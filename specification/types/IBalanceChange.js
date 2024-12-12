"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceChangesSchema = exports.BalanceChangeSchema = exports.AccountTypeSchema = exports.BalanceProofSchema = exports.MerkleProofSchema = exports.AccountOriginSchema = exports.notebookNumberValidation = exports.tickValidation = exports.notaryIdValidation = exports.AccountType = void 0;
const zod_1 = require("zod");
const localchain_1 = require("@argonprotocol/localchain");
Object.defineProperty(exports, "AccountType", { enumerable: true, get: function () { return localchain_1.AccountType; } });
const index_1 = require("./index");
const INote_1 = require("./INote");
exports.notaryIdValidation = zod_1.z.number().int().positive();
exports.tickValidation = zod_1.z
    .number()
    .int()
    .nonnegative()
    .describe('The system tick (one per minute starting at the unix epoch)');
exports.notebookNumberValidation = zod_1.z
    .number()
    .int()
    .positive()
    .describe('The sequence number of a notebook (a collection of balance changes, votes and domain registrations)');
exports.AccountOriginSchema = zod_1.z.object({
    notebookNumber: exports.notebookNumberValidation.describe('The notebook where this account originated'),
    accountUid: zod_1.z.number().int().describe('The unique user index in the given notebook'),
});
exports.MerkleProofSchema = zod_1.z.object({
    proof: zod_1.z.instanceof(Uint8Array).array(),
    numberOfLeaves: zod_1.z.number().int().nonnegative(),
    leafIndex: zod_1.z.number().int().nonnegative(),
});
exports.BalanceProofSchema = zod_1.z.object({
    notaryId: exports.notaryIdValidation.describe('The notary where this proof was provided'),
    notebookNumber: exports.notebookNumberValidation,
    tick: exports.tickValidation,
    balance: index_1.microgonsValidation.describe('The previous balance'),
    accountOrigin: exports.AccountOriginSchema,
    notebookProof: exports.MerkleProofSchema.nullish().describe('The proof that this balance change can be found in the published accountChangesRoot for the given notebook'),
});
exports.AccountTypeSchema = zod_1.z.nativeEnum(localchain_1.AccountType).describe('The type of account');
exports.BalanceChangeSchema = zod_1.z.object({
    accountId: index_1.addressValidation,
    accountType: exports.AccountTypeSchema,
    changeNumber: zod_1.z.number().int().nonnegative(),
    balance: index_1.microgonsValidation.describe('The new balance of the account'),
    previousBalanceProof: exports.BalanceProofSchema.nullish().describe('A balance change must provide proof of a previous balance if the change_number is non-zero'),
    channelHoldNote: INote_1.NoteSchema.nullish().describe('A hold note currently active on the account (if applicable)'),
    notes: zod_1.z.array(INote_1.NoteSchema).max(100).describe('The applied changes'),
    signature: index_1.multiSignatureValidation.describe("The account's signature of the balance change hash"),
});
exports.BalanceChangesSchema = exports.BalanceChangeSchema.array();
//# sourceMappingURL=IBalanceChange.js.map