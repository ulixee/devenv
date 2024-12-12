import { IDatastoreListEntry } from '@ulixee/platform-specification/services/DatastoreRegistryApis';
import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';
import IDatastoreRegistryStore, { IDatastoreManifestWithLatest } from '../interfaces/IDatastoreRegistryStore';
import { IDatastoreManifestWithRuntime } from './DatastoreRegistry';
export type TInstallDatastoreCallbackFn = (version: IDatastoreManifestWithRuntime, source: IDatastoreSourceDetails, previous?: IDatastoreManifestWithRuntime, options?: {
    clearExisting?: boolean;
    isWatching?: boolean;
}) => Promise<void>;
export default class DatastoreRegistryDiskStore implements IDatastoreRegistryStore {
    #private;
    readonly datastoresDir: string;
    readonly isSourceOfTruth: boolean;
    readonly defaultStorageEngineHost: string;
    readonly onInstallCallbackFn: TInstallDatastoreCallbackFn;
    source: "disk";
    private get datastoresDb();
    constructor(datastoresDir: string, isSourceOfTruth: boolean, defaultStorageEngineHost: string, onInstallCallbackFn: TInstallDatastoreCallbackFn);
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
    getRuntime(id: string, version: string): Promise<{
        runtimePath: string;
        isStarted: boolean;
    }>;
    getCompressedDbx(id: string, version: string): Promise<{
        compressedDbx: Buffer;
        adminSignature: Buffer;
        adminIdentity: string;
    }>;
    installFromService(id: string, version: string, service: IDatastoreRegistryStore): Promise<{
        runtimePath: string;
        isStarted: boolean;
    }>;
    getPreviousInstalledVersion(id: string, version: string): Promise<string>;
    getLatestVersion(id: string): Promise<string>;
    install(datastoreTmpPath: string, adminOptions: {
        adminIdentity?: string;
        hasServerAdminIdentity?: boolean;
        datastoresMustHaveOwnAdminIdentity?: boolean;
    }, sourceDetails?: IDatastoreSourceDetails): Promise<{
        dbxPath: string;
        manifest: IDatastoreManifest;
        didInstall: boolean;
    }>;
    installOnDiskUploads(cloudAdminIdentities: string[]): Promise<{
        dbxPath: string;
        manifest: IDatastoreManifest;
    }[]>;
    startAtPath(dbxPath: string, sourceHost: string, watch: boolean): Promise<IDatastoreManifest>;
    stopAtPath(dbxPath: string): {
        version: string;
        id: string;
    };
    recordPublished(id: string, version: string, timestamp: number): void;
    onInstalled(manifest: IDatastoreManifest, source: IDatastoreSourceDetails, clearExisting?: boolean, isWatching?: boolean): Promise<void>;
    private verifyAdminIdentity;
    private checkDatastoreCoreInstalled;
    private createDbxPath;
    private saveManifestMetadata;
}
export interface IDatastoreSourceDetails {
    source: 'disk' | 'upload' | 'upload:create-storage' | 'start' | 'cluster';
    adminIdentity?: string;
    adminSignature?: Buffer;
}
