import { ConnectionToCore } from '@ulixee/net';
import { IStatsTrackerApis, IStatsTrackerApiTypes } from '@ulixee/platform-specification/services/StatsTrackerApis';
import { IDatastoreStats } from './StatsTracker';
export default class StatsTrackerServiceClient {
    client: ConnectionToCore<IStatsTrackerApis, {}>;
    constructor(client: ConnectionToCore<IStatsTrackerApis, {}>);
    close(): Promise<void>;
    getForDatastoreVersion(datastoreId: string, version: string): Promise<IDatastoreStats>;
    getForDatastore(datastoreId: string): Promise<IDatastoreStats>;
    getDatastoreSummary(datastoreId: string): Promise<Pick<IDatastoreStats, 'stats'>>;
    recordEntityStats(details: IStatsTrackerApiTypes['StatsTracker.recordEntityStats']['args']): Promise<void>;
    recordQuery(details: IStatsTrackerApiTypes['StatsTracker.recordQuery']['args']): Promise<void>;
}
