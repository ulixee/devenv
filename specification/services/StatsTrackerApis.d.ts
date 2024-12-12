import { z } from 'zod';
import { IZodHandlers, IZodSchemaToApiTypes } from '../utils/IZodApi';
export declare const StatsTrackerApiSchemas: {
    'StatsTracker.getByVersion': {
        args: z.ZodObject<{
            datastoreId: z.ZodString;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            version: string;
            datastoreId: string;
        }, {
            version: string;
            datastoreId: string;
        }>;
        result: z.ZodObject<{
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
            statsByEntityName: z.ZodRecord<z.ZodString, z.ZodObject<{
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
            }>>;
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
            statsByEntityName: Record<string, {
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
            statsByEntityName: Record<string, {
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
        }>;
    };
    'StatsTracker.get': {
        args: z.ZodObject<{
            datastoreId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            datastoreId: string;
        }, {
            datastoreId: string;
        }>;
        result: z.ZodObject<{
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
            statsByEntityName: z.ZodRecord<z.ZodString, z.ZodObject<{
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
            }>>;
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
            statsByEntityName: Record<string, {
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
            statsByEntityName: Record<string, {
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
        }>;
    };
    'StatsTracker.getSummary': {
        args: z.ZodObject<{
            datastoreId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            datastoreId: string;
        }, {
            datastoreId: string;
        }>;
        result: z.ZodObject<{
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
    };
    'StatsTracker.recordEntityStats': {
        args: z.ZodObject<{
            datastoreId: z.ZodString;
            version: z.ZodString;
            cloudNodeHost: z.ZodString;
            cloudNodeIdentity: z.ZodOptional<z.ZodString>;
            entityName: z.ZodOptional<z.ZodString>;
            error: z.ZodOptional<z.ZodType<Error, z.ZodTypeDef, Error>>;
            bytes: z.ZodNumber;
            microgons: z.ZodBigInt;
            milliseconds: z.ZodNumber;
            didUseCredits: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            microgons: bigint;
            version: string;
            datastoreId: string;
            bytes: number;
            milliseconds: number;
            cloudNodeHost: string;
            didUseCredits: boolean;
            cloudNodeIdentity?: string | undefined;
            entityName?: string | undefined;
            error?: Error | undefined;
        }, {
            microgons: bigint;
            version: string;
            datastoreId: string;
            bytes: number;
            milliseconds: number;
            cloudNodeHost: string;
            didUseCredits: boolean;
            cloudNodeIdentity?: string | undefined;
            entityName?: string | undefined;
            error?: Error | undefined;
        }>;
        result: z.ZodObject<{
            success: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
        }, {
            success: boolean;
        }>;
    };
    'StatsTracker.recordQuery': {
        args: z.ZodObject<{
            datastoreId: z.ZodString;
            version: z.ZodString;
            queryId: z.ZodString;
            cloudNodeHost: z.ZodString;
            cloudNodeIdentity: z.ZodOptional<z.ZodString>;
            query: z.ZodString;
            startTime: z.ZodNumber;
            input: z.ZodAny;
            outputs: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
            error: z.ZodOptional<z.ZodType<Error, z.ZodTypeDef, Error>>;
            channelHoldId: z.ZodOptional<z.ZodString>;
            creditId: z.ZodOptional<z.ZodString>;
            affiliateId: z.ZodOptional<z.ZodString>;
            heroSessionIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            bytes: z.ZodNumber;
            microgons: z.ZodBigInt;
            milliseconds: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            microgons: bigint;
            version: string;
            datastoreId: string;
            bytes: number;
            milliseconds: number;
            queryId: string;
            cloudNodeHost: string;
            query: string;
            startTime: number;
            input?: any;
            channelHoldId?: string | undefined;
            outputs?: any[] | undefined;
            affiliateId?: string | undefined;
            creditId?: string | undefined;
            cloudNodeIdentity?: string | undefined;
            error?: Error | undefined;
            heroSessionIds?: string[] | undefined;
        }, {
            microgons: bigint;
            version: string;
            datastoreId: string;
            bytes: number;
            milliseconds: number;
            queryId: string;
            cloudNodeHost: string;
            query: string;
            startTime: number;
            input?: any;
            channelHoldId?: string | undefined;
            outputs?: any[] | undefined;
            affiliateId?: string | undefined;
            creditId?: string | undefined;
            cloudNodeIdentity?: string | undefined;
            error?: Error | undefined;
            heroSessionIds?: string[] | undefined;
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
export type IStatsTrackerApiTypes = IZodSchemaToApiTypes<typeof StatsTrackerApiSchemas>;
export type IStatsTrackerApis<TContext = any> = IZodHandlers<typeof StatsTrackerApiSchemas, TContext>;
export default IStatsTrackerApiTypes;
