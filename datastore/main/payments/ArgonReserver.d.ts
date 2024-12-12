import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import { IPayment } from '@ulixee/platform-specification';
import IPaymentServiceApiTypes from '@ulixee/platform-specification/datastore/PaymentServiceApis';
import IBalanceChange from '@ulixee/platform-specification/types/IBalanceChange';
import { IPaymentMethod } from '@ulixee/platform-specification/types/IPayment';
import { IPaymentDetails, IPaymentEvents, IPaymentReserver } from '../interfaces/IPaymentService';
import DatastoreApiClients from '../lib/DatastoreApiClients';
export type IChannelHoldAllocationStrategy = {
    type: 'default';
    microgons: bigint;
} | {
    type: 'multiplier';
    queries: number;
};
type IPaymentDetailsByDatastoreId = {
    [datastoreId: string]: IPaymentDetails[];
};
export interface IChannelHoldDetails {
    channelHoldId: string;
    balanceChange: IBalanceChange;
    expirationDate: Date;
}
export interface IChannelHoldSource {
    sourceKey: string;
    createChannelHold(paymentInfo: IPaymentServiceApiTypes['PaymentService.reserve']['args'], microgons: bigint): Promise<IChannelHoldDetails>;
    updateChannelHoldSettlement(channelHold: IPaymentMethod['channelHold'], updatedSettlement: bigint): Promise<void>;
}
export default class ArgonReserver extends TypedEventEmitter<IPaymentEvents> implements IPaymentReserver {
    private channelHoldSource;
    private channelHoldAllocationStrategy;
    static settlementThreshold: bigint;
    static baseStorePath: string;
    readonly paymentsByDatastoreId: IPaymentDetailsByDatastoreId;
    private paymentsPendingFinalization;
    private readonly reserveQueueByDatastoreId;
    private readonly channelHoldQueue;
    private needsSave;
    private loadPromise;
    private readonly saveInterval;
    private closeApiClients;
    private apiClients;
    private readonly storePath;
    constructor(channelHoldSource: IChannelHoldSource, channelHoldAllocationStrategy?: IChannelHoldAllocationStrategy, apiClients?: DatastoreApiClients);
    close(): Promise<void>;
    load(): Promise<void>;
    save(): Promise<void>;
    reserve(paymentInfo: IPaymentServiceApiTypes['PaymentService.reserve']['args']): Promise<IPayment>;
    finalize(paymentInfo: IPaymentServiceApiTypes['PaymentService.finalize']['args']): Promise<void>;
    createChannelHold(paymentInfo: IPaymentServiceApiTypes['PaymentService.reserve']['args'], microgons: bigint): Promise<IPaymentDetails>;
    protected calculateChannelHoldAmount(_datastoreId: string, microgons: bigint): bigint;
    private charge;
    private updateSettlement;
    private writeToDisk;
}
export {};
