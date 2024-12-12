"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatastoreApiSchemas = exports.EntityStatsSchema = void 0;
const types_1 = require("@ulixee/platform-specification/types");
const zod_1 = require("zod");
const DatastoreRegistryApis_1 = require("../services/DatastoreRegistryApis");
const datastoreIdValidation_1 = require("../types/datastoreIdValidation");
const IDatastoreManifest_1 = require("../types/IDatastoreManifest");
const IDatastorePricing_1 = require("../types/IDatastorePricing");
const IDatastoreStats_1 = require("../types/IDatastoreStats");
const IPayment_1 = require("../types/IPayment");
const semverValidation_1 = require("../types/semverValidation");
const EntityMetaSchema = zod_1.z.object({
    description: zod_1.z.string().optional(),
    stats: IDatastoreStats_1.DatastoreStatsSchema,
    netBasePrice: types_1.microgonsValidation.describe('The aggregate base price per query.'),
    schemaAsJson: zod_1.z.any().optional().describe('The schema JSON if requested'),
    priceBreakdown: IDatastorePricing_1.DatastorePricing.array(),
});
exports.EntityStatsSchema = zod_1.z.object({
    name: zod_1.z.string().describe('The entity name'),
    type: zod_1.z.enum(['Table', 'Extractor', 'Crawler']),
    stats: IDatastoreStats_1.DatastoreStatsSchema,
});
const DatastoreMetadataResult = zod_1.z.object({
    microgons: types_1.microgonsValidation,
    bytes: zod_1.z.number().int().nonnegative(),
    milliseconds: zod_1.z.number().int().nonnegative(),
});
const DatastoreQueryResultSchema = zod_1.z.object({
    latestVersion: semverValidation_1.semverValidation,
    runError: zod_1.z.instanceof(Error).optional().describe('An error that occurred during the query.'),
    outputs: zod_1.z
        .any()
        .optional()
        .array()
        .describe('The outputs of the query (omitted if error or streamed).'),
    metadata: DatastoreMetadataResult,
});
const DatastoreQueryMetadataSchema = zod_1.z.object({
    id: datastoreIdValidation_1.datastoreIdValidation.describe('The datastore id'),
    version: semverValidation_1.semverValidation,
    queryId: zod_1.z.string().describe('The unique id of this query.'),
    authentication: zod_1.z
        .object({
        identity: types_1.identityValidation,
        signature: types_1.identitySignatureValidation,
        nonce: zod_1.z.string().length(10).describe('A random nonce adding signature noise.'),
    })
        .optional(),
    affiliateId: zod_1.z
        .string()
        .regex(/^aff[a-zA-Z_0-9-]{10}$/)
        .optional()
        .describe('A tracking id to attribute payments to source affiliates.'),
    payment: IPayment_1.PaymentSchema.optional().describe('Payment for this request.'),
});
exports.DatastoreApiSchemas = {
    'Datastore.upload': {
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
    'Datastore.download': {
        args: zod_1.z.object({
            id: datastoreIdValidation_1.datastoreIdValidation.describe('The datastore id'),
            version: semverValidation_1.semverValidation,
            requestDate: zod_1.z.date().describe('Date of this request. Must be in last 10 seconds.'),
            adminIdentity: types_1.identityValidation.describe('If this server is in production mode, an AdminIdentity approved on the Server or Datastore.'),
            adminSignature: types_1.identitySignatureValidation.describe('A signature from an approved AdminIdentity'),
        }),
        result: zod_1.z.object({
            adminIdentity: types_1.identityValidation.describe('The admin identity who uploaded this Datastore.'),
            adminSignature: types_1.identitySignatureValidation.describe('The signature of the uploader of this Datastore.'),
            compressedDbx: zod_1.z.instanceof(Buffer).describe('Bytes of the compressed .dbx directory.'),
        }),
    },
    'Datastore.start': {
        args: zod_1.z.object({
            id: datastoreIdValidation_1.datastoreIdValidation.describe('A temporary datastore id'),
            dbxPath: zod_1.z.string().describe('Path to a local file system Database path.'),
            watch: zod_1.z.boolean().describe('Whether to watch for updates'),
        }),
        result: zod_1.z.object({
            success: zod_1.z.boolean(),
        }),
    },
    'Datastore.creditsBalance': {
        args: zod_1.z.object({
            id: datastoreIdValidation_1.datastoreIdValidation.describe('The datastore id'),
            version: semverValidation_1.semverValidation.describe('The Datastore version to look at credits for.'),
            creditId: zod_1.z.string().describe('CreditId issued by this datastore.'),
        }),
        result: zod_1.z.object({
            issuedCredits: types_1.microgonsValidation.describe('Issued credits balance in microgons.'),
            balance: types_1.microgonsValidation.describe('Remaining credits balance in microgons.'),
        }),
    },
    'Datastore.creditsIssued': {
        args: zod_1.z.object({
            id: datastoreIdValidation_1.datastoreIdValidation.describe('The datastore id'),
            version: semverValidation_1.semverValidation.describe('The Datastore version to look at credits for.'),
        }),
        result: zod_1.z.object({
            issuedCredits: types_1.microgonsValidation.describe('Total credit microgons issued in microgons.'),
            count: zod_1.z.number().describe('Total credits issued.'),
        }),
    },
    'Datastore.admin': {
        args: zod_1.z.object({
            id: datastoreIdValidation_1.datastoreIdValidation.describe('The datastore id'),
            version: semverValidation_1.semverValidation.describe('The datastore version'),
            adminIdentity: types_1.identityValidation
                .optional()
                .describe('An admin Identity for this Datastore.'),
            adminSignature: types_1.identitySignatureValidation
                .optional()
                .describe('A signature from the admin Identity'),
            adminFunction: zod_1.z.object({
                ownerType: zod_1.z
                    .enum(['table', 'crawler', 'extractor', 'datastore'])
                    .describe('Where to locate the function.'),
                ownerName: zod_1.z
                    .string()
                    .describe('The name of the owning extractor, table or crawler (if applicable).')
                    .optional(),
                functionName: zod_1.z.string().describe('The name of the function'),
            }),
            functionArgs: zod_1.z.any().array().describe('The args to provide to the function.'),
        }),
        result: zod_1.z.any().describe('A flexible result based on the type of api.'),
    },
    'Datastore.meta': {
        args: zod_1.z.object({
            id: datastoreIdValidation_1.datastoreIdValidation.describe('The datastore id'),
            version: semverValidation_1.semverValidation.describe('The datastore version'),
            includeSchemasAsJson: zod_1.z
                .boolean()
                .optional()
                .describe('Include JSON describing the schema for each function'),
        }),
        result: DatastoreRegistryApis_1.DatastoreManifestWithLatest.extend({
            stats: IDatastoreStats_1.DatastoreStatsSchema,
            extractorsByName: zod_1.z.record(zod_1.z.string().describe('The name of the extractor'), EntityMetaSchema),
            crawlersByName: zod_1.z.record(zod_1.z.string().describe('The name of the crawler'), EntityMetaSchema),
            tablesByName: zod_1.z.record(zod_1.z.string().describe('The name of a table'), EntityMetaSchema),
            schemaInterface: zod_1.z
                .string()
                .optional()
                .describe('A Typescript interface describing input and outputs of Datastore Extractors, and schemas of Datastore Tables'),
            payment: IDatastoreManifest_1.DatastorePaymentRecipientSchema.optional(),
        }),
    },
    'Datastore.stream': {
        args: DatastoreQueryMetadataSchema.extend({
            name: zod_1.z.string().describe('The name of the table or function'),
            input: zod_1.z.any().optional().describe('Optional input or where parameters'),
        }),
        result: DatastoreQueryResultSchema,
    },
    'Datastore.query': {
        args: DatastoreQueryMetadataSchema.extend({
            sql: zod_1.z.string().describe('The SQL command(s) you want to run'),
            boundValues: zod_1.z
                .array(zod_1.z.any())
                .optional()
                .describe('An array of values you want to use as bound parameters'),
        }),
        result: DatastoreQueryResultSchema,
    },
    'Datastore.createStorageEngine': {
        args: zod_1.z.object({
            version: zod_1.z.object({
                compressedDbx: zod_1.z.instanceof(Buffer).describe('Bytes of a compressed .dbx directory.'),
                adminIdentity: types_1.identityValidation
                    .optional()
                    .describe('If this server is in production mode, an AdminIdentity approved on the Server or Datastore.'),
                adminSignature: types_1.identitySignatureValidation
                    .optional()
                    .describe('A signature from an approved AdminIdentity'),
            }),
            previousVersion: zod_1.z
                .object({
                compressedDbx: zod_1.z.instanceof(Buffer).describe('Bytes of a compressed .dbx directory.'),
                adminIdentity: types_1.identityValidation
                    .optional()
                    .describe('If this server is in production mode, an AdminIdentity approved on the Server or Datastore.'),
                adminSignature: types_1.identitySignatureValidation
                    .optional()
                    .describe('A signature from an approved AdminIdentity'),
            })
                .nullable()
                .optional(),
        }),
        result: zod_1.z.object({
            success: zod_1.z.boolean(),
        }),
    },
    'Datastore.queryStorageEngine': {
        args: DatastoreQueryMetadataSchema.extend({
            sql: zod_1.z.string().describe('The SQL command you want to run.'),
            boundValues: zod_1.z
                .array(zod_1.z.any())
                .optional()
                .describe('An array of values you want to use as bound parameters.'),
            virtualEntitiesByName: zod_1.z
                .record(zod_1.z
                .string()
                .describe('Name of the passthrough table, extractor or crawler defined in the Datastore schema.'), zod_1.z.object({
                parameters: zod_1.z
                    .record(zod_1.z.string().describe("Parameter name matching the entity's schema."), zod_1.z
                    .any()
                    .describe('Parameter value as a Javascript type (will be converted by engine).'))
                    .optional()
                    .describe('Parameters to simulate for this virtual function or table'),
                records: zod_1.z
                    .any()
                    .array()
                    .describe('Records to simulate (NOTE: must match the Datastore schema).'),
            }))
                .optional()
                .describe('Virtual passthrough tables, extractors or crawlers being simulated in the sql query.'),
        }),
        result: DatastoreQueryResultSchema,
    },
    'Datastores.list': {
        args: zod_1.z.object({
            offset: zod_1.z
                .number()
                .optional()
                .describe('Starting offset (inclusive) of results to return')
                .default(0),
        }),
        result: zod_1.z.object({
            datastores: zod_1.z
                .object({
                id: datastoreIdValidation_1.datastoreIdValidation,
                version: semverValidation_1.semverValidation.describe('The latest version'),
                versionTimestamp: zod_1.z.number().int().positive().describe('Millis since epoch'),
                name: zod_1.z.string().optional(),
                description: zod_1.z.string().optional(),
                domain: zod_1.z.string().optional(),
                isStarted: zod_1.z
                    .boolean()
                    .describe('Only relevant in development mode - is this Datastore started.'),
                scriptEntrypoint: zod_1.z.string(),
                stats: IDatastoreStats_1.DatastoreStatsSchema,
            })
                .array(),
            total: zod_1.z.number().describe('Total datastores.'),
            offset: zod_1.z.number().describe('Offset index of result (inclusive).'),
        }),
    },
    'Datastore.versions': {
        args: zod_1.z.object({
            id: datastoreIdValidation_1.datastoreIdValidation.describe('The datastore id'),
        }),
        result: zod_1.z.object({
            versions: zod_1.z
                .object({
                version: semverValidation_1.semverValidation,
                timestamp: zod_1.z
                    .number()
                    .int()
                    .gt(IDatastoreManifest_1.minDate)
                    .refine(x => x <= Date.now())
                    .describe('Millis since the epoch'),
            })
                .array(),
        }),
    },
    'Datastore.stats': {
        args: zod_1.z.object({
            id: datastoreIdValidation_1.datastoreIdValidation.describe('The datastore id'),
        }),
        result: zod_1.z.object({
            byVersion: exports.EntityStatsSchema.array(),
            overall: exports.EntityStatsSchema.array(),
        }),
    },
};
//# sourceMappingURL=DatastoreApis.js.map