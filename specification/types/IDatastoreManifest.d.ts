import { z } from 'zod';
import { Chain } from '@argonprotocol/localchain';
export declare const minDate: number;
export declare const DatastorePaymentRecipientSchema: z.ZodObject<{
    chain: z.ZodNativeEnum<typeof Chain>;
    genesisHash: z.ZodString;
    address: z.ZodString;
    notaryId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    notaryId: number;
    chain: Chain;
    genesisHash: string;
    address: string;
}, {
    notaryId: number;
    chain: Chain;
    genesisHash: string;
    address: string;
}>;
export declare const DatastoreManifestSchema: z.ZodObject<{
    id: z.ZodString;
    version: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    storageEngineHost: z.ZodOptional<z.ZodString>;
    versionTimestamp: z.ZodNumber;
    scriptHash: z.ZodString;
    adminIdentities: z.ZodArray<z.ZodString, "many">;
    scriptEntrypoint: z.ZodString;
    coreVersion: z.ZodString;
    schemaInterface: z.ZodOptional<z.ZodString>;
    extractorsByName: z.ZodRecord<z.ZodString, z.ZodObject<{
        description: z.ZodOptional<z.ZodString>;
        corePlugins: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        schemaAsJson: z.ZodOptional<z.ZodObject<{
            input: z.ZodOptional<z.ZodAny>;
            output: z.ZodOptional<z.ZodAny>;
            inputExamples: z.ZodOptional<z.ZodAny>;
        }, "strip", z.ZodTypeAny, {
            input?: any;
            output?: any;
            inputExamples?: any;
        }, {
            input?: any;
            output?: any;
            inputExamples?: any;
        }>>;
        prices: z.ZodOptional<z.ZodArray<z.ZodObject<{
            basePrice: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
            addOns: z.ZodOptional<z.ZodObject<{
                perKb: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                perKb?: number | undefined;
            }, {
                perKb?: number | undefined;
            }>>;
            remoteMeta: z.ZodOptional<z.ZodObject<{
                host: z.ZodString;
                datastoreId: z.ZodString;
                datastoreVersion: z.ZodString;
                name: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            }, {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            }>>;
        }, "strip", z.ZodTypeAny, {
            basePrice: bigint;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }, {
            basePrice?: unknown;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        description?: string | undefined;
        corePlugins?: Record<string, string> | undefined;
        schemaAsJson?: {
            input?: any;
            output?: any;
            inputExamples?: any;
        } | undefined;
        prices?: {
            basePrice: bigint;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }[] | undefined;
    }, {
        description?: string | undefined;
        corePlugins?: Record<string, string> | undefined;
        schemaAsJson?: {
            input?: any;
            output?: any;
            inputExamples?: any;
        } | undefined;
        prices?: {
            basePrice?: unknown;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }[] | undefined;
    }>>;
    crawlersByName: z.ZodRecord<z.ZodString, z.ZodObject<{
        description: z.ZodOptional<z.ZodString>;
        corePlugins: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        schemaAsJson: z.ZodOptional<z.ZodObject<{
            input: z.ZodOptional<z.ZodAny>;
            output: z.ZodOptional<z.ZodAny>;
            inputExamples: z.ZodOptional<z.ZodAny>;
        }, "strip", z.ZodTypeAny, {
            input?: any;
            output?: any;
            inputExamples?: any;
        }, {
            input?: any;
            output?: any;
            inputExamples?: any;
        }>>;
        prices: z.ZodOptional<z.ZodArray<z.ZodObject<{
            basePrice: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
            addOns: z.ZodOptional<z.ZodObject<{
                perKb: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                perKb?: number | undefined;
            }, {
                perKb?: number | undefined;
            }>>;
            remoteMeta: z.ZodOptional<z.ZodObject<{
                host: z.ZodString;
                datastoreId: z.ZodString;
                datastoreVersion: z.ZodString;
                name: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            }, {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            }>>;
        }, "strip", z.ZodTypeAny, {
            basePrice: bigint;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }, {
            basePrice?: unknown;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        description?: string | undefined;
        corePlugins?: Record<string, string> | undefined;
        schemaAsJson?: {
            input?: any;
            output?: any;
            inputExamples?: any;
        } | undefined;
        prices?: {
            basePrice: bigint;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }[] | undefined;
    }, {
        description?: string | undefined;
        corePlugins?: Record<string, string> | undefined;
        schemaAsJson?: {
            input?: any;
            output?: any;
            inputExamples?: any;
        } | undefined;
        prices?: {
            basePrice?: unknown;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }[] | undefined;
    }>>;
    tablesByName: z.ZodRecord<z.ZodString, z.ZodObject<{
        description: z.ZodOptional<z.ZodString>;
        schemaAsJson: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        prices: z.ZodOptional<z.ZodArray<z.ZodObject<{
            basePrice: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
            addOns: z.ZodOptional<z.ZodObject<{
                perKb: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                perKb?: number | undefined;
            }, {
                perKb?: number | undefined;
            }>>;
            remoteMeta: z.ZodOptional<z.ZodObject<{
                host: z.ZodString;
                datastoreId: z.ZodString;
                datastoreVersion: z.ZodString;
                name: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            }, {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            }>>;
        }, "strip", z.ZodTypeAny, {
            basePrice: bigint;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }, {
            basePrice?: unknown;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        description?: string | undefined;
        schemaAsJson?: Record<string, any> | undefined;
        prices?: {
            basePrice: bigint;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }[] | undefined;
    }, {
        description?: string | undefined;
        schemaAsJson?: Record<string, any> | undefined;
        prices?: {
            basePrice?: unknown;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }[] | undefined;
    }>>;
    domain: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    version: string;
    versionTimestamp: number;
    scriptHash: string;
    adminIdentities: string[];
    scriptEntrypoint: string;
    coreVersion: string;
    extractorsByName: Record<string, {
        description?: string | undefined;
        corePlugins?: Record<string, string> | undefined;
        schemaAsJson?: {
            input?: any;
            output?: any;
            inputExamples?: any;
        } | undefined;
        prices?: {
            basePrice: bigint;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }[] | undefined;
    }>;
    crawlersByName: Record<string, {
        description?: string | undefined;
        corePlugins?: Record<string, string> | undefined;
        schemaAsJson?: {
            input?: any;
            output?: any;
            inputExamples?: any;
        } | undefined;
        prices?: {
            basePrice: bigint;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }[] | undefined;
    }>;
    tablesByName: Record<string, {
        description?: string | undefined;
        schemaAsJson?: Record<string, any> | undefined;
        prices?: {
            basePrice: bigint;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }[] | undefined;
    }>;
    description?: string | undefined;
    name?: string | undefined;
    domain?: string | undefined;
    storageEngineHost?: string | undefined;
    schemaInterface?: string | undefined;
}, {
    id: string;
    version: string;
    versionTimestamp: number;
    scriptHash: string;
    adminIdentities: string[];
    scriptEntrypoint: string;
    coreVersion: string;
    extractorsByName: Record<string, {
        description?: string | undefined;
        corePlugins?: Record<string, string> | undefined;
        schemaAsJson?: {
            input?: any;
            output?: any;
            inputExamples?: any;
        } | undefined;
        prices?: {
            basePrice?: unknown;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }[] | undefined;
    }>;
    crawlersByName: Record<string, {
        description?: string | undefined;
        corePlugins?: Record<string, string> | undefined;
        schemaAsJson?: {
            input?: any;
            output?: any;
            inputExamples?: any;
        } | undefined;
        prices?: {
            basePrice?: unknown;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }[] | undefined;
    }>;
    tablesByName: Record<string, {
        description?: string | undefined;
        schemaAsJson?: Record<string, any> | undefined;
        prices?: {
            basePrice?: unknown;
            addOns?: {
                perKb?: number | undefined;
            } | undefined;
            remoteMeta?: {
                datastoreId: string;
                name: string;
                host: string;
                datastoreVersion: string;
            } | undefined;
        }[] | undefined;
    }>;
    description?: string | undefined;
    name?: string | undefined;
    domain?: string | undefined;
    storageEngineHost?: string | undefined;
    schemaInterface?: string | undefined;
}>;
type IDatastoreManifest = z.infer<typeof DatastoreManifestSchema>;
type IDatastorePaymentRecipient = z.infer<typeof DatastorePaymentRecipientSchema>;
export { IDatastorePaymentRecipient };
export default IDatastoreManifest;
