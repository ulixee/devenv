import { IPage } from '@ulixee/unblocked-specification/agent/browser/IPage';
import IDevtoolsSession, { Protocol } from '@ulixee/unblocked-specification/agent/browser/IDevtoolsSession';
import IElementSummary from '@ulixee/desktop-interfaces/IElementSummary';
import ChromeAliveWindowController from '../ChromeAliveWindowController';
import TargetInfo = Protocol.Target.TargetInfo;
export default class DevtoolsBackdoorModule {
    readonly chromeAliveWindowController: ChromeAliveWindowController;
    private events;
    private devtoolsDetachedSessionIds;
    private devtoolsSessionByTargetId;
    private devtoolsSessionToIds;
    private devtoolsSessionByTabId;
    private logger;
    constructor(chromeAliveWindowController: ChromeAliveWindowController);
    onDevtoolsPanelAttached(devtoolsSession: IDevtoolsSession, targetInfo: TargetInfo): Promise<void>;
    onDevtoolsPanelDetached(devtoolsSession: IDevtoolsSession): void;
    close(): void;
    showElementsPanel(page: IPage): Promise<void>;
    toggleInspectElementMode(): Promise<boolean>;
    closeDevtoolsPanelForPage(page: IPage): Promise<void>;
    searchDom(query: string): Promise<IElementSummary[]>;
    private handleIncomingMessageFromBrowser;
    private emitElementWasSelected;
    private emitToggleInspectElementMode;
    private toElementSummary;
    private send;
}
