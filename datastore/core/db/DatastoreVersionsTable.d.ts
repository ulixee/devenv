import SqliteTable from '@ulixee/commons/lib/SqliteTable';
import { Database as SqliteDatabase } from 'better-sqlite3';
export default class DatastoreVersionsTable extends SqliteTable<IDatastoreVersionRecord> {
    private getQuery;
    private latestByDatastoresQuery;
    private countDatastoresQuery;
    private findByIdQuery;
    private updateLatestQuery;
    private versionsById;
    private cacheByVersion;
    constructor(db: SqliteDatabase);
    list(results?: number, offset?: number): {
        datastores: IDatastoreVersionRecord[];
        total: number;
    };
    allCached(): IDatastoreVersionRecord[];
    setDbxStopped(dbxPath: string): IDatastoreVersionRecord;
    setDbxStarted(id: string, version: string): IDatastoreVersionRecord;
    delete(id: string, version: string): IDatastoreVersionRecord;
    recordPublishedToNetworkDate(id: string, version: string, publishedToNetworkTimestamp: number): void;
    save(id: string, version: string, scriptEntrypoint: string, versionTimestamp: number, dbxPath: string, source: IDatastoreVersionRecord['source'], adminIdentity: string, adminSignature: Buffer, publishedToNetworkTimestamp?: number): void;
    get(id: string, version: string): IDatastoreVersionRecord;
    getLatestVersion(id: string): string;
    getDatastoreVersions(id: string): IVersionHistoryEntry[];
    private updateDatastoreVersionCache;
    private sortVersionCache;
}
export interface IVersionHistoryEntry {
    version: string;
    timestamp: number;
}
export interface IDatastoreVersionRecord {
    id: string;
    version: string;
    versionTimestamp: number;
    scriptEntrypoint: string;
    dbxPath: string;
    publishedToNetworkTimestamp: number;
    source: 'disk' | 'start' | 'upload' | 'upload:create-storage' | 'cluster';
    adminIdentity: string | undefined;
    adminSignature: Buffer | undefined;
    isStarted: boolean;
    isLatest: boolean;
}
