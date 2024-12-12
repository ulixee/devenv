"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelHoldApisSchema = void 0;
const zod_1 = require("zod");
const datastoreIdValidation_1 = require("../types/datastoreIdValidation");
const IBalanceChange_1 = require("../types/IBalanceChange");
const INote_1 = require("../types/INote");
exports.ChannelHoldApisSchema = {
    'ChannelHold.register': {
        args: zod_1.z.object({
            datastoreId: datastoreIdValidation_1.datastoreIdValidation,
            channelHold: IBalanceChange_1.BalanceChangeSchema.describe('A ChannelHold balance change putting funds on hold for this datastore.').extend({
                channelHoldNote: INote_1.NoteSchema.describe('The active channel hold note'),
            }),
        }),
        result: zod_1.z.object({
            accepted: zod_1.z.boolean(),
        }),
    },
};
//# sourceMappingURL=ChannelHoldApis.js.map