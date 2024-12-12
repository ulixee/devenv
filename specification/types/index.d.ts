import { z } from 'zod';
export declare const addressValidation: z.ZodString;
export declare const identityValidation: z.ZodString;
export declare const identitySignatureValidation: z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>;
export declare const hashValidation: z.ZodEffects<z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>;
export declare const multiSignatureValidation: z.ZodEffects<z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>, Buffer, unknown>;
export declare const microgonsValidation: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
export declare function bufferPreprocess(x: string | Uint8Array | Buffer): Buffer;
