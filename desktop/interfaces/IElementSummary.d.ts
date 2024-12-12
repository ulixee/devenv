export default interface IElementSummary {
    nodeType: number;
    backendNodeId?: number;
    objectId?: string;
    nodeName: string;
    localName: string;
    attributes: {
        name: string;
        value: string;
    }[];
    hasChildren: boolean;
    nodeValueInternal: any;
}
