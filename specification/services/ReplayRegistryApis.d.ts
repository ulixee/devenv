import { z } from 'zod';
import { IZodHandlers, IZodSchemaToApiTypes } from '../utils/IZodApi';
export declare const ReplayRegistryApiSchemas: {
    'ReplayRegistry.store': {
        args: z.ZodObject<{
            sessionId: z.ZodString;
            timestamp: z.ZodNumber;
            db: z.ZodType<Buffer, z.ZodTypeDef, Buffer>;
        }, "strip", z.ZodTypeAny, {
            timestamp: number;
            sessionId: string;
            db: Buffer;
        }, {
            timestamp: number;
            sessionId: string;
            db: Buffer;
        }>;
        result: z.ZodObject<{
            success: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
        }, {
            success: boolean;
        }>;
    };
    'ReplayRegistry.delete': {
        args: z.ZodObject<{
            sessionId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sessionId: string;
        }, {
            sessionId: string;
        }>;
        result: z.ZodObject<{
            success: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
        }, {
            success: boolean;
        }>;
    };
    'ReplayRegistry.get': {
        args: z.ZodObject<{
            sessionId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sessionId: string;
        }, {
            sessionId: string;
        }>;
        result: z.ZodObject<{
            db: z.ZodType<Buffer, z.ZodTypeDef, Buffer>;
        }, "strip", z.ZodTypeAny, {
            db: Buffer;
        }, {
            db: Buffer;
        }>;
    };
    'ReplayRegistry.ids': {
        args: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        result: z.ZodObject<{
            sessionIds: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            sessionIds: string[];
        }, {
            sessionIds: string[];
        }>;
    };
};
export type IReplayRegistryApiTypes = IZodSchemaToApiTypes<typeof ReplayRegistryApiSchemas>;
export type IReplayRegistryApis<TContext = any> = IZodHandlers<typeof ReplayRegistryApiSchemas, TContext>;
export default IReplayRegistryApiTypes;
