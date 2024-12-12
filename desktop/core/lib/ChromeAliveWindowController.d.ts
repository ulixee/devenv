import Page from '@ulixee/unblocked-agent/lib/Page';
import IDevtoolsSession, { Protocol } from '@ulixee/unblocked-specification/agent/browser/IDevtoolsSession';
import { IBrowserContextHooks } from '@ulixee/unblocked-specification/agent/hooks/IBrowserHooks';
import IChromeAliveSessionEvents from '@ulixee/desktop-interfaces/events/IChromeAliveSessionEvents';
import DevtoolsBackdoorModule from './app-extension-modules/DevtoolsBackdoorModule';
import ElementsModule from './app-extension-modules/ElementsModule';
import AppDevtoolsConnection from './AppDevtoolsConnection';
import TargetInfo = Protocol.Target.TargetInfo;
export default class ChromeAliveWindowController implements IBrowserContextHooks {
    readonly sessionId: string;
    readonly appDevtoolsConnection: AppDevtoolsConnection;
    readonly sendApiEvent: <T extends keyof IChromeAliveSessionEvents>(eventType: T, data?: IChromeAliveSessionEvents[T]) => void;
    get activePage(): Page;
    devtoolsBackdoorModule: DevtoolsBackdoorModule;
    elementsModule: ElementsModule;
    private pages;
    private readonly events;
    private readonly bridgeToExtension;
    private readonly pagesById;
    private readonly pendingPagePromisesByTabId;
    private readonly idsByTargetId;
    constructor(sessionId: string, appDevtoolsConnection: AppDevtoolsConnection, sendApiEvent: <T extends keyof IChromeAliveSessionEvents>(eventType: T, data?: IChromeAliveSessionEvents[T]) => void);
    showElementsPanel(): Promise<void>;
    getChromeTabIdByPageId(pageId: string): number;
    getPageByChromeTabId(chromeTabId: number): Page;
    getPageByHeroTabId(heroTabId: number): Page;
    waitForPageWithHeroTabId(heroTabId: number): Promise<Page>;
    onDevtoolsPanelAttached(devtoolsSession: IDevtoolsSession, targetInfo: TargetInfo): Promise<any>;
    onDevtoolsPanelDetached(devtoolsSession: IDevtoolsSession): Promise<any>;
    onDevtoolsOpenedInApp(target: {
        targetId: string;
        browserContextId: string;
        isReconnect?: boolean;
    }): Promise<void>;
    addTarget(target: {
        targetId: string;
        chromeTabId: number;
        heroTabId: number;
        browserContextId: string;
        isReconnect?: boolean;
    }): Promise<void>;
}
