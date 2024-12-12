import IDatastoreApiTypes, { IDatastoreQueryMetadata } from '@ulixee/platform-specification/datastore/DatastoreApis';
import { SqlParser } from '@ulixee/sql-engine';
import { IDbJsTypes } from '@ulixee/sql-engine/interfaces/IDbTypes';
import ConnectionToDatastoreCore from '../connections/ConnectionToDatastoreCore';
import IQueryOptions from '../interfaces/IQueryOptions';
import { IQueryInternalCallbacks } from '../lib/DatastoreInternal';
import AbstractStorageEngine from './AbstractStorageEngine';
export default class RemoteStorageEngine extends AbstractStorageEngine {
    protected connectionToCore: ConnectionToDatastoreCore;
    protected metadata: IDatastoreQueryMetadata;
    constructor(connectionToCore: ConnectionToDatastoreCore, metadata: IDatastoreQueryMetadata);
    filterLocalTableCalls(_entityCalls: string[]): string[];
    close(): Promise<void>;
    query<TResult>(sql: string | SqlParser, boundValues: IDbJsTypes[], metadata?: IQueryOptions, virtualEntitiesByName?: {
        [name: string]: {
            parameters?: Record<string, any>;
            records: Record<string, any>[];
        };
    }, callbacks?: IQueryInternalCallbacks): Promise<TResult>;
    createRemote(version: IDatastoreApiTypes['Datastore.upload']['args'], previousVersion?: IDatastoreApiTypes['Datastore.upload']['args']): Promise<void>;
    protected createTable(): Promise<void>;
}
