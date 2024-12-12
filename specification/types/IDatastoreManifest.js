"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatastoreManifestSchema = exports.DatastorePaymentRecipientSchema = exports.minDate = void 0;
const types_1 = require("@ulixee/platform-specification/types");
const zod_1 = require("zod");
const localchain_1 = require("@argonprotocol/localchain");
const datastoreIdValidation_1 = require("./datastoreIdValidation");
const IDatastorePricing_1 = require("./IDatastorePricing");
const semverValidation_1 = require("./semverValidation");
exports.minDate = new Date('2022-01-01').getTime();
exports.DatastorePaymentRecipientSchema = zod_1.z.object({
    chain: zod_1.z.nativeEnum(localchain_1.Chain),
    genesisHash: zod_1.z.string().regex(/^(0[xX])?[0-9a-fA-F]{64}$/),
    address: types_1.addressValidation.describe('A payment address microchannel payments should be made out to.'),
    notaryId: zod_1.z.number(),
});
exports.DatastoreManifestSchema = zod_1.z.object({
    id: datastoreIdValidation_1.datastoreIdValidation.describe('A unique id for the Datastore'),
    version: semverValidation_1.semverValidation,
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    storageEngineHost: zod_1.z
        .string()
        .url('The storage engine host to use for this Datastore. If empty, will default to a local host.')
        .optional(),
    versionTimestamp: zod_1.z.number().int().gt(exports.minDate),
    scriptHash: zod_1.z
        .string()
        .describe('A sha256 of the script contents.')
        .length(62)
        .regex(/^scr1[ac-hj-np-z02-9]{58}$/, 'This is not a Datastore scriptHash (Bech32m encoded hash starting with "scr").'),
    adminIdentities: types_1.identityValidation
        .array()
        .describe('Administrators of this Datastore. If none are present, defaults to Administrators on the Cloud.'),
    scriptEntrypoint: zod_1.z.string().describe('A relative path from a project root'),
    coreVersion: zod_1.z.string().describe('Version of the Datastore Core Runtime'),
    schemaInterface: zod_1.z.string().optional().describe('The raw typescript schema for this Datastore'),
    extractorsByName: zod_1.z.record(zod_1.z
        .string()
        .regex(/^[a-z][A-Za-z0-9]+$/)
        .describe('The Extractor name'), zod_1.z.object({
        description: zod_1.z.string().optional(),
        corePlugins: zod_1.z
            .record(zod_1.z.string())
            .optional()
            .describe('Plugin dependencies required for execution'),
        schemaAsJson: zod_1.z
            .object({
            input: zod_1.z.any().optional(),
            output: zod_1.z.any().optional(),
            inputExamples: zod_1.z.any().optional(),
        })
            .optional()
            .describe('The schema as json.'),
        prices: IDatastorePricing_1.DatastorePricing.array()
            .min(1)
            .optional()
            .describe('Price details for a function call. This array will have an entry for each function called in this process. ' +
            'The first entry is the cost of the function packaged in this Datastore.'),
    })),
    crawlersByName: zod_1.z.record(zod_1.z
        .string()
        .regex(/^[a-z][A-Za-z0-9]+$/)
        .describe('The Crawler name'), zod_1.z.object({
        description: zod_1.z.string().optional(),
        corePlugins: zod_1.z
            .record(zod_1.z.string())
            .optional()
            .describe('Plugin dependencies required for execution'),
        schemaAsJson: zod_1.z
            .object({
            input: zod_1.z.any().optional(),
            output: zod_1.z.any().optional(),
            inputExamples: zod_1.z.any().optional(),
        })
            .optional()
            .describe('The schema as json.'),
        prices: IDatastorePricing_1.DatastorePricing.array()
            .min(1)
            .optional()
            .describe('Price details for a function call. This array will have an entry for each function called in this process. ' +
            'The first entry is the cost of the function packaged in this Datastore.'),
    })),
    tablesByName: zod_1.z.record(zod_1.z
        .string()
        .regex(/^[a-z][A-Za-z0-9]+$/)
        .describe('The Table name'), zod_1.z.object({
        description: zod_1.z.string().optional(),
        schemaAsJson: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional().describe('The schema as json.'),
        prices: IDatastorePricing_1.DatastorePricing.array()
            .min(1)
            .optional()
            .describe('Price details for a table call. This array will have an entry for each table called in this process. ' +
            'The first entry is the cost of the table packaged in this Datastore.'),
    })),
    domain: zod_1.z
        .string()
        .optional()
        .describe('An Argon domain for this manifest. It can be looked up in the mainchain as a dns lookup for the version hosting.\n' +
        'DATASTORE DEVELOPER NOTE: this property is used to indicate to tooling and CloudNode hosting that a domain is in effect and ChannelHolds must match this setting, but it does not register anything in and of itself.'),
});
//# sourceMappingURL=IDatastoreManifest.js.map