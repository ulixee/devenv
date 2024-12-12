import IDatastoreMetadata from '@ulixee/datastore/interfaces/IDatastoreMetadata';
import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';
export default class DatastoreManifest implements IDatastoreManifest {
    private sharedConfigFileKey?;
    static TemporaryIdPrefix: string;
    id: string;
    version: string;
    name: string;
    description: string;
    versionTimestamp: number;
    scriptHash: string;
    scriptEntrypoint: string;
    storageEngineHost: string;
    coreVersion: string;
    schemaInterface: string;
    crawlersByName: IDatastoreManifest['crawlersByName'];
    extractorsByName: IDatastoreManifest['extractorsByName'];
    tablesByName: IDatastoreManifest['tablesByName'];
    adminIdentities: string[];
    domain?: string;
    explicitSettings: Partial<IDatastoreManifest>;
    source: 'dbx' | 'entrypoint' | 'project' | 'global';
    readonly path: string;
    constructor(manifestPath: string, source?: (typeof DatastoreManifest.prototype)['source'], sharedConfigFileKey?: string);
    exists(): Promise<boolean>;
    update(absoluteScriptEntrypoint: string, scriptHash: string, versionTimestamp: number, schemaInterface: string, extractorsByName: IDatastoreManifest['extractorsByName'], crawlersByName: IDatastoreManifest['crawlersByName'], tablesByName: IDatastoreManifest['tablesByName'], metadata: Pick<IDatastoreMetadata, 'id' | 'version' | 'coreVersion' | 'payment' | 'domain' | 'adminIdentities' | 'name' | 'description' | 'storageEngineHost'>, logger?: (message: string, ...args: any[]) => any, createTemporaryVersion?: boolean): Promise<void>;
    load(): Promise<boolean>;
    save(): Promise<void>;
    toConfigManifest(): IDatastoreManifestJson;
    toJSON(): IDatastoreManifest;
    private syncGeneratedManifests;
    private loadGeneratedManifests;
    private loadExplicitSettings;
    static validate(json: IDatastoreManifest): void;
    static validateId(id: string): void;
    private static getCustomSources;
    private static loadEntrypointManifest;
    private static loadProjectManifest;
    private static loadGlobalManifest;
    private static writeToDisk;
}
interface IDatastoreManifestJson extends Partial<IDatastoreManifest> {
    __GENERATED_LAST_VERSION__: IDatastoreManifest;
}
export {};
