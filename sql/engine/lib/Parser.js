"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedCommandType = void 0;
const sql_ast_1 = require("@ulixee/sql-ast");
var SupportedCommandType;
(function (SupportedCommandType) {
    SupportedCommandType["insert"] = "insert";
    SupportedCommandType["select"] = "select";
    SupportedCommandType["update"] = "update";
    SupportedCommandType["delete"] = "delete";
})(SupportedCommandType || (exports.SupportedCommandType = SupportedCommandType = {}));
class SqlParser {
    constructor(sql, limitedTo = {}, replaceTableNames = {}) {
        this.limitedTo = {};
        this.limitedTo = limitedTo;
        const cleaner = (0, sql_ast_1.astMapper)(map => ({
            tableRef(t) {
                if (limitedTo.table && t.name === 'self') {
                    t.name = limitedTo.table;
                }
                if (replaceTableNames[t.name]) {
                    t.name = replaceTableNames[t.name];
                }
                return map.super().tableRef(t);
            },
            call(t) {
                if (limitedTo.function && t.function.name === 'self') {
                    t.function.name = limitedTo.function;
                }
                return map.super().call(t);
            },
        }));
        this.ast = cleaner.statement((0, sql_ast_1.parseFirst)(sql));
    }
    get tableNames() {
        const names = new Set();
        const visitor = (0, sql_ast_1.astVisitor)(() => ({
            tableRef: t => names.add(t.name),
        }));
        visitor.statement(this.ast);
        return Array.from(names);
    }
    get functionNames() {
        const names = new Set();
        const visitor = (0, sql_ast_1.astVisitor)(() => ({
            call: t => names.add(t.function.name),
        }));
        visitor.statement(this.ast);
        return Array.from(names);
    }
    get commandType() {
        return this.ast.type;
    }
    hasReturn() {
        let hasReturning = false;
        const visitor = (0, sql_ast_1.astVisitor)(() => ({
            insert(t) {
                hasReturning = t.returning?.length > 0;
                return t;
            },
            update(t) {
                hasReturning = t.returning?.length > 0;
                return t;
            },
            delete(t) {
                hasReturning = t.returning?.length > 0;
                return t;
            },
        }));
        visitor.statement(this.ast);
        return hasReturning;
    }
    toSql() {
        return sql_ast_1.toSql.statement(this.ast);
    }
    isSelect() {
        return this.ast.type === 'select';
    }
    isInsert() {
        return this.ast.type === 'insert';
    }
    isUpdate() {
        return this.ast.type === 'update';
    }
    isDelete() {
        return this.ast.type === 'delete';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extractTableQuery(tableName, _boundValues) {
        // const input: any = {}
        // let columns: string[];
        // const visitor = astVisitor(() => ({
        //   fromTable(t) {
        //     // TODO: how do you pull out the right sql for this?
        //   }
        // }));
        // visitor.statement(this.ast);
        // return input;
        return { sql: `SELECT * FROM ${tableName}`, args: [] };
    }
    extractCalls() {
        const names = [];
        const visitor = (0, sql_ast_1.astVisitor)(() => ({
            tableRef: t => names.push(t.name),
            call: t => names.push(t.function.name),
        }));
        visitor.statement(this.ast);
        return names;
    }
    extractTableCalls() {
        const names = [];
        const visitor = (0, sql_ast_1.astVisitor)(() => ({
            tableRef: t => names.push(t.name),
        }));
        visitor.statement(this.ast);
        return names;
    }
    extractFunctionCallInputs(boundValues) {
        const inputByFunction = {};
        const limitedToFunction = this.limitedTo?.function;
        const visitor = (0, sql_ast_1.astVisitor)(() => ({
            call(t) {
                if (limitedToFunction && limitedToFunction !== t.function.name) {
                    throw new Error(`function does not exist: ${t.function.name}`);
                }
                inputByFunction[t.function.name] = {};
                for (const arg of t.args) {
                    if (arg.type === 'parameter') {
                        const argIndex = Number(arg.name.replace('$', '')) - 1;
                        if (Number.isNaN(argIndex) || argIndex > boundValues.length) {
                            throw new Error(`Error parsing function inputs. Trying to convert arg (${arg.name}) to an index ${argIndex}.`);
                        }
                        inputByFunction[t.function.name][arg.key] = boundValues[argIndex];
                    }
                    else {
                        inputByFunction[t.function.name][arg.key] = arg.value;
                    }
                }
            },
        }));
        visitor.statement(this.ast);
        return inputByFunction;
    }
}
exports.default = SqlParser;
//# sourceMappingURL=Parser.js.map