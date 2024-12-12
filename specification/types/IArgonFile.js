"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgonFileSchema = exports.ARGON_FILE_EXTENSION = void 0;
const zod_1 = require("zod");
const IBalanceChange_1 = require("./IBalanceChange");
const index_1 = require("./index");
exports.ARGON_FILE_EXTENSION = 'argon';
exports.ArgonFileSchema = zod_1.z.object({
    version: zod_1.z.string(),
    credit: zod_1.z
        .object({
        datastoreUrl: zod_1.z.string().url('The connection string to the datastore'),
        microgons: index_1.microgonsValidation.describe('The granted number of microgons.'),
    })
        .optional()
        .nullish(),
    send: IBalanceChange_1.BalanceChangeSchema.array().optional().nullish(),
    request: IBalanceChange_1.BalanceChangeSchema.array().optional().nullish(),
});
//# sourceMappingURL=IArgonFile.js.map