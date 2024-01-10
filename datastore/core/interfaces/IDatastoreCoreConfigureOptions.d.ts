import { IBlockSettings } from '@ulixee/specification';
import Identity from '@ulixee/crypto/lib/Identity';
export default interface IDatastoreCoreConfigureOptions {
    serverEnvironment: 'development' | 'production';
    cloudType: 'public' | 'private';
    maxRuntimeMs: number;
    datastoresDir: string;
    queryHeroSessionsDir: string;
    datastoresTmpDir: string;
    waitForDatastoreCompletionOnShutdown: boolean;
    paymentAddress: string;
    enableDatastoreWatchMode: boolean;
    cloudAdminIdentities: string[];
    datastoresMustHaveOwnAdminIdentity: boolean;
    defaultBytesForPaymentEstimates: number;
    computePricePerQuery: number;
    approvedSidechains: IBlockSettings['sidechains'];
    approvedSidechainsRefreshInterval: number;
    defaultSidechainHost: string;
    defaultSidechainRootIdentity: string;
    identityWithSidechain: Identity;
    datastoreRegistryHost: string | 'self';
    storageEngineHost: string | 'self';
    statsTrackerHost: string | 'self';
    replayRegistryHost: string | 'self';
}
