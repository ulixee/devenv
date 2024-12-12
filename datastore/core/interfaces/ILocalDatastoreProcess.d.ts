import IDatastoreMetadata from '@ulixee/datastore/interfaces/IDatastoreMetadata';
export interface IFetchMetaMessage {
    action: 'fetchMeta';
    scriptPath: string;
}
export type IMessage = IFetchMetaMessage;
export interface IFetchMetaResponseData extends IDatastoreMetadata {
    tableSeedlingsByName: {
        [name: string]: Record<string, any>;
    };
}
export type IResponseData = IFetchMetaResponseData;
export interface IResponse {
    data: IResponseData | Error;
}
