import { IAnySchemaJson } from '@ulixee/schema/interfaces/ISchemaJson';
import { IDbJsTypes } from '../interfaces/IDbTypes';
export default class SqlGenerator {
    static createWhereClause(tableName: string, filters: {
        [field: string]: any;
    }, fields?: string[], limit?: number): {
        sql: string;
        boundValues: IDbJsTypes[];
    };
    static createInsertsFromRecords(name: string, schema: Record<string, IAnySchemaJson>, ...records: Record<string, IDbJsTypes>[]): {
        sql: string;
        boundValues: IDbJsTypes[];
    }[];
}
