import IArgonPaymentProcessor from '@ulixee/datastore-core/interfaces/IArgonPaymentProcessor';
import { ConnectionToCore } from '@ulixee/net';
import IArgonPaymentProcessorApiTypes, { IArgonPaymentProcessorApis } from '@ulixee/platform-specification/services/ArgonPaymentProcessorApis';
import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';
export default class ArgonPaymentProcessorClient implements IArgonPaymentProcessor {
    readonly serviceClient: ConnectionToCore<IArgonPaymentProcessorApis, {}>;
    constructor(serviceClient: ConnectionToCore<IArgonPaymentProcessorApis, {}>);
    getPaymentInfo(): Promise<IArgonPaymentProcessorApiTypes['ArgonPaymentProcessor.getPaymentInfo']['result']>;
    debit(data: IArgonPaymentProcessorApiTypes['ArgonPaymentProcessor.debit']['args']): Promise<IArgonPaymentProcessorApiTypes['ArgonPaymentProcessor.debit']['result']>;
    finalize(data: IArgonPaymentProcessorApiTypes['ArgonPaymentProcessor.finalize']['args']): Promise<IArgonPaymentProcessorApiTypes['ArgonPaymentProcessor.finalize']['result']>;
    importChannelHold(data: IArgonPaymentProcessorApiTypes['ArgonPaymentProcessor.importChannelHold']['args'], _datastoreManifest: IDatastoreManifest): Promise<IArgonPaymentProcessorApiTypes['ArgonPaymentProcessor.importChannelHold']['result']>;
}
