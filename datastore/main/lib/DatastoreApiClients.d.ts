import DatastoreApiClient from './DatastoreApiClient';
/**
 * This is a cache of all the connections to other machines that we keep
 * alive since many connections use repeated access
 */
export default class DatastoreApiClients {
    private apiClientCacheByUrl;
    close(): Promise<void>;
    get(host: string): DatastoreApiClient;
}
