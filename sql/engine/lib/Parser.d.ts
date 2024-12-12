import { IStatement } from '@ulixee/sql-ast';
export declare enum SupportedCommandType {
    insert = "insert",
    select = "select",
    update = "update",
    delete = "delete"
}
type ISupportedCommandType = keyof typeof SupportedCommandType;
type ILimitedTo = {
    table?: string;
    function?: string;
};
export default class SqlParser {
    ast: IStatement;
    private limitedTo;
    constructor(sql: string, limitedTo?: ILimitedTo, replaceTableNames?: {
        [name: string]: string;
    });
    get tableNames(): string[];
    get functionNames(): string[];
    get commandType(): ISupportedCommandType;
    hasReturn(): boolean;
    toSql(): string;
    isSelect(): boolean;
    isInsert(): boolean;
    isUpdate(): boolean;
    isDelete(): boolean;
    extractTableQuery(tableName: string, _boundValues: any): {
        sql: string;
        args: any[];
    };
    extractCalls(): string[];
    extractTableCalls(): string[];
    extractFunctionCallInputs(boundValues: any[]): {
        [functionName: string]: any;
    };
}
export {};
