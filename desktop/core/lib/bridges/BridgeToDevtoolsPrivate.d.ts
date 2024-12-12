import { EventEmitter } from 'events';
import IDevtoolsSession from '@ulixee/unblocked-specification/agent/browser/IDevtoolsSession';
import { IMessageObject } from '@ulixee/desktop-interfaces/BridgeHelpers';
export default class BridgeToDevtoolsPrivate extends EventEmitter {
    private devtoolsSessionMap;
    private events;
    onDevtoolsPanelAttached(devtoolsSession: IDevtoolsSession): Promise<void>;
    send(message: IMessageObject | string, tabId?: number): Promise<void>;
    private getDevtoolsSessionWithTabId;
    private getDevtoolsTabId;
    private runInBrowser;
    private handleIncomingMessageFromBrowser;
    private onContextCreated;
    private onContextDestroyed;
    private onContextCleared;
}
