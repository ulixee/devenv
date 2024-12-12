import { IDatastoreApiTypes } from '@ulixee/platform-specification/datastore';
import IDatastoreCoreConfigureOptions from '../interfaces/IDatastoreCoreConfigureOptions';
import DatastoreApiHandler from '../lib/DatastoreApiHandler';
declare const _default: DatastoreApiHandler<"Datastore.upload">;
export default _default;
export declare function verifyAdminSignature(request: IDatastoreApiTypes['Datastore.upload']['args'], configuration: IDatastoreCoreConfigureOptions): void;
