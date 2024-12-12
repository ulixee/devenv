"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("../lib/Parser");
test('extracts functions from SELECT', () => {
    const sqlParser = new Parser_1.default('SELECT * FROM funcName()');
    expect(sqlParser.functionNames).toEqual(['funcName']);
});
test('replace function alias "self" with name SELECT', () => {
    const sqlParser = new Parser_1.default('SELECT * FROM self()', { function: 'funcName' });
    expect(sqlParser.functionNames).toEqual(['funcName']);
});
test('extracts tables from SELECT', () => {
    const sqlParser = new Parser_1.default('SELECT * FROM tableName');
    expect(sqlParser.tableNames).toEqual(['tableName']);
});
test('replace table alias "self" with name', () => {
    const sqlParser = new Parser_1.default('SELECT * FROM self', { table: 'tableName' });
    expect(sqlParser.tableNames).toEqual(['tableName']);
});
test('toSql replaces table alias "self" with name', () => {
    const sqlParser = new Parser_1.default('SELECT * FROM self', { table: 'tableName' });
    expect(sqlParser.toSql()).toEqual('SELECT *  FROM "tableName"');
});
test('basic INSERT', async () => {
    const sqlParser = new Parser_1.default(`INSERT INTO this AS test (column1, column2) VALUES ('value1', 10)`);
    await expect(sqlParser.commandType).toBe(Parser_1.SupportedCommandType.insert);
});
test('basic SELECT', async () => {
    const sqlParser = new Parser_1.default('SELECT * FROM this');
    await expect(sqlParser.commandType).toBe(Parser_1.SupportedCommandType.select);
});
test('basic UPDATE', async () => {
    const sqlParser = new Parser_1.default(`UPDATE this SET column1='value2', column2=20`);
    await expect(sqlParser.commandType).toBe(Parser_1.SupportedCommandType.update);
});
test('basic DELETE', async () => {
    const sqlParser = new Parser_1.default('DELETE FROM this');
    await expect(sqlParser.commandType).toBe(Parser_1.SupportedCommandType.delete);
});
//# sourceMappingURL=basic.test.js.map