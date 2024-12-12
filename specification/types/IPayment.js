"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSchema = exports.PaymentMethodSchema = exports.channelHoldIdValidation = void 0;
const zod_1 = require("zod");
const index_1 = require("./index");
/**
 * This will likely be changed to a specific address for payments (maybe just an extra prefix?). It's a placeholder for now.
 */
exports.channelHoldIdValidation = zod_1.z
    .string()
    .length(63)
    .regex(/^chan1[ac-hj-np-z02-9]{58}$/, 'This is not a Ulixee identity (Bech32m encoded public key starting with "chan1").');
exports.PaymentMethodSchema = zod_1.z.object({
    channelHold: zod_1.z
        .object({
        id: exports.channelHoldIdValidation,
        settledMicrogons: index_1.microgonsValidation.describe('The aggregate settled microgons'),
        settledSignature: index_1.multiSignatureValidation.describe('A signature of the updated channel hold with settled microgons'),
    })
        .optional(),
    credits: zod_1.z
        .object({
        id: zod_1.z
            .string()
            .length(11)
            .regex(/^crd[A-Za-z0-9_]{8}$/, 'This is not a Datastore credits id (starting with "crd", following by 8 alphanumeric characters).'),
        secret: zod_1.z.string().length(12),
    })
        .optional(),
});
exports.PaymentSchema = exports.PaymentMethodSchema.extend({
    uuid: zod_1.z
        .string()
        .length(21)
        .regex(/^[A-Za-z0-9_-]{21}$/)
        .describe('A one time payment id.'),
    microgons: index_1.microgonsValidation,
});
//# sourceMappingURL=IPayment.js.map