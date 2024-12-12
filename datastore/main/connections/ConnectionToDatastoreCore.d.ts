import { IDatastoreApis, IChannelHoldApis, IChannelHoldEvents } from '@ulixee/platform-specification/datastore';
import { ConnectionToCore } from '@ulixee/net';
import ITransport from '@ulixee/net/interfaces/ITransport';
import IDatastoreEvents from '../interfaces/IDatastoreEvents';
interface IConnectionToCoreOptions {
    version?: string;
}
export default class ConnectionToDatastoreCore extends ConnectionToCore<IDatastoreApis & IChannelHoldApis, IDatastoreEvents & IChannelHoldEvents> {
    options: IConnectionToCoreOptions;
    constructor(transport: ITransport, options?: IConnectionToCoreOptions);
    static remote(host: string): ConnectionToDatastoreCore;
}
export {};
