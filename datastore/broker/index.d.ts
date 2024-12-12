import '@ulixee/commons/lib/SourceMapSupport';
import { BalanceSyncResult } from '@argonprotocol/localchain';
import ApiRegistry from '@ulixee/net/lib/ApiRegistry';
import AdminApiEndpoints from './endpoints/AdminApiEndpoints';
import IDatabrokerApiContext from './interfaces/IDatabrokerApiContext';
import IDatabrokerCoreConfigureOptions from './interfaces/IDatabrokerCoreConfigureOptions';
export default class DataBroker {
    #private;
    readonly configuration: IDatabrokerCoreConfigureOptions;
    apiRegistry: ApiRegistry<IDatabrokerApiContext>;
    adminApis: AdminApiEndpoints;
    get host(): Promise<string>;
    get adminHost(): Promise<string>;
    constructor(configuration: IDatabrokerCoreConfigureOptions);
    close(): Promise<void>;
    onLocalchainSync(sync: BalanceSyncResult): Promise<void>;
    listen(port?: number, hostname?: string): Promise<void>;
    listenAdmin(port: number): Promise<void>;
    getApiContext(remoteId: string): IDatabrokerApiContext;
}
