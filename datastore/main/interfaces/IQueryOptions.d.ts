import { IDatastoreQueryMetadata, IDatastoreQueryResult } from '@ulixee/platform-specification/datastore/DatastoreApis';
export default interface IQueryOptions extends IDatastoreQueryMetadata {
    domain?: string;
    onQueryResult?: (result: IDatastoreQueryResult) => Promise<any> | void;
    onCacheUpdated?: (sessionId: string, crawler: string, status: 'cached' | 'evicted') => Promise<void> | void;
}
export type IQueryOptionsWithoutId = Partial<Omit<IQueryOptions, 'payment'>>;
