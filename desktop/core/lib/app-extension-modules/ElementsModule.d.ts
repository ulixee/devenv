import { IPage } from '@ulixee/unblocked-specification/agent/browser/IPage';
import { ISelectorMap } from '@ulixee/desktop-interfaces/ISelectorMap';
import ChromeAliveWindowController from '../ChromeAliveWindowController';
export default class ElementsModule {
    private chromeAliveWindowController;
    constructor(chromeAliveWindowController: ChromeAliveWindowController);
    onNewPage(page: IPage): Promise<any>;
    highlightNode(id: {
        backendNodeId?: number;
        objectId?: string;
    }): Promise<void>;
    hideHighlight(): Promise<void>;
    generateQuerySelector(id: {
        backendNodeId?: number;
        objectId?: string;
    }): Promise<ISelectorMap>;
}
