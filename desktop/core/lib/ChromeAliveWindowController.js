"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventSubscriber_1 = require("@ulixee/commons/lib/EventSubscriber");
const Resolvable_1 = require("@ulixee/commons/lib/Resolvable");
const BridgeToExtension_1 = require("./bridges/BridgeToExtension");
const DevtoolsBackdoorModule_1 = require("./app-extension-modules/DevtoolsBackdoorModule");
const ElementsModule_1 = require("./app-extension-modules/ElementsModule");
class ChromeAliveWindowController {
    // TODO: support multiple replay tabs for finder
    get activePage() {
        return this.pages[0];
    }
    constructor(sessionId, appDevtoolsConnection, sendApiEvent) {
        this.sessionId = sessionId;
        this.appDevtoolsConnection = appDevtoolsConnection;
        this.sendApiEvent = sendApiEvent;
        this.pages = [];
        this.events = new EventSubscriber_1.default();
        this.pagesById = new Map();
        this.pendingPagePromisesByTabId = new Map();
        this.idsByTargetId = new Map();
        this.bridgeToExtension = new BridgeToExtension_1.default();
        this.elementsModule = new ElementsModule_1.default(this);
        this.devtoolsBackdoorModule = new DevtoolsBackdoorModule_1.default(this);
    }
    async showElementsPanel() {
        await this.devtoolsBackdoorModule.showElementsPanel(this.activePage);
    }
    getChromeTabIdByPageId(pageId) {
        return this.idsByTargetId.get(pageId)?.chromeTabId;
    }
    getPageByChromeTabId(chromeTabId) {
        for (const [pageId, ids] of this.idsByTargetId) {
            if (ids.chromeTabId === chromeTabId)
                return this.pagesById.get(pageId);
        }
    }
    getPageByHeroTabId(heroTabId) {
        for (const [targetId, entry] of this.idsByTargetId) {
            if (entry.heroTabId === heroTabId)
                return this.pagesById.get(targetId);
        }
    }
    async waitForPageWithHeroTabId(heroTabId) {
        const existing = this.getPageByHeroTabId(heroTabId);
        if (existing)
            return existing;
        if (!this.pendingPagePromisesByTabId.has(heroTabId)) {
            this.pendingPagePromisesByTabId.set(heroTabId, new Resolvable_1.default());
        }
        return await this.pendingPagePromisesByTabId.get(heroTabId).promise;
    }
    onDevtoolsPanelAttached(devtoolsSession, targetInfo) {
        return this.devtoolsBackdoorModule.onDevtoolsPanelAttached(devtoolsSession, targetInfo);
    }
    onDevtoolsPanelDetached(devtoolsSession) {
        this.devtoolsBackdoorModule.onDevtoolsPanelDetached(devtoolsSession);
        return Promise.resolve();
    }
    async onDevtoolsOpenedInApp(target) {
        await this.appDevtoolsConnection.attachToDevtools(target.targetId);
    }
    async addTarget(target) {
        const { chromeTabId, targetId, heroTabId, browserContextId } = target;
        this.idsByTargetId.set(targetId, { chromeTabId, heroTabId });
        const page = await this.appDevtoolsConnection.attachToPage(targetId, browserContextId, this);
        this.pages.push(page);
        if (!this.pendingPagePromisesByTabId.has(heroTabId)) {
            this.pendingPagePromisesByTabId.set(heroTabId, new Resolvable_1.default());
        }
        await this.bridgeToExtension.addPage(page, this.events);
        await this.elementsModule.onNewPage(page);
        this.pagesById.set(page.targetId, page);
        this.pendingPagePromisesByTabId.get(heroTabId).resolve(page);
    }
}
exports.default = ChromeAliveWindowController;
//# sourceMappingURL=ChromeAliveWindowController.js.map