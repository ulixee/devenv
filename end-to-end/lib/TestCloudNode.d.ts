import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';
export default class TestCloudNode {
    #private;
    private rootDir;
    address: string;
    constructor(rootDir?: string, onlyCloseOnFinal?: boolean);
    start(envArgs: Record<string, string>): Promise<string>;
    close(): Promise<void>;
}
export declare function uploadDatastore(id: string, buildDir: string, cloudAddress: string, manifest: Partial<IDatastoreManifest>, identityPath: string): Promise<void>;
