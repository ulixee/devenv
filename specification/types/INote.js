"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteSchema = exports.LeaseDomain = exports.ChannelHoldNote = exports.ClaimFromMainchainNote = exports.SendNote = void 0;
const zod_1 = require("zod");
const index_1 = require("./index");
exports.SendNote = zod_1.z.object({
    action: zod_1.z.literal('send'),
    to: zod_1.z.array(index_1.addressValidation).max(10).optional().nullish(),
});
exports.ClaimFromMainchainNote = zod_1.z.object({
    action: zod_1.z.literal('claimFromMainchain'),
    transferId: zod_1.z.number().int().nonnegative().describe('The id of this transfer to localchain'),
});
exports.ChannelHoldNote = zod_1.z.object({
    action: zod_1.z.literal('channelHold'),
    recipient: index_1.addressValidation,
    domainHash: index_1.hashValidation.optional().nullish(),
    delegatedSigner: index_1.addressValidation.optional().nullish(),
});
function createActionLiteral(action) {
    return zod_1.z.object({
        action: zod_1.z.literal(action),
    });
}
exports.LeaseDomain = createActionLiteral('LeaseDomain');
exports.NoteSchema = zod_1.z.object({
    microgons: index_1.microgonsValidation,
    noteType: zod_1.z.discriminatedUnion('action', [
        createActionLiteral('sendToMainchain'),
        exports.ClaimFromMainchainNote,
        createActionLiteral('claim'),
        exports.SendNote,
        createActionLiteral('leaseDomain'),
        createActionLiteral('fee'),
        createActionLiteral('tax'),
        createActionLiteral('sendToVote'),
        exports.ChannelHoldNote,
        createActionLiteral('channelHoldSettle'),
        createActionLiteral('channelHoldClaim'),
    ]),
});
//# sourceMappingURL=INote.js.map