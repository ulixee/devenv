import { IPayment } from '@ulixee/platform-specification';
import { IDatastoreListEntry, IDatastoreManifestWithLatest } from '@ulixee/platform-specification/services/DatastoreRegistryApis';
export { IDatastoreManifestWithLatest };
export default interface IDatastoreRegistryStore {
    source: 'cluster' | 'disk';
    close(): Promise<void>;
    list(count?: number, offset?: number): Promise<{
        datastores: IDatastoreListEntry[];
        total: number;
    }>;
    get(id: string, version: string): Promise<IDatastoreManifestWithLatest>;
    getLatestVersion(id: string): Promise<string>;
    downloadDbx?(id: string, version: string, payment?: IPayment): Promise<{
        compressedDbx: Buffer;
        apiHost: string;
        adminIdentity: string;
        adminSignature: Buffer;
    }>;
}
