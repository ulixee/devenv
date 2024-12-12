import IResourceType from '@ulixee/unblocked-specification/agent/net/IResourceType';
import IHttpHeaders from '@ulixee/unblocked-specification/agent/net/IHttpHeaders';
import IHttpResourceLoadDetails from '@ulixee/unblocked-specification/agent/net/IHttpResourceLoadDetails';
export default interface IResourceOverview {
    id: number;
    tabId: number;
    frameId: number;
    url: string;
    documentUrl: string;
    type: IResourceType;
    postDataBytes: number;
    requestHeaders: IHttpHeaders;
    method: string;
    statusCode: number;
    responseHeaders: IHttpHeaders;
    responseBodyBytes: number;
    browserServedFromCache?: IHttpResourceLoadDetails['browserServedFromCache'];
    browserLoadFailure?: string;
    receivedAtCommandId: number;
    originalRequestHeaders: string;
    didMitmModifyHeaders: boolean;
}
