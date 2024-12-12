import { z } from 'zod';
import { IZodSchemaToApiTypes } from '../utils/IZodApi';
export declare const DomainLookupApiSchema: {
    'DomainLookup.query': {
        args: z.ZodObject<{
            datastoreUrl: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            datastoreUrl: string;
        }, {
            datastoreUrl: string;
        }>;
        result: z.ZodObject<{
            datastoreId: z.ZodString;
            version: z.ZodString;
            host: z.ZodString;
            domain: z.ZodOptional<z.ZodString>;
            payment: z.ZodOptional<z.ZodObject<{
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
            }>>;
        }, "strip", z.ZodTypeAny, {
            version: string;
            datastoreId: string;
            host: string;
            domain?: string | undefined;
            payment?: {
                notaryId: number;
                chain: import("@argonprotocol/localchain").Chain;
                genesisHash: string;
                address: string;
            } | undefined;
        }, {
            version: string;
            datastoreId: string;
            host: string;
            domain?: string | undefined;
            payment?: {
                notaryId: number;
                chain: import("@argonprotocol/localchain").Chain;
                genesisHash: string;
                address: string;
            } | undefined;
        }>;
    };
};
type IDomainLookupApiTypes = IZodSchemaToApiTypes<typeof DomainLookupApiSchema>;
export default IDomainLookupApiTypes;
