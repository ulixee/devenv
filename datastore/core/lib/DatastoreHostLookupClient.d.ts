import IDatastoreHostLookup, { IDatastoreHost } from '@ulixee/datastore/interfaces/IDatastoreHostLookup';
import { ConnectionToCore } from '@ulixee/net';
import { IDomainLookupApis } from '@ulixee/platform-specification/datastore';
export default class DatastoreHostLookupClient implements IDatastoreHostLookup {
    readonly serviceClient: ConnectionToCore<IDomainLookupApis, {}>;
    constructor(serviceClient: ConnectionToCore<IDomainLookupApis, {}>);
    getHostInfo(datastoreUrl: string): Promise<IDatastoreHost>;
}
