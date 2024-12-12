"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@ulixee/commons/lib/utils");
const BrokerChannelHoldSource_1 = require("@ulixee/datastore/payments/BrokerChannelHoldSource");
const IBalanceChange_1 = require("@ulixee/platform-specification/types/IBalanceChange");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const DatabrokerApiHandler_1 = require("../lib/DatabrokerApiHandler");
exports.default = new DatabrokerApiHandler_1.default('Databroker.createChannelHold', {
    async handler(request, context) {
        const { microgons, recipient, datastoreId, domain, delegatedSigningAddress, authentication } = request;
        const { identity, signature, nonce } = authentication;
        const identityBytes = Identity_1.default.getBytes(identity);
        (0, utils_1.assert)(context.datastoreWhitelist.isWhitelisted(datastoreId, domain), "Sorry, this datastore domain isn't whitelisted.");
        const signatureMessage = BrokerChannelHoldSource_1.default.createSignatureMessage(domain, datastoreId, identityBytes, microgons, nonce);
        (0, utils_1.assert)(Identity_1.default.verify(identity, signatureMessage, signature), 'Invalid signature');
        const db = context.db;
        return await db.transaction(async () => {
            const organizationId = db.users.getOrganizationId(identity);
            (0, utils_1.assert)(organizationId, 'Organization not found');
            db.organizations.debit(organizationId, microgons);
            const openChannelHold = await context.localchain.transactions.createChannelHold(microgons, recipient.address, domain, recipient.notaryId, delegatedSigningAddress);
            const channelHold = await openChannelHold.channelHold;
            db.channelHolds.create({
                channelHoldId: channelHold.id,
                heldMicrogons: microgons,
                domain,
                organizationId,
                settledMicrogons: channelHold.settledAmount,
                settlementDate: null,
                createdByIdentity: identity,
                created: Date.now(),
            });
            const balanceChange = await IBalanceChange_1.BalanceChangeSchema.parseAsync(JSON.parse(await openChannelHold.exportForSend()));
            const expirationDate = context.localchain.timeForTick(channelHold.expirationTick);
            return {
                channelHoldId: channelHold.id,
                balanceChange,
                expirationDate,
            };
        });
    },
});
//# sourceMappingURL=Databroker.createChannelHold.js.map