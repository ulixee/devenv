import TypedEventEmitter from '@ulixee/commons/lib/TypedEventEmitter';
import { IStatsTrackerApiTypes } from '@ulixee/platform-specification/services/StatsTrackerApis';
import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';
import { IDatastoreStatsRecord } from '../db/DatastoreStatsTable';
import QueryLogDb from '../db/QueryLogDb';
import StatsDb from '../db/StatsDb';
import { IDatastoreStats } from './StatsTracker';
export default class StatsTrackerDiskStore extends TypedEventEmitter<{
    stats: IDatastoreStatsRecord;
}> {
    #private;
    readonly datastoresDir: string;
    get statsDb(): StatsDb;
    get queryLogDb(): QueryLogDb;
    constructor(datastoresDir: string);
    close(): Promise<void>;
    getForDatastoreVersion(manifest: IDatastoreManifest): IDatastoreStats;
    getForDatastore(manifest: IDatastoreManifest): IDatastoreStats;
    getDatastoreSummary(id: string): {
        stats: IDatastoreStats['stats'];
    };
    recordEntityStats(details: IStatsTrackerApiTypes['StatsTracker.recordEntityStats']['args']): void;
    recordQuery(details: IStatsTrackerApiTypes['StatsTracker.recordQuery']['args']): void;
}
