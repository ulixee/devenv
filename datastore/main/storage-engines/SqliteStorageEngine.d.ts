import { IAnySchemaJson } from '@ulixee/schema/interfaces/ISchemaJson';
import { SqlParser } from '@ulixee/sql-engine';
import SqliteAdapter from '@ulixee/sql-engine/adapters/SqliteAdapter';
import { IDbJsTypes } from '@ulixee/sql-engine/interfaces/IDbTypes';
import IQueryOptions from '../interfaces/IQueryOptions';
import AbstractStorageEngine from './AbstractStorageEngine';
type ISchema = Record<string, IAnySchemaJson>;
export default class SqliteStorageEngine extends AbstractStorageEngine {
    #private;
    readonly path: string;
    readonly adapter: SqliteAdapter;
    constructor(storagePath?: string);
    close(): Promise<void>;
    filterLocalTableCalls(entityCalls: string[]): string[];
    query<TResult>(sql: string | SqlParser, boundValues: IDbJsTypes[], _metadata?: IQueryOptions, virtualEntitiesByName?: {
        [name: string]: {
            parameters?: Record<string, any>;
            records: Record<string, any>[];
        };
    }): Promise<TResult>;
    protected createTable(name: string, schema: ISchema): Promise<void>;
    private convertBoundValuesToMap;
}
export {};
