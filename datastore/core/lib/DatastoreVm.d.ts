import Datastore, { ConnectionToDatastoreCore } from '@ulixee/datastore';
import IDatastoreHostLookup from '@ulixee/datastore/interfaces/IDatastoreHostLookup';
import type IExtractorPluginCore from '@ulixee/datastore/interfaces/IExtractorPluginCore';
import IPaymentService from '@ulixee/datastore/interfaces/IPaymentService';
import IStorageEngine from '@ulixee/datastore/interfaces/IStorageEngine';
import DatastoreApiClients from '@ulixee/datastore/lib/DatastoreApiClients';
import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';
export default class DatastoreVm {
    readonly plugins: IExtractorPluginCore[];
    readonly datastoreLookup: IDatastoreHostLookup;
    private remotePaymentService?;
    static doNotCacheList: Set<string>;
    private compiledScriptsByPath;
    private readonly connectionToDatastoreCore;
    private readonly apiClientCache;
    private readonly whitelist;
    constructor(connectionToDatastoreCore: ConnectionToDatastoreCore, apiClientCache: DatastoreApiClients, plugins: IExtractorPluginCore[], datastoreLookup: IDatastoreHostLookup, remotePaymentService?: IPaymentService);
    getDatastore(path: string): Promise<Datastore>;
    open(path: string, storage: IStorageEngine, manifest: IDatastoreManifest): Promise<Datastore>;
    private getDefaultContext;
    private getVMScript;
    private buildCustomRequire;
}
