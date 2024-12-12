import DatastoreStatsTable from './DatastoreStatsTable';
import DatastoreEntityStatsTable from './DatastoreEntityStatsTable';
export default class StatsDb {
    readonly datastores: DatastoreStatsTable;
    readonly datastoreEntities: DatastoreEntityStatsTable;
    private db;
    constructor(baseDir: string);
    close(): void;
}
