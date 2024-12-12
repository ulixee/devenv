import IResourceType from '@ulixee/unblocked-specification/agent/net/IResourceType';
export default interface IResourceSearchResult {
    id: number;
    matchIndices: [start: number, end: number][];
    type: IResourceType;
    body: string;
    url: string;
    documentUrl: string;
    statusCode: number;
}
