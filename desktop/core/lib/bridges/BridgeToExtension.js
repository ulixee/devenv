"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const IPendingWaitEvent_1 = require("@ulixee/commons/interfaces/IPendingWaitEvent");
const utils_1 = require("@ulixee/commons/lib/utils");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const BridgeHelpers_1 = require("@ulixee/desktop-interfaces/BridgeHelpers");
const ExtensionUtils_1 = require("../ExtensionUtils");
const { log } = (0, Logger_1.default)(module);
class BridgeToExtension extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.contextIdByPageId = new Map();
        this.devtoolsSessionsByPageId = {};
        this.pendingByResponseId = {};
    }
    getContextIdByPageId(pageId) {
        return this.contextIdByPageId.get(pageId) ?? null;
    }
    getDevtoolsSessionByPageId(pageId) {
        return this.devtoolsSessionsByPageId[pageId];
    }
    addPage(page, events) {
        const { devtoolsSession, id } = page;
        this.devtoolsSessionsByPageId[id] = devtoolsSession;
        events.once(page, 'close', this.closePage.bind(this, id));
        events.on(devtoolsSession, 'Runtime.executionContextCreated', this.onContextCreated.bind(this, id));
        events.on(devtoolsSession, 'Runtime.executionContextDestroyed', this.onContextDestroyed.bind(this, id));
        events.on(devtoolsSession, 'Runtime.executionContextsCleared', this.onContextCleared.bind(this, id));
        events.on(devtoolsSession, 'Runtime.bindingCalled', this.handleIncomingMessageFromBrowser.bind(this, id));
        return Promise.all([
            devtoolsSession.send('Runtime.addBinding', { name: BridgeHelpers_1.___sendToCore }),
            devtoolsSession.send('Runtime.runIfWaitingForDebugger'),
        ]).catch(() => null);
    }
    send(message, pageId) {
        const [destLocation, responseCode, restOfMessage] = (0, BridgeHelpers_1.extractStringifiedComponentsFromMessage)(message);
        if (!pageId) {
            throw new Error(`No active browser page ${pageId}`);
        }
        const contextId = this.getContextIdByPageId(pageId);
        if (!contextId) {
            log.warn(`No browser execution context for ${pageId}`, {
                sessionId: null,
                pageId,
            });
            return Promise.resolve();
        }
        const devtoolsSession = this.getDevtoolsSessionByPageId(pageId);
        this.runInBrowser(devtoolsSession, contextId, `window.${BridgeHelpers_1.___receiveFromCore}('${destLocation}', '${responseCode}', ${restOfMessage});`);
        if ((0, BridgeHelpers_1.messageExpectsResponse)(message)) {
            const responseId = (0, BridgeHelpers_1.extractResponseIdFromMessage)(message);
            this.pendingByResponseId[responseId] = (0, utils_1.createPromise)(10e3, 'Response was not received within 10s');
            return this.pendingByResponseId[responseId].promise;
        }
        return Promise.resolve();
    }
    closePage(pageId) {
        this.contextIdByPageId.delete(pageId);
    }
    close() {
        this.contextIdByPageId.clear();
    }
    runInBrowser(devtoolsSession, contextId, expressionToRun) {
        const response = devtoolsSession.send('Runtime.evaluate', {
            expression: expressionToRun,
            contextId,
            awaitPromise: false,
            returnByValue: false,
        });
        response.catch(err => {
            if (err instanceof IPendingWaitEvent_1.CanceledPromiseError)
                return;
            throw err;
        });
    }
    handleIncomingMessageFromBrowser(pageId, event) {
        if (event.name !== BridgeHelpers_1.___sendToCore)
            return;
        const [destLocation, responseCode, stringifiedMessage] = (0, BridgeHelpers_1.extractStringifiedComponentsFromMessage)(event.payload);
        if ((0, BridgeHelpers_1.isResponseMessage)(event.payload)) {
            const { responseId, payload } = JSON.parse(stringifiedMessage);
            const waitingForResponse = this.pendingByResponseId[responseId];
            waitingForResponse.resolve(payload);
        }
        else {
            this.emit('message', event.payload, {
                destLocation,
                responseCode,
                stringifiedMessage,
                pageId,
            });
        }
    }
    onContextCreated(pageId, event) {
        if (!event.context.origin.startsWith(`chrome-extension://${ExtensionUtils_1.extensionId}`))
            return;
        this.contextIdByPageId.set(pageId, event.context.id);
    }
    onContextDestroyed(pageId, event) {
        if (this.contextIdByPageId.get(pageId) === event.executionContextId) {
            this.contextIdByPageId.delete(pageId);
        }
    }
    onContextCleared(pageId) {
        this.contextIdByPageId.delete(pageId);
    }
}
exports.default = BridgeToExtension;
//# sourceMappingURL=BridgeToExtension.js.map