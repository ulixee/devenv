import { Browser } from '@ulixee/unblocked-agent';
import Page from '@ulixee/unblocked-agent/lib/Page';
import IConnectionTransport from '@ulixee/unblocked-agent/interfaces/IConnectionTransport';
import Resolvable from '@ulixee/commons/lib/Resolvable';
import { IBrowserContextHooks } from '@ulixee/unblocked-specification/agent/hooks/IBrowserHooks';
import WebSocket = require('ws');
export default class AppDevtoolsConnection implements IConnectionTransport {
    readonly webSocket: WebSocket;
    browser: Browser;
    onMessageFn: (message: string) => void;
    readonly onCloseFns: (() => void)[];
    connectedPromise: Resolvable<void>;
    isClosed: boolean;
    private id;
    private events;
    constructor(webSocket: WebSocket);
    attachToDevtools(targetId: string): Promise<void>;
    attachToPage(targetId: string, browserContextId: string, hooks: IBrowserContextHooks): Promise<Page>;
    send(message: string): boolean;
    close(): void;
    private onClosed;
    private onMessage;
}
