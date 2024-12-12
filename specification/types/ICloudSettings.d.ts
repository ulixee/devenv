import { z } from 'zod';
export declare const CloudSettingsSchema: z.ZodObject<{
    datastoreRegistryEndpoint: z.ZodOptional<z.ZodString>;
    storageEngineEndpoint: z.ZodOptional<z.ZodString>;
    statsEndpoint: z.ZodOptional<z.ZodString>;
    nodeRegistryEndpoint: z.ZodOptional<z.ZodString>;
    dhtServices: z.ZodOptional<z.ZodObject<{
        datastoreRegistry: z.ZodAny;
        nodeRegistry: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        datastoreRegistry?: any;
        nodeRegistry?: any;
    }, {
        datastoreRegistry?: any;
        nodeRegistry?: any;
    }>>;
}, "strip", z.ZodTypeAny, {
    datastoreRegistryEndpoint?: string | undefined;
    storageEngineEndpoint?: string | undefined;
    statsEndpoint?: string | undefined;
    nodeRegistryEndpoint?: string | undefined;
    dhtServices?: {
        datastoreRegistry?: any;
        nodeRegistry?: any;
    } | undefined;
}, {
    datastoreRegistryEndpoint?: string | undefined;
    storageEngineEndpoint?: string | undefined;
    statsEndpoint?: string | undefined;
    nodeRegistryEndpoint?: string | undefined;
    dhtServices?: {
        datastoreRegistry?: any;
        nodeRegistry?: any;
    } | undefined;
}>;
type ICloudSettings = z.infer<typeof CloudSettingsSchema>;
export default ICloudSettings;
