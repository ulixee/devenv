import { z } from 'zod';
import { IZodSchemaToApiTypes } from '../utils/IZodApi';
export declare const PaymentServiceApisSchema: {
    'PaymentService.authenticate': {
        args: z.ZodObject<{
            authentication: z.ZodOptional<z.ZodObject<{
                identity: z.ZodString;
                signature: z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>;
                nonce: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                signature: Buffer;
                identity: string;
                nonce: string;
            }, {
                signature: Buffer;
                identity: string;
                nonce: string;
            }>>;
        }, "strip", z.ZodTypeAny, {
            authentication?: {
                signature: Buffer;
                identity: string;
                nonce: string;
            } | undefined;
        }, {
            authentication?: {
                signature: Buffer;
                identity: string;
                nonce: string;
            } | undefined;
        }>;
        result: z.ZodObject<{
            authenticationToken: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authenticationToken: string;
        }, {
            authenticationToken: string;
        }>;
    };
    'PaymentService.reserve': {
        args: z.ZodObject<{
            id: z.ZodString;
            version: z.ZodString;
            microgons: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
            host: z.ZodString;
            recipient: z.ZodObject<{
                chain: z.ZodNativeEnum<typeof import("@argonprotocol/localchain").Chain>;
                genesisHash: z.ZodString;
                address: z.ZodString;
                notaryId: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                notaryId: number;
                chain: import("@argonprotocol/localchain").Chain;
                genesisHash: string;
                address: string;
            }, {
                notaryId: number;
                chain: import("@argonprotocol/localchain").Chain;
                genesisHash: string;
                address: string;
            }>;
            domain: z.ZodOptional<z.ZodString>;
            authenticationToken: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            microgons: bigint;
            version: string;
            recipient: {
                notaryId: number;
                chain: import("@argonprotocol/localchain").Chain;
                genesisHash: string;
                address: string;
            };
            host: string;
            domain?: string | undefined;
            authenticationToken?: string | undefined;
        }, {
            id: string;
            version: string;
            recipient: {
                notaryId: number;
                chain: import("@argonprotocol/localchain").Chain;
                genesisHash: string;
                address: string;
            };
            host: string;
            microgons?: unknown;
            domain?: string | undefined;
            authenticationToken?: string | undefined;
        }>;
        result: z.ZodObject<z.objectUtil.extendShape<{
            channelHold: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
                settledMicrogons: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
                settledSignature: z.ZodEffects<z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                settledMicrogons: bigint;
                settledSignature: Buffer;
            }, {
                id: string;
                settledMicrogons?: unknown;
                settledSignature?: unknown;
            }>>;
            credits: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
                secret: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
                secret: string;
            }, {
                id: string;
                secret: string;
            }>>;
        }, {
            uuid: z.ZodString;
            microgons: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
        }>, "strip", z.ZodTypeAny, {
            uuid: string;
            microgons: bigint;
            channelHold?: {
                id: string;
                settledMicrogons: bigint;
                settledSignature: Buffer;
            } | undefined;
            credits?: {
                id: string;
                secret: string;
            } | undefined;
        }, {
            uuid: string;
            channelHold?: {
                id: string;
                settledMicrogons?: unknown;
                settledSignature?: unknown;
            } | undefined;
            credits?: {
                id: string;
                secret: string;
            } | undefined;
            microgons?: unknown;
        }>;
    };
    'PaymentService.finalize': {
        args: z.ZodObject<z.objectUtil.extendShape<Pick<z.objectUtil.extendShape<{
            channelHold: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
                settledMicrogons: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
                settledSignature: z.ZodEffects<z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                settledMicrogons: bigint;
                settledSignature: Buffer;
            }, {
                id: string;
                settledMicrogons?: unknown;
                settledSignature?: unknown;
            }>>;
            credits: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
                secret: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
                secret: string;
            }, {
                id: string;
                secret: string;
            }>>;
        }, {
            uuid: z.ZodString;
            microgons: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
        }>, "uuid" | "microgons">, {
            finalMicrogons: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
            authenticationToken: z.ZodOptional<z.ZodString>;
        }>, "strip", z.ZodTypeAny, {
            uuid: string;
            microgons: bigint;
            finalMicrogons: bigint;
            authenticationToken?: string | undefined;
        }, {
            uuid: string;
            microgons?: unknown;
            authenticationToken?: string | undefined;
            finalMicrogons?: unknown;
        }>;
        result: z.ZodVoid;
    };
};
type IPaymentServiceApiTypes = IZodSchemaToApiTypes<typeof PaymentServiceApisSchema>;
export default IPaymentServiceApiTypes;
