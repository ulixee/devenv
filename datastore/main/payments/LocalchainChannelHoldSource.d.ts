import { LocalchainOverview } from '@argonprotocol/localchain';
import Resolvable from '@ulixee/commons/lib/Resolvable';
import IPaymentServiceApiTypes from '@ulixee/platform-specification/datastore/PaymentServiceApis';
import { IPaymentMethod } from '@ulixee/platform-specification/types/IPayment';
import ILocalchainRef from '../interfaces/ILocalchainRef';
import DatastoreLookup from '../lib/DatastoreLookup';
import { IChannelHoldDetails, IChannelHoldSource } from './ArgonReserver';
export default class LocalchainChannelHoldSource implements IChannelHoldSource {
    localchain: ILocalchainRef;
    address: string;
    datastoreLookup: DatastoreLookup;
    isMainchainLoaded: Resolvable<void>;
    get sourceKey(): string;
    private readonly openChannelHoldsById;
    constructor(localchain: ILocalchainRef, address: string, datastoreLookup: DatastoreLookup, isMainchainLoaded: Resolvable<void>);
    accountOverview(): Promise<LocalchainOverview>;
    createChannelHold(paymentInfo: IPaymentServiceApiTypes['PaymentService.reserve']['args'], microgons: bigint): Promise<IChannelHoldDetails>;
    updateChannelHoldSettlement(channelHold: IPaymentMethod['channelHold'], updatedSettlement: bigint): Promise<void>;
}
