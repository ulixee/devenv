import IPaymentServiceApiTypes from '@ulixee/platform-specification/datastore/PaymentServiceApis';
import { IPaymentMethod } from '@ulixee/platform-specification/types/IPayment';
import Identity from '@ulixee/platform-utils/lib/Identity';
import { IChannelHoldDetails, IChannelHoldSource } from './ArgonReserver';
export default class BrokerChannelHoldSource implements IChannelHoldSource {
    host: string;
    readonly authentication: Identity;
    get sourceKey(): string;
    private readonly connectionToCore;
    private keyring;
    private readonly loadPromise;
    private balanceChangeByChannelHoldId;
    constructor(host: string, authentication: Identity);
    close(): Promise<void>;
    load(): Promise<void>;
    getBalance(): Promise<bigint>;
    createChannelHold(paymentInfo: IPaymentServiceApiTypes['PaymentService.reserve']['args'], microgons: bigint): Promise<IChannelHoldDetails>;
    updateChannelHoldSettlement(channelHold: IPaymentMethod['channelHold'], updatedSettlement: bigint): Promise<void>;
    static createSignatureMessage(domain: string | null, datastoreId: string, identity: Buffer, microgons: bigint, nonce: string): Buffer;
    static getBalance(host: string, identity: string): Promise<bigint>;
}
