"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsTrackerApiSchemas = void 0;
const zod_1 = require("zod");
const DatastoreApis_1 = require("../datastore/DatastoreApis");
const datastoreIdValidation_1 = require("../types/datastoreIdValidation");
const IDatastoreStats_1 = require("../types/IDatastoreStats");
const IPayment_1 = require("../types/IPayment");
const semverValidation_1 = require("../types/semverValidation");
exports.StatsTrackerApiSchemas = {
    'StatsTracker.getByVersion': {
        args: zod_1.z.object({
            datastoreId: datastoreIdValidation_1.datastoreIdValidation,
            version: semverValidation_1.semverValidation,
        }),
        result: zod_1.z.object({
            stats: IDatastoreStats_1.DatastoreStatsSchema,
            statsByEntityName: zod_1.z.record(zod_1.z.string().describe('Entity name'), DatastoreApis_1.EntityStatsSchema),
        }),
    },
    'StatsTracker.get': {
        args: zod_1.z.object({
            datastoreId: datastoreIdValidation_1.datastoreIdValidation,
        }),
        result: zod_1.z.object({
            stats: IDatastoreStats_1.DatastoreStatsSchema,
            statsByEntityName: zod_1.z.record(zod_1.z.string().describe('Entity name'), DatastoreApis_1.EntityStatsSchema),
        }),
    },
    'StatsTracker.getSummary': {
        args: zod_1.z.object({
            datastoreId: datastoreIdValidation_1.datastoreIdValidation,
        }),
        result: zod_1.z.object({
            stats: IDatastoreStats_1.DatastoreStatsSchema,
        }),
    },
    'StatsTracker.recordEntityStats': {
        args: zod_1.z.object({
            datastoreId: datastoreIdValidation_1.datastoreIdValidation,
            version: semverValidation_1.semverValidation,
            cloudNodeHost: zod_1.z.string().describe('The node hosting this query.'),
            cloudNodeIdentity: zod_1.z
                .string()
                .optional()
                .describe('The network identity of the query running node.'),
            entityName: zod_1.z.string().optional(),
            error: zod_1.z.instanceof(Error).optional(),
            bytes: zod_1.z.number().int(),
            microgons: zod_1.z.bigint().nonnegative(),
            milliseconds: zod_1.z.number().int(),
            didUseCredits: zod_1.z.boolean(),
        }),
        result: zod_1.z.object({
            success: zod_1.z.boolean(),
        }),
    },
    'StatsTracker.recordQuery': {
        args: zod_1.z.object({
            datastoreId: datastoreIdValidation_1.datastoreIdValidation,
            version: semverValidation_1.semverValidation,
            queryId: zod_1.z.string().describe('Query Id'),
            cloudNodeHost: zod_1.z.string().describe('The node hosting this query.'),
            cloudNodeIdentity: zod_1.z
                .string()
                .optional()
                .describe('The network identity of the query running node.'),
            query: zod_1.z.string().describe('The sql query run'),
            startTime: zod_1.z.number().describe('Date epoch millis'),
            input: zod_1.z.any(),
            outputs: zod_1.z.any().array().optional(),
            error: zod_1.z.instanceof(Error).optional(),
            channelHoldId: IPayment_1.channelHoldIdValidation.optional(),
            creditId: zod_1.z.string().optional().describe('Any credit spent on this item'),
            affiliateId: zod_1.z.string().optional().describe('An affiliate id used for this query'),
            heroSessionIds: zod_1.z
                .string()
                .array()
                .optional()
                .describe('Any hero session ids used for this query'),
            bytes: zod_1.z.number().int(),
            microgons: zod_1.z.bigint().nonnegative(),
            milliseconds: zod_1.z.number().int(),
        }),
        result: zod_1.z.object({
            success: zod_1.z.boolean(),
        }),
    },
};
//# sourceMappingURL=StatsTrackerApis.js.map