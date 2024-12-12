import { z } from 'zod';
export declare const ServicesSetupSchema: z.ZodObject<{
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
type IServicesSetup = z.infer<typeof ServicesSetupSchema>;
export default IServicesSetup;
