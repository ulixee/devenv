import { IBoundLog } from '@ulixee/commons/interfaces/ILog';
import DatastoreApiClients from '@ulixee/datastore/lib/DatastoreApiClients';
import LocalchainWithSync from '@ulixee/datastore/payments/LocalchainWithSync';
import DatastoreWhitelistDb from '../db/DatastoreWhitelistDb';
import DatabrokerDb from '../db';
import IDatabrokerCoreConfigureOptions from './IDatabrokerCoreConfigureOptions';
export default interface IDatabrokerApiContext {
    logger: IBoundLog;
    configuration: IDatabrokerCoreConfigureOptions;
    localchain: LocalchainWithSync;
    db: DatabrokerDb;
    datastoreWhitelist: DatastoreWhitelistDb;
    datastoreApiClients: DatastoreApiClients;
}
