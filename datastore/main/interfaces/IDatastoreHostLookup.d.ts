import IDomainLookupApiTypes from '@ulixee/platform-specification/datastore/DomainLookupApis';
export type IDatastoreHost = IDomainLookupApiTypes['DomainLookup.query']['result'];
export default interface IDatastoreHostLookup {
    getHostInfo(datastoreUrl: string): Promise<IDatastoreHost>;
}
