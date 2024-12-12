import { ISelectorMap } from '../ISelectorMap';
export default interface IDevtoolsBackdoorApi {
    toggleInspectElementMode(): Promise<void>;
    highlightNode(options: {
        backendNodeId?: number;
        objectId?: string;
    }): Promise<void>;
    hideHighlight(): Promise<void>;
    generateQuerySelector(options: {
        backendNodeId?: number;
        objectId?: string;
    }): Promise<ISelectorMap>;
}
