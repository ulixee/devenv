import IDatastoreCoreConfigureOptions from '@ulixee/datastore-core/interfaces/IDatastoreCoreConfigureOptions';
import ICoreConfigureOptions from '@ulixee/hero-interfaces/ICoreConfigureOptions';
import CloudNode from './CloudNode';
export default class CoreRouter {
    private cloudNode;
    set datastoreConfiguration(value: Partial<IDatastoreCoreConfigureOptions>);
    set heroConfiguration(value: ICoreConfigureOptions);
    private nodeAddress;
    private hostedServiceEndpoints;
    private hostedServicesAddress;
    private isClosing;
    private readonly connections;
    private cloudApiRegistry;
    private wsConnectionByType;
    private httpRoutersByType;
    constructor(cloudNode: CloudNode);
    register(): Promise<void>;
    close(): Promise<void>;
    private addHostedServicesConnection;
    private addHttpRoute;
    private addWsRoute;
    private getApiContext;
    private handleHome;
    private handleRawSocketRequest;
    private handleSocketRequest;
    private handleHttpRequest;
    private handleHttpServerDetails;
    private handleHostedServicesRoot;
}
