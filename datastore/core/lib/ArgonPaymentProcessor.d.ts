import IArgonPaymentProcessor from '@ulixee/datastore-core/interfaces/IArgonPaymentProcessor';
import ILocalchainRef from '@ulixee/datastore/interfaces/ILocalchainRef';
import { IArgonPaymentProcessorApiTypes } from '@ulixee/platform-specification/services/ArgonPaymentProcessorApis';
import IDatastoreManifest, { IDatastorePaymentRecipient } from '@ulixee/platform-specification/types/IDatastoreManifest';
export default class ArgonPaymentProcessor implements IArgonPaymentProcessor {
    readonly channelHoldDbDir: string;
    readonly localchain: ILocalchainRef;
    private readonly channelHoldDbsByDatastore;
    private readonly openChannelHoldsById;
    private cachedPaymentInfo?;
    constructor(channelHoldDbDir: string, localchain: ILocalchainRef);
    getPaymentInfo(): Promise<IDatastorePaymentRecipient | undefined>;
    close(): Promise<void>;
    debit(data: IArgonPaymentProcessorApiTypes['ArgonPaymentProcessor.debit']['args']): Promise<IArgonPaymentProcessorApiTypes['ArgonPaymentProcessor.debit']['result']>;
    finalize(data: IArgonPaymentProcessorApiTypes['ArgonPaymentProcessor.finalize']['args']): Promise<IArgonPaymentProcessorApiTypes['ArgonPaymentProcessor.finalize']['result']>;
    importChannelHold(data: IArgonPaymentProcessorApiTypes['ArgonPaymentProcessor.importChannelHold']['args'], datastoreManifest: IDatastoreManifest): Promise<IArgonPaymentProcessorApiTypes['ArgonPaymentProcessor.importChannelHold']['result']>;
    private updateSettlement;
    private canSign;
    private timeForTick;
    private importToLocalchain;
    private getDb;
}
