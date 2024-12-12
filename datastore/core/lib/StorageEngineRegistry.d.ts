import IStorageEngine from '@ulixee/datastore/interfaces/IStorageEngine';
import IDatastoreApiTypes, { IDatastoreQueryMetadata } from '@ulixee/platform-specification/datastore/DatastoreApis';
import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';
import { IDatastoreManifestWithRuntime } from './DatastoreRegistry';
import DatastoreVm from './DatastoreVm';
export default class StorageEngineRegistry {
    #private;
    readonly dataDir: string;
    constructor(dataDir: string, nodeAddress: URL);
    close(): Promise<void>;
    isHostingStorageEngine(storageEngineHost: string): boolean;
    get(manifest: Pick<IDatastoreManifest, 'id' | 'version' | 'storageEngineHost'>, queryMetadata: IDatastoreQueryMetadata): IStorageEngine;
    deleteExisting(datastoreId: string, version: string): Promise<void>;
    createRemote(manifest: IDatastoreManifest, version: IDatastoreApiTypes['Datastore.upload']['args'], previousVersion: IDatastoreApiTypes['Datastore.upload']['args']): Promise<void>;
    create(vm: DatastoreVm, datastoreVersion: IDatastoreManifestWithRuntime, previousVersion: IDatastoreManifestWithRuntime | null, options?: {
        clearExisting?: boolean;
        isWatching?: boolean;
    }): Promise<void>;
    private onEngineDisconnected;
    private getRemoteConnection;
}
