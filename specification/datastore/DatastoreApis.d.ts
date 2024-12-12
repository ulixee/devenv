import { z } from 'zod';
import { IZodSchemaToApiTypes } from '../utils/IZodApi';
export declare const EntityStatsSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["Table", "Extractor", "Crawler"]>;
    stats: z.ZodObject<{
        queries: z.ZodNumber;
        errors: z.ZodNumber;
        totalSpend: z.ZodBigInt;
        totalCreditSpend: z.ZodBigInt;
        averageBytesPerQuery: z.ZodNumber;
        maxBytesPerQuery: z.ZodNumber;
        averageMilliseconds: z.ZodNumber;
        maxMilliseconds: z.ZodNumber;
        averageTotalPricePerQuery: z.ZodBigInt;
        maxPricePerQuery: z.ZodBigInt;
    }, "strip", z.ZodTypeAny, {
        queries: number;
        errors: number;
        totalSpend: bigint;
        totalCreditSpend: bigint;
        averageBytesPerQuery: number;
        maxBytesPerQuery: number;
        averageMilliseconds: number;
        maxMilliseconds: number;
        averageTotalPricePerQuery: bigint;
        maxPricePerQuery: bigint;
    }, {
        queries: number;
        errors: number;
        totalSpend: bigint;
        totalCreditSpend: bigint;
        averageBytesPerQuery: number;
        maxBytesPerQuery: number;
        averageMilliseconds: number;
        maxMilliseconds: number;
        averageTotalPricePerQuery: bigint;
        maxPricePerQuery: bigint;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "Table" | "Extractor" | "Crawler";
    name: string;
    stats: {
        queries: number;
        errors: number;
        totalSpend: bigint;
        totalCreditSpend: bigint;
        averageBytesPerQuery: number;
        maxBytesPerQuery: number;
        averageMilliseconds: number;
        maxMilliseconds: number;
        averageTotalPricePerQuery: bigint;
        maxPricePerQuery: bigint;
    };
}, {
    type: "Table" | "Extractor" | "Crawler";
    name: string;
    stats: {
        queries: number;
        errors: number;
        totalSpend: bigint;
        totalCreditSpend: bigint;
        averageBytesPerQuery: number;
        maxBytesPerQuery: number;
        averageMilliseconds: number;
        maxMilliseconds: number;
        averageTotalPricePerQuery: bigint;
        maxPricePerQuery: bigint;
    };
}>;
declare const DatastoreMetadataResult: z.ZodObject<{
    microgons: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
    bytes: z.ZodNumber;
    milliseconds: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    microgons: bigint;
    bytes: number;
    milliseconds: number;
}, {
    bytes: number;
    milliseconds: number;
    microgons?: unknown;
}>;
declare const DatastoreQueryResultSchema: z.ZodObject<{
    latestVersion: z.ZodString;
    runError: z.ZodOptional<z.ZodType<Error, z.ZodTypeDef, Error>>;
    outputs: z.ZodArray<z.ZodOptional<z.ZodAny>, "many">;
    metadata: z.ZodObject<{
        microgons: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
        bytes: z.ZodNumber;
        milliseconds: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        microgons: bigint;
        bytes: number;
        milliseconds: number;
    }, {
        bytes: number;
        milliseconds: number;
        microgons?: unknown;
    }>;
}, "strip", z.ZodTypeAny, {
    latestVersion: string;
    outputs: any[];
    metadata: {
        microgons: bigint;
        bytes: number;
        milliseconds: number;
    };
    runError?: Error | undefined;
}, {
    latestVersion: string;
    outputs: any[];
    metadata: {
        bytes: number;
        milliseconds: number;
        microgons?: unknown;
    };
    runError?: Error | undefined;
}>;
declare const DatastoreQueryMetadataSchema: z.ZodObject<{
    id: z.ZodString;
    version: z.ZodString;
    queryId: z.ZodString;
    authentication: z.ZodOptional<z.ZodObject<{
        identity: z.ZodString;
        signature: z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>;
        nonce: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        signature: Buffer;
        identity: string;
        nonce: string;
    }, {
        signature: Buffer;
        identity: string;
        nonce: string;
    }>>;
    affiliateId: z.ZodOptional<z.ZodString>;
    payment: z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<{
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
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    version: string;
    queryId: string;
    authentication?: {
        signature: Buffer;
        identity: string;
        nonce: string;
    } | undefined;
    affiliateId?: string | undefined;
    payment?: {
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
    } | undefined;
}, {
    id: string;
    version: string;
    queryId: string;
    authentication?: {
        signature: Buffer;
        identity: string;
        nonce: string;
    } | undefined;
    affiliateId?: string | undefined;
    payment?: {
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
    } | undefined;
}>;
export declare const DatastoreApiSchemas: {
    'Datastore.upload': {
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
    'Datastore.download': {
        args: z.ZodObject<{
            id: z.ZodString;
            version: z.ZodString;
            requestDate: z.ZodDate;
            adminIdentity: z.ZodString;
            adminSignature: z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            version: string;
            adminSignature: Buffer;
            adminIdentity: string;
            requestDate: Date;
        }, {
            id: string;
            version: string;
            adminSignature: Buffer;
            adminIdentity: string;
            requestDate: Date;
        }>;
        result: z.ZodObject<{
            adminIdentity: z.ZodString;
            adminSignature: z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>;
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
    'Datastore.start': {
        args: z.ZodObject<{
            id: z.ZodString;
            dbxPath: z.ZodString;
            watch: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            id: string;
            dbxPath: string;
            watch: boolean;
        }, {
            id: string;
            dbxPath: string;
            watch: boolean;
        }>;
        result: z.ZodObject<{
            success: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
        }, {
            success: boolean;
        }>;
    };
    'Datastore.creditsBalance': {
        args: z.ZodObject<{
            id: z.ZodString;
            version: z.ZodString;
            creditId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            version: string;
            creditId: string;
        }, {
            id: string;
            version: string;
            creditId: string;
        }>;
        result: z.ZodObject<{
            issuedCredits: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
            balance: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
        }, "strip", z.ZodTypeAny, {
            balance: bigint;
            issuedCredits: bigint;
        }, {
            balance?: unknown;
            issuedCredits?: unknown;
        }>;
    };
    'Datastore.creditsIssued': {
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
            issuedCredits: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            count: number;
            issuedCredits: bigint;
        }, {
            count: number;
            issuedCredits?: unknown;
        }>;
    };
    'Datastore.admin': {
        args: z.ZodObject<{
            id: z.ZodString;
            version: z.ZodString;
            adminIdentity: z.ZodOptional<z.ZodString>;
            adminSignature: z.ZodOptional<z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>>;
            adminFunction: z.ZodObject<{
                ownerType: z.ZodEnum<["table", "crawler", "extractor", "datastore"]>;
                ownerName: z.ZodOptional<z.ZodString>;
                functionName: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                ownerType: "datastore" | "table" | "crawler" | "extractor";
                functionName: string;
                ownerName?: string | undefined;
            }, {
                ownerType: "datastore" | "table" | "crawler" | "extractor";
                functionName: string;
                ownerName?: string | undefined;
            }>;
            functionArgs: z.ZodArray<z.ZodAny, "many">;
        }, "strip", z.ZodTypeAny, {
            id: string;
            version: string;
            adminFunction: {
                ownerType: "datastore" | "table" | "crawler" | "extractor";
                functionName: string;
                ownerName?: string | undefined;
            };
            functionArgs: any[];
            adminSignature?: Buffer | undefined;
            adminIdentity?: string | undefined;
        }, {
            id: string;
            version: string;
            adminFunction: {
                ownerType: "datastore" | "table" | "crawler" | "extractor";
                functionName: string;
                ownerName?: string | undefined;
            };
            functionArgs: any[];
            adminSignature?: Buffer | undefined;
            adminIdentity?: string | undefined;
        }>;
        result: z.ZodAny;
    };
    'Datastore.meta': {
        args: z.ZodObject<{
            id: z.ZodString;
            version: z.ZodString;
            includeSchemasAsJson: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            version: string;
            includeSchemasAsJson?: boolean | undefined;
        }, {
            id: string;
            version: string;
            includeSchemasAsJson?: boolean | undefined;
        }>;
        result: z.ZodObject<z.objectUtil.extendShape<z.objectUtil.extendShape<{
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
        }>, {
            stats: z.ZodObject<{
                queries: z.ZodNumber;
                errors: z.ZodNumber;
                totalSpend: z.ZodBigInt;
                totalCreditSpend: z.ZodBigInt;
                averageBytesPerQuery: z.ZodNumber;
                maxBytesPerQuery: z.ZodNumber;
                averageMilliseconds: z.ZodNumber;
                maxMilliseconds: z.ZodNumber;
                averageTotalPricePerQuery: z.ZodBigInt;
                maxPricePerQuery: z.ZodBigInt;
            }, "strip", z.ZodTypeAny, {
                queries: number;
                errors: number;
                totalSpend: bigint;
                totalCreditSpend: bigint;
                averageBytesPerQuery: number;
                maxBytesPerQuery: number;
                averageMilliseconds: number;
                maxMilliseconds: number;
                averageTotalPricePerQuery: bigint;
                maxPricePerQuery: bigint;
            }, {
                queries: number;
                errors: number;
                totalSpend: bigint;
                totalCreditSpend: bigint;
                averageBytesPerQuery: number;
                maxBytesPerQuery: number;
                averageMilliseconds: number;
                maxMilliseconds: number;
                averageTotalPricePerQuery: bigint;
                maxPricePerQuery: bigint;
            }>;
            extractorsByName: z.ZodRecord<z.ZodString, z.ZodObject<{
                description: z.ZodOptional<z.ZodString>;
                stats: z.ZodObject<{
                    queries: z.ZodNumber;
                    errors: z.ZodNumber;
                    totalSpend: z.ZodBigInt;
                    totalCreditSpend: z.ZodBigInt;
                    averageBytesPerQuery: z.ZodNumber;
                    maxBytesPerQuery: z.ZodNumber;
                    averageMilliseconds: z.ZodNumber;
                    maxMilliseconds: z.ZodNumber;
                    averageTotalPricePerQuery: z.ZodBigInt;
                    maxPricePerQuery: z.ZodBigInt;
                }, "strip", z.ZodTypeAny, {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                }, {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                }>;
                netBasePrice: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
                schemaAsJson: z.ZodOptional<z.ZodAny>;
                priceBreakdown: z.ZodArray<z.ZodObject<{
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
                }>, "many">;
            }, "strip", z.ZodTypeAny, {
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                netBasePrice: bigint;
                priceBreakdown: {
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
                }[];
                description?: string | undefined;
                schemaAsJson?: any;
            }, {
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                priceBreakdown: {
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
                }[];
                description?: string | undefined;
                schemaAsJson?: any;
                netBasePrice?: unknown;
            }>>;
            crawlersByName: z.ZodRecord<z.ZodString, z.ZodObject<{
                description: z.ZodOptional<z.ZodString>;
                stats: z.ZodObject<{
                    queries: z.ZodNumber;
                    errors: z.ZodNumber;
                    totalSpend: z.ZodBigInt;
                    totalCreditSpend: z.ZodBigInt;
                    averageBytesPerQuery: z.ZodNumber;
                    maxBytesPerQuery: z.ZodNumber;
                    averageMilliseconds: z.ZodNumber;
                    maxMilliseconds: z.ZodNumber;
                    averageTotalPricePerQuery: z.ZodBigInt;
                    maxPricePerQuery: z.ZodBigInt;
                }, "strip", z.ZodTypeAny, {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                }, {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                }>;
                netBasePrice: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
                schemaAsJson: z.ZodOptional<z.ZodAny>;
                priceBreakdown: z.ZodArray<z.ZodObject<{
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
                }>, "many">;
            }, "strip", z.ZodTypeAny, {
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                netBasePrice: bigint;
                priceBreakdown: {
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
                }[];
                description?: string | undefined;
                schemaAsJson?: any;
            }, {
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                priceBreakdown: {
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
                }[];
                description?: string | undefined;
                schemaAsJson?: any;
                netBasePrice?: unknown;
            }>>;
            tablesByName: z.ZodRecord<z.ZodString, z.ZodObject<{
                description: z.ZodOptional<z.ZodString>;
                stats: z.ZodObject<{
                    queries: z.ZodNumber;
                    errors: z.ZodNumber;
                    totalSpend: z.ZodBigInt;
                    totalCreditSpend: z.ZodBigInt;
                    averageBytesPerQuery: z.ZodNumber;
                    maxBytesPerQuery: z.ZodNumber;
                    averageMilliseconds: z.ZodNumber;
                    maxMilliseconds: z.ZodNumber;
                    averageTotalPricePerQuery: z.ZodBigInt;
                    maxPricePerQuery: z.ZodBigInt;
                }, "strip", z.ZodTypeAny, {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                }, {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                }>;
                netBasePrice: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
                schemaAsJson: z.ZodOptional<z.ZodAny>;
                priceBreakdown: z.ZodArray<z.ZodObject<{
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
                }>, "many">;
            }, "strip", z.ZodTypeAny, {
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                netBasePrice: bigint;
                priceBreakdown: {
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
                }[];
                description?: string | undefined;
                schemaAsJson?: any;
            }, {
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                priceBreakdown: {
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
                }[];
                description?: string | undefined;
                schemaAsJson?: any;
                netBasePrice?: unknown;
            }>>;
            schemaInterface: z.ZodOptional<z.ZodString>;
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
        }>, "strip", z.ZodTypeAny, {
            id: string;
            version: string;
            versionTimestamp: number;
            scriptHash: string;
            adminIdentities: string[];
            scriptEntrypoint: string;
            coreVersion: string;
            extractorsByName: Record<string, {
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                netBasePrice: bigint;
                priceBreakdown: {
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
                }[];
                description?: string | undefined;
                schemaAsJson?: any;
            }>;
            crawlersByName: Record<string, {
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                netBasePrice: bigint;
                priceBreakdown: {
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
                }[];
                description?: string | undefined;
                schemaAsJson?: any;
            }>;
            tablesByName: Record<string, {
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                netBasePrice: bigint;
                priceBreakdown: {
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
                }[];
                description?: string | undefined;
                schemaAsJson?: any;
            }>;
            latestVersion: string;
            isStarted: boolean;
            stats: {
                queries: number;
                errors: number;
                totalSpend: bigint;
                totalCreditSpend: bigint;
                averageBytesPerQuery: number;
                maxBytesPerQuery: number;
                averageMilliseconds: number;
                maxMilliseconds: number;
                averageTotalPricePerQuery: bigint;
                maxPricePerQuery: bigint;
            };
            description?: string | undefined;
            name?: string | undefined;
            domain?: string | undefined;
            storageEngineHost?: string | undefined;
            schemaInterface?: string | undefined;
            payment?: {
                notaryId: number;
                chain: import("@argonprotocol/localchain").Chain;
                genesisHash: string;
                address: string;
            } | undefined;
        }, {
            id: string;
            version: string;
            versionTimestamp: number;
            scriptHash: string;
            adminIdentities: string[];
            scriptEntrypoint: string;
            coreVersion: string;
            extractorsByName: Record<string, {
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                priceBreakdown: {
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
                }[];
                description?: string | undefined;
                schemaAsJson?: any;
                netBasePrice?: unknown;
            }>;
            crawlersByName: Record<string, {
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                priceBreakdown: {
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
                }[];
                description?: string | undefined;
                schemaAsJson?: any;
                netBasePrice?: unknown;
            }>;
            tablesByName: Record<string, {
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                priceBreakdown: {
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
                }[];
                description?: string | undefined;
                schemaAsJson?: any;
                netBasePrice?: unknown;
            }>;
            latestVersion: string;
            isStarted: boolean;
            stats: {
                queries: number;
                errors: number;
                totalSpend: bigint;
                totalCreditSpend: bigint;
                averageBytesPerQuery: number;
                maxBytesPerQuery: number;
                averageMilliseconds: number;
                maxMilliseconds: number;
                averageTotalPricePerQuery: bigint;
                maxPricePerQuery: bigint;
            };
            description?: string | undefined;
            name?: string | undefined;
            domain?: string | undefined;
            storageEngineHost?: string | undefined;
            schemaInterface?: string | undefined;
            payment?: {
                notaryId: number;
                chain: import("@argonprotocol/localchain").Chain;
                genesisHash: string;
                address: string;
            } | undefined;
        }>;
    };
    'Datastore.stream': {
        args: z.ZodObject<z.objectUtil.extendShape<{
            id: z.ZodString;
            version: z.ZodString;
            queryId: z.ZodString;
            authentication: z.ZodOptional<z.ZodObject<{
                identity: z.ZodString;
                signature: z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>;
                nonce: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                signature: Buffer;
                identity: string;
                nonce: string;
            }, {
                signature: Buffer;
                identity: string;
                nonce: string;
            }>>;
            affiliateId: z.ZodOptional<z.ZodString>;
            payment: z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<{
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
            }>>;
        }, {
            name: z.ZodString;
            input: z.ZodOptional<z.ZodAny>;
        }>, "strip", z.ZodTypeAny, {
            id: string;
            version: string;
            name: string;
            queryId: string;
            input?: any;
            authentication?: {
                signature: Buffer;
                identity: string;
                nonce: string;
            } | undefined;
            affiliateId?: string | undefined;
            payment?: {
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
            } | undefined;
        }, {
            id: string;
            version: string;
            name: string;
            queryId: string;
            input?: any;
            authentication?: {
                signature: Buffer;
                identity: string;
                nonce: string;
            } | undefined;
            affiliateId?: string | undefined;
            payment?: {
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
            } | undefined;
        }>;
        result: z.ZodObject<{
            latestVersion: z.ZodString;
            runError: z.ZodOptional<z.ZodType<Error, z.ZodTypeDef, Error>>;
            outputs: z.ZodArray<z.ZodOptional<z.ZodAny>, "many">;
            metadata: z.ZodObject<{
                microgons: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
                bytes: z.ZodNumber;
                milliseconds: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                microgons: bigint;
                bytes: number;
                milliseconds: number;
            }, {
                bytes: number;
                milliseconds: number;
                microgons?: unknown;
            }>;
        }, "strip", z.ZodTypeAny, {
            latestVersion: string;
            outputs: any[];
            metadata: {
                microgons: bigint;
                bytes: number;
                milliseconds: number;
            };
            runError?: Error | undefined;
        }, {
            latestVersion: string;
            outputs: any[];
            metadata: {
                bytes: number;
                milliseconds: number;
                microgons?: unknown;
            };
            runError?: Error | undefined;
        }>;
    };
    'Datastore.query': {
        args: z.ZodObject<z.objectUtil.extendShape<{
            id: z.ZodString;
            version: z.ZodString;
            queryId: z.ZodString;
            authentication: z.ZodOptional<z.ZodObject<{
                identity: z.ZodString;
                signature: z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>;
                nonce: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                signature: Buffer;
                identity: string;
                nonce: string;
            }, {
                signature: Buffer;
                identity: string;
                nonce: string;
            }>>;
            affiliateId: z.ZodOptional<z.ZodString>;
            payment: z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<{
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
            }>>;
        }, {
            sql: z.ZodString;
            boundValues: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
        }>, "strip", z.ZodTypeAny, {
            id: string;
            version: string;
            queryId: string;
            sql: string;
            authentication?: {
                signature: Buffer;
                identity: string;
                nonce: string;
            } | undefined;
            affiliateId?: string | undefined;
            payment?: {
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
            } | undefined;
            boundValues?: any[] | undefined;
        }, {
            id: string;
            version: string;
            queryId: string;
            sql: string;
            authentication?: {
                signature: Buffer;
                identity: string;
                nonce: string;
            } | undefined;
            affiliateId?: string | undefined;
            payment?: {
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
            } | undefined;
            boundValues?: any[] | undefined;
        }>;
        result: z.ZodObject<{
            latestVersion: z.ZodString;
            runError: z.ZodOptional<z.ZodType<Error, z.ZodTypeDef, Error>>;
            outputs: z.ZodArray<z.ZodOptional<z.ZodAny>, "many">;
            metadata: z.ZodObject<{
                microgons: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
                bytes: z.ZodNumber;
                milliseconds: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                microgons: bigint;
                bytes: number;
                milliseconds: number;
            }, {
                bytes: number;
                milliseconds: number;
                microgons?: unknown;
            }>;
        }, "strip", z.ZodTypeAny, {
            latestVersion: string;
            outputs: any[];
            metadata: {
                microgons: bigint;
                bytes: number;
                milliseconds: number;
            };
            runError?: Error | undefined;
        }, {
            latestVersion: string;
            outputs: any[];
            metadata: {
                bytes: number;
                milliseconds: number;
                microgons?: unknown;
            };
            runError?: Error | undefined;
        }>;
    };
    'Datastore.createStorageEngine': {
        args: z.ZodObject<{
            version: z.ZodObject<{
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
            previousVersion: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
            }>>>;
        }, "strip", z.ZodTypeAny, {
            version: {
                compressedDbx: Buffer;
                adminSignature?: Buffer | undefined;
                adminIdentity?: string | undefined;
            };
            previousVersion?: {
                compressedDbx: Buffer;
                adminSignature?: Buffer | undefined;
                adminIdentity?: string | undefined;
            } | null | undefined;
        }, {
            version: {
                compressedDbx: Buffer;
                adminSignature?: Buffer | undefined;
                adminIdentity?: string | undefined;
            };
            previousVersion?: {
                compressedDbx: Buffer;
                adminSignature?: Buffer | undefined;
                adminIdentity?: string | undefined;
            } | null | undefined;
        }>;
        result: z.ZodObject<{
            success: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
        }, {
            success: boolean;
        }>;
    };
    'Datastore.queryStorageEngine': {
        args: z.ZodObject<z.objectUtil.extendShape<{
            id: z.ZodString;
            version: z.ZodString;
            queryId: z.ZodString;
            authentication: z.ZodOptional<z.ZodObject<{
                identity: z.ZodString;
                signature: z.ZodEffects<z.ZodType<Buffer, z.ZodTypeDef, Buffer>, Buffer, Buffer>;
                nonce: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                signature: Buffer;
                identity: string;
                nonce: string;
            }, {
                signature: Buffer;
                identity: string;
                nonce: string;
            }>>;
            affiliateId: z.ZodOptional<z.ZodString>;
            payment: z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<{
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
            }>>;
        }, {
            sql: z.ZodString;
            boundValues: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
            virtualEntitiesByName: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
                parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
                records: z.ZodArray<z.ZodAny, "many">;
            }, "strip", z.ZodTypeAny, {
                records: any[];
                parameters?: Record<string, any> | undefined;
            }, {
                records: any[];
                parameters?: Record<string, any> | undefined;
            }>>>;
        }>, "strip", z.ZodTypeAny, {
            id: string;
            version: string;
            queryId: string;
            sql: string;
            authentication?: {
                signature: Buffer;
                identity: string;
                nonce: string;
            } | undefined;
            affiliateId?: string | undefined;
            payment?: {
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
            } | undefined;
            boundValues?: any[] | undefined;
            virtualEntitiesByName?: Record<string, {
                records: any[];
                parameters?: Record<string, any> | undefined;
            }> | undefined;
        }, {
            id: string;
            version: string;
            queryId: string;
            sql: string;
            authentication?: {
                signature: Buffer;
                identity: string;
                nonce: string;
            } | undefined;
            affiliateId?: string | undefined;
            payment?: {
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
            } | undefined;
            boundValues?: any[] | undefined;
            virtualEntitiesByName?: Record<string, {
                records: any[];
                parameters?: Record<string, any> | undefined;
            }> | undefined;
        }>;
        result: z.ZodObject<{
            latestVersion: z.ZodString;
            runError: z.ZodOptional<z.ZodType<Error, z.ZodTypeDef, Error>>;
            outputs: z.ZodArray<z.ZodOptional<z.ZodAny>, "many">;
            metadata: z.ZodObject<{
                microgons: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
                bytes: z.ZodNumber;
                milliseconds: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                microgons: bigint;
                bytes: number;
                milliseconds: number;
            }, {
                bytes: number;
                milliseconds: number;
                microgons?: unknown;
            }>;
        }, "strip", z.ZodTypeAny, {
            latestVersion: string;
            outputs: any[];
            metadata: {
                microgons: bigint;
                bytes: number;
                milliseconds: number;
            };
            runError?: Error | undefined;
        }, {
            latestVersion: string;
            outputs: any[];
            metadata: {
                bytes: number;
                milliseconds: number;
                microgons?: unknown;
            };
            runError?: Error | undefined;
        }>;
    };
    'Datastores.list': {
        args: z.ZodObject<{
            offset: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            offset: number;
        }, {
            offset?: number | undefined;
        }>;
        result: z.ZodObject<{
            datastores: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                version: z.ZodString;
                versionTimestamp: z.ZodNumber;
                name: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                domain: z.ZodOptional<z.ZodString>;
                isStarted: z.ZodBoolean;
                scriptEntrypoint: z.ZodString;
                stats: z.ZodObject<{
                    queries: z.ZodNumber;
                    errors: z.ZodNumber;
                    totalSpend: z.ZodBigInt;
                    totalCreditSpend: z.ZodBigInt;
                    averageBytesPerQuery: z.ZodNumber;
                    maxBytesPerQuery: z.ZodNumber;
                    averageMilliseconds: z.ZodNumber;
                    maxMilliseconds: z.ZodNumber;
                    averageTotalPricePerQuery: z.ZodBigInt;
                    maxPricePerQuery: z.ZodBigInt;
                }, "strip", z.ZodTypeAny, {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                }, {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                }>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                version: string;
                versionTimestamp: number;
                scriptEntrypoint: string;
                isStarted: boolean;
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                description?: string | undefined;
                name?: string | undefined;
                domain?: string | undefined;
            }, {
                id: string;
                version: string;
                versionTimestamp: number;
                scriptEntrypoint: string;
                isStarted: boolean;
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                description?: string | undefined;
                name?: string | undefined;
                domain?: string | undefined;
            }>, "many">;
            total: z.ZodNumber;
            offset: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            offset: number;
            datastores: {
                id: string;
                version: string;
                versionTimestamp: number;
                scriptEntrypoint: string;
                isStarted: boolean;
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                description?: string | undefined;
                name?: string | undefined;
                domain?: string | undefined;
            }[];
            total: number;
        }, {
            offset: number;
            datastores: {
                id: string;
                version: string;
                versionTimestamp: number;
                scriptEntrypoint: string;
                isStarted: boolean;
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
                description?: string | undefined;
                name?: string | undefined;
                domain?: string | undefined;
            }[];
            total: number;
        }>;
    };
    'Datastore.versions': {
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
                timestamp: z.ZodEffects<z.ZodNumber, number, number>;
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
    'Datastore.stats': {
        args: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        result: z.ZodObject<{
            byVersion: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                type: z.ZodEnum<["Table", "Extractor", "Crawler"]>;
                stats: z.ZodObject<{
                    queries: z.ZodNumber;
                    errors: z.ZodNumber;
                    totalSpend: z.ZodBigInt;
                    totalCreditSpend: z.ZodBigInt;
                    averageBytesPerQuery: z.ZodNumber;
                    maxBytesPerQuery: z.ZodNumber;
                    averageMilliseconds: z.ZodNumber;
                    maxMilliseconds: z.ZodNumber;
                    averageTotalPricePerQuery: z.ZodBigInt;
                    maxPricePerQuery: z.ZodBigInt;
                }, "strip", z.ZodTypeAny, {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                }, {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                }>;
            }, "strip", z.ZodTypeAny, {
                type: "Table" | "Extractor" | "Crawler";
                name: string;
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
            }, {
                type: "Table" | "Extractor" | "Crawler";
                name: string;
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
            }>, "many">;
            overall: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                type: z.ZodEnum<["Table", "Extractor", "Crawler"]>;
                stats: z.ZodObject<{
                    queries: z.ZodNumber;
                    errors: z.ZodNumber;
                    totalSpend: z.ZodBigInt;
                    totalCreditSpend: z.ZodBigInt;
                    averageBytesPerQuery: z.ZodNumber;
                    maxBytesPerQuery: z.ZodNumber;
                    averageMilliseconds: z.ZodNumber;
                    maxMilliseconds: z.ZodNumber;
                    averageTotalPricePerQuery: z.ZodBigInt;
                    maxPricePerQuery: z.ZodBigInt;
                }, "strip", z.ZodTypeAny, {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                }, {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                }>;
            }, "strip", z.ZodTypeAny, {
                type: "Table" | "Extractor" | "Crawler";
                name: string;
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
            }, {
                type: "Table" | "Extractor" | "Crawler";
                name: string;
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            byVersion: {
                type: "Table" | "Extractor" | "Crawler";
                name: string;
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
            }[];
            overall: {
                type: "Table" | "Extractor" | "Crawler";
                name: string;
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
            }[];
        }, {
            byVersion: {
                type: "Table" | "Extractor" | "Crawler";
                name: string;
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
            }[];
            overall: {
                type: "Table" | "Extractor" | "Crawler";
                name: string;
                stats: {
                    queries: number;
                    errors: number;
                    totalSpend: bigint;
                    totalCreditSpend: bigint;
                    averageBytesPerQuery: number;
                    maxBytesPerQuery: number;
                    averageMilliseconds: number;
                    maxMilliseconds: number;
                    averageTotalPricePerQuery: bigint;
                    maxPricePerQuery: bigint;
                };
            }[];
        }>;
    };
};
type IDatastoreApiTypes = IZodSchemaToApiTypes<typeof DatastoreApiSchemas>;
export type IDatastoreEntityStats = z.infer<typeof EntityStatsSchema>;
export type IDatastoreQueryMetadata = z.infer<typeof DatastoreQueryMetadataSchema>;
export type IDatastoreMetadataResult = z.infer<typeof DatastoreMetadataResult>;
export type IDatastoreQueryResult = z.infer<typeof DatastoreQueryResultSchema>;
export default IDatastoreApiTypes;
