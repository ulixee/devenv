"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@ulixee/platform-utils/lib/errors");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const DatastoreApiHandler_1 = require("../lib/DatastoreApiHandler");
const errors_2 = require("../lib/errors");
exports.default = new DatastoreApiHandler_1.default('Datastore.download', {
    async handler(request, context) {
        const { datastoreRegistry, configuration } = context;
        const { id, version, requestDate, adminIdentity, adminSignature } = request;
        if (Date.now() - requestDate.getTime() > 10e3) {
            throw new Error('This download request date is too old. Please try again.');
        }
        // verify admin permissions to download
        let isValidAdmin = configuration.cloudAdminIdentities.includes(adminIdentity);
        if (!isValidAdmin) {
            if (!adminIdentity && configuration.serverEnvironment === 'production') {
                throw new errors_2.InvalidPermissionsError(`Download from this cloud require Admin Signatures.`);
            }
            const datastore = await datastoreRegistry.get(id, version);
            isValidAdmin = datastore.adminIdentities.includes(adminIdentity);
        }
        if (!isValidAdmin)
            throw new errors_2.InvalidPermissionsError(`The signing Admin Identity does not have permissions to this Datastore`);
        const signatureMessage = DatastoreApiClient_1.default.createDownloadSignatureMessage(id, version, requestDate.getTime());
        if (!Identity_1.default.verify(adminIdentity, signatureMessage, adminSignature)) {
            throw new errors_1.InvalidSignatureError("You didn't include a valid AdminIdentity signature to authorize this request.");
        }
        // don't go out to the network
        const result = await datastoreRegistry.diskStore.getCompressedDbx(id, version);
        if (!result)
            throw new errors_2.DatastoreNotFoundError('Could not find this Datastore runtime.', { version });
        return result;
    },
});
//# sourceMappingURL=Datastore.download.js.map