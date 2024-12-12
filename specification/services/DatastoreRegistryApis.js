"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatastoreRegistryApiSchemas = exports.DatastoreListEntry = exports.DatastoreManifestWithLatest = void 0;
const types_1 = require("@ulixee/platform-specification/types");
const zod_1 = require("zod");
const datastoreIdValidation_1 = require("../types/datastoreIdValidation");
const IDatastoreManifest_1 = require("../types/IDatastoreManifest");
const semverValidation_1 = require("../types/semverValidation");
exports.DatastoreManifestWithLatest = IDatastoreManifest_1.DatastoreManifestSchema.extend({
    latestVersion: semverValidation_1.semverValidation.describe('The newest version of this Datastore.'),
    isStarted: zod_1.z.boolean().describe('Is the Datastore started. Only relevant in development mode.'),
});
exports.DatastoreListEntry = IDatastoreManifest_1.DatastoreManifestSchema.pick({
    id: true,
    version: true,
    versionTimestamp: true,
    description: true,
    name: true,
    domain: true,
    scriptEntrypoint: true,
}).extend({
    isStarted: zod_1.z.boolean().describe('Is the Datastore started. Only relevant in development mode.'),
});
exports.DatastoreRegistryApiSchemas = {
    'DatastoreRegistry.list': {
        args: zod_1.z.object({
            count: zod_1.z.number().optional().describe('The number of results to return'),
            offset: zod_1.z.number().optional().describe('The offset of records to return'),
        }),
        result: zod_1.z.object({
            datastores: exports.DatastoreListEntry.array(),
            total: zod_1.z.number().positive().int(),
        }),
    },
    'DatastoreRegistry.get': {
        args: zod_1.z.object({
            id: datastoreIdValidation_1.datastoreIdValidation,
            version: semverValidation_1.semverValidation,
        }),
        result: zod_1.z.object({
            datastore: exports.DatastoreManifestWithLatest,
        }),
    },
    'DatastoreRegistry.getVersions': {
        args: zod_1.z.object({
            id: datastoreIdValidation_1.datastoreIdValidation,
        }),
        result: zod_1.z.object({
            versions: zod_1.z
                .object({
                version: semverValidation_1.semverValidation,
                timestamp: zod_1.z.number().positive().int().describe('Millis since the epoch'),
            })
                .array(),
        }),
    },
    'DatastoreRegistry.getLatestVersion': {
        args: zod_1.z.object({
            id: datastoreIdValidation_1.datastoreIdValidation,
        }),
        result: zod_1.z.object({
            latestVersion: semverValidation_1.semverValidation,
        }),
    },
    'DatastoreRegistry.downloadDbx': {
        args: zod_1.z.object({
            id: datastoreIdValidation_1.datastoreIdValidation,
            version: semverValidation_1.semverValidation,
        }),
        result: zod_1.z.object({
            adminSignature: types_1.identitySignatureValidation,
            adminIdentity: types_1.identityValidation,
            compressedDbx: zod_1.z.instanceof(Buffer),
        }),
    },
    'DatastoreRegistry.upload': {
        args: zod_1.z.object({
            compressedDbx: zod_1.z.instanceof(Buffer).describe('Bytes of a compressed .dbx directory.'),
            adminIdentity: types_1.identityValidation
                .optional()
                .describe('If this server is in production mode, an AdminIdentity approved on the Server or Datastore.'),
            adminSignature: types_1.identitySignatureValidation
                .optional()
                .describe('A signature from an approved AdminIdentity'),
        }),
        result: zod_1.z.object({
            success: zod_1.z.boolean(),
        }),
    },
};
//# sourceMappingURL=DatastoreRegistryApis.js.map