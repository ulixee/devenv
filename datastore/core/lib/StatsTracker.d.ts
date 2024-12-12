import { ConnectionToCore } from '@ulixee/net';
import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';
import TypedEventEmitter from '@ulixee/commons/lib/TypedEventEmitter';
import { IStatsTrackerApis, IStatsTrackerApiTypes } from '@ulixee/platform-specification/services/StatsTrackerApis';
import { IDatastoreStatsRecord } from '../db/DatastoreStatsTable';
import StatsTrackerDiskStore from './StatsTrackerDiskStore';
import StatsTrackerServiceClient from './StatsTrackerServiceClient';
export type IDatastoreStats = IStatsTrackerApiTypes['StatsTracker.get']['result'];
export default class StatsTracker extends TypedEventEmitter<{
    stats: IDatastoreStatsRecord;
    query: {
        datastoreId: string;
        version: string;
    };
}> {
    readonly datastoresDir: string;
    diskStore?: StatsTrackerDiskStore;
    serviceClient?: StatsTrackerServiceClient;
    constructor(datastoresDir: string, connectionToServiceCore?: ConnectionToCore<IStatsTrackerApis, {}>);
    close(): Promise<void>;
    getForDatastoreVersion(manifest: IDatastoreManifest): Promise<IDatastoreStats>;
    getForDatastore(manifest: IDatastoreManifest): Promise<IDatastoreStats>;
    getSummary(datastoreId: string): Promise<Pick<IDatastoreStats, 'stats'>>;
    recordEntityStats(details: IStatsTrackerApiTypes['StatsTracker.recordEntityStats']['args']): Promise<void>;
    recordQuery(details: IStatsTrackerApiTypes['StatsTracker.recordQuery']['args']): Promise<void>;
}
