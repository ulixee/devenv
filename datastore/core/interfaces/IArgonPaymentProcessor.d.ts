import IDatastoreManifest, { IDatastorePaymentRecipient } from '@ulixee/platform-specification/types/IDatastoreManifest';
import IArgonPaymentProcessorApis from '@ulixee/platform-specification/services/ArgonPaymentProcessorApis';
export default interface IArgonPaymentProcessor {
    getPaymentInfo(): Promise<IDatastorePaymentRecipient | undefined>;
    debit(data: IArgonPaymentProcessorApis['ArgonPaymentProcessor.debit']['args']): Promise<IArgonPaymentProcessorApis['ArgonPaymentProcessor.debit']['result']>;
    finalize(data: IArgonPaymentProcessorApis['ArgonPaymentProcessor.finalize']['args']): Promise<IArgonPaymentProcessorApis['ArgonPaymentProcessor.finalize']['result']>;
    importChannelHold(data: IArgonPaymentProcessorApis['ArgonPaymentProcessor.importChannelHold']['args'], datastoreManifest: IDatastoreManifest): Promise<IArgonPaymentProcessorApis['ArgonPaymentProcessor.importChannelHold']['result']>;
}
