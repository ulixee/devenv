import { IDatastoreApiTypes } from '@ulixee/platform-specification/datastore';
import { IDatastorePaymentRecipient } from '@ulixee/platform-specification/types/IDatastoreManifest';
import { IDatastoreStatsRecord } from '../db/DatastoreStatsTable';
import { IDatastoreManifestWithLatest } from '../interfaces/IDatastoreRegistryStore';
import { IDatastoreStats } from './StatsTracker';
export default function translateDatastoreMetadata(datastore: IDatastoreManifestWithLatest, datastoreStats: IDatastoreStats, includeSchemaAsJson: boolean, paymentInfo?: IDatastorePaymentRecipient): Promise<IDatastoreApiTypes['Datastore.meta']['result']>;
export declare function translateStats(stats: IDatastoreStatsRecord): IDatastoreApiTypes['Datastore.meta']['result']['extractorsByName'][0]['stats'];
