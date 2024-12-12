import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';
import IDatastorePricing from '@ulixee/platform-specification/types/IDatastorePricing';
import DatastoreApiClient from './DatastoreApiClient';
export default class PricingManager {
    readonly apiClient: DatastoreApiClient;
    constructor(apiClient: DatastoreApiClient);
    getEntityPrice(datastoreId: string, version: string, name: string): Promise<bigint>;
    getQueryPrice(datastoreId: string, version: string, sql: string): Promise<bigint>;
    static computePrice(manifest: IDatastoreManifest, entityCalls: string[]): bigint;
    static getNetBasePrice(prices: IDatastorePricing[]): bigint;
    static getOfficialBytes(output: any): number;
}
