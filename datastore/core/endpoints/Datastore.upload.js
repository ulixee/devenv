"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminSignature = verifyAdminSignature;
const errors_1 = require("@ulixee/commons/lib/errors");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const errors_2 = require("@ulixee/platform-utils/lib/errors");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const DatastoreApiHandler_1 = require("../lib/DatastoreApiHandler");
exports.default = new DatastoreApiHandler_1.default('Datastore.upload', {
    async handler(request, context) {
        const { workTracker, datastoreRegistry, configuration } = context;
        verifyAdminSignature(request, configuration);
        // Check if this DatastoreRegistry should be the "owner" of this datastore. If not, proxy it through.
        if (!context.datastoreRegistry.diskStore.isSourceOfTruth) {
            return await context.datastoreRegistry.uploadToSourceOfTruth(request);
        }
        const result = await workTracker.trackUpload(datastoreRegistry.saveDbx(request, context.connectionToClient?.transport.remoteId));
        if (result.manifest && !result.didInstall) {
            throw new errors_1.UlixeeError('This datastore version has already been uploaded', 'ERR_DUPLICATE_VERSION', {
                version: result.manifest.version,
            });
        }
        return { success: result?.didInstall ?? false };
    },
});
function verifyAdminSignature(request, configuration) {
    if (configuration.cloudAdminIdentities.length ||
        configuration.serverEnvironment === 'production') {
        const message = DatastoreApiClient_1.default.createUploadSignatureMessage(request.compressedDbx);
        if (!Identity_1.default.verify(request.adminIdentity, message, request.adminSignature)) {
            throw new errors_2.InvalidSignatureError('This uploaded Datastore did not have a valid AdminIdentity signature.');
        }
    }
}
//# sourceMappingURL=Datastore.upload.js.map