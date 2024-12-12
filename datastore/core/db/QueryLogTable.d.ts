import { Database as SqliteDatabase } from 'better-sqlite3';
import SqliteTable from '@ulixee/commons/lib/SqliteTable';
import type IQueryLogEntry from '@ulixee/datastore/interfaces/IQueryLogEntry';
export default class QueryLogTable extends SqliteTable<IQueryLogRecord> {
    constructor(db: SqliteDatabase);
    record(queryId: string, datastoreId: string, version: string, query: string, startTime: number, affiliateId: string, input: any, outputs: any[], error: Error, channelHoldId: string, creditId: string, microgons: bigint, bytes: number, milliseconds: number, heroSessionIds: string[], cloudNodeHost: string, cloudNodeIdentity: string): void;
}
export interface IQueryLogRecord extends IQueryLogEntry {
    heroSessionIds: string;
}
