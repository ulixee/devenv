import ILocalchainConfig from '@ulixee/datastore/interfaces/ILocalchainConfig';
export default interface IDatastoreCoreConfigureOptions {
    serverEnvironment: 'development' | 'production';
    maxRuntimeMs: number;
    datastoresDir: string;
    queryHeroSessionsDir: string;
    datastoresTmpDir: string;
    waitForDatastoreCompletionOnShutdown: boolean;
    enableDatastoreWatchMode: boolean;
    cloudAdminIdentities: string[];
    datastoresMustHaveOwnAdminIdentity: boolean;
    localchainConfig?: ILocalchainConfig;
    datastoreRegistryHost: string | 'self';
    storageEngineHost: string | 'self';
    statsTrackerHost: string | 'self';
    replayRegistryHost: string | 'self';
    argonPaymentProcessorHost: string | 'self';
    upstreamPaymentsServiceHost: string | 'self';
    datastoreLookupHost: string | 'self';
}
