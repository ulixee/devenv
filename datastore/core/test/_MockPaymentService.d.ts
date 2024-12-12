import { KeyringPair } from '@argonprotocol/mainchain';
import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import IPaymentService, { IPaymentEvents } from '@ulixee/datastore/interfaces/IPaymentService';
import DatastoreApiClient from '@ulixee/datastore/lib/DatastoreApiClient';
import { IPayment } from '@ulixee/platform-specification';
import IPaymentServiceApiTypes from '@ulixee/platform-specification/datastore/PaymentServiceApis';
import { IDatastorePaymentRecipient } from '@ulixee/platform-specification/types/IDatastoreManifest';
export default class MockPaymentService extends TypedEventEmitter<IPaymentEvents> implements IPaymentService {
    clientAddress: KeyringPair;
    client: DatastoreApiClient;
    paymentInfo?: IDatastorePaymentRecipient;
    private name?;
    paymentsByDatastoreId: {
        [datastoreId: string]: {
            channelHoldId: string;
        };
    };
    channelHoldsById: {
        [channelHoldId: string]: {
            channelHoldAmount: bigint;
            tick: number;
        };
    };
    payments: IPaymentServiceApiTypes['PaymentService.finalize']['args'][];
    constructor(clientAddress: KeyringPair, client: DatastoreApiClient, paymentInfo?: IDatastorePaymentRecipient, name?: string);
    close(): Promise<void>;
    getPaymentInfo(): Promise<IDatastorePaymentRecipient>;
    reserve(info: IPaymentServiceApiTypes['PaymentService.reserve']['args']): Promise<IPayment>;
    finalize(info: any): Promise<void>;
}
