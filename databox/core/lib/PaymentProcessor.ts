import { IBlockSettings, IPayment } from '@ulixee/specification';
import SidechainClient from '@ulixee/sidechain';
import { IBoundLog } from '@ulixee/commons/interfaces/ILog';
import verifyMicronote from '@ulixee/sidechain/lib/verifyMicronote';
import { IDataboxApiTypes } from '@ulixee/specification/databox';
import { InsufficientMicronoteFundsError, InsufficientQueryPriceError } from './errors';

/**
 * 50 microgons for 1KB means:
 * 1 microgons per 20.5 bytes
 * 1MB is $0.05
 * 1GB is $52.43
 *
 * Luminati is 1.2c per mb base price (but that's for all page contents)
 *  ie, 12k microgons, ie, 12 microgons per kb
 *
 */
export default class PaymentProcessor {
  public get pricePerQuery(): number {
    return this.addressesPayable.reduce((total, res) => total + (res.pricePerQuery ?? 0), 0);
  }

  public get pricePerKb(): number {
    // TODO: this should possibly average out once we have multiple miners participating.
    return this.addressesPayable.reduce((total, res) => total + (res.pricePerKb ?? 0), 0);
  }

  private get giftCardId(): string {
    return this.payment.giftCard?.id;
  }

  private get giftCardRedemptionKey(): string {
    return this.payment.giftCard?.redemptionKey;
  }

  private giftCardHoldId: string;
  private addressesPayable: { address: string; pricePerQuery?: number; pricePerKb?: number }[] = [];
  private microgonsAllocated: number;

  constructor(
    private payment: IPayment,
    readonly config: {
      anticipatedBytesPerQuery: number;
      cachedResultDiscount: number; // eg, 0.2 - used as a multiplier
      approvedSidechainRootIdentities: Set<string>;
    },
    private sidechain: SidechainClient,
    private settlementFeeMicrogons: number,
    private blockSettings: IBlockSettings,
    readonly logger: IBoundLog,
  ) {}

  public addAddressPayable(
    address: string,
    payment: { pricePerQuery?: number; pricePerKb?: number },
  ): void {
    if (!address) return;
    const { pricePerQuery, pricePerKb } = payment;
    if (!pricePerQuery && !pricePerKb) return;

    const existing = this.addressesPayable.find(x => x.address === address);
    if (existing) {
      if (pricePerKb) {
        existing.pricePerKb ??= 0;
        existing.pricePerKb += pricePerKb;
      }
      if (pricePerQuery) {
        existing.pricePerQuery ??= 0;
        existing.pricePerQuery += pricePerQuery;
      }
    } else {
      this.addressesPayable.push({ address, pricePerQuery, pricePerKb });
    }
  }

  public async createGiftCardHold(): Promise<boolean> {
    this.microgonsAllocated = this.calculateMinimumPrice();
    const hold = await this.sidechain.giftCards.createHold(
      this.giftCardId,
      this.giftCardRedemptionKey,
      this.microgonsAllocated,
    );
    this.giftCardHoldId = hold.holdId;
    return true;
  }

  public async lock(
    clientStipulations?: IDataboxApiTypes['Databox.exec']['args']['pricingPreferences'],
  ): Promise<boolean> {
    this.validateQueryPrice(clientStipulations?.maxComputePricePerKb);
    this.microgonsAllocated = this.payment.micronote.microgons;
    verifyMicronote(
      this.payment.micronote,
      this.config.approvedSidechainRootIdentities,
      this.blockSettings.height ?? 0,
    );
    const { micronoteId, batchSlug } = this.payment.micronote;
    await this.sidechain.lockMicronote(
      micronoteId,
      batchSlug,
      this.addressesPayable.map(x => x.address),
    );
    return true;
  }

  public async claim(resultBytes: number, isCached = false): Promise<number> {
    const cacheMultiplier = isCached ? this.config.cachedResultDiscount : 1;
    const payments: { [address: string]: number } = {};
    // NOTE: don't claim the settlement cost!!
    const maxMicrogons = this.microgonsAllocated - this.settlementFeeMicrogons;
    let allocatedMicrogons = 0;
    let totalMicrogons = 0;
    for (const addressPayable of this.addressesPayable) {
      let microgons = addressPayable.pricePerQuery ?? 0;
      if (addressPayable.pricePerKb) {
        microgons += Math.floor(resultBytes * addressPayable.pricePerKb);
      }
      if (microgons === 0) continue;
      microgons *= cacheMultiplier;

      totalMicrogons += microgons;
      if (allocatedMicrogons + microgons > maxMicrogons) {
        microgons = maxMicrogons - allocatedMicrogons;
        allocatedMicrogons = maxMicrogons;
      } else {
        allocatedMicrogons += microgons;
      }

      payments[addressPayable.address] ??= 0;
      payments[addressPayable.address] += microgons;
    }

    if (this.giftCardId && this.giftCardHoldId) {
      const total = Object.values(payments).reduce((a, b) => a + b, 0);
      await this.sidechain.giftCards.settleHold(this.giftCardId, this.giftCardHoldId, total);
      return total;
    }

    const { finalCost } = await this.sidechain.claimMicronote(
      this.payment.micronote.micronoteId,
      this.payment.micronote.batchSlug,
      payments,
    );

    // if nsf, claim the funds that are allocated, but do not return the query result
    if (totalMicrogons > maxMicrogons) {
      throw new InsufficientMicronoteFundsError(this.payment.micronote.microgons, totalMicrogons);
    }

    return finalCost;
  }

  private calculateMinimumPrice(): number {
    const pricePerQuery = this.pricePerQuery;
    const pricePerKb = this.pricePerKb;

    return pricePerQuery + Math.ceil((pricePerKb * this.config.anticipatedBytesPerQuery) / 1e3);
  }

  private validateQueryPrice(maxComputePricePerKb: number | undefined): void {
    const pricePerQuery = this.pricePerQuery;
    const pricePerKb = this.pricePerKb;

    const minimumPrice = this.calculateMinimumPrice();

    const microgonsAllocated = this.payment.micronote.microgons - this.settlementFeeMicrogons;

    let isAcceptablePrice = true;
    if (microgonsAllocated < minimumPrice) {
      isAcceptablePrice = false;
    } else if (maxComputePricePerKb && maxComputePricePerKb < pricePerKb) {
      isAcceptablePrice = false;
    }

    if (!isAcceptablePrice) {
      throw new InsufficientQueryPriceError(
        maxComputePricePerKb,
        pricePerQuery,
        pricePerKb,
        microgonsAllocated,
        minimumPrice,
      );
    }
  }
}
