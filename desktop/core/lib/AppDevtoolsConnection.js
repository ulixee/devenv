"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unblocked_agent_1 = require("@ulixee/unblocked-agent");
const MirrorPage_1 = require("@ulixee/hero-timetravel/lib/MirrorPage");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const EventSubscriber_1 = require("@ulixee/commons/lib/EventSubscriber");
const Resolvable_1 = require("@ulixee/commons/lib/Resolvable");
const WebSocket = require("ws");
const { log } = (0, Logger_1.default)(module);
let counter = 0;
class AppDevtoolsConnection {
    constructor(webSocket) {
        this.webSocket = webSocket;
        this.onCloseFns = [];
        this.connectedPromise = new Resolvable_1.default();
        this.isClosed = false;
        this.id = counter++;
        this.events = new EventSubscriber_1.default();
        this.browser = new unblocked_agent_1.Browser({
            isHeaded: true,
            launchArguments: [],
            executablePath: 'electron',
            fullVersion: '',
            name: 'ChromeAlive',
            userDataDir: '',
            doesBrowserAnimateScrolling: false,
            executablePathEnvVar: '',
            isInstalled: true,
            verifyLaunchable: () => Promise.resolve(),
        }, this);
        this.events.on(this.webSocket, 'message', this.onMessage.bind(this));
        this.events.once(this.webSocket, 'close', this.onClosed.bind(this));
        this.events.once(this.webSocket, 'error', error => {
            if (!this.connectedPromise.isResolved)
                this.connectedPromise.reject(error, true);
            if (this.isClosed)
                return;
            if (error.code !== 'EPIPE') {
                log.error('WebsocketTransport.error', { error, sessionId: null });
            }
        });
    }
    async attachToDevtools(targetId) {
        await this.browser.connectToPage(targetId, {
            enableDomStorageTracker: false,
            runPageScripts: false,
        });
    }
    async attachToPage(targetId, browserContextId, hooks) {
        await this.browser.connect(this);
        const page = await this.browser.connectToPage(targetId, MirrorPage_1.default.newPageOptions, hooks);
        const pageTargets = await this.browser.getAllPageTargets();
        for (const target of pageTargets) {
            if (target.url.startsWith('devtools://') && target.browserContextId === browserContextId) {
                await this.attachToDevtools(target.targetId);
            }
        }
        return page;
    }
    send(message) {
        if (this.webSocket.readyState === WebSocket.OPEN) {
            this.webSocket.send(message);
            return true;
        }
        return false;
    }
    close() {
        this.isClosed = true;
        this.events.close();
        try {
            this.webSocket.close();
        }
        catch { }
    }
    onClosed() {
        log.stats('WebSocketTransport.Closed');
        for (const close of this.onCloseFns)
            close();
    }
    onMessage(event) {
        this.onMessageFn?.(event);
    }
}
exports.default = AppDevtoolsConnection;
//# sourceMappingURL=AppDevtoolsConnection.js.map