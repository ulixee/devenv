"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const localchain_1 = require("@argonprotocol/localchain");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const serdeJson_1 = require("@ulixee/platform-utils/lib/serdeJson");
const DatastoreChannelHoldsDb_1 = require("../db/DatastoreChannelHoldsDb");
const { log } = (0, Logger_1.default)(module);
class ArgonPaymentProcessor {
    constructor(channelHoldDbDir, localchain) {
        this.channelHoldDbDir = channelHoldDbDir;
        this.localchain = localchain;
        this.channelHoldDbsByDatastore = new Map();
        this.openChannelHoldsById = new Map();
    }
    async getPaymentInfo() {
        if (!this.cachedPaymentInfo) {
            this.cachedPaymentInfo = await this.localchain.paymentInfo?.promise;
        }
        if (!this.cachedPaymentInfo) {
            const account = await this.localchain.accountOverview();
            const notaryId = (await this.localchain.accounts.getDepositAccount()).notaryId;
            this.cachedPaymentInfo = {
                address: account.address,
                notaryId,
                ...account.mainchainIdentity,
            };
        }
        return this.cachedPaymentInfo;
    }
    async close() {
        return Promise.resolve();
    }
    async debit(data) {
        if (!data.payment.channelHold.id) {
            throw new Error('The payment sent to the ArgonPaymentProcessor does not have a ChannelHold id. This is an internal error.');
        }
        await this.updateSettlement(data.payment.channelHold.id, data.payment.channelHold.settledMicrogons, data.payment.channelHold.settledSignature);
        return this.getDb(data.datastoreId).debit(data.queryId, data.payment);
    }
    finalize(data) {
        const { datastoreId, channelHoldId, uuid, finalMicrogons } = data;
        this.getDb(datastoreId).finalize(channelHoldId, uuid, finalMicrogons);
        return Promise.resolve();
    }
    async importChannelHold(data, datastoreManifest) {
        const note = data.channelHold.channelHoldNote;
        if (note.noteType.action === 'channelHold') {
            if (datastoreManifest.domain) {
                const notaryHash = localchain_1.DomainStore.getHash(datastoreManifest.domain);
                if (!note.noteType.domainHash.equals(notaryHash)) {
                    throw new Error(`The supplied ChannelHold note does not match the domain of this Datastore ${data.datastoreId}`);
                }
            }
            const paymentInfo = await this.getPaymentInfo();
            if (paymentInfo.notaryId &&
                paymentInfo.notaryId !== data.channelHold.previousBalanceProof?.notaryId) {
                throw new Error(`The channelHold notary (${data.channelHold.previousBalanceProof?.notaryId}) does not match the required notary (${paymentInfo.notaryId})`);
            }
            const recipient = note.noteType.recipient;
            if ((await this.canSign(recipient)) !== true) {
                const localchainAddress = await this.localchain.address;
                log.warn('This channelHold is made out to a different address than your attached localchain', {
                    recipient,
                    channelHold: data.channelHold,
                    yourAddress: localchainAddress,
                });
                throw new Error('ChannelHold recipient not localchain address');
            }
        }
        else {
            throw new Error('Invalid channelHold note');
        }
        const channelHold = await this.importToLocalchain(data.datastoreId, data.channelHold);
        this.getDb(data.datastoreId).create(channelHold.id, channelHold.holdAmount, this.timeForTick(channelHold.expirationTick));
        return { accepted: true };
    }
    async updateSettlement(channelHoldId, settledMicrogons, settledSignature) {
        let channelHold = this.openChannelHoldsById.get(channelHoldId);
        if (!channelHold) {
            channelHold = await this.localchain.openChannelHolds.get(channelHoldId);
            this.openChannelHoldsById.set(channelHoldId, channelHold);
        }
        const internal = await channelHold.channelHold;
        if (settledMicrogons > internal.settledAmount) {
            await channelHold.recordUpdatedSettlement(settledMicrogons, settledSignature);
        }
    }
    async canSign(address) {
        const myAddress = await this.localchain.address;
        return myAddress === address;
    }
    timeForTick(tick) {
        const time = this.localchain.ticker.timeForTick(tick);
        return new Date(Number(time));
    }
    async importToLocalchain(datastoreId, balanceChange) {
        log.stats('Importing channelHold to localchain', { datastoreId, balanceChange });
        const channelHoldJson = (0, serdeJson_1.default)(balanceChange);
        const openChannelHold = await this.localchain.openChannelHolds.importChannelHold(channelHoldJson);
        const channelHold = await openChannelHold.channelHold;
        this.openChannelHoldsById.set(channelHold.id, openChannelHold);
        return channelHold;
    }
    getDb(datastoreId) {
        if (!datastoreId)
            throw new Error('No datastoreId provided to get channelHold spend tracking db.');
        let db = this.channelHoldDbsByDatastore.get(datastoreId);
        if (!db) {
            db = new DatastoreChannelHoldsDb_1.default(this.channelHoldDbDir, datastoreId);
            this.channelHoldDbsByDatastore.set(datastoreId, db);
        }
        return db;
    }
}
exports.default = ArgonPaymentProcessor;
//# sourceMappingURL=ArgonPaymentProcessor.js.map