"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const localchain_1 = require("@argonprotocol/localchain");
const IBalanceChange_1 = require("@ulixee/platform-specification/types/IBalanceChange");
const env_1 = require("../env");
const BASE_TRANSFER_FEE = 200000n;
class LocalchainChannelHoldSource {
    get sourceKey() {
        return `localchain-${this.address}`;
    }
    constructor(localchain, address, datastoreLookup, isMainchainLoaded) {
        this.localchain = localchain;
        this.address = address;
        this.datastoreLookup = datastoreLookup;
        this.isMainchainLoaded = isMainchainLoaded;
        this.openChannelHoldsById = {};
    }
    async accountOverview() {
        return await this.localchain.accountOverview();
    }
    async createChannelHold(paymentInfo, microgons) {
        await this.isMainchainLoaded.promise;
        const { domain } = paymentInfo;
        if (domain) {
            await this.datastoreLookup.validatePayment(paymentInfo);
        }
        if (env_1.default.allowMinimumAffordableChannelHold) {
            const accountOverview = await this.localchain.accountOverview();
            const availableBalance = accountOverview.balance - accountOverview.heldBalance;
            if (availableBalance < microgons) {
                if (availableBalance > localchain_1.CHANNEL_HOLD_MINIMUM_SETTLEMENT) {
                    microgons = availableBalance - BASE_TRANSFER_FEE;
                }
                else {
                    throw new Error(`Insufficient balance to fund a channel hold for ${microgons} microgons. (Balance=${availableBalance}m)`);
                }
            }
        }
        const openChannelHold = await this.localchain.transactions.createChannelHold(microgons, paymentInfo.recipient.address, domain, paymentInfo.recipient.notaryId);
        const balanceChange = await IBalanceChange_1.BalanceChangeSchema.parseAsync(JSON.parse(await openChannelHold.exportForSend()));
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
    async updateChannelHoldSettlement(channelHold, updatedSettlement) {
        const channelHoldId = channelHold.id;
        this.openChannelHoldsById[channelHoldId] ??=
            await this.localchain.openChannelHolds.get(channelHoldId);
        const openChannelHold = this.openChannelHoldsById[channelHoldId];
        const result = await openChannelHold.sign(updatedSettlement);
        const channelHoldDetails = await openChannelHold.channelHold;
        channelHold.settledMicrogons = channelHoldDetails.settledAmount;
        channelHold.settledSignature = Buffer.from(result.signature);
    }
}
exports.default = LocalchainChannelHoldSource;
//# sourceMappingURL=LocalchainChannelHoldSource.js.map