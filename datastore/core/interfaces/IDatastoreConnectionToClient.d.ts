import ConnectionToClient from '@ulixee/net/lib/ConnectionToClient';
import { IDatastoreApis } from '@ulixee/platform-specification/datastore';
import IDatastoreEvents from '@ulixee/datastore/interfaces/IDatastoreEvents';
import IDatastoreApiContext from './IDatastoreApiContext';
export default interface IDatastoreConnectionToClient extends ConnectionToClient<IDatastoreApis, IDatastoreEvents, IDatastoreApiContext> {
}
