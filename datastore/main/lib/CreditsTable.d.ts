import { ExtractSchemaType } from '@ulixee/schema';
import Table from './Table';
export default class CreditsTable extends Table<typeof CreditsSchema> {
    static tableName: "ulx_credits";
    constructor();
    create(microgons: bigint, secret?: string): Promise<{
        id: string;
        secret: string;
        remainingCredits: bigint;
    }>;
    get(id: string): Promise<Omit<ICredit, 'salt' | 'secretHash'>>;
    summary(): Promise<{
        count: number;
        microgons: bigint;
    }>;
    debit(id: string, secret: string, amount: bigint): Promise<bigint>;
    finalize(id: string, refund: bigint): Promise<void>;
    private getUpstreamCreditLimit;
}
export declare const CreditsSchema: {
    id: import("@ulixee/schema/lib/StringSchema").default<false>;
    salt: import("@ulixee/schema/lib/StringSchema").default<false>;
    secretHash: import("@ulixee/schema/lib/BufferSchema").default<false>;
    issuedCredits: import("@ulixee/schema/lib/BigintSchema").default<false>;
    remainingCredits: import("@ulixee/schema/lib/BigintSchema").default<false>;
};
type ICredit = ExtractSchemaType<typeof CreditsSchema>;
export {};
