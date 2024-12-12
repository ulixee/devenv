"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotarizationSchema = exports.BlockVoteSchema = exports.DomainSchema = void 0;
const zod_1 = require("zod");
const IBalanceChange_1 = require("./IBalanceChange");
const index_1 = require("./index");
exports.DomainSchema = zod_1.z.tuple([
    index_1.hashValidation.describe('The domain hash'),
    index_1.addressValidation.describe('The account id the data domain is registered to.'),
]);
exports.BlockVoteSchema = zod_1.z.object({
    accountId: index_1.addressValidation,
    blockHash: index_1.hashValidation.describe('The block hash being voted on. Must be in last 2 ticks.'),
    index: zod_1.z.number().int().nonnegative().describe('An index to provide noise to the vote hash'),
    power: index_1.microgonsValidation.describe('The tax applied (and thus multiplier) of this vote'),
    signature: index_1.multiSignatureValidation.describe('The signature of the vote hash'),
    blockRewardsAccountId: index_1.addressValidation.describe('The account that will receive the block rewards if this vote wins'),
});
exports.NotarizationSchema = zod_1.z.object({
    balanceChanges: IBalanceChange_1.BalanceChangeSchema.array().max(25),
    blockVotes: exports.BlockVoteSchema.array().max(100),
    domains: exports.DomainSchema.array().max(100),
});
//# sourceMappingURL=INotarization.js.map