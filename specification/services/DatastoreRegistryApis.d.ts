import { z } from 'zod';
import { IZodHandlers, IZodSchemaToApiTypes } from '../utils/IZodApi';
export declare const DatastoreManifestWithLatest: z.ZodObject<z.objectUtil.extendShape<{
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
}, {
    latestVersion: z.ZodString;
    isStarted: z.ZodBoolean;
}>, "strip", z.ZodTypeAny, {
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
    latestVersion: string;
    isStarted: boolean;
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
    latestVersion: string;
    isStarted: boolean;
    description?: string | undefined;
    name?: string | undefined;
    domain?: string | undefined;
    storageEngineHost?: string | undefined;
    schemaInterface?: string | undefined;
}>;
export declare const DatastoreListEntry: z.ZodObject<z.objectUtil.extendShape<Pick<{
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
}, "id" | "description" | "version" | "name" | "domain" | "versionTimestamp" | "scriptEntrypoint">, {
    isStarted: z.ZodBoolean;
}>, "strip", z.ZodTypeAny, {
    id: string;
    version: string;
    versionTimestamp: number;
    scriptEntrypoint: string;
    isStarted: boolean;
    description?: string | undefined;
    name?: string | undefined;
    domain?: string | undefined;
}, {
    id: string;
    version: string;
    versionTimestamp: number;
    scriptEntrypoint: string;
    isStarted: boolean;
    description?: string | undefined;
    name?: string | undefined;
    domain?: string | undefined;
}>;
export declare const DatastoreRegistryApiSchemas: {
    'DatastoreRegistry.list': {
        args: z.ZodObject<{
            count: z.ZodOptional<z.ZodNumber>;
            offset: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            count?: number | undefined;
            offset?: number | undefined;
        }, {
            count?: number | undefined;
            offset?: number | undefined;
        }>;
        result: z.ZodObject<{
            datastores: z.ZodArray<z.ZodObject<z.objectUtil.extendShape<Pick<{
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
            }, "id" | "description" | "version" | "name" | "domain" | "versionTimestamp" | "scriptEntrypoint">, {
                isStarted: z.ZodBoolean;
            }>, "strip", z.ZodTypeAny, {
                id: string;
                version: string;
                versionTimestamp: number;
                scriptEntrypoint: string;
                isStarted: boolean;
                description?: string | undefined;
                name?: string | undefined;
                domain?: string | undefined;
            }, {
                id: string;
                version: string;
                versionTimestamp: number;
                scriptEntrypoint: string;
                isStarted: boolean;
                description?: string | undefined;
                name?: string | undefined;
                domain?: string | undefined;
            }>, "many">;
            total: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            datastores: {
                id: string;
                version: string;
                versionTimestamp: number;
                scriptEntrypoint: string;
                isStarted: boolean;
                description?: string | undefined;
                name?: string | undefined;
                domain?: string | undefined;
            }[];
            total: number;
        }, {
            datastores: {
                id: string;
                version: string;
                versionTimestamp: number;
                scriptEntrypoint: string;
                isStarted: boolean;
                description?: string | undefined;
                name?: string | undefined;
                domain?: string | undefined;
            }[];
            total: number;
        }>;
    };
    'DatastoreRegistry.get': {
        args: z.ZodObject<{
            id: z.ZodString;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            version: string;
        }, {
            id: string;
            version: string;
        }>;
        result: z.ZodObject<{
            datastore: z.ZodObject<z.objectUtil.extendShape<{
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
            }, {
                latestVersion: z.ZodString;
                isStarted: z.ZodBoolean;
            }>, "strip", z.ZodTypeAny, {
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
                latestVersion: string;
                isStarted: boolean;
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
                latestVersion: string;
                isStarted: boolean;
                description?: string | undefined;
                name?: string | undefined;
                domain?: string | undefined;
                storageEngineHost?: string | undefined;
                schemaInterface?: string | undefined;
            }>;
        }, "strip", z.ZodTypeAny, {
            datastore: {
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
                latestVersion: string;
                isStarted: boolean;
                description?: string | undefined;
                name?: string | undefined;
                domain?: string | undefined;
                storageEngineHost?: string | undefined;
                schemaInterface?: string | undefined;
            };
        }, {
            datastore: {
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
                latestVersion: string;
                isStarted: boolean;
                description?: string | undefined;
                name?: string | undefined;
                domain?: string | undefined;
                storageEngineHost?: string | undefined;
                schemaInterface?: string | undefined;
            };
        }>;
    };
    'DatastoreRegistry.getVersions': {
        args: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        result: z.ZodObject<{
            versions: z.ZodArray<z.ZodObject<{
                version: z.ZodString;
                timestamp: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                version: string;
                timestamp: number;
            }, {
                version: string;
                timestamp: number;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            versions: {
                version: string;
                timestamp: number;
            }[];
        }, {
            versions: {
                version: string;
                timestamp: number;
            }[];
        }>;
    };
    'DatastoreRegistry.getLatestVersion': {
        args: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        result: z.ZodObject<{
            latestVersion: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            latestVersion: string;
        }, {
            latestVersion: string;
        }>;
    };
    'DatastoreRegistry.downloadDbx': {
        args: z.ZodObject<{
            id: z.ZodString;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            version: string;
        }, {
            id: string;
            version: string;
        }>;
        result: z.ZodObject<{
            adminSignature: z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>;
            adminIdentity: z.ZodString;
            compressedDbx: z.ZodType<Buffer, z.ZodTypeDef, Buffer>;
        }, "strip", z.ZodTypeAny, {
            adminSignature: Buffer;
            adminIdentity: string;
            compressedDbx: Buffer;
        }, {
            adminSignature: Buffer;
            adminIdentity: string;
            compressedDbx: Buffer;
        }>;
    };
    'DatastoreRegistry.upload': {
        args: z.ZodObject<{
            compressedDbx: z.ZodType<Buffer, z.ZodTypeDef, Buffer>;
            adminIdentity: z.ZodOptional<z.ZodString>;
            adminSignature: z.ZodOptional<z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>>;
        }, "strip", z.ZodTypeAny, {
            compressedDbx: Buffer;
            adminSignature?: Buffer | undefined;
            adminIdentity?: string | undefined;
        }, {
            compressedDbx: Buffer;
            adminSignature?: Buffer | undefined;
            adminIdentity?: string | undefined;
        }>;
        result: z.ZodObject<{
            success: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
        }, {
            success: boolean;
        }>;
    };
};
export type IDatastoreRegistryApiTypes = IZodSchemaToApiTypes<typeof DatastoreRegistryApiSchemas>;
export type IDatastoreRegistryApis<TContext = any> = IZodHandlers<typeof DatastoreRegistryApiSchemas, TContext>;
export type IDatastoreManifestWithLatest = z.infer<typeof DatastoreManifestWithLatest>;
export type IDatastoreListEntry = z.infer<typeof DatastoreListEntry>;
export default IDatastoreRegistryApiTypes;
