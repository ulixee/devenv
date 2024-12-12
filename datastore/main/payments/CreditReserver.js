"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncUtils_1 = require("@ulixee/commons/lib/asyncUtils");
const dirUtils_1 = require("@ulixee/commons/lib/dirUtils");
const eventUtils_1 = require("@ulixee/commons/lib/eventUtils");
const fileUtils_1 = require("@ulixee/commons/lib/fileUtils");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const Queue_1 = require("@ulixee/commons/lib/Queue");
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
const utils_1 = require("@ulixee/commons/lib/utils");
const nanoid_1 = require("nanoid");
const promises_1 = require("node:fs/promises");
const Path = require("node:path");
const DatastoreApiClient_1 = require("../lib/DatastoreApiClient");
const DatastoreLookup_1 = require("../lib/DatastoreLookup");
const { log } = (0, Logger_1.default)(module);
class CreditReserver extends eventUtils_1.TypedEventEmitter {
    get datastoreId() {
        return this.paymentDetails.id;
    }
    get credit() {
        return {
            datastoreId: this.paymentDetails.id,
            datastoreVersion: this.paymentDetails.version,
            allocated: this.paymentDetails.allocated,
            remaining: this.paymentDetails.remaining,
            creditsId: this.paymentDetails.paymentMethod.credits.id,
            host: this.paymentDetails.host,
        };
    }
    constructor(credit, baseDir) {
        super();
        this.baseDir = baseDir;
        this.isClosed = false;
        this.queue = new Queue_1.default();
        this.paymentsPendingFinalization = {};
        if (!credit.paymentMethod.credits)
            throw new Error('CreditReserver requires a credit payment method');
        this.storePath = Path.join(baseDir, `${credit.id}-${credit.paymentMethod.credits.id}.json`);
        this.paymentDetails = credit;
        this.saveDebounce = (0, asyncUtils_1.debounce)(this.save.bind(this), 1_000, 5_000);
    }
    async getPaymentInfo() {
        return undefined;
    }
    hasBalance(microgons) {
        return this.paymentDetails.remaining >= microgons;
    }
    async reserve(paymentInfo) {
        const microgons = paymentInfo.microgons ?? 0n;
        if (paymentInfo.id !== this.paymentDetails.id)
            throw new Error('Datastore id does not match');
        return await this.queue.run(async () => {
            if (!this.hasBalance(microgons)) {
                throw new Error('Insufficient credits balance');
            }
            this.paymentDetails.remaining -= microgons;
            this.saveDebounce(false);
            const payment = {
                uuid: (0, nanoid_1.nanoid)(),
                microgons,
                ...this.paymentDetails.paymentMethod,
            };
            this.paymentsPendingFinalization[payment.uuid] = { microgons, datastoreId: paymentInfo.id };
            this.emit('reserved', {
                payment,
                datastoreId: paymentInfo.id,
                remainingBalance: this.paymentDetails.remaining,
            });
            return payment;
        });
    }
    canFinalize(uuid) {
        return uuid in this.paymentsPendingFinalization;
    }
    async finalize(paymentInfo) {
        const { microgons, finalMicrogons, uuid } = paymentInfo;
        const payment = this.paymentsPendingFinalization[uuid];
        delete this.paymentsPendingFinalization[uuid];
        if (payment) {
            return await this.queue.run(async () => {
                this.paymentDetails.remaining += microgons - finalMicrogons;
                this.emit('finalized', {
                    finalMicrogons,
                    initialMicrogons: microgons,
                    paymentUuid: uuid,
                    remainingBalance: this.paymentDetails.remaining,
                });
                this.saveDebounce(true);
            });
        }
    }
    async close() {
        await this.save();
        this.isClosed = true;
    }
    async save(canDelete = false) {
        if (this.isClosed)
            return;
        await this.writeToDisk(canDelete).catch(error => {
            log.error('Error saving credit amount', {
                error,
                creditId: this.paymentDetails.paymentMethod.credits.id,
            });
        });
    }
    async writeToDisk(canDelete) {
        if (!(await (0, fileUtils_1.existsAsync)(this.baseDir))) {
            await (0, promises_1.mkdir)(this.baseDir, { recursive: true });
        }
        if (canDelete && this.paymentDetails.remaining <= CreditReserver.MIN_BALANCE) {
            return await (0, promises_1.unlink)(this.storePath);
        }
        await (0, fileUtils_1.safeOverwriteFile)(this.storePath, TypeSerializer_1.default.stringify(this.paymentDetails, { format: true }));
    }
    static async loadAll(fromDir = CreditReserver.defaultBasePath) {
        if (!(await (0, fileUtils_1.existsAsync)(fromDir)))
            return [];
        const creditFiles = await (0, promises_1.readdir)(fromDir, {
            withFileTypes: true,
        });
        const credits = await Promise.all(creditFiles.map(async (file) => {
            if (!file.isFile() || !file.name.endsWith('.json'))
                return null;
            const path = Path.join(fromDir, file.name);
            const credit = await (0, fileUtils_1.readFileAsJson)(path);
            if (!credit.paymentMethod.credits)
                return null;
            return new CreditReserver(credit, fromDir);
        }));
        return credits.filter(x => x !== null);
    }
    static async load(datastoreId, creditId, fromDir = CreditReserver.defaultBasePath) {
        const storePath = Path.join(fromDir, `${datastoreId}-${creditId}.json`);
        const credit = await (0, fileUtils_1.readFileAsJson)(storePath);
        return new CreditReserver(credit, fromDir);
    }
    static async storeCredit(datastoreId, datastoreVersion, host, credits, creditsDir = CreditReserver.defaultBasePath) {
        const service = new CreditReserver({
            id: datastoreId,
            version: datastoreVersion,
            allocated: credits.remainingCredits,
            remaining: credits.remainingCredits,
            paymentMethod: {
                credits: {
                    id: credits.id,
                    secret: credits.secret,
                },
            },
            host,
        }, creditsDir);
        await service.save();
        return service;
    }
    static async lookup(datastoreUrl, credit, datastoreLookup, creditsDir = CreditReserver.defaultBasePath) {
        const datastoreURL = (0, utils_1.toUrl)(datastoreUrl);
        const datastoreHost = (await datastoreLookup?.getHostInfo(datastoreUrl)) ??
            DatastoreLookup_1.default.parseDatastoreIpHost(datastoreURL);
        if (!datastoreHost)
            throw new Error('This datastoreUrl could not be parsed');
        const { datastoreId, version, host } = datastoreHost;
        const client = new DatastoreApiClient_1.default(host);
        try {
            const balance = await client.getCreditsBalance(datastoreId, version, credit.id);
            const service = new CreditReserver({
                id: datastoreId,
                version,
                allocated: balance.issuedCredits,
                remaining: balance.balance,
                paymentMethod: {
                    credits: credit,
                },
                host,
            }, creditsDir);
            await service.save();
            return service;
        }
        catch (error) {
            throw new Error(`Error looking up credit ${credit.id} for datastore ${datastoreId}`);
        }
        finally {
            if (!client)
                await client.disconnect();
        }
    }
    static async storeCreditFromUrl(url, microgons, datastoreLookup) {
        const datastoreURL = (0, utils_1.toUrl)(url);
        const datastoreHost = (await datastoreLookup?.getHostInfo(url)) ??
            DatastoreLookup_1.default.parseDatastoreIpHost(datastoreURL);
        if (!datastoreHost)
            throw new Error('This datastoreUrl could not be parsed');
        const { datastoreId, version, host } = datastoreHost;
        return await CreditReserver.storeCredit(datastoreId, version, host, {
            id: datastoreURL.username,
            secret: datastoreURL.password,
            remainingCredits: microgons,
        });
    }
}
CreditReserver.MIN_BALANCE = 1;
CreditReserver.defaultBasePath = Path.join((0, dirUtils_1.getDataDirectory)(), 'ulixee', 'credits');
exports.default = CreditReserver;
//# sourceMappingURL=CreditReserver.js.map