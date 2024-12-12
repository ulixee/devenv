import { z } from 'zod';
import { IZodHandlers, IZodSchemaToApiTypes } from '../utils/IZodApi';
export declare const ServicesSetupApiSchemas: {
    'Services.getSetup': {
        args: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        result: z.ZodObject<{
            datastoreRegistryHost: z.ZodOptional<z.ZodString>;
            storageEngineHost: z.ZodOptional<z.ZodString>;
            statsTrackerHost: z.ZodOptional<z.ZodString>;
            nodeRegistryHost: z.ZodOptional<z.ZodString>;
            replayRegistryHost: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            storageEngineHost?: string | undefined;
            datastoreRegistryHost?: string | undefined;
            statsTrackerHost?: string | undefined;
            nodeRegistryHost?: string | undefined;
            replayRegistryHost?: string | undefined;
        }, {
            storageEngineHost?: string | undefined;
            datastoreRegistryHost?: string | undefined;
            statsTrackerHost?: string | undefined;
            nodeRegistryHost?: string | undefined;
            replayRegistryHost?: string | undefined;
        }>;
    };
};
export type IServicesSetupApiTypes = IZodSchemaToApiTypes<typeof ServicesSetupApiSchemas>;
export type IServicesSetupApis<TContext = any> = IZodHandlers<typeof ServicesSetupApiSchemas, TContext>;
export default IServicesSetupApiTypes;
