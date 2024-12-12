"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServiceApisSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
const datastoreIdValidation_1 = require("../types/datastoreIdValidation");
const IDatastoreManifest_1 = require("../types/IDatastoreManifest");
const IPayment_1 = require("../types/IPayment");
const semverValidation_1 = require("../types/semverValidation");
exports.PaymentServiceApisSchema = {
    'PaymentService.authenticate': {
        args: zod_1.z.object({
            authentication: zod_1.z
                .object({
                identity: types_1.identityValidation,
                signature: types_1.identitySignatureValidation,
                nonce: zod_1.z.string().length(10).describe('A random nonce adding signature noise.'),
            })
                .optional()
                .describe('An optional authentication mechanism for this payment reservation. Should be pre-arranged with the payment service'),
        }),
        result: zod_1.z.object({
            authenticationToken: zod_1.z.string(),
        }),
    },
    'PaymentService.reserve': {
        args: zod_1.z.object({
            id: datastoreIdValidation_1.datastoreIdValidation.describe('The datastore id'),
            version: semverValidation_1.semverValidation.describe('The datastore version'),
            microgons: types_1.microgonsValidation.describe('Amount to reserve'),
            host: zod_1.z.string().describe('The datastore host'),
            recipient: IDatastoreManifest_1.DatastorePaymentRecipientSchema,
            domain: zod_1.z.string().optional().describe('The datastore domain if applicable'),
            authenticationToken: zod_1.z.string().optional(),
        }),
        result: IPayment_1.PaymentSchema,
    },
    'PaymentService.finalize': {
        args: IPayment_1.PaymentSchema.pick({ uuid: true, microgons: true }).extend({
            finalMicrogons: types_1.microgonsValidation,
            authenticationToken: zod_1.z.string().optional(),
        }),
        result: zod_1.z.void(),
    },
};
//# sourceMappingURL=PaymentServiceApis.js.map