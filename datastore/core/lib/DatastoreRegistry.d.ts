import TypedEventEmitter from '@ulixee/commons/lib/TypedEventEmitter';
import { ConnectionToCore } from '@ulixee/net';
import { IDatastoreListEntry, IDatastoreRegistryApis } from '@ulixee/platform-specification/services/DatastoreRegistryApis';
import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';
import IDatastoreCoreConfigureOptions from '../interfaces/IDatastoreCoreConfigureOptions';
import { IDatastoreManifestWithLatest } from '../interfaces/IDatastoreRegistryStore';
import DatastoreRegistryDiskStore, { IDatastoreSourceDetails } from './DatastoreRegistryDiskStore';
import DatastoreRegistryServiceClient from './DatastoreRegistryServiceClient';
export type IDatastoreManifestWithRuntime = IDatastoreManifestWithLatest & {
    runtimePath: string;
    isStarted: boolean;
};
type TOnDatastoreInstalledCallbackFn = (version: IDatastoreManifestWithRuntime, source: IDatastoreSourceDetails['source'], previous?: IDatastoreManifestWithRuntime, options?: {
    clearExisting?: boolean;
    isWatching?: boolean;
}) => Promise<void>;
export default class DatastoreRegistry extends TypedEventEmitter<{
    new: {
        datastore: IDatastoreManifestWithRuntime;
        activity: 'started' | 'uploaded';
    };
    stopped: {
        id: string;
        version: string;
    };
}> {
    private config?;
    private installCallbackFn?;
    diskStore: DatastoreRegistryDiskStore;
    clusterStore: DatastoreRegistryServiceClient;
    get sourceOfTruthAddress(): URL;
    private readonly stores;
    private logger;
    constructor(datastoreDir: string, connectionToHostedServiceCore?: ConnectionToCore<IDatastoreRegistryApis, {}>, config?: IDatastoreCoreConfigureOptions, installCallbackFn?: TOnDatastoreInstalledCallbackFn);
    close(): Promise<void>;
    list(count?: number, offset?: number): Promise<{
        datastores: IDatastoreListEntry[];
        total: number;
    }>;
    getVersions(id: string): Promise<{
        version: string;
        timestamp: number;
    }[]>;
    get(id: string, version?: string, throwIfNotExists?: boolean): Promise<IDatastoreManifestWithRuntime>;
    getLatestVersion(id: string): Promise<string>;
    saveDbx(details: TDatastoreUpload, sourceHost?: string, source?: IDatastoreSourceDetails['source']): Promise<{
        didInstall: boolean;
        dbxPath: string;
        manifest: IDatastoreManifest;
    }>;
    uploadToSourceOfTruth(datastore: TDatastoreUpload): Promise<{
        success: boolean;
    }>;
    save(datastoreTmpPath: string, adminDetails?: {
        adminIdentity?: string;
        hasServerAdminIdentity?: boolean;
        datastoresMustHaveOwnAdminIdentity?: boolean;
    }, uploaderSource?: IDatastoreSourceDetails): Promise<{
        dbxPath: string;
        manifest: IDatastoreManifest;
        didInstall: boolean;
    }>;
    startAtPath(dbxPath: string, sourceHost: string, watch: boolean): Promise<IDatastoreManifest>;
    stopAtPath(dbxPath: string): void;
    private onDatastoreInstalled;
}
export interface TDatastoreUpload {
    compressedDbx: Buffer;
    adminIdentity?: string;
    adminSignature?: Buffer;
}
export {};
