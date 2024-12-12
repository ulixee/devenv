import { z } from 'zod';
import { AccountType } from '@argonprotocol/localchain';
export { AccountType };
export declare const notaryIdValidation: z.ZodNumber;
export declare const tickValidation: z.ZodNumber;
export declare const notebookNumberValidation: z.ZodNumber;
export declare const AccountOriginSchema: z.ZodObject<{
    notebookNumber: z.ZodNumber;
    accountUid: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    notebookNumber: number;
    accountUid: number;
}, {
    notebookNumber: number;
    accountUid: number;
}>;
export declare const MerkleProofSchema: z.ZodObject<{
    proof: z.ZodArray<z.ZodType<Uint8Array, z.ZodTypeDef, Uint8Array>, "many">;
    numberOfLeaves: z.ZodNumber;
    leafIndex: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    proof: Uint8Array[];
    numberOfLeaves: number;
    leafIndex: number;
}, {
    proof: Uint8Array[];
    numberOfLeaves: number;
    leafIndex: number;
}>;
export declare const BalanceProofSchema: z.ZodObject<{
    notaryId: z.ZodNumber;
    notebookNumber: z.ZodNumber;
    tick: z.ZodNumber;
    balance: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
    accountOrigin: z.ZodObject<{
        notebookNumber: z.ZodNumber;
        accountUid: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        notebookNumber: number;
        accountUid: number;
    }, {
        notebookNumber: number;
        accountUid: number;
    }>;
    notebookProof: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        proof: z.ZodArray<z.ZodType<Uint8Array, z.ZodTypeDef, Uint8Array>, "many">;
        numberOfLeaves: z.ZodNumber;
        leafIndex: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        proof: Uint8Array[];
        numberOfLeaves: number;
        leafIndex: number;
    }, {
        proof: Uint8Array[];
        numberOfLeaves: number;
        leafIndex: number;
    }>>>;
}, "strip", z.ZodTypeAny, {
    notebookNumber: number;
    notaryId: number;
    tick: number;
    balance: bigint;
    accountOrigin: {
        notebookNumber: number;
        accountUid: number;
    };
    notebookProof?: {
        proof: Uint8Array[];
        numberOfLeaves: number;
        leafIndex: number;
    } | null | undefined;
}, {
    notebookNumber: number;
    notaryId: number;
    tick: number;
    accountOrigin: {
        notebookNumber: number;
        accountUid: number;
    };
    balance?: unknown;
    notebookProof?: {
        proof: Uint8Array[];
        numberOfLeaves: number;
        leafIndex: number;
    } | null | undefined;
}>;
export declare const AccountTypeSchema: z.ZodNativeEnum<typeof AccountType>;
export declare const BalanceChangeSchema: z.ZodObject<{
    accountId: z.ZodString;
    accountType: z.ZodNativeEnum<typeof AccountType>;
    changeNumber: z.ZodNumber;
    balance: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
    previousBalanceProof: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        notaryId: z.ZodNumber;
        notebookNumber: z.ZodNumber;
        tick: z.ZodNumber;
        balance: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
        accountOrigin: z.ZodObject<{
            notebookNumber: z.ZodNumber;
            accountUid: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            notebookNumber: number;
            accountUid: number;
        }, {
            notebookNumber: number;
            accountUid: number;
        }>;
        notebookProof: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            proof: z.ZodArray<z.ZodType<Uint8Array, z.ZodTypeDef, Uint8Array>, "many">;
            numberOfLeaves: z.ZodNumber;
            leafIndex: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            proof: Uint8Array[];
            numberOfLeaves: number;
            leafIndex: number;
        }, {
            proof: Uint8Array[];
            numberOfLeaves: number;
            leafIndex: number;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        notebookNumber: number;
        notaryId: number;
        tick: number;
        balance: bigint;
        accountOrigin: {
            notebookNumber: number;
            accountUid: number;
        };
        notebookProof?: {
            proof: Uint8Array[];
            numberOfLeaves: number;
            leafIndex: number;
        } | null | undefined;
    }, {
        notebookNumber: number;
        notaryId: number;
        tick: number;
        accountOrigin: {
            notebookNumber: number;
            accountUid: number;
        };
        balance?: unknown;
        notebookProof?: {
            proof: Uint8Array[];
            numberOfLeaves: number;
            leafIndex: number;
        } | null | undefined;
    }>>>;
    channelHoldNote: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        microgons: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
        noteType: z.ZodDiscriminatedUnion<"action", [z.ZodObject<{
            action: z.ZodLiteral<"sendToMainchain">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "sendToMainchain";
        }, {
            action: "sendToMainchain";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"claimFromMainchain">;
            transferId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            action: "claimFromMainchain";
            transferId: number;
        }, {
            action: "claimFromMainchain";
            transferId: number;
        }>, z.ZodObject<{
            action: z.ZodLiteral<"claim">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "claim";
        }, {
            action: "claim";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"send">;
            to: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>>;
        }, "strip", z.ZodTypeAny, {
            action: "send";
            to?: string[] | null | undefined;
        }, {
            action: "send";
            to?: string[] | null | undefined;
        }>, z.ZodObject<{
            action: z.ZodLiteral<"leaseDomain">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "leaseDomain";
        }, {
            action: "leaseDomain";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"fee">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "fee";
        }, {
            action: "fee";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"tax">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "tax";
        }, {
            action: "tax";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"sendToVote">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "sendToVote";
        }, {
            action: "sendToVote";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"channelHold">;
            recipient: z.ZodString;
            domainHash: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>>>>;
            delegatedSigner: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        }, "strip", z.ZodTypeAny, {
            action: "channelHold";
            recipient: string;
            domainHash?: Buffer | null | undefined;
            delegatedSigner?: string | null | undefined;
        }, {
            action: "channelHold";
            recipient: string;
            domainHash?: unknown;
            delegatedSigner?: string | null | undefined;
        }>, z.ZodObject<{
            action: z.ZodLiteral<"channelHoldSettle">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "channelHoldSettle";
        }, {
            action: "channelHoldSettle";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"channelHoldClaim">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "channelHoldClaim";
        }, {
            action: "channelHoldClaim";
        }>]>;
    }, "strip", z.ZodTypeAny, {
        microgons: bigint;
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: Buffer | null | undefined;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
    }, {
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: unknown;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
        microgons?: unknown;
    }>>>;
    notes: z.ZodArray<z.ZodObject<{
        microgons: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
        noteType: z.ZodDiscriminatedUnion<"action", [z.ZodObject<{
            action: z.ZodLiteral<"sendToMainchain">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "sendToMainchain";
        }, {
            action: "sendToMainchain";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"claimFromMainchain">;
            transferId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            action: "claimFromMainchain";
            transferId: number;
        }, {
            action: "claimFromMainchain";
            transferId: number;
        }>, z.ZodObject<{
            action: z.ZodLiteral<"claim">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "claim";
        }, {
            action: "claim";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"send">;
            to: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>>;
        }, "strip", z.ZodTypeAny, {
            action: "send";
            to?: string[] | null | undefined;
        }, {
            action: "send";
            to?: string[] | null | undefined;
        }>, z.ZodObject<{
            action: z.ZodLiteral<"leaseDomain">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "leaseDomain";
        }, {
            action: "leaseDomain";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"fee">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "fee";
        }, {
            action: "fee";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"tax">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "tax";
        }, {
            action: "tax";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"sendToVote">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "sendToVote";
        }, {
            action: "sendToVote";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"channelHold">;
            recipient: z.ZodString;
            domainHash: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>>>>;
            delegatedSigner: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        }, "strip", z.ZodTypeAny, {
            action: "channelHold";
            recipient: string;
            domainHash?: Buffer | null | undefined;
            delegatedSigner?: string | null | undefined;
        }, {
            action: "channelHold";
            recipient: string;
            domainHash?: unknown;
            delegatedSigner?: string | null | undefined;
        }>, z.ZodObject<{
            action: z.ZodLiteral<"channelHoldSettle">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "channelHoldSettle";
        }, {
            action: "channelHoldSettle";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"channelHoldClaim">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "channelHoldClaim";
        }, {
            action: "channelHoldClaim";
        }>]>;
    }, "strip", z.ZodTypeAny, {
        microgons: bigint;
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: Buffer | null | undefined;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
    }, {
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: unknown;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
        microgons?: unknown;
    }>, "many">;
    signature: z.ZodEffects<z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>;
}, "strip", z.ZodTypeAny, {
    balance: bigint;
    accountId: string;
    accountType: AccountType;
    changeNumber: number;
    notes: {
        microgons: bigint;
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: Buffer | null | undefined;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
    }[];
    signature: Buffer;
    previousBalanceProof?: {
        notebookNumber: number;
        notaryId: number;
        tick: number;
        balance: bigint;
        accountOrigin: {
            notebookNumber: number;
            accountUid: number;
        };
        notebookProof?: {
            proof: Uint8Array[];
            numberOfLeaves: number;
            leafIndex: number;
        } | null | undefined;
    } | null | undefined;
    channelHoldNote?: {
        microgons: bigint;
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: Buffer | null | undefined;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
    } | null | undefined;
}, {
    accountId: string;
    accountType: AccountType;
    changeNumber: number;
    notes: {
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: unknown;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
        microgons?: unknown;
    }[];
    balance?: unknown;
    previousBalanceProof?: {
        notebookNumber: number;
        notaryId: number;
        tick: number;
        accountOrigin: {
            notebookNumber: number;
            accountUid: number;
        };
        balance?: unknown;
        notebookProof?: {
            proof: Uint8Array[];
            numberOfLeaves: number;
            leafIndex: number;
        } | null | undefined;
    } | null | undefined;
    channelHoldNote?: {
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: unknown;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
        microgons?: unknown;
    } | null | undefined;
    signature?: unknown;
}>;
export declare const BalanceChangesSchema: z.ZodArray<z.ZodObject<{
    accountId: z.ZodString;
    accountType: z.ZodNativeEnum<typeof AccountType>;
    changeNumber: z.ZodNumber;
    balance: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
    previousBalanceProof: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        notaryId: z.ZodNumber;
        notebookNumber: z.ZodNumber;
        tick: z.ZodNumber;
        balance: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
        accountOrigin: z.ZodObject<{
            notebookNumber: z.ZodNumber;
            accountUid: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            notebookNumber: number;
            accountUid: number;
        }, {
            notebookNumber: number;
            accountUid: number;
        }>;
        notebookProof: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            proof: z.ZodArray<z.ZodType<Uint8Array, z.ZodTypeDef, Uint8Array>, "many">;
            numberOfLeaves: z.ZodNumber;
            leafIndex: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            proof: Uint8Array[];
            numberOfLeaves: number;
            leafIndex: number;
        }, {
            proof: Uint8Array[];
            numberOfLeaves: number;
            leafIndex: number;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        notebookNumber: number;
        notaryId: number;
        tick: number;
        balance: bigint;
        accountOrigin: {
            notebookNumber: number;
            accountUid: number;
        };
        notebookProof?: {
            proof: Uint8Array[];
            numberOfLeaves: number;
            leafIndex: number;
        } | null | undefined;
    }, {
        notebookNumber: number;
        notaryId: number;
        tick: number;
        accountOrigin: {
            notebookNumber: number;
            accountUid: number;
        };
        balance?: unknown;
        notebookProof?: {
            proof: Uint8Array[];
            numberOfLeaves: number;
            leafIndex: number;
        } | null | undefined;
    }>>>;
    channelHoldNote: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        microgons: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
        noteType: z.ZodDiscriminatedUnion<"action", [z.ZodObject<{
            action: z.ZodLiteral<"sendToMainchain">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "sendToMainchain";
        }, {
            action: "sendToMainchain";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"claimFromMainchain">;
            transferId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            action: "claimFromMainchain";
            transferId: number;
        }, {
            action: "claimFromMainchain";
            transferId: number;
        }>, z.ZodObject<{
            action: z.ZodLiteral<"claim">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "claim";
        }, {
            action: "claim";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"send">;
            to: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>>;
        }, "strip", z.ZodTypeAny, {
            action: "send";
            to?: string[] | null | undefined;
        }, {
            action: "send";
            to?: string[] | null | undefined;
        }>, z.ZodObject<{
            action: z.ZodLiteral<"leaseDomain">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "leaseDomain";
        }, {
            action: "leaseDomain";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"fee">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "fee";
        }, {
            action: "fee";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"tax">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "tax";
        }, {
            action: "tax";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"sendToVote">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "sendToVote";
        }, {
            action: "sendToVote";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"channelHold">;
            recipient: z.ZodString;
            domainHash: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>>>>;
            delegatedSigner: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        }, "strip", z.ZodTypeAny, {
            action: "channelHold";
            recipient: string;
            domainHash?: Buffer | null | undefined;
            delegatedSigner?: string | null | undefined;
        }, {
            action: "channelHold";
            recipient: string;
            domainHash?: unknown;
            delegatedSigner?: string | null | undefined;
        }>, z.ZodObject<{
            action: z.ZodLiteral<"channelHoldSettle">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "channelHoldSettle";
        }, {
            action: "channelHoldSettle";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"channelHoldClaim">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "channelHoldClaim";
        }, {
            action: "channelHoldClaim";
        }>]>;
    }, "strip", z.ZodTypeAny, {
        microgons: bigint;
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: Buffer | null | undefined;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
    }, {
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: unknown;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
        microgons?: unknown;
    }>>>;
    notes: z.ZodArray<z.ZodObject<{
        microgons: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
        noteType: z.ZodDiscriminatedUnion<"action", [z.ZodObject<{
            action: z.ZodLiteral<"sendToMainchain">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "sendToMainchain";
        }, {
            action: "sendToMainchain";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"claimFromMainchain">;
            transferId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            action: "claimFromMainchain";
            transferId: number;
        }, {
            action: "claimFromMainchain";
            transferId: number;
        }>, z.ZodObject<{
            action: z.ZodLiteral<"claim">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "claim";
        }, {
            action: "claim";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"send">;
            to: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>>;
        }, "strip", z.ZodTypeAny, {
            action: "send";
            to?: string[] | null | undefined;
        }, {
            action: "send";
            to?: string[] | null | undefined;
        }>, z.ZodObject<{
            action: z.ZodLiteral<"leaseDomain">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "leaseDomain";
        }, {
            action: "leaseDomain";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"fee">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "fee";
        }, {
            action: "fee";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"tax">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "tax";
        }, {
            action: "tax";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"sendToVote">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "sendToVote";
        }, {
            action: "sendToVote";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"channelHold">;
            recipient: z.ZodString;
            domainHash: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>>>>;
            delegatedSigner: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        }, "strip", z.ZodTypeAny, {
            action: "channelHold";
            recipient: string;
            domainHash?: Buffer | null | undefined;
            delegatedSigner?: string | null | undefined;
        }, {
            action: "channelHold";
            recipient: string;
            domainHash?: unknown;
            delegatedSigner?: string | null | undefined;
        }>, z.ZodObject<{
            action: z.ZodLiteral<"channelHoldSettle">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "channelHoldSettle";
        }, {
            action: "channelHoldSettle";
        }>, z.ZodObject<{
            action: z.ZodLiteral<"channelHoldClaim">;
        }, z.UnknownKeysParam, z.ZodTypeAny, {
            action: "channelHoldClaim";
        }, {
            action: "channelHoldClaim";
        }>]>;
    }, "strip", z.ZodTypeAny, {
        microgons: bigint;
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: Buffer | null | undefined;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
    }, {
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: unknown;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
        microgons?: unknown;
    }>, "many">;
    signature: z.ZodEffects<z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>;
}, "strip", z.ZodTypeAny, {
    balance: bigint;
    accountId: string;
    accountType: AccountType;
    changeNumber: number;
    notes: {
        microgons: bigint;
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: Buffer | null | undefined;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
    }[];
    signature: Buffer;
    previousBalanceProof?: {
        notebookNumber: number;
        notaryId: number;
        tick: number;
        balance: bigint;
        accountOrigin: {
            notebookNumber: number;
            accountUid: number;
        };
        notebookProof?: {
            proof: Uint8Array[];
            numberOfLeaves: number;
            leafIndex: number;
        } | null | undefined;
    } | null | undefined;
    channelHoldNote?: {
        microgons: bigint;
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: Buffer | null | undefined;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
    } | null | undefined;
}, {
    accountId: string;
    accountType: AccountType;
    changeNumber: number;
    notes: {
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: unknown;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
        microgons?: unknown;
    }[];
    balance?: unknown;
    previousBalanceProof?: {
        notebookNumber: number;
        notaryId: number;
        tick: number;
        accountOrigin: {
            notebookNumber: number;
            accountUid: number;
        };
        balance?: unknown;
        notebookProof?: {
            proof: Uint8Array[];
            numberOfLeaves: number;
            leafIndex: number;
        } | null | undefined;
    } | null | undefined;
    channelHoldNote?: {
        noteType: {
            action: "send";
            to?: string[] | null | undefined;
        } | {
            action: "claimFromMainchain";
            transferId: number;
        } | {
            action: "channelHold";
            recipient: string;
            domainHash?: unknown;
            delegatedSigner?: string | null | undefined;
        } | {
            action: "sendToMainchain";
        } | {
            action: "claim";
        } | {
            action: "leaseDomain";
        } | {
            action: "fee";
        } | {
            action: "tax";
        } | {
            action: "sendToVote";
        } | {
            action: "channelHoldSettle";
        } | {
            action: "channelHoldClaim";
        };
        microgons?: unknown;
    } | null | undefined;
    signature?: unknown;
}>, "many">;
type IBalanceChange = z.infer<typeof BalanceChangeSchema>;
export default IBalanceChange;
