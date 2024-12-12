import ValidatingApiHandler from '@ulixee/platform-specification/utils/ValidatingApiHandler';
import IDatastoreApiContext from '../interfaces/IDatastoreApiContext';
declare const _default: ValidatingApiHandler<{
    'ChannelHold.register': {
        args: import("zod").ZodObject<{
            datastoreId: import("zod").ZodString;
            channelHold: import("zod").ZodObject<import("zod").objectUtil.extendShape<{
                accountId: import("zod").ZodString;
                accountType: import("zod").ZodNativeEnum<typeof import("@argonprotocol/localchain").AccountType>;
                changeNumber: import("zod").ZodNumber;
                balance: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
                previousBalanceProof: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodObject<{
                    notaryId: import("zod").ZodNumber;
                    notebookNumber: import("zod").ZodNumber;
                    tick: import("zod").ZodNumber;
                    balance: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
                    accountOrigin: import("zod").ZodObject<{
                        notebookNumber: import("zod").ZodNumber;
                        accountUid: import("zod").ZodNumber;
                    }, "strip", import("zod").ZodTypeAny, {
                        notebookNumber: number;
                        accountUid: number;
                    }, {
                        notebookNumber: number;
                        accountUid: number;
                    }>;
                    notebookProof: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodObject<{
                        proof: import("zod").ZodArray<import("zod").ZodType<Uint8Array, import("zod").ZodTypeDef, Uint8Array>, "many">;
                        numberOfLeaves: import("zod").ZodNumber;
                        leafIndex: import("zod").ZodNumber;
                    }, "strip", import("zod").ZodTypeAny, {
                        proof: Uint8Array[];
                        numberOfLeaves: number;
                        leafIndex: number;
                    }, {
                        proof: Uint8Array[];
                        numberOfLeaves: number;
                        leafIndex: number;
                    }>>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                channelHoldNote: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodObject<{
                    microgons: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
                    noteType: import("zod").ZodDiscriminatedUnion<"action", [import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"sendToMainchain">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "sendToMainchain";
                    }, {
                        action: "sendToMainchain";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"claimFromMainchain">;
                        transferId: import("zod").ZodNumber;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "claimFromMainchain";
                        transferId: number;
                    }, {
                        action: "claimFromMainchain";
                        transferId: number;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"claim">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "claim";
                    }, {
                        action: "claim";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"send">;
                        to: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>>;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "send";
                        to?: string[] | null | undefined;
                    }, {
                        action: "send";
                        to?: string[] | null | undefined;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"leaseDomain">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "leaseDomain";
                    }, {
                        action: "leaseDomain";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"fee">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "fee";
                    }, {
                        action: "fee";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"tax">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "tax";
                    }, {
                        action: "tax";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"sendToVote">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "sendToVote";
                    }, {
                        action: "sendToVote";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHold">;
                        recipient: import("zod").ZodString;
                        domainHash: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodEffects<import("zod").ZodType<Buffer, import("zod").ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>>>>;
                        delegatedSigner: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "channelHold";
                        recipient: string;
                        domainHash?: Buffer | null | undefined;
                        delegatedSigner?: string | null | undefined;
                    }, {
                        action: "channelHold";
                        recipient: string;
                        domainHash?: unknown;
                        delegatedSigner?: string | null | undefined;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHoldSettle">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "channelHoldSettle";
                    }, {
                        action: "channelHoldSettle";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHoldClaim">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "channelHoldClaim";
                    }, {
                        action: "channelHoldClaim";
                    }>]>;
                }, "strip", import("zod").ZodTypeAny, {
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
                notes: import("zod").ZodArray<import("zod").ZodObject<{
                    microgons: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
                    noteType: import("zod").ZodDiscriminatedUnion<"action", [import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"sendToMainchain">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "sendToMainchain";
                    }, {
                        action: "sendToMainchain";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"claimFromMainchain">;
                        transferId: import("zod").ZodNumber;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "claimFromMainchain";
                        transferId: number;
                    }, {
                        action: "claimFromMainchain";
                        transferId: number;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"claim">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "claim";
                    }, {
                        action: "claim";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"send">;
                        to: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>>;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "send";
                        to?: string[] | null | undefined;
                    }, {
                        action: "send";
                        to?: string[] | null | undefined;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"leaseDomain">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "leaseDomain";
                    }, {
                        action: "leaseDomain";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"fee">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "fee";
                    }, {
                        action: "fee";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"tax">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "tax";
                    }, {
                        action: "tax";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"sendToVote">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "sendToVote";
                    }, {
                        action: "sendToVote";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHold">;
                        recipient: import("zod").ZodString;
                        domainHash: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodEffects<import("zod").ZodType<Buffer, import("zod").ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>>>>;
                        delegatedSigner: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "channelHold";
                        recipient: string;
                        domainHash?: Buffer | null | undefined;
                        delegatedSigner?: string | null | undefined;
                    }, {
                        action: "channelHold";
                        recipient: string;
                        domainHash?: unknown;
                        delegatedSigner?: string | null | undefined;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHoldSettle">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "channelHoldSettle";
                    }, {
                        action: "channelHoldSettle";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHoldClaim">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "channelHoldClaim";
                    }, {
                        action: "channelHoldClaim";
                    }>]>;
                }, "strip", import("zod").ZodTypeAny, {
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
                signature: import("zod").ZodEffects<import("zod").ZodEffects<import("zod").ZodType<Buffer, import("zod").ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>;
            }, {
                channelHoldNote: import("zod").ZodObject<{
                    microgons: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
                    noteType: import("zod").ZodDiscriminatedUnion<"action", [import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"sendToMainchain">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "sendToMainchain";
                    }, {
                        action: "sendToMainchain";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"claimFromMainchain">;
                        transferId: import("zod").ZodNumber;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "claimFromMainchain";
                        transferId: number;
                    }, {
                        action: "claimFromMainchain";
                        transferId: number;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"claim">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "claim";
                    }, {
                        action: "claim";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"send">;
                        to: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>>;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "send";
                        to?: string[] | null | undefined;
                    }, {
                        action: "send";
                        to?: string[] | null | undefined;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"leaseDomain">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "leaseDomain";
                    }, {
                        action: "leaseDomain";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"fee">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "fee";
                    }, {
                        action: "fee";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"tax">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "tax";
                    }, {
                        action: "tax";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"sendToVote">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "sendToVote";
                    }, {
                        action: "sendToVote";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHold">;
                        recipient: import("zod").ZodString;
                        domainHash: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodEffects<import("zod").ZodType<Buffer, import("zod").ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>>>>;
                        delegatedSigner: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "channelHold";
                        recipient: string;
                        domainHash?: Buffer | null | undefined;
                        delegatedSigner?: string | null | undefined;
                    }, {
                        action: "channelHold";
                        recipient: string;
                        domainHash?: unknown;
                        delegatedSigner?: string | null | undefined;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHoldSettle">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "channelHoldSettle";
                    }, {
                        action: "channelHoldSettle";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHoldClaim">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "channelHoldClaim";
                    }, {
                        action: "channelHoldClaim";
                    }>]>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>;
            }>, "strip", import("zod").ZodTypeAny, {
                balance: bigint;
                accountId: string;
                accountType: import("@argonprotocol/localchain").AccountType;
                changeNumber: number;
                channelHoldNote: {
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
                };
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
            }, {
                accountId: string;
                accountType: import("@argonprotocol/localchain").AccountType;
                changeNumber: number;
                channelHoldNote: {
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
                };
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
                signature?: unknown;
            }>;
        }, "strip", import("zod").ZodTypeAny, {
            channelHold: {
                balance: bigint;
                accountId: string;
                accountType: import("@argonprotocol/localchain").AccountType;
                changeNumber: number;
                channelHoldNote: {
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
                };
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
            };
            datastoreId: string;
        }, {
            channelHold: {
                accountId: string;
                accountType: import("@argonprotocol/localchain").AccountType;
                changeNumber: number;
                channelHoldNote: {
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
                };
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
                signature?: unknown;
            };
            datastoreId: string;
        }>;
        result: import("zod").ZodObject<{
            accepted: import("zod").ZodBoolean;
        }, "strip", import("zod").ZodTypeAny, {
            accepted: boolean;
        }, {
            accepted: boolean;
        }>;
    };
}, "ChannelHold.register", import("@ulixee/platform-specification/utils/IZodApi").IZodSchemaToApiTypes<{
    'ChannelHold.register': {
        args: import("zod").ZodObject<{
            datastoreId: import("zod").ZodString;
            channelHold: import("zod").ZodObject<import("zod").objectUtil.extendShape<{
                accountId: import("zod").ZodString;
                accountType: import("zod").ZodNativeEnum<typeof import("@argonprotocol/localchain").AccountType>;
                changeNumber: import("zod").ZodNumber;
                balance: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
                previousBalanceProof: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodObject<{
                    notaryId: import("zod").ZodNumber;
                    notebookNumber: import("zod").ZodNumber;
                    tick: import("zod").ZodNumber;
                    balance: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
                    accountOrigin: import("zod").ZodObject<{
                        notebookNumber: import("zod").ZodNumber;
                        accountUid: import("zod").ZodNumber;
                    }, "strip", import("zod").ZodTypeAny, {
                        notebookNumber: number;
                        accountUid: number;
                    }, {
                        notebookNumber: number;
                        accountUid: number;
                    }>;
                    notebookProof: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodObject<{
                        proof: import("zod").ZodArray<import("zod").ZodType<Uint8Array, import("zod").ZodTypeDef, Uint8Array>, "many">;
                        numberOfLeaves: import("zod").ZodNumber;
                        leafIndex: import("zod").ZodNumber;
                    }, "strip", import("zod").ZodTypeAny, {
                        proof: Uint8Array[];
                        numberOfLeaves: number;
                        leafIndex: number;
                    }, {
                        proof: Uint8Array[];
                        numberOfLeaves: number;
                        leafIndex: number;
                    }>>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                channelHoldNote: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodObject<{
                    microgons: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
                    noteType: import("zod").ZodDiscriminatedUnion<"action", [import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"sendToMainchain">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "sendToMainchain";
                    }, {
                        action: "sendToMainchain";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"claimFromMainchain">;
                        transferId: import("zod").ZodNumber;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "claimFromMainchain";
                        transferId: number;
                    }, {
                        action: "claimFromMainchain";
                        transferId: number;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"claim">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "claim";
                    }, {
                        action: "claim";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"send">;
                        to: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>>;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "send";
                        to?: string[] | null | undefined;
                    }, {
                        action: "send";
                        to?: string[] | null | undefined;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"leaseDomain">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "leaseDomain";
                    }, {
                        action: "leaseDomain";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"fee">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "fee";
                    }, {
                        action: "fee";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"tax">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "tax";
                    }, {
                        action: "tax";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"sendToVote">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "sendToVote";
                    }, {
                        action: "sendToVote";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHold">;
                        recipient: import("zod").ZodString;
                        domainHash: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodEffects<import("zod").ZodType<Buffer, import("zod").ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>>>>;
                        delegatedSigner: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "channelHold";
                        recipient: string;
                        domainHash?: Buffer | null | undefined;
                        delegatedSigner?: string | null | undefined;
                    }, {
                        action: "channelHold";
                        recipient: string;
                        domainHash?: unknown;
                        delegatedSigner?: string | null | undefined;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHoldSettle">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "channelHoldSettle";
                    }, {
                        action: "channelHoldSettle";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHoldClaim">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "channelHoldClaim";
                    }, {
                        action: "channelHoldClaim";
                    }>]>;
                }, "strip", import("zod").ZodTypeAny, {
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
                notes: import("zod").ZodArray<import("zod").ZodObject<{
                    microgons: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
                    noteType: import("zod").ZodDiscriminatedUnion<"action", [import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"sendToMainchain">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "sendToMainchain";
                    }, {
                        action: "sendToMainchain";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"claimFromMainchain">;
                        transferId: import("zod").ZodNumber;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "claimFromMainchain";
                        transferId: number;
                    }, {
                        action: "claimFromMainchain";
                        transferId: number;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"claim">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "claim";
                    }, {
                        action: "claim";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"send">;
                        to: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>>;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "send";
                        to?: string[] | null | undefined;
                    }, {
                        action: "send";
                        to?: string[] | null | undefined;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"leaseDomain">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "leaseDomain";
                    }, {
                        action: "leaseDomain";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"fee">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "fee";
                    }, {
                        action: "fee";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"tax">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "tax";
                    }, {
                        action: "tax";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"sendToVote">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "sendToVote";
                    }, {
                        action: "sendToVote";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHold">;
                        recipient: import("zod").ZodString;
                        domainHash: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodEffects<import("zod").ZodType<Buffer, import("zod").ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>>>>;
                        delegatedSigner: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "channelHold";
                        recipient: string;
                        domainHash?: Buffer | null | undefined;
                        delegatedSigner?: string | null | undefined;
                    }, {
                        action: "channelHold";
                        recipient: string;
                        domainHash?: unknown;
                        delegatedSigner?: string | null | undefined;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHoldSettle">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "channelHoldSettle";
                    }, {
                        action: "channelHoldSettle";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHoldClaim">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "channelHoldClaim";
                    }, {
                        action: "channelHoldClaim";
                    }>]>;
                }, "strip", import("zod").ZodTypeAny, {
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
                signature: import("zod").ZodEffects<import("zod").ZodEffects<import("zod").ZodType<Buffer, import("zod").ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>;
            }, {
                channelHoldNote: import("zod").ZodObject<{
                    microgons: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
                    noteType: import("zod").ZodDiscriminatedUnion<"action", [import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"sendToMainchain">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "sendToMainchain";
                    }, {
                        action: "sendToMainchain";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"claimFromMainchain">;
                        transferId: import("zod").ZodNumber;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "claimFromMainchain";
                        transferId: number;
                    }, {
                        action: "claimFromMainchain";
                        transferId: number;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"claim">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "claim";
                    }, {
                        action: "claim";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"send">;
                        to: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>>;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "send";
                        to?: string[] | null | undefined;
                    }, {
                        action: "send";
                        to?: string[] | null | undefined;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"leaseDomain">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "leaseDomain";
                    }, {
                        action: "leaseDomain";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"fee">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "fee";
                    }, {
                        action: "fee";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"tax">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "tax";
                    }, {
                        action: "tax";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"sendToVote">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "sendToVote";
                    }, {
                        action: "sendToVote";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHold">;
                        recipient: import("zod").ZodString;
                        domainHash: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodEffects<import("zod").ZodType<Buffer, import("zod").ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>>>>;
                        delegatedSigner: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodOptional<import("zod").ZodString>>>;
                    }, "strip", import("zod").ZodTypeAny, {
                        action: "channelHold";
                        recipient: string;
                        domainHash?: Buffer | null | undefined;
                        delegatedSigner?: string | null | undefined;
                    }, {
                        action: "channelHold";
                        recipient: string;
                        domainHash?: unknown;
                        delegatedSigner?: string | null | undefined;
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHoldSettle">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "channelHoldSettle";
                    }, {
                        action: "channelHoldSettle";
                    }>, import("zod").ZodObject<{
                        action: import("zod").ZodLiteral<"channelHoldClaim">;
                    }, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
                        action: "channelHoldClaim";
                    }, {
                        action: "channelHoldClaim";
                    }>]>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>;
            }>, "strip", import("zod").ZodTypeAny, {
                balance: bigint;
                accountId: string;
                accountType: import("@argonprotocol/localchain").AccountType;
                changeNumber: number;
                channelHoldNote: {
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
                };
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
            }, {
                accountId: string;
                accountType: import("@argonprotocol/localchain").AccountType;
                changeNumber: number;
                channelHoldNote: {
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
                };
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
                signature?: unknown;
            }>;
        }, "strip", import("zod").ZodTypeAny, {
            channelHold: {
                balance: bigint;
                accountId: string;
                accountType: import("@argonprotocol/localchain").AccountType;
                changeNumber: number;
                channelHoldNote: {
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
                };
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
            };
            datastoreId: string;
        }, {
            channelHold: {
                accountId: string;
                accountType: import("@argonprotocol/localchain").AccountType;
                changeNumber: number;
                channelHoldNote: {
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
                };
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
                signature?: unknown;
            };
            datastoreId: string;
        }>;
        result: import("zod").ZodObject<{
            accepted: import("zod").ZodBoolean;
        }, "strip", import("zod").ZodTypeAny, {
            accepted: boolean;
        }, {
            accepted: boolean;
        }>;
    };
}>, IDatastoreApiContext>;
export default _default;
