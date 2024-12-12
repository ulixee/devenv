"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./Parser");
class SqlGenerator {
    static createWhereClause(tableName, filters, fields = ['*'], limit = 1000) {
        filters ??= {};
        const where = Object.keys(filters).map((field, i) => `"${field}"=$${i + 1}`);
        const whereSql = where.length ? `WHERE ${where.join(', ')} ` : '';
        const sql = `SELECT ${fields.join(',')} from "${tableName}" ${whereSql}LIMIT ${limit}`;
        const sqlParser = new Parser_1.default(sql, { table: tableName });
        const unknownNames = sqlParser.tableNames.filter(x => x !== tableName);
        if (unknownNames.length) {
            throw new Error(`Table${unknownNames.length === 1 ? ' does' : 's do'} not exist: ${unknownNames.join(', ')}`);
        }
        return {
            sql: sqlParser.toSql(),
            boundValues: Object.values(filters),
        };
    }
    static createInsertsFromRecords(name, schema, ...records) {
        if (!records?.length)
            return [];
        return records.map(x => {
            const fields = Object.keys(x);
            const params = fields.map((_, i) => `$${i + 1}`);
            const sql = `INSERT INTO "${name}" (${fields.join(', ')}) VALUES (${params.join(', ')})`;
            return { sql, boundValues: Object.values(x) };
        });
    }
}
exports.default = SqlGenerator;
//# sourceMappingURL=Generator.js.map