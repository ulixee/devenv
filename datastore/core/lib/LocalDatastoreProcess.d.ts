import '@ulixee/commons/lib/SourceMapSupport';
import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import { IFetchMetaResponseData } from '../interfaces/ILocalDatastoreProcess';
export default class LocalDatastoreProcess extends TypedEventEmitter<{
    error: Error;
}> {
    #private;
    scriptPath: string;
    constructor(scriptPath: string);
    fetchMeta(): Promise<IFetchMetaResponseData>;
    close(): Promise<void>;
    private closeCleanup;
    private get child();
    private handleMessageFromChild;
    private sendMessageToChild;
}
