"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const EventSubscriber_1 = require("@ulixee/commons/lib/EventSubscriber");
const utils_1 = require("@ulixee/commons/lib/utils");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const DevtoolsBackdoorConfig_1 = require("../../injected-scripts/DevtoolsBackdoorConfig");
const { log } = (0, Logger_1.default)(module);
class DevtoolsBackdoorModule {
    constructor(chromeAliveWindowController) {
        this.chromeAliveWindowController = chromeAliveWindowController;
        this.events = new EventSubscriber_1.default();
        this.devtoolsDetachedSessionIds = new Set();
        this.devtoolsSessionByTargetId = new Map();
        this.devtoolsSessionToIds = new Map();
        this.devtoolsSessionByTabId = new Map();
        (0, utils_1.bindFunctions)(this);
        this.logger = log.createChild(module, { sessionId: chromeAliveWindowController.sessionId });
    }
    async onDevtoolsPanelAttached(devtoolsSession, targetInfo) {
        if (this.devtoolsDetachedSessionIds.has(devtoolsSession.id))
            return;
        if (this.devtoolsSessionByTargetId.has(targetInfo.targetId)) {
            await devtoolsSession.send('Target.detachFromTarget');
            return;
        }
        let response;
        try {
            response = await devtoolsSession.send('Runtime.evaluate', {
                expression: `(function devtoolsBackdoorInjectedScripts() {
          ${injectedScript};
          return DevtoolsBackdoor.getInspectedTabId(10e3);
        })();`,
                awaitPromise: true,
                returnByValue: true,
            });
            if (response.exceptionDetails) {
                throw new Error(response.exceptionDetails.exception.description);
            }
        }
        catch (error) {
            if (error.message.includes('Cannot find context with specified id'))
                return;
            throw error;
        }
        const tabId = response.result.value;
        if (this.devtoolsSessionToIds.has(devtoolsSession))
            return;
        this.devtoolsSessionToIds.set(devtoolsSession, { tabId, targetId: targetInfo.targetId });
        const byTabId = this.devtoolsSessionByTabId.get(tabId) ?? new Set();
        byTabId.add(devtoolsSession);
        this.devtoolsSessionByTabId.set(tabId, byTabId);
        this.events.on(devtoolsSession, 'Runtime.bindingCalled', this.handleIncomingMessageFromBrowser.bind(this, tabId));
        await devtoolsSession.send('Runtime.addBinding', { name: DevtoolsBackdoorConfig_1.___emitFromDevtoolsToCore });
    }
    onDevtoolsPanelDetached(devtoolsSession) {
        this.devtoolsDetachedSessionIds.add(devtoolsSession.id);
        const ids = this.devtoolsSessionToIds.get(devtoolsSession);
        this.devtoolsSessionToIds.delete(devtoolsSession);
        if (ids) {
            const { tabId, targetId } = ids;
            this.devtoolsSessionByTargetId.delete(targetId);
            const byTabId = this.devtoolsSessionByTabId.get(tabId);
            byTabId?.delete(devtoolsSession);
            if (byTabId?.size === 0)
                this.devtoolsSessionByTabId.delete(tabId);
        }
    }
    close() {
        this.devtoolsSessionToIds.clear();
        this.devtoolsSessionByTargetId.clear();
        this.devtoolsSessionByTabId.clear();
        this.events.close();
    }
    async showElementsPanel(page) {
        const tabId = this.chromeAliveWindowController.getChromeTabIdByPageId(page.id);
        await this.send(tabId, 'DevtoolsBackdoor.showElementsPanel');
    }
    // COMMANDS
    async toggleInspectElementMode() {
        const page = this.chromeAliveWindowController.activePage;
        if (!page)
            return;
        const tabId = this.chromeAliveWindowController.getChromeTabIdByPageId(page.id);
        return await this.send(tabId, 'DevtoolsBackdoor.toggleInspectElementMode');
    }
    async closeDevtoolsPanelForPage(page) {
        const tabId = this.chromeAliveWindowController.getChromeTabIdByPageId(page.id);
        await this.send(tabId, 'DevtoolsBackdoor.closeDevtools');
    }
    async searchDom(query) {
        const page = this.chromeAliveWindowController.activePage;
        if (!page)
            return [];
        const tabId = this.chromeAliveWindowController.getChromeTabIdByPageId(page.id);
        await this.send(tabId, 'DevtoolsBackdoor.showElementsPanel');
        return await this.send(tabId, 'DevtoolsBackdoor.searchDom', [query]);
    }
    // END OF COMMANDS
    handleIncomingMessageFromBrowser(tabId, message) {
        if (message.name !== DevtoolsBackdoorConfig_1.___emitFromDevtoolsToCore)
            return;
        const payload = JSON.parse(message.payload);
        const event = payload.event;
        if (event === DevtoolsBackdoorConfig_1.EventType.ElementWasSelected) {
            this.emitElementWasSelected(tabId, payload.backendNodeId).catch(console.error);
        }
        else if (event === DevtoolsBackdoorConfig_1.EventType.ToggleInspectElementMode) {
            this.emitToggleInspectElementMode(payload.isActive);
        }
    }
    async emitElementWasSelected(tabId, backendNodeId) {
        const page = await this.chromeAliveWindowController.getPageByChromeTabId(tabId);
        if (!page) {
            this.logger.warn('Element emitted for non-ChromeAlive tab', { tabId, backendNodeId });
            return;
        }
        const result = await page.devtoolsSession.send('DOM.describeNode', {
            backendNodeId,
        });
        const nodeOverview = result.node;
        const element = this.toElementSummary(nodeOverview, { backendNodeId });
        this.chromeAliveWindowController.sendApiEvent('DevtoolsBackdoor.elementWasSelected', {
            element,
        });
    }
    emitToggleInspectElementMode(isActive) {
        this.chromeAliveWindowController.sendApiEvent('DevtoolsBackdoor.toggleInspectElementMode', {
            isActive,
        });
    }
    toElementSummary(nodeOverview, id) {
        const attributes = [];
        if (nodeOverview.attributes) {
            for (let i = 0; i < nodeOverview.attributes.length; i += 2) {
                const name = nodeOverview.attributes[i];
                const value = nodeOverview.attributes[i + 1];
                attributes.push({ name, value });
            }
        }
        return {
            ...id,
            localName: nodeOverview.localName,
            nodeName: nodeOverview.nodeName,
            nodeType: nodeOverview.nodeType,
            attributes,
            hasChildren: nodeOverview.childNodeCount > 0,
            nodeValueInternal: nodeOverview.nodeValue,
        };
    }
    async send(tabId, command, args = []) {
        for (const devtoolsSession of this.devtoolsSessionByTabId.get(tabId) ?? []) {
            try {
                const response = await devtoolsSession.send('Runtime.evaluate', {
                    expression: `(function devtoolsBackdoorCommand() {
        return ${command}(...${JSON.stringify(args)});
      })();`,
                    awaitPromise: true,
                    returnByValue: true,
                });
                if (response.exceptionDetails) {
                    throw new Error(response.exceptionDetails.exception.description);
                }
                return response.result.value;
            }
            catch (error) {
                this.logger.warn('ERROR sending to DevtoolsBackdoor', error);
            }
        }
    }
}
exports.default = DevtoolsBackdoorModule;
const pageScripts = {
    DevtoolsBackdoorConfig: fs.readFileSync(`${__dirname}/../../injected-scripts/DevtoolsBackdoorConfig.js`, 'utf8'),
    DevtoolsBackdoor: fs.readFileSync(`${__dirname}/../../injected-scripts/DevtoolsBackdoor.js`, 'utf8'),
};
const injectedScript = `(function devtoolsBackdoor() {
  if (window.__backdoorInstalled) return;
  window.__backdoorInstalled = true;
  
  const exports = {}; // workaround for ts adding an exports variable
  
  ${pageScripts.DevtoolsBackdoorConfig};
  ${pageScripts.DevtoolsBackdoor};
})();`;
//# sourceMappingURL=DevtoolsBackdoorModule.js.map