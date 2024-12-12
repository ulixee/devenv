import { IDbJsTypes } from '@ulixee/sql-engine/interfaces/IDbTypes';
import SqlParser from '@ulixee/sql-engine/lib/Parser';
import Datastore from '../lib/Datastore';
import { IQueryInternalCallbacks } from '../lib/DatastoreInternal';
import { ISchema } from '../storage-engines/AbstractStorageEngine';
import IDatastoreComponents, { TCrawlers, TExtractors, TTables } from './IDatastoreComponents';
import IQueryOptions from './IQueryOptions';
export default interface IStorageEngine {
    inputsByName: {
        [name: string]: ISchema;
    };
    schemasByName: {
        [name: string]: ISchema;
    };
    virtualTableNames: Set<string>;
    filterLocalTableCalls(entityCalls: string[]): string[];
    bind(datastore: IDatastoreComponents<TTables, TExtractors, TCrawlers>): void;
    create(datastore: Datastore, previousVersion?: Datastore): Promise<void>;
    query<TResult>(sql: string | SqlParser, boundValues: IDbJsTypes[], metadata?: IQueryOptions, virtualEntitiesByName?: {
        [name: string]: {
            parameters?: Record<string, any>;
            records: Record<string, any>[];
        };
    }, callbacks?: IQueryInternalCallbacks): Promise<TResult>;
    close(): Promise<void>;
}
