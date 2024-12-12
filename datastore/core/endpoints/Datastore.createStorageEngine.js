"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileUtils_1 = require("@ulixee/commons/lib/fileUtils");
const errors_1 = require("@ulixee/platform-utils/lib/errors");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const fs_1 = require("fs");
const DatastoreApiHandler_1 = require("../lib/DatastoreApiHandler");
const dbxUtils_1 = require("../lib/dbxUtils");
exports.default = new DatastoreApiHandler_1.default('Datastore.createStorageEngine', {
    async handler(request, context) {
        const { configuration } = context;
        const { version, previousVersion } = request;
        const needsValidSignatures = configuration.serverEnvironment === 'production';
        if (needsValidSignatures) {
            verifySignature(version.compressedDbx, version.adminIdentity, version.adminSignature, 'uploaded "version"');
            if (previousVersion)
                verifySignature(previousVersion.compressedDbx, previousVersion.adminIdentity, previousVersion.adminSignature, 'uploaded "previousVersion"');
        }
        if (previousVersion)
            await install(previousVersion, context, false);
        await install(version, context, true);
        return { success: true };
    },
});
async function install(version, context, forceInstall = false) {
    const { configuration, datastoreRegistry, storageEngineRegistry } = context;
    const tmpVersionDir = await fs_1.promises.mkdtemp(`${configuration.datastoresTmpDir}/`);
    try {
        await (0, dbxUtils_1.unpackDbx)(version.compressedDbx, tmpVersionDir);
        const manifest = await (0, fileUtils_1.readFileAsJson)(`${tmpVersionDir}/datastore-manifest.json`);
        if (!storageEngineRegistry.isHostingStorageEngine(manifest.storageEngineHost)) {
            throw new Error(`Uploaded to invalid Datastore.createStorageEngine host. Should have been ${manifest.storageEngineHost}.`);
        }
        const { adminIdentity, adminSignature } = version;
        // install will trigger storage engine installation
        const sourceDetails = {
            source: 'upload:create-storage',
            adminIdentity,
            adminSignature,
        };
        const result = await datastoreRegistry.diskStore.install(tmpVersionDir, {
            adminIdentity,
            hasServerAdminIdentity: configuration.cloudAdminIdentities.includes(adminIdentity ?? '-1'),
        }, sourceDetails);
        if (forceInstall && !result.didInstall) {
            await datastoreRegistry.diskStore.onInstalled(result.manifest, sourceDetails);
        }
    }
    finally {
        // remove tmp dir in case of errors
        await fs_1.promises.rm(tmpVersionDir, { recursive: true }).catch(() => null);
    }
}
function verifySignature(compressedDbx, adminIdentity, adminSignature, name) {
    const message = DatastoreApiClient_1.default.createUploadSignatureMessage(compressedDbx);
    if (!Identity_1.default.verify(adminIdentity, message, adminSignature)) {
        throw new errors_1.InvalidSignatureError(`This ${name} Datastore did not have a valid AdminIdentity signature.`);
    }
}
//# sourceMappingURL=Datastore.createStorageEngine.js.map