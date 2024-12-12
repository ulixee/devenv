import { z } from 'zod';
export declare const DatastoreStatsSchema: z.ZodObject<{
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
type IDatastoreStats = z.infer<typeof DatastoreStatsSchema>;
export default IDatastoreStats;
