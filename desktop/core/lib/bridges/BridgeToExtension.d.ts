import EventSubscriber from '@ulixee/commons/lib/EventSubscriber';
import { EventEmitter } from 'events';
import IDevtoolsSession from '@ulixee/unblocked-specification/agent/browser/IDevtoolsSession';
import { IPage } from '@ulixee/unblocked-specification/agent/browser/IPage';
export default class BridgeToExtension extends EventEmitter {
    private contextIdByPageId;
    private devtoolsSessionsByPageId;
    private pendingByResponseId;
    getContextIdByPageId(pageId: string): number | null;
    getDevtoolsSessionByPageId(pageId: string): IDevtoolsSession;
    addPage(page: IPage, events: EventSubscriber): Promise<any>;
    send<T = any>(message: any, pageId: string): Promise<T | void>;
    closePage(pageId: string): void;
    close(): void;
    private runInBrowser;
    private handleIncomingMessageFromBrowser;
    private onContextCreated;
    private onContextDestroyed;
    private onContextCleared;
}
