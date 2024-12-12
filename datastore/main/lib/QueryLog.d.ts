import { IDatastoreApiTypes } from '@ulixee/platform-specification/datastore';
import IQueryLogEntry from '../interfaces/IQueryLogEntry';
export default class QueryLog {
    queriesById: {
        [id: string]: IQueryLogEntry;
    };
    queryLogPath: string;
    private fileWatcher;
    private queryLogBytesRead;
    private appendOps;
    private events;
    private readQueue;
    constructor();
    monitor(onNewQuery: (query: IQueryLogEntry) => any): {
        stop: () => void;
    };
    close(): Promise<void>;
    log(query: IDatastoreApiTypes['Datastore.query']['args'] | IDatastoreApiTypes['Datastore.stream']['args'], startDate: Date, outputs: any[], metadata: IDatastoreApiTypes['Datastore.query']['result']['metadata'], cloudNodeHost: string, cloudNodeIdentity?: string, error?: Error): void;
    private stopWatching;
    private watchFileCallback;
    private publishQueries;
}
