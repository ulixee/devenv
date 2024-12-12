"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@ulixee/commons/lib/utils");
const CreditReserver_1 = require("./CreditReserver");
const DefaultPaymentService_1 = require("./DefaultPaymentService");
/**
 * A Payment service meant to be embedded - includes a whitelist of upstream datastores
 */
class EmbeddedPaymentService extends DefaultPaymentService_1.default {
    constructor() {
        super(...arguments);
        /**
         * Security feature to enable only specific datastores to create channelHolds.
         *
         * Key is host_id
         */
        this.whitelistedDatastoreIds = new Set();
        /**
         * Indicates which datastores have been loaded into the IPaymentService['whitelistRemotes'] call
         */
        this.loadedDatastoreIds = new Set();
    }
    async whitelistRemotes(manifest, datastoreLookup) {
        if (!manifest.remoteDatastores)
            return;
        if (this.loadedDatastoreIds.has(manifest.id))
            return;
        this.loadedDatastoreIds.add(manifest.id);
        for (const [remoteSource, datastoreUrl] of Object.entries(manifest.remoteDatastores)) {
            const datastoreHost = await datastoreLookup.getHostInfo(datastoreUrl);
            this.whitelistedDatastoreIds.add(`${datastoreHost.host}_${datastoreHost.datastoreId}`);
            const credit = manifest.remoteDatastoreEmbeddedCredits[remoteSource];
            if (credit) {
                const service = await CreditReserver_1.default.lookup(datastoreUrl, credit, datastoreLookup, this.creditsPath);
                this.addCredit(service);
            }
        }
    }
    async reserve(info) {
        if (!info.microgons || !info.recipient)
            return null;
        const host = (0, utils_1.toUrl)(info.host).host;
        if (!this.whitelistedDatastoreIds.has(`${host}_${info.id}`)) {
            throw new Error(`The host ${info.host} is not whitelisted to create channelHolds for datastore ${info.id}`);
        }
        return super.reserve(info);
    }
}
exports.default = EmbeddedPaymentService;
//# sourceMappingURL=EmbeddedPaymentService.js.map