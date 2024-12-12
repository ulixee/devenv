import SqliteTable from '@ulixee/commons/lib/SqliteTable';
import { Database as SqliteDatabase } from 'better-sqlite3';
export default class DatastoreStatsTable extends SqliteTable<IDatastoreStatsRecord> {
    private static byVersion;
    private static byDatastore;
    private getByVersionQuery;
    private getQuery;
    constructor(db: SqliteDatabase);
    record(datastoreId: string, version: string, price: bigint, bytes: number, milliseconds: number, creditsUsed: bigint, isError: boolean): {
        versionStats: IDatastoreStatsRecord;
        datastoreStats: IDatastoreStatsRecord;
    };
    getByVersion(datastoreId: string, version: string): IDatastoreStatsRecord;
    get(datastoreId: string): IDatastoreStatsRecord;
    private process;
    private emptyStats;
    private addToStats;
}
export interface IDatastoreStatsRecord {
    datastoreId: string;
    version: string;
    runs: number;
    errors: number;
    lastRunTimestamp: number;
    averageBytes: number;
    maxBytes: number;
    minBytes: number;
    averagePrice: bigint;
    maxPrice: bigint;
    minPrice: bigint;
    averageMilliseconds: number;
    maxMilliseconds: number;
    minMilliseconds: number;
    totalSpend: bigint;
    totalCreditSpend: bigint;
}
