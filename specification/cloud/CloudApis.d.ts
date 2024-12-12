import { z } from 'zod';
import { IZodSchemaToApiTypes } from '../utils/IZodApi';
export declare const CloudApiSchemas: {
    'Cloud.status': {
        args: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        result: z.ZodObject<{
            version: z.ZodString;
            nodes: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            version: string;
            nodes: number;
        }, {
            version: string;
            nodes: number;
        }>;
    };
};
type ICloudApiTypes = IZodSchemaToApiTypes<typeof CloudApiSchemas>;
export default ICloudApiTypes;
