"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const localchain_1 = require("@argonprotocol/localchain");
const eventUtils_1 = require("@ulixee/commons/lib/eventUtils");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const env_1 = require("../env");
const index_1 = require("../index");
const DatastoreLookup_1 = require("../lib/DatastoreLookup");
const ArgonReserver_1 = require("./ArgonReserver");
const BrokerChannelHoldSource_1 = require("./BrokerChannelHoldSource");
const CreditReserver_1 = require("./CreditReserver");
const LocalchainChannelHoldSource_1 = require("./LocalchainChannelHoldSource");
/**
 * A PaymentService that activates credits and includes an optional ArgonReserver
 */
class DefaultPaymentService extends eventUtils_1.TypedEventEmitter {
    constructor(argonReserver, loadCreditFromPath = 'default') {
        super();
        this.creditsByDatastoreId = {};
        this.creditsPath = CreditReserver_1.default.defaultBasePath;
        this.paymentUuidToService = {};
        this.argonReserver = argonReserver;
        if (loadCreditFromPath) {
            this.creditsPath =
                loadCreditFromPath === 'default' ? CreditReserver_1.default.defaultBasePath : loadCreditFromPath;
            this.creditsAutoLoaded = this.loadCredits().catch(() => null);
        }
        this.argonReserver?.addEventEmitter(this, [
            'reserved',
            'finalized',
            'createdChannelHold',
            'updateSettlement',
        ]);
    }
    async credits() {
        const credits = [];
        for (const services of Object.values(this.creditsByDatastoreId) ?? []) {
            credits.push(...services.map(x => x.credit));
        }
        return credits;
    }
    async loadCredits(path) {
        if (this.creditsAutoLoaded) {
            if (!path || path === this.creditsPath)
                return this.creditsAutoLoaded;
        }
        path ??= this.creditsPath;
        const credits = await CreditReserver_1.default.loadAll(path);
        for (const credit of credits) {
            this.addCredit(credit);
        }
    }
    addCredit(service) {
        this.creditsByDatastoreId[service.datastoreId] ??= [];
        this.creditsByDatastoreId[service.datastoreId].push(service);
        service.addEventEmitter(this, ['reserved', 'finalized']);
    }
    async close() {
        for (const services of Object.values(this.creditsByDatastoreId) ?? []) {
            await Promise.allSettled(services.map(x => x.close()));
        }
        await this.argonReserver?.close();
    }
    async attachCredit(url, credit, datastoreLookup) {
        let mainchainClientToClose;
        if (!datastoreLookup && env_1.default.argonMainchainUrl) {
            mainchainClientToClose = localchain_1.MainchainClient.connect(env_1.default.argonMainchainUrl, 10e3);
            datastoreLookup = new DatastoreLookup_1.default(mainchainClientToClose);
        }
        try {
            const service = await CreditReserver_1.default.lookup(url, credit, datastoreLookup, this.creditsPath);
            this.addCredit(service);
        }
        finally {
            if (mainchainClientToClose) {
                await mainchainClientToClose.then(x => x.close());
            }
        }
    }
    async reserve(info) {
        if (!info.microgons)
            return null;
        await this.creditsAutoLoaded;
        let datastoreCredits = 0;
        for (const credit of this.creditsByDatastoreId[info.id] ?? []) {
            datastoreCredits += 1;
            if (credit.hasBalance(info.microgons)) {
                const payment = await credit.reserve(info);
                if (payment) {
                    this.paymentUuidToService[payment.uuid] = new WeakRef(credit);
                    return payment;
                }
            }
        }
        if (!this.argonReserver) {
            if (datastoreCredits > 0) {
                throw new Error(`Your datastore credit${datastoreCredits > 1} don't have enough remaining funds. Connect another payment source to continue.`);
            }
            throw new Error("You don't have any valid payment methods configured. Please install any credits you have or connect a localchain.");
        }
        if (!info.recipient) {
            throw new Error("This Datastore hasn't configured a payment address, so it can't receive Argons as payment.");
        }
        const payment = await this.argonReserver?.reserve(info);
        if (payment) {
            this.paymentUuidToService[payment.uuid] = new WeakRef(this.argonReserver);
        }
        return payment;
    }
    async finalize(info) {
        const service = this.paymentUuidToService[info.uuid]?.deref();
        delete this.paymentUuidToService[info.uuid];
        await service?.finalize(info);
    }
    static async fromLocalchain(config, channelHoldAllocationStrategy, apiClients, loadCreditsFromPath) {
        const localchain = await index_1.LocalchainWithSync.load(config);
        return await DefaultPaymentService.fromOpenLocalchain(localchain, channelHoldAllocationStrategy ?? config.channelHoldAllocationStrategy, apiClients, loadCreditsFromPath);
    }
    static async fromOpenLocalchain(localchain, channelHoldAllocationStrategy, apiClients, loadCreditsFromPath) {
        const datastoreLookup = new DatastoreLookup_1.default(localchain.mainchainClient);
        const channelHoldSource = new LocalchainChannelHoldSource_1.default(localchain, await localchain.address, datastoreLookup, localchain.mainchainLoaded);
        const reserver = new ArgonReserver_1.default(channelHoldSource, channelHoldAllocationStrategy ?? localchain.localchainConfig.channelHoldAllocationStrategy, apiClients);
        await reserver.load();
        return new DefaultPaymentService(reserver, loadCreditsFromPath);
    }
    static async fromBroker(brokerHost, identityConfig, channelHoldAllocationStrategy, apiClients, loadCreditsFromPath) {
        const identity = 'pemPath' in identityConfig
            ? Identity_1.default.loadFromFile(identityConfig.pemPath, identityConfig.passphrase ? { keyPassphrase: identityConfig.passphrase } : undefined)
            : Identity_1.default.loadFromPem(identityConfig.pem);
        const channelHoldSource = new BrokerChannelHoldSource_1.default(brokerHost, identity);
        const reserver = new ArgonReserver_1.default(channelHoldSource, channelHoldAllocationStrategy, apiClients);
        await reserver.load();
        return new DefaultPaymentService(reserver, loadCreditsFromPath);
    }
}
exports.default = DefaultPaymentService;
//# sourceMappingURL=DefaultPaymentService.js.map