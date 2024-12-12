import Identity from '@ulixee/platform-utils/lib/Identity';
import { IFetchMetaResponseData } from '@ulixee/datastore-core/interfaces/ILocalDatastoreProcess';
import DatastoreManifest from '@ulixee/datastore-core/lib/DatastoreManifest';
export default class Dbx {
    readonly path: string;
    manifest: DatastoreManifest;
    get entrypoint(): string;
    constructor(path: string);
    getEmbeddedManifest(): Promise<DatastoreManifest>;
    createOrUpdateDocpage(meta: IFetchMetaResponseData, manifest: DatastoreManifest, entrypoint: string): Promise<void>;
    tarGzip(): Promise<Buffer>;
    upload(host: string, options?: {
        identity?: Identity;
        timeoutMs?: number;
    }): Promise<{
        success: boolean;
    }>;
}
