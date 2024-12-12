"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgonPaymentProcessorApiSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
const datastoreIdValidation_1 = require("../types/datastoreIdValidation");
const IBalanceChange_1 = require("../types/IBalanceChange");
const IDatastoreManifest_1 = require("../types/IDatastoreManifest");
const INote_1 = require("../types/INote");
const IPayment_1 = require("../types/IPayment");
exports.ArgonPaymentProcessorApiSchema = {
    'ArgonPaymentProcessor.getPaymentInfo': {
        args: zod_1.z.void(),
        result: IDatastoreManifest_1.DatastorePaymentRecipientSchema,
    },
    'ArgonPaymentProcessor.importChannelHold': {
        args: zod_1.z.object({
            datastoreId: datastoreIdValidation_1.datastoreIdValidation,
            channelHold: IBalanceChange_1.BalanceChangeSchema.describe('A ChannelHold balance change putting funds on hold for this datastore.').extend({
                channelHoldNote: INote_1.NoteSchema.describe('The active ChannelHold note'),
            }),
        }),
        result: zod_1.z.object({
            accepted: zod_1.z.boolean(),
        }),
    },
    'ArgonPaymentProcessor.debit': {
        args: zod_1.z.object({
            datastoreId: datastoreIdValidation_1.datastoreIdValidation,
            queryId: zod_1.z.string(),
            payment: IPayment_1.PaymentSchema,
        }),
        result: zod_1.z.object({
            shouldFinalize: zod_1.z.boolean(),
        }),
    },
    'ArgonPaymentProcessor.finalize': {
        args: zod_1.z.object({
            datastoreId: datastoreIdValidation_1.datastoreIdValidation,
            channelHoldId: IPayment_1.channelHoldIdValidation,
            uuid: zod_1.z.string().length(21),
            finalMicrogons: types_1.microgonsValidation,
        }),
        result: zod_1.z.void(),
    },
};
//# sourceMappingURL=ArgonPaymentProcessorApis.js.map