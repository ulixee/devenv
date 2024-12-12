import { ConnectionToCore } from '@ulixee/net';
import { IDatastoreListEntry, IDatastoreRegistryApis } from '@ulixee/platform-specification/services/DatastoreRegistryApis';
import IDatastoreRegistryStore, { IDatastoreManifestWithLatest } from '../interfaces/IDatastoreRegistryStore';
import { TDatastoreUpload } from './DatastoreRegistry';
export default class DatastoreRegistryServiceClient implements IDatastoreRegistryStore {
    client: ConnectionToCore<IDatastoreRegistryApis, {}>;
    source: "cluster";
    hostAddress: URL;
    constructor(client: ConnectionToCore<IDatastoreRegistryApis, {}>);
    close(): Promise<void>;
    list(count?: number, offset?: number): Promise<{
        datastores: IDatastoreListEntry[];
        total: number;
    }>;
    getVersions(id: string): Promise<{
        version: string;
        timestamp: number;
    }[]>;
    get(id: string, version: string): Promise<IDatastoreManifestWithLatest>;
    getLatestVersion(id: string): Promise<string>;
    downloadDbx(id: string, version: string): ReturnType<IDatastoreRegistryStore['downloadDbx']>;
    upload(datastore: TDatastoreUpload): Promise<{
        success: boolean;
    }>;
}
