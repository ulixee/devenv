type IDbTypes = {
    string: string;
    number: number;
    boolean: boolean;
    bigint: bigint;
    object: object;
    array: [];
    buffer: Buffer;
    date: Date;
    record: Record<string, IDbTypes>;
};
export type IDbTypeNames = keyof IDbTypes;
export type IDbJsTypes = IDbTypes[IDbTypeNames];
export default IDbTypes;
