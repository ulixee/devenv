"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreditsTable_1 = require("@ulixee/datastore/lib/CreditsTable");
const PricingManager_1 = require("@ulixee/datastore/lib/PricingManager");
const errors_1 = require("./errors");
/**
 * 50 microgons for 1KB means:
 * 1 microgons per 20.5 bytes
 * 1MB is $0.05
 * 1GB is $52.43
 *
 * Proxy services can be 1.2c per mb base price (but that's for all page contents)
 *  ie, 12k microgons, ie, 12 microgons per kb
 *
 */
class PaymentsProcessor {
    constructor(payment, datastoreId, datastore, context) {
        this.payment = payment;
        this.datastoreId = datastoreId;
        this.datastore = datastore;
        this.context = context;
        this.initialPrice = 0n;
        this.talliedPrice = 0n;
        this.shouldFinalize = true;
    }
    async debit(queryId, manifest, entityCalls) {
        const price = PricingManager_1.default.computePrice(manifest, entityCalls);
        this.initialPrice = price;
        if (price === 0n)
            return true;
        if (!this.payment?.credits?.id && !this.payment?.channelHold?.id) {
            throw new errors_1.PaymentRequiredError('This Datastore requires payment.', Number(price));
        }
        if (price !== this.payment.microgons) {
            throw new errors_1.InsufficientQueryPriceError(Number(this.payment.microgons), Number(price));
        }
        if (this.payment.credits) {
            const credits = this.datastore.tables[CreditsTable_1.default.tableName];
            if (!credits)
                throw new Error('This Datastore does not support Credits.');
            const { id, secret } = this.payment.credits;
            await credits.debit(id, secret, price);
            this.shouldFinalize = true;
        }
        else {
            const result = await this.context.argonPaymentProcessor.debit({
                datastoreId: this.datastoreId,
                queryId,
                payment: this.payment,
            });
            this.shouldFinalize = result.shouldFinalize;
        }
        return true;
    }
    trackCallResult(_call, microgons, upstreamResult) {
        let amount = microgons ?? 0n;
        if (upstreamResult)
            amount += upstreamResult.microgons ?? 0n;
        this.talliedPrice += amount;
        return amount;
    }
    storageEngineResult(result) {
        this.talliedPrice += result.microgons;
    }
    async finalize(_bytes) {
        if (this.shouldFinalize && this.payment) {
            if (this.payment.credits) {
                const diff = this.initialPrice - this.talliedPrice;
                if (diff !== 0n) {
                    const credits = this.datastore.tables[CreditsTable_1.default.tableName];
                    await credits.finalize(this.payment.credits.id, diff);
                }
            }
            else {
                await this.context.argonPaymentProcessor.finalize({
                    datastoreId: this.datastoreId,
                    channelHoldId: this.payment.channelHold.id,
                    uuid: this.payment.uuid,
                    finalMicrogons: this.talliedPrice,
                });
            }
        }
        return this.talliedPrice;
    }
}
exports.default = PaymentsProcessor;
//# sourceMappingURL=PaymentsProcessor.js.map