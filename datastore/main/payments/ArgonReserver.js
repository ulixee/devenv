"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const localchain_1 = require("@argonprotocol/localchain");
const dirUtils_1 = require("@ulixee/commons/lib/dirUtils");
const eventUtils_1 = require("@ulixee/commons/lib/eventUtils");
const fileUtils_1 = require("@ulixee/commons/lib/fileUtils");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const Queue_1 = require("@ulixee/commons/lib/Queue");
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
const utils_1 = require("@ulixee/commons/lib/utils");
const nanoid_1 = require("nanoid");
const Path = require("node:path");
const DatastoreApiClients_1 = require("../lib/DatastoreApiClients");
const { log } = (0, Logger_1.default)(module);
class ArgonReserver extends eventUtils_1.TypedEventEmitter {
    constructor(channelHoldSource, channelHoldAllocationStrategy = {
        type: 'multiplier',
        queries: 100,
    }, apiClients) {
        super();
        this.channelHoldSource = channelHoldSource;
        this.channelHoldAllocationStrategy = channelHoldAllocationStrategy;
        this.paymentsByDatastoreId = {};
        this.paymentsPendingFinalization = {};
        this.reserveQueueByDatastoreId = {};
        this.channelHoldQueue = new Queue_1.default('CHANNELHOLD QUEUE', 1);
        this.needsSave = false;
        this.closeApiClients = false;
        this.storePath = Path.join(ArgonReserver.baseStorePath, `${channelHoldSource.sourceKey}.json`);
        this.saveInterval = setInterval(() => this.save(), 5e3).unref();
        if (!apiClients) {
            this.apiClients = new DatastoreApiClients_1.default();
            this.closeApiClients = true;
        }
        else {
            this.apiClients = apiClients;
        }
    }
    async close() {
        clearInterval(this.saveInterval);
        await this.save();
        if (this.closeApiClients) {
            await this.apiClients.close();
        }
    }
    async load() {
        if (this.loadPromise)
            return this.loadPromise;
        this.loadPromise = (async () => {
            const paymentsByDatastore = await (0, fileUtils_1.readFileAsJson)(this.storePath).catch(() => ({}));
            Object.assign(this.paymentsByDatastoreId, paymentsByDatastore);
        })();
    }
    async save() {
        if (!this.needsSave || !this.loadPromise)
            return;
        this.needsSave = false;
        await this.loadPromise;
        await this.writeToDisk().catch(error => {
            log.error("Error saving ChannelHoldFundsTracker's payments", { error });
        });
    }
    async reserve(paymentInfo) {
        const microgons = paymentInfo.microgons ?? 0n;
        if (!microgons || !paymentInfo.recipient)
            return null;
        let datastoreHost = paymentInfo.host;
        const datastoreId = paymentInfo.id;
        datastoreHost = (0, utils_1.toUrl)(datastoreHost).host;
        await this.load();
        this.reserveQueueByDatastoreId[datastoreId] ??= new Queue_1.default('RESERVE QUEUE', 1);
        this.paymentsByDatastoreId[datastoreId] ??= [];
        return await this.reserveQueueByDatastoreId[datastoreId].run(async () => {
            this.paymentsByDatastoreId[datastoreId] = this.paymentsByDatastoreId[datastoreId].filter(x => x.remaining > 0 && (!x.expirationDate || x.expirationDate > new Date()));
            for (const paymentOption of this.paymentsByDatastoreId[datastoreId]) {
                if (paymentOption.remaining >= microgons) {
                    if (paymentOption.paymentMethod.channelHold?.id) {
                        if (paymentOption.host !== datastoreHost &&
                            !paymentOption.host.includes(`//${datastoreHost}`))
                            continue;
                    }
                    return await this.charge(paymentOption, microgons);
                }
            }
            const holdAmount = this.calculateChannelHoldAmount(datastoreId, microgons);
            const details = await this.createChannelHold(paymentInfo, holdAmount);
            return await this.charge(details, microgons);
        });
    }
    async finalize(paymentInfo) {
        const { microgons, finalMicrogons, uuid } = paymentInfo;
        const payment = this.paymentsPendingFinalization[uuid];
        if (payment) {
            delete this.paymentsPendingFinalization[uuid];
            const details = this.paymentsByDatastoreId[payment.datastoreId].find(x => x.paymentMethod.credits?.id === payment.paymentId ||
                x.paymentMethod.channelHold?.id === payment.paymentId);
            details.remaining += microgons - finalMicrogons;
            this.needsSave = true;
            this.emit('finalized', {
                paymentUuid: uuid,
                initialMicrogons: microgons,
                finalMicrogons,
                remainingBalance: details.remaining,
            });
        }
    }
    async createChannelHold(paymentInfo, microgons) {
        const { id, host, version } = paymentInfo;
        if (microgons < localchain_1.CHANNEL_HOLD_MINIMUM_SETTLEMENT) {
            microgons = localchain_1.CHANNEL_HOLD_MINIMUM_SETTLEMENT;
        }
        return await this.channelHoldQueue.run(async () => {
            const channelHold = await this.channelHoldSource.createChannelHold(paymentInfo, microgons);
            const apiClient = this.apiClients.get(host);
            await apiClient.registerChannelHold(id, channelHold.balanceChange);
            const holdAmount = channelHold.balanceChange.channelHoldNote.microgons;
            const settlement = channelHold.balanceChange.notes[0];
            if (settlement.noteType.action !== 'channelHoldSettle') {
                throw new Error('Invalid channelHold balance change');
            }
            const channelHoldId = channelHold.channelHoldId;
            const allocated = holdAmount;
            const entry = {
                paymentMethod: {
                    channelHold: {
                        id: channelHoldId,
                        settledSignature: Buffer.from(channelHold.balanceChange.signature),
                        settledMicrogons: settlement.microgons,
                    },
                },
                id,
                version,
                remaining: allocated,
                expirationDate: channelHold.expirationDate,
                host,
                allocated,
            };
            this.emit('createdChannelHold', {
                channelHoldId,
                datastoreId: id,
                allocatedMicrogons: holdAmount,
            });
            this.paymentsByDatastoreId[id] ??= [];
            this.paymentsByDatastoreId[id].push(entry);
            return entry;
        });
    }
    calculateChannelHoldAmount(_datastoreId, microgons) {
        if (this.channelHoldAllocationStrategy.type === 'default') {
            return this.channelHoldAllocationStrategy.microgons;
        }
        if (this.channelHoldAllocationStrategy.type === 'multiplier') {
            return microgons * BigInt(this.channelHoldAllocationStrategy.queries);
        }
        throw new Error('Unknown channelHold allocation strategy. Please specify in `config.channelHoldAllocationStrategy.type`.');
    }
    async charge(details, microgons) {
        if (details.paymentMethod.channelHold?.id) {
            await this.updateSettlement(details, microgons);
        }
        details.remaining -= microgons;
        this.needsSave = true;
        const payment = {
            uuid: (0, nanoid_1.nanoid)(),
            microgons,
            ...details.paymentMethod,
        };
        this.paymentsPendingFinalization[payment.uuid] = {
            microgons,
            datastoreId: details.id,
            paymentId: details.paymentMethod.credits?.id ?? details.paymentMethod.channelHold?.id,
        };
        this.emit('reserved', {
            payment,
            datastoreId: details.id,
            remainingBalance: details.remaining,
        });
        return payment;
    }
    async updateSettlement(details, addedMicrogons) {
        const channelHold = details.paymentMethod.channelHold;
        if (!channelHold)
            return;
        // settle in increments of 1000 microgons
        const updatedSettlement = ((details.allocated - details.remaining + addedMicrogons + 999n) /
            ArgonReserver.settlementThreshold) *
            ArgonReserver.settlementThreshold;
        if (updatedSettlement > details.allocated) {
            throw new Error('Cannot release more than the allocated amount');
        }
        if (updatedSettlement > channelHold.settledMicrogons) {
            await this.channelHoldSource.updateChannelHoldSettlement(channelHold, updatedSettlement);
            this.needsSave = true;
            this.emit('updateSettlement', {
                channelHoldId: channelHold.id,
                settledMicrogons: channelHold.settledMicrogons,
                datastoreId: details.id,
                remaining: details.allocated - channelHold.settledMicrogons,
            });
        }
    }
    async writeToDisk() {
        await (0, fileUtils_1.safeOverwriteFile)(this.storePath, TypeSerializer_1.default.stringify(this.paymentsByDatastoreId, { format: true }));
    }
}
ArgonReserver.settlementThreshold = 1000n;
ArgonReserver.baseStorePath = Path.join((0, dirUtils_1.getDataDirectory)(), `ulixee`);
exports.default = ArgonReserver;
//# sourceMappingURL=ArgonReserver.js.map