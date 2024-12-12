import { z } from 'zod';
/**
 * This will likely be changed to a specific address for payments (maybe just an extra prefix?). It's a placeholder for now.
 */
export declare const channelHoldIdValidation: z.ZodString;
export declare const PaymentMethodSchema: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
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
    channelHold?: {
        id: string;
        settledMicrogons?: unknown;
        settledSignature?: unknown;
    } | undefined;
    credits?: {
        id: string;
        secret: string;
    } | undefined;
}>;
export declare const PaymentSchema: z.ZodObject<z.objectUtil.extendShape<{
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
type IPayment = z.infer<typeof PaymentSchema>;
type IPaymentMethod = z.infer<typeof PaymentMethodSchema>;
export { IPaymentMethod };
export default IPayment;
