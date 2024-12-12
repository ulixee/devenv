import { AccountStore, BalanceSync, BalanceSyncResult, CryptoScheme, DomainStore, Keystore, Localchain, LocalchainOverview, MainchainClient, MainchainTransferStore, OpenChannelHoldsStore, TickerRef, Transactions } from '@argonprotocol/localchain';
import { KeyringPair$Json } from '@argonprotocol/mainchain';
import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import Resolvable from '@ulixee/commons/lib/Resolvable';
import ILocalchainConfig from '../interfaces/ILocalchainConfig';
import ILocalchainRef from '../interfaces/ILocalchainRef';
import DatastoreApiClients from '../lib/DatastoreApiClients';
import DatastoreLookup from '../lib/DatastoreLookup';
import DefaultPaymentService from './DefaultPaymentService';
export default class LocalchainWithSync extends TypedEventEmitter<{
    sync: BalanceSyncResult;
}> implements ILocalchainRef {
    #private;
    readonly localchainConfig: Omit<ILocalchainConfig, 'localchainCreateIfMissing'>;
    get accounts(): AccountStore;
    get domains(): DomainStore;
    get openChannelHolds(): OpenChannelHoldsStore;
    get balanceSync(): BalanceSync;
    get transactions(): Transactions;
    get ticker(): TickerRef;
    get mainchainTransfers(): MainchainTransferStore;
    get mainchainClient(): Promise<MainchainClient>;
    get keystore(): Keystore;
    get inner(): Localchain;
    get name(): string;
    get path(): string;
    get currentTick(): number;
    isSynching: boolean;
    datastoreLookup: DatastoreLookup;
    address: Promise<string>;
    enableLogging: boolean;
    paymentInfo: Resolvable<{
        notaryId: number;
        chain: import("@argonprotocol/localchain").Chain;
        genesisHash: string;
        address: string;
    }>;
    mainchainLoaded: Resolvable<void>;
    private nextTick;
    constructor(localchainConfig?: Omit<ILocalchainConfig, 'localchainCreateIfMissing'>);
    load(): Promise<void>;
    bindToExportedAccount(accountJson: KeyringPair$Json, passphrase?: string): Promise<void>;
    createIfMissing(account?: {
        suri?: string;
        cryptoScheme?: CryptoScheme;
    }): Promise<void>;
    close(): Promise<void>;
    connectToMainchain(argonMainchainUrl: string, timeoutMs?: number): Promise<void>;
    attachMainchain(mainchain: MainchainClient): Promise<void>;
    accountOverview(): Promise<LocalchainOverview>;
    timeForTick(tick: number): Date;
    createPaymentService(datastoreClients: DatastoreApiClients): Promise<DefaultPaymentService>;
    private getPassword;
    private afterLoad;
    private scheduleNextTick;
    static load(config?: Omit<ILocalchainConfig, 'localchainCreateIfMissing'>): Promise<LocalchainWithSync>;
}
