import {
  CHANNEL_HOLD_MINIMUM_SETTLEMENT,
  LocalchainOverview,
  OpenChannelHold,
} from '@argonprotocol/localchain';
import Resolvable from '@ulixee/commons/lib/Resolvable';
import IPaymentServiceApiTypes from '@ulixee/platform-specification/datastore/PaymentServiceApis';
import { BalanceChangeSchema } from '@ulixee/platform-specification/types/IBalanceChange';
import { IPaymentMethod } from '@ulixee/platform-specification/types/IPayment';
import Env from '../env';
import ILocalchainRef from '../interfaces/ILocalchainRef';
import DatastoreLookup from '../lib/DatastoreLookup';
import { IChannelHoldDetails, IChannelHoldSource } from './ArgonReserver';

export default class LocalchainChannelHoldSource implements IChannelHoldSource {
  public get sourceKey(): string {
    return `localchain-${this.address}`;
  }

  private readonly openChannelHoldsById: { [channelHoldId: string]: OpenChannelHold } = {};

  constructor(
    public localchain: ILocalchainRef,
    public address: string,
    public datastoreLookup: DatastoreLookup,
    public isMainchainLoaded: Resolvable<void>,
  ) {}

  public async accountOverview(): Promise<LocalchainOverview> {
    return await this.localchain.accountOverview();
  }

  public async createChannelHold(
    paymentInfo: IPaymentServiceApiTypes['PaymentService.reserve']['args'],
    milligons: bigint,
  ): Promise<IChannelHoldDetails> {
    await this.isMainchainLoaded.promise;
    const { domain } = paymentInfo;
    if (domain) {
      await this.datastoreLookup.validatePayment(paymentInfo);
    }

    if (Env.allowMinimumAffordableChannelHold) {
      const accountOverview = await this.localchain.accountOverview();
      const availableBalance = accountOverview.balance - accountOverview.heldBalance;
      if (availableBalance < milligons) {
        if (availableBalance > CHANNEL_HOLD_MINIMUM_SETTLEMENT) {
          milligons = availableBalance- 200n;
        } else {
          throw new Error(
            `Insufficient balance to fund a channel hold for ${milligons} milligons. (Balance=${availableBalance}m)`,
          );
        }
      }
    }

    const openChannelHold = await this.localchain.transactions.createChannelHold(
      milligons,
      paymentInfo.recipient.address!,
      domain,
      paymentInfo.recipient.notaryId,
    );

    const balanceChange = await BalanceChangeSchema.parseAsync(
      JSON.parse(await openChannelHold.exportForSend()),
    );

    const channelHold = await openChannelHold.channelHold;
    const channelHoldId = channelHold.id;
    const expirationMillis = this.localchain.ticker.timeForTick(channelHold.expirationTick);

    this.openChannelHoldsById[channelHoldId] = openChannelHold;
    return {
      channelHoldId,
      balanceChange,
      expirationDate: new Date(Number(expirationMillis)),
    };
  }

  public async updateChannelHoldSettlement(
    channelHold: IChannelHoldDetails,
    updatedSettlement: bigint,
  ): Promise<IBalanceChange> {
    const channelHoldId = channelHold.channelHoldId;
    this.openChannelHoldsById[channelHoldId] ??=
      await this.localchain.openChannelHolds.get(channelHoldId);
    const openChannelHold = this.openChannelHoldsById[channelHoldId];
    const result = await openChannelHold.sign(updatedSettlement);
    const balanceChange = channelHold.balanceChange;
    balanceChange.signature = Buffer.from(result.signature);
    balanceChange.notes[0].milligons = result.milligons;
    balanceChange.balance = balanceChange.channelHoldNote!.milligons - result.milligons;
    return balanceChange;
  }
}