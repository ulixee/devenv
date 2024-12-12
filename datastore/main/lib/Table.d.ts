import { ExtractSchemaType, ISchemaAny } from '@ulixee/schema';
import IQueryOptions from '../interfaces/IQueryOptions';
import ITableComponents from '../interfaces/ITableComponents';
import DatastoreInternal, { IDatastoreBinding, IQueryInternalCallbacks } from './DatastoreInternal';
export type IExpandedTableSchema<T> = T extends Record<string, ISchemaAny> ? {
    [K in keyof T]: T[K];
} : never;
export default class Table<TSchema extends IExpandedTableSchema<any> = IExpandedTableSchema<any>, TSchemaType extends ExtractSchemaType<TSchema> = ExtractSchemaType<TSchema>> {
    #private;
    readonly schemaType: TSchemaType;
    protected readonly components: ITableComponents<TSchema>;
    get basePrice(): bigint;
    get isPublic(): boolean;
    get schema(): TSchema;
    get name(): string;
    get description(): string | undefined;
    constructor(components: ITableComponents<TSchema>);
    onCreated(): Promise<void>;
    onVersionMigrated(previousVersion: Table<TSchema>): Promise<void>;
    protected get datastoreInternal(): DatastoreInternal;
    fetchInternal(options?: IQueryOptions & {
        input: TSchemaType;
    }, callbacks?: IQueryInternalCallbacks): Promise<TSchemaType[]>;
    insertInternal(...records: TSchemaType[]): Promise<void>;
    queryInternal<T = TSchemaType[]>(sql: string, boundValues?: any[], options?: IQueryOptions, _callbacks?: IQueryInternalCallbacks): Promise<T>;
    attachToDatastore(datastoreInternal: DatastoreInternal<any, any>, tableName: string): void;
    bind(config: IDatastoreBinding): Promise<DatastoreInternal>;
}
