"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jest/expect-expect */
const parser_1 = require("../lib/parser");
const astMapper_1 = require("../lib/astMapper");
const toSql_1 = require("../lib/toSql");
const utils_1 = require("../lib/utils");
describe('Ast mapper', () => {
    function parse(str) {
        const ret = (0, parser_1.parse)(str);
        if (ret.length !== 1) {
            throw new Error('Expected single statement');
        }
        return ret[0];
    }
    function testExpr(statement, map, expr) {
        const toMap = parse(statement);
        const mapped = (0, astMapper_1.astMapper)(map).statement(toMap);
        expect(mapped).toEqual({
            type: 'select',
            columns: [{
                    expr
                }]
        });
    }
    function testExprs(statement, map, exprs) {
        const toMap = parse(statement);
        const mapped = (0, astMapper_1.astMapper)(map).statement(toMap);
        expect(mapped).toEqual({
            type: 'select',
            columns: exprs.map(expr => ({ expr })),
        });
    }
    it('maps a select constant', () => {
        testExpr('select 42', b => ({
            constant: c => (0, utils_1.assignChanged)(c, {
                value: 51,
            })
        }), {
            type: 'integer',
            value: 51
        });
    });
    it('maps binaries', () => {
        testExpr('select 42+51', b => ({
            binary: c => c.right
        }), {
            type: 'integer',
            value: 51
        });
    });
    it('maps unaries', () => {
        testExpr('select -b', b => ({
            unary: c => c.operand
        }), {
            type: 'ref',
            name: 'b',
        });
    });
    it('maps ternaries', () => {
        testExpr('select a between b and 42', b => ({
            ternary: c => c.hi
        }), {
            type: 'integer',
            value: 42
        });
    });
    it('maps array index', () => {
        testExpr('select a[42]', b => ({
            arrayIndex: c => c.index
        }), {
            type: 'integer',
            value: 42
        });
    });
    it('maps member', () => {
        testExpr(`select a->'b'`, b => ({
            member: c => c.operand,
        }), {
            type: 'ref',
            name: 'a',
        });
    });
    it('calls submap', () => {
        testExpr(`select a->'b'`, b => ({
            ref: c => (0, utils_1.assignChanged)(c, { name: 'foo' }),
            member: c => b.expr(c.operand),
        }), {
            type: 'ref',
            name: 'foo',
        });
    });
    it('maps case', () => {
        testExpr('select case a when b then 1 end', b => ({
            case: c => c.whens[0].when,
        }), {
            type: 'ref',
            name: 'b',
        });
    });
    it('maps cast', () => {
        testExpr('select a::jsonb', b => ({
            cast: c => c.operand
        }), {
            type: 'ref',
            name: 'a',
        });
    });
    it('maps call', () => {
        testExpr('select fn(a)', b => ({
            call: c => c.args[0],
        }), {
            type: 'ref',
            name: 'a',
        });
    });
    it('maps multiple calls', () => {
        testExprs('select fn(a), fn(b), fn(c)', () => ({
            call: c => c.args[0],
        }), [
            {
                type: 'ref',
                name: 'a',
            }, {
                type: 'ref',
                name: 'b',
            }, {
                type: 'ref',
                name: 'c',
            }
        ]);
    });
    it('maps array literal', () => {
        testExpr('select (a,b)', b => ({
            array: c => c.expressions[1],
        }), {
            type: 'ref',
            name: 'b',
        });
    });
    it('maps ref', () => {
        testExpr('select a', b => ({
            ref: x => (0, utils_1.assignChanged)(x, { name: 'foo' })
        }), {
            type: 'ref',
            name: 'foo',
        });
    });
    it('maps deep', () => {
        // create a mapper
        const mapper = (0, astMapper_1.astMapper)(map => ({
            tableRef: t => {
                if (t.name === 'foo') {
                    return {
                        // Dont do that... see below
                        // (I wrote this like that for the sake of explainability)
                        ...t,
                        name: 'bar',
                    };
                }
                // call the default implementation of 'tableRef'
                // this will ensure that the subtree is also traversed.
                return map.super().tableRef(t);
            }
        }));
        // parse + map + reconvert to sql
        const modified = mapper.statement((0, parser_1.parseFirst)('select * from foo'));
        expect(modified).toBeTruthy();
        expect(toSql_1.toSql.statement(modified)).toBe('SELECT *  FROM bar');
    });
    it('allows super call', () => {
        // create a mapper
        const mapper = (0, astMapper_1.astMapper)(map => ({
            tableRef: t => {
                const sup = map.super();
                return sup.tableRef(t);
            }
        }));
        // parse + map + reconvert to sql
        const modified = mapper.statement((0, parser_1.parseFirst)('select * from foo'));
        expect(modified).toBeTruthy();
        expect(toSql_1.toSql.statement(modified)).toEqual('SELECT *  FROM foo');
    });
    it('removes node', () => {
        // create a mapper
        const mapper = (0, astMapper_1.astMapper)(map => ({
            ref: c => c.name === 'foo' ? null : c,
        }));
        // process sql
        const result = mapper.statement((0, parser_1.parseFirst)('select foo, bar from test'));
        expect(toSql_1.toSql.statement(result)).toEqual('SELECT bar  FROM test');
    });
});
//# sourceMappingURL=astMapper.test.js.map