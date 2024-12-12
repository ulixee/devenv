import { Database as SqliteDatabase } from 'better-sqlite3';
import SqliteTable from '@ulixee/commons/lib/SqliteTable';
export default class DatastoreEntityStatsTable extends SqliteTable<IDatastoreEntityStatsRecord> {
    private static byIdVersionAndName;
    private static byIdAndName;
    private getQuery;
    private getByVersionQuery;
    constructor(db: SqliteDatabase);
    record(datastoreId: string, version: string, name: string, price: bigint, bytes: number, milliseconds: number, creditsUsed: bigint, isError: boolean): void;
    getByVersion(datastoreId: string, version: string, name: string): IDatastoreEntityStatsRecord;
    getByDatastore(datastoreId: string, name: string): IDatastoreEntityStatsRecord;
    private emptyStats;
    private process;
    private addToStats;
}
export declare function calculateNewAverageBigInt(oldAverage: bigint, value: bigint, newTotalValues: number): bigint;
export interface IDatastoreEntityStatsRecord {
    datastoreId: string;
    version: string;
    name: string;
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
