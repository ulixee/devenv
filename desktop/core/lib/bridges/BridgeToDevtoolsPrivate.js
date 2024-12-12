"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const IPendingWaitEvent_1 = require("@ulixee/commons/interfaces/IPendingWaitEvent");
const EventSubscriber_1 = require("@ulixee/commons/lib/EventSubscriber");
const BridgeHelpers_1 = require("@ulixee/desktop-interfaces/BridgeHelpers");
const ExtensionUtils_1 = require("../ExtensionUtils");
class BridgeToDevtoolsPrivate extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.devtoolsSessionMap = new Map();
        this.events = new EventSubscriber_1.default();
    }
    async onDevtoolsPanelAttached(devtoolsSession) {
        this.devtoolsSessionMap.set(devtoolsSession, { contextIds: [] });
        this.events.on(devtoolsSession, 'Runtime.executionContextCreated', event => this.onContextCreated(devtoolsSession, event));
        this.events.on(devtoolsSession, 'Runtime.executionContextDestroyed', event => this.onContextDestroyed(devtoolsSession, event));
        this.events.on(devtoolsSession, 'Runtime.executionContextsCleared', () => this.onContextCleared(devtoolsSession));
        this.events.on(devtoolsSession, 'Runtime.bindingCalled', event => this.handleIncomingMessageFromBrowser(event));
        await Promise.all([
            devtoolsSession.send('Runtime.addBinding', { name: BridgeHelpers_1.___sendToCore }),
            devtoolsSession.send('Page.addScriptToEvaluateOnNewDocument', {
                source: `(function run() {
          window.___includedBackendNodeIds = new Set();
          window.___excludedBackendNodeIds = new Set();
          window.${BridgeHelpers_1.___receiveFromCore} = function ${BridgeHelpers_1.___receiveFromCore}(destLocation, responseCode, restOfMessage) {
            const payload = restOfMessage.payload;
            const { event, backendNodeId } = payload;
            if (event === '${BridgeHelpers_1.MessageEventType.OpenSelectorGeneratorPanel}') {
              (${openSelectorGeneratorPanel.toString()})(DevToolsAPI, '${ExtensionUtils_1.extensionId}');
            } else if (event === '${BridgeHelpers_1.MessageEventType.ToggleInspectElementMode}') {
              (${toggleInspectElementMode.toString()})(InspectorFrontendAPI);
            } else if (payload.event === '${BridgeHelpers_1.MessageEventType.CloseDevtoolsPanel}'){
              InspectorFrontendHost.closeWindow();
            } else if (event === '${BridgeHelpers_1.MessageEventType.AddIncludedElement}') {
              window.___includedBackendNodeIds.add(backendNodeId);
            } else if (event === '${BridgeHelpers_1.MessageEventType.RemoveIncludedElement}') {
              window.___includedBackendNodeIds.delete(backendNodeId);
            } else if (event === '${BridgeHelpers_1.MessageEventType.AddExcludedElement}') {
              window.___excludedBackendNodeIds.add(backendNodeId);
            } else if (event === '${BridgeHelpers_1.MessageEventType.RemoveExcludedElement}') {
              window.___excludedBackendNodeIds.delete(backendNodeId);
            } else {
              console.log('UNHANDLED MESSAGE FROM CORE: ', destLocation, responseCode, payload);
            }
          };
          (${interceptElementWasSelected.toString()})('${BridgeHelpers_1.___sendToCore}', '${BridgeHelpers_1.MessageEventType.OpenElementOptionsOverlay}');
          (${interceptInspectElementMode.toString()})('${BridgeHelpers_1.___sendToCore}', '${BridgeHelpers_1.MessageEventType.InspectElementModeChanged}');
          (${interceptElementPanelOnHighlight.toString()})('${BridgeHelpers_1.___sendToCore}', '${BridgeHelpers_1.MessageEventType.HideElementOptionsOverlay}');
          (${interceptElementPanelOnRemoveHighlight.toString()})('${BridgeHelpers_1.___sendToCore}', '${BridgeHelpers_1.MessageEventType.RemoveHideFromElementOptionsOverlay}');
          (${injectContextMenu.toString()})('${BridgeHelpers_1.___sendToCore}', '${BridgeHelpers_1.MessageEventType.UpdateElementOptions}');
        })();`,
            }),
            this.getDevtoolsTabId.bind(this, devtoolsSession),
            devtoolsSession.send('Runtime.runIfWaitingForDebugger'),
        ]).catch(() => null);
        const contextId = this.devtoolsSessionMap.get(devtoolsSession).contextIds[0];
        await this.runInBrowser(devtoolsSession, contextId, `(${interceptInspectElementMode.toString()})('${BridgeHelpers_1.___sendToCore}', '${BridgeHelpers_1.MessageEventType.InspectElementModeChanged}');`);
        // (${interceptElementOverlayDispatches.toString()})('${___sendToCore}', '${MessageEventType.CloseElementOptionsOverlay}');
    }
    async send(message, tabId) {
        const [destLocation, responseCode, restOfMessage] = (0, BridgeHelpers_1.extractStringifiedComponentsFromMessage)(message);
        let devtoolsSession;
        if (tabId) {
            devtoolsSession = await this.getDevtoolsSessionWithTabId(tabId);
        }
        devtoolsSession ??= this.devtoolsSessionMap.keys().next().value;
        const contextId = this.devtoolsSessionMap.get(devtoolsSession).contextIds[0];
        await this.runInBrowser(devtoolsSession, contextId, `window.${BridgeHelpers_1.___receiveFromCore}('${destLocation}', '${responseCode}', ${restOfMessage});`);
    }
    async getDevtoolsSessionWithTabId(tabId) {
        for (const [session, details] of this.devtoolsSessionMap) {
            if (details.tabId === tabId)
                return session;
            if (!details.tabId) {
                const loadedTabId = await this.getDevtoolsTabId(session);
                if (loadedTabId === tabId)
                    return session;
            }
        }
    }
    async getDevtoolsTabId(devtoolsSession, retries = 3) {
        const response = await devtoolsSession.send('Runtime.evaluate', {
            expression: 'DevToolsAPI.getInspectedTabId()',
        });
        const tabId = response.result.value;
        if (!tabId) {
            if (retries <= 0)
                return;
            await new Promise(resolve => setTimeout(resolve, 250));
            return await this.getDevtoolsTabId(devtoolsSession, retries - 1);
        }
        if (!this.devtoolsSessionMap.has(devtoolsSession))
            this.devtoolsSessionMap.set(devtoolsSession, { contextIds: [] });
        this.devtoolsSessionMap.get(devtoolsSession).tabId = tabId;
        return tabId;
    }
    runInBrowser(devtoolsSession, contextId, expressionToRun) {
        return devtoolsSession
            .send('Runtime.evaluate', {
            expression: expressionToRun,
            contextId,
            awaitPromise: false,
            returnByValue: false,
        })
            .catch(err => {
            if (err instanceof IPendingWaitEvent_1.CanceledPromiseError)
                return;
            throw err;
        });
    }
    handleIncomingMessageFromBrowser(event) {
        if (event.name !== BridgeHelpers_1.___sendToCore)
            return;
        const [destLocation] = (0, BridgeHelpers_1.extractStringifiedComponentsFromMessage)(event.payload);
        this.emit('message', event.payload, { destLocation });
    }
    onContextCreated(devtoolsSession, event) {
        if (!this.devtoolsSessionMap.has(devtoolsSession)) {
            this.devtoolsSessionMap.set(devtoolsSession, { contextIds: [] });
        }
        const contextIds = this.devtoolsSessionMap.get(devtoolsSession).contextIds;
        if (!contextIds.includes(event.context.id)) {
            contextIds.push(event.context.id);
        }
    }
    onContextDestroyed(devtoolsSession, event) {
        const contextIds = this.devtoolsSessionMap.get(devtoolsSession)?.contextIds;
        if (!contextIds)
            return;
        const idx = contextIds.indexOf(event.executionContextId);
        if (idx >= 0)
            contextIds.splice(idx, 1);
        if (!contextIds.length) {
            this.devtoolsSessionMap.delete(devtoolsSession);
        }
    }
    onContextCleared(devtoolsSession) {
        this.devtoolsSessionMap.delete(devtoolsSession);
    }
}
exports.default = BridgeToDevtoolsPrivate;
// METHODS TO RUN IN BROWSER CONTEXT ////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-shadow
function openSelectorGeneratorPanel(DevToolsAPI, extensionId) {
    // We can get list from UI.panels
    DevToolsAPI.showPanel(`chrome-extension://${extensionId}HeroScript`);
}
function toggleInspectElementMode(InspectorFrontendAPI) {
    InspectorFrontendAPI.enterInspectElementMode();
}
const interceptInspectElementMode = `
async function interceptInspectElementMode(sendToCoreFnName, eventType) {
  const globalWindow = window;
  const elements = await import('./devtools-frontend/front_end/panels/elements/elements.js');
  const InspectElementModeController = elements.InspectElementModeController.InspectElementModeController;
  const setMode = InspectElementModeController.prototype.setMode;
  function override(mode) {
    const isOn = mode === 'searchForNode';
    const payload = '{"event":"' + eventType +'","isOn": ' + isOn.toString() + '}';
    const packedMessage = ':Core                :N:{"origLocation":"DevtoolsPrivate","payload":'+ payload + '}';
    globalWindow[sendToCoreFnName](packedMessage);
    setMode.call(this, mode);
  }
  InspectElementModeController.prototype.setMode = override;
}
`;
const interceptElementPanelOnHighlight = `
async function interceptElementPanelOnHighlight(sendToCoreFnName, eventType) {
  const globalWindow = window;
  const elements = await import('./devtools-frontend/front_end/panels/elements/elements.js');
  const ElementsTreeOutline = elements.ElementsTreeOutline.ElementsTreeOutline;
  const highlightTreeElement = ElementsTreeOutline.prototype._highlightTreeElement;
  ElementsTreeOutline.prototype._highlightTreeElement = function(element, showInfo) {
    const payload = '{"event":"' + eventType + '"}';
    const packedMessage = ':ContentScript       :N:{"origLocation":"DevtoolsPrivate","payload":'+ payload + '}';
    globalWindow[sendToCoreFnName](packedMessage);
    highlightTreeElement.call(this, element, showInfo);
  }
}
`;
const interceptElementPanelOnRemoveHighlight = `
async function interceptElementPanelWasHovered(sendToCoreFnName, eventType) {
  const globalWindow = window;
  const elements = await import('./devtools-frontend/front_end/panels/elements/elements.js');
  const ElementsTreeOutline = elements.ElementsTreeOutline.ElementsTreeOutline;
  const setHoverEffect = ElementsTreeOutline.prototype.setHoverEffect;
  ElementsTreeOutline.prototype.setHoverEffect = function(treeElement) {
    if (!treeElement) {
      const payload = '{"event":"' + eventType + '"}';
      const packedMessage = ':ContentScript       :N:{"origLocation":"DevtoolsPrivate","payload":'+ payload + '}';
      globalWindow[sendToCoreFnName](packedMessage);
    }
    setHoverEffect.call(this, treeElement);
  }
}
`;
// Every time an element in page is selected for inspection
function interceptElementWasSelected(sendToCoreFnName, eventType) {
    // @ts-ignore
    const globalWindow = window;
    // @ts-ignore
    const globalSDK = window.SDK;
    if (!globalSDK) {
        setTimeout(() => interceptElementWasSelected(sendToCoreFnName, eventType), 1);
        return;
    }
    const inspectNodeRequestedOrig = globalSDK.OverlayModel.prototype.inspectNodeRequested;
    globalSDK.OverlayModel.prototype.inspectNodeRequested = function inspectNodeRequested({ backendNodeId }) {
        const payload = `{"event":"${eventType}","backendNodeId": ${backendNodeId}}`;
        const packedMessage = `:ContentScript       :N:{"origLocation":"DevtoolsPrivate","payload":${payload}}`;
        // @ts-ignore
        globalWindow[sendToCoreFnName](packedMessage);
        inspectNodeRequestedOrig.call(this, { backendNodeId });
    };
}
// THIS CREATES CONTEXT MENU
const injectContextMenu = `
async function injectContextMenu(sendToCoreFnName, eventType) {
  const elements = await import('./devtools-frontend/front_end/panels/elements/elements.js');
  const ElementsTreeElement = elements.ElementsTreeElement.ElementsTreeElement;
  const populateNodeContextMenu = ElementsTreeElement.prototype.populateNodeContextMenu;
    
  ElementsTreeElement.prototype.populateNodeContextMenu = function(contextMenu) {
    populateNodeContextMenu.call(this, contextMenu);
    const backendNodeId = this._node._backendNodeId;
    const sgMenu = contextMenu.clipboardSection().appendSubMenuItem('Selector Generator');
    const section = sgMenu.section();
    
    const isIncluded = window.___includedBackendNodeIds.has(backendNodeId);
    const mustIncludeItem = section.appendCheckboxItem('Must Include', () => {
      const payload = { event: eventType, backendNodeId, isIncluded: !isIncluded };
      const packedMessage = ':ContentScript       :N:{"origLocation":"DevtoolsPrivate","payload":'+ JSON.stringify(payload) + '}';
      window[sendToCoreFnName](packedMessage);
    }, isIncluded);
    
    const isExcluded = window.___excludedBackendNodeIds.has(backendNodeId);
    const mustExcludeItem = section.appendCheckboxItem('Must Exclude', () => { 
      const payload = { event: eventType, backendNodeId, isExcluded: !isExcluded };
      const packedMessage = ':ContentScript       :N:{"origLocation":"DevtoolsPrivate","payload":'+ JSON.stringify(payload) + '}';
      window[sendToCoreFnName](packedMessage);
    }, isExcluded);
  }
}
`;
// Every time a node element is highlighted using Inspector in page (not devtools panel)
// SDK.OverlayModel.prototype.nodeHighlightRequested = function({nodeId}) {
//   console.log('nodeHighlightRequested', nodeId);
//   nodeHighlightRequested.call(this, {nodeId});
// }
//# sourceMappingURL=BridgeToDevtoolsPrivate.js.map