"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../testing/helpers");
const toSql_1 = require("../../lib/toSql");
describe('Expressions', () => {
    // ====================================
    // =============== VALUES =============
    // ====================================
    describe('Comments', () => {
        (0, helpers_1.checkTreeExpr)(['2 /* yo */ + 2', '2 +/* yo */ 2', '2+-- yo \n2', '2-- yo \n+2', '2+-- yo \n  \n2'], {
            type: 'binary',
            op: '+',
            left: { type: 'integer', value: 2 },
            right: { type: 'integer', value: 2 },
        });
    });
    // ====================================
    // =============== VALUES =============
    // ====================================
    describe('Simple values & arithmetic precedence', () => {
        (0, helpers_1.checkTreeExpr)(['42'], {
            type: 'integer',
            value: 42,
        });
        (0, helpers_1.checkTreeExprLoc)(['(42)'], {
            _location: { start: 1, end: 3 },
            type: 'integer',
            value: 42,
        });
        (0, helpers_1.checkTreeExpr)(['0.5', '.5'], {
            type: 'numeric',
            value: 0.5,
        });
        (0, helpers_1.checkTreeExpr)(['-0.5', '-.5'], {
            type: 'numeric',
            value: -0.5,
        });
        (0, helpers_1.checkTreeExpr)(['-42.', '-42.0'], {
            type: 'numeric',
            value: -42,
        });
        (0, helpers_1.checkInvalidExpr)('42. 51');
        (0, helpers_1.checkInvalidExpr)('42.-51');
        (0, helpers_1.checkTreeExprLoc)(['null'], {
            _location: { start: 0, end: 4 },
            type: 'null',
        });
        (0, helpers_1.checkTreeExpr)(['true'], {
            type: 'boolean',
            value: true,
        });
        (0, helpers_1.checkTreeExprLoc)(['(true)'], {
            _location: { start: 1, end: 5 },
            type: 'boolean',
            value: true,
        });
        (0, helpers_1.checkTreeExpr)(['false'], {
            type: 'boolean',
            value: false,
        });
        (0, helpers_1.checkTreeExprLoc)(['(false)'], {
            _location: { start: 1, end: 6 },
            type: 'boolean',
            value: false,
        });
        (0, helpers_1.checkTreeExprLoc)([`'test'`], {
            _location: { start: 0, end: 6 },
            type: 'string',
            value: 'test',
        });
        (0, helpers_1.checkTreeExpr)([`'te''st'`], {
            type: 'string',
            value: `te'st`,
        });
        (0, helpers_1.checkTreeExpr)([`E'escaped'`], {
            type: 'string',
            value: `escaped`,
        });
        (0, helpers_1.checkTreeExpr)([`E'new
line'`], {
            type: 'string',
            value: `new
line`,
        });
        (0, helpers_1.checkTreeExpr)([`E'some\\twide\ttabs'`], {
            type: 'string',
            value: `some\twide\ttabs`,
        });
        (0, helpers_1.checkTreeExpr)([`E'new\\nline'`], {
            type: 'string',
            value: `new
line`,
        });
        (0, helpers_1.checkTreeExpr)([`E'new\\\\
line'`], {
            type: 'string',
            value: `new\\
line`,
        });
        (0, helpers_1.checkTreeExpr)([`E'new\\
line'`], {
            type: 'string',
            value: `new
line`,
        });
        (0, helpers_1.checkTreeExpr)([`E'"double quote"'`], {
            type: 'string',
            value: `"double quote"`,
        });
        (0, helpers_1.checkTreeExpr)([`E'single''quote'`], {
            type: 'string',
            value: `single'quote`,
        });
        (0, helpers_1.checkTreeExpr)([`E'"antislash"\\\\
"return"\\n
"quote" ''
"tab"\t\\t'`], {
            type: 'string',
            value: `"antislash"\\
"return"

"quote" '
"tab"\t\t`,
        });
        (0, helpers_1.checkTreeExpr)([`'te"s\\\\t'`], {
            type: 'string',
            value: `te"s\\\\t`,
        });
        (0, helpers_1.checkTreeExpr)([`'te\\n\\tst'`], {
            type: 'string',
            value: `te\\n\\tst`,
        });
        (0, helpers_1.checkTreeExpr)('*', {
            type: 'ref',
            name: '*',
        });
        (0, helpers_1.checkTreeExpr)('a.*', {
            type: 'ref',
            table: { name: 'a' },
            name: '*',
        });
        (0, helpers_1.checkTreeExpr)('a.b', {
            type: 'ref',
            table: { name: 'a' },
            name: 'b',
        });
        (0, helpers_1.checkTreeExpr)('a.b.c', {
            type: 'ref',
            table: { name: 'b', schema: 'a' },
            name: 'c',
        });
        (0, helpers_1.checkTreeExpr)([`a->>'b'`], {
            type: 'member',
            op: '->>',
            member: 'b',
            operand: {
                type: 'ref',
                name: 'a',
            }
        });
        (0, helpers_1.checkTreeExprLoc)([`a ->> 'b'`], {
            _location: { start: 0, end: 9 },
            type: 'member',
            op: '->>',
            member: 'b',
            operand: {
                _location: { start: 0, end: 1 },
                type: 'ref',
                name: 'a',
            }
        });
        (0, helpers_1.checkTreeExpr)([`t.a->'b'`, `t."a" -> 'b'`], {
            type: 'member',
            op: '->',
            member: 'b',
            operand: {
                type: 'ref',
                name: 'a',
                table: { name: 't' },
            }
        });
        (0, helpers_1.checkTreeExpr)([`data::jsonb->'b'`, `("data"::jsonb)->'b'`, `("data")::jsonb->'b'`, `(data::jsonb) -> 'b'`], {
            type: 'member',
            op: '->',
            member: 'b',
            operand: {
                type: 'cast',
                to: { name: 'jsonb' },
                operand: {
                    type: 'ref',
                    name: 'data',
                }
            }
        });
        (0, helpers_1.checkTreeExpr)([`data::jsonb->'b'::json`, `((data::jsonb) -> 'b')::json`], {
            type: 'cast',
            to: { name: 'json' },
            operand: {
                type: 'member',
                op: '->',
                member: 'b',
                operand: {
                    type: 'cast',
                    to: { name: 'jsonb' },
                    operand: {
                        type: 'ref',
                        name: 'data',
                    }
                }
            }
        });
        (0, helpers_1.checkTreeExprLoc)(`ARRAY[1, '2']`, {
            _location: { start: 0, end: 13 },
            type: 'array',
            expressions: [
                {
                    _location: { start: 6, end: 7 },
                    type: 'integer', value: 1,
                },
                {
                    _location: { start: 9, end: 12 },
                    type: 'string', value: '2'
                },
            ]
        });
        (0, helpers_1.checkTreeExprLoc)(`ARRAY[]`, {
            _location: { start: 0, end: 7 },
            type: 'array',
            expressions: []
        });
        (0, helpers_1.checkTreeExpr)(`ARRAY[['a', 'b']]`, {
            type: 'array',
            expressions: [{
                    type: 'array',
                    expressions: [{
                            type: 'string',
                            value: 'a',
                        }, {
                            type: 'string',
                            value: 'b',
                        }]
                }]
        });
        (0, helpers_1.checkTreeExpr)(`ARRAY[ARRAY['a', 'b']]`, {
            type: 'array',
            expressions: [{
                    type: 'array',
                    expressions: [{
                            type: 'string',
                            value: 'a',
                        }, {
                            type: 'string',
                            value: 'b',
                        }]
                }]
        });
        (0, helpers_1.checkTreeExpr)(`ARRAY[['a'], ['b']]`, {
            type: 'array',
            expressions: [{
                    type: 'array',
                    expressions: [{
                            type: 'string',
                            value: 'a',
                        }]
                }, {
                    type: 'array',
                    expressions: [{
                            type: 'string',
                            value: 'b',
                        }]
                }]
        });
        (0, helpers_1.checkInvalidExpr)(`ARRAY[ARRAY['a'], ['b']]`);
        (0, helpers_1.checkInvalidExpr)(`ARRAY[['a'], ARRAY['b']]`);
        (0, helpers_1.checkTreeExpr)(`a->>42`, {
            type: 'member',
            op: '->>',
            member: 42,
            operand: {
                type: 'ref',
                name: 'a',
            }
        });
        (0, helpers_1.checkTreeExpr)(`a#>>b`, {
            type: 'binary',
            op: '#>>',
            left: {
                type: 'ref',
                name: 'a',
            },
            right: {
                type: 'ref',
                name: 'b',
            },
        });
        (0, helpers_1.checkTreeExpr)(`a->>-1`, {
            type: 'member',
            op: '->>',
            member: -1,
            operand: {
                type: 'ref',
                name: 'a',
            }
        });
        (0, helpers_1.checkTreeExpr)(`a.b->-1`, {
            type: 'member',
            op: '->',
            member: -1,
            operand: {
                type: 'ref',
                name: 'b',
                table: { name: 'a' },
            }
        });
        (0, helpers_1.checkTreeExpr)(['42.', '42.0'], {
            type: 'numeric',
            value: 42,
        });
        (0, helpers_1.checkTreeExpr)(['.42', '0.42'], {
            type: 'numeric',
            value: .42,
        });
        (0, helpers_1.checkTreeExpr)(['42+51', '42 + 51'], {
            type: 'binary',
            op: '+',
            left: {
                type: 'integer',
                value: 42,
            },
            right: {
                type: 'integer',
                value: 51,
            }
        });
        (0, helpers_1.checkTreeExpr)(['42*51', '42 * 51'], {
            type: 'binary',
            op: '*',
            left: {
                type: 'integer',
                value: 42,
            },
            right: {
                type: 'integer',
                value: 51,
            }
        });
        (0, helpers_1.checkTreeExpr)('42 + 51 - 30', {
            type: 'binary',
            op: '-',
            left: {
                type: 'binary',
                op: '+',
                left: {
                    type: 'integer',
                    value: 42,
                },
                right: {
                    type: 'integer',
                    value: 51,
                }
            },
            right: {
                type: 'integer',
                value: 30,
            },
        });
        (0, helpers_1.checkTreeExpr)('2 + 3 * 4', {
            type: 'binary',
            op: '+',
            left: {
                type: 'integer',
                value: 2,
            },
            right: {
                type: 'binary',
                op: '*',
                left: {
                    type: 'integer',
                    value: 3,
                },
                right: {
                    type: 'integer',
                    value: 4,
                }
            }
        });
        (0, helpers_1.checkTreeExpr)('2 * 3 + 4', {
            type: 'binary',
            op: '+',
            left: {
                type: 'binary',
                op: '*',
                left: {
                    type: 'integer',
                    value: 2,
                },
                right: {
                    type: 'integer',
                    value: 3,
                }
            },
            right: {
                type: 'integer',
                value: 4,
            },
        });
        (0, helpers_1.checkTreeExpr)('2. * .3 + 4.5', {
            type: 'binary',
            op: '+',
            left: {
                type: 'binary',
                op: '*',
                left: {
                    type: 'numeric',
                    value: 2,
                },
                right: {
                    type: 'numeric',
                    value: 0.3,
                }
            },
            right: {
                type: 'numeric',
                value: 4.5,
            },
        });
        (0, helpers_1.checkTreeExpr)(['2 * (3 + 4)', '2*(3+4)'], {
            type: 'binary',
            op: '*',
            left: {
                type: 'integer',
                value: 2,
            },
            right: {
                type: 'binary',
                op: '+',
                left: {
                    type: 'integer',
                    value: 3,
                },
                right: {
                    type: 'integer',
                    value: 4,
                }
            },
        });
    });
    // ====================================
    // =============== LOGIC ==============
    // ====================================
    describe('Logic', () => {
        (0, helpers_1.checkTreeExpr)(['a and b OR c', '"a"AND"b"or"c"', '"a"and "b"or "c"'], {
            type: 'binary',
            op: 'OR',
            left: {
                type: 'binary',
                op: 'AND',
                left: { type: 'ref', name: 'a' },
                right: { type: 'ref', name: 'b' },
            },
            right: { type: 'ref', name: 'c' }
        });
        (0, helpers_1.checkTreeExpr)(['a or b AND c', '"a"OR"b"and"c"', '"a"or "b"and "c"'], {
            type: 'binary',
            op: 'OR',
            left: { type: 'ref', name: 'a' },
            right: {
                type: 'binary',
                op: 'AND',
                left: { type: 'ref', name: 'b' },
                right: { type: 'ref', name: 'c' },
            },
        });
        (0, helpers_1.checkTreeExprLoc)('a.b or c', {
            _location: { start: 0, end: 8 },
            type: 'binary',
            op: 'OR',
            left: {
                _location: { start: 0, end: 3 },
                type: 'ref',
                table: {
                    _location: { start: 0, end: 1 },
                    name: 'a'
                },
                name: 'b',
            },
            right: {
                _location: { start: 7, end: 8 },
                type: 'ref',
                name: 'c'
            },
        });
    });
    // ====================================
    // =============== CASTS ==============
    // ====================================
    describe('Cast', () => {
        (0, helpers_1.checkTreeExpr)(['a + b::jsonb', 'a + b::JSONB'], {
            type: 'binary',
            op: '+',
            left: {
                type: 'ref',
                name: 'a',
            },
            right: {
                type: 'cast',
                to: { name: 'jsonb' },
                operand: {
                    type: 'ref',
                    name: 'b',
                },
            },
        });
        (0, helpers_1.checkTreeExpr)(`'1'::double precision`, {
            type: 'cast',
            operand: { type: 'string', value: '1' },
            to: { name: 'double precision' },
        });
        (0, helpers_1.checkTreeExpr)(`CAST('1' AS INTEGER)`, {
            type: 'cast',
            operand: { type: 'string', value: '1' },
            to: { name: 'integer' },
        });
        (0, helpers_1.checkTreeExpr)(`CAST('1' AS DOUBLE PRECISION)`, {
            type: 'cast',
            operand: { type: 'string', value: '1' },
            to: { name: 'double precision' },
        });
        (0, helpers_1.checkTreeExprLoc)(`ARRAY[]::text[]`, {
            _location: { start: 0, end: 15 },
            type: 'cast',
            to: {
                _location: { start: 9, end: 15 },
                kind: 'array',
                arrayOf: {
                    _location: { start: 9, end: 13 },
                    name: 'text',
                }
            },
            operand: {
                _location: { start: 0, end: 7 },
                type: 'array',
                expressions: []
            },
        });
        (0, helpers_1.checkTreeExprLoc)(`timestamp 'value'`, {
            _location: { start: 0, end: 17 },
            type: 'cast',
            to: {
                _location: { start: 0, end: 9 },
                name: 'timestamp',
            },
            operand: {
                _location: { start: 10, end: 17 },
                type: 'string',
                value: 'value',
            },
        });
        (0, helpers_1.checkTreeExpr)(`time 'value'`, {
            type: 'cast',
            to: { name: 'time' },
            operand: {
                type: 'string',
                value: 'value'
            },
        });
        (0, helpers_1.checkTreeExpr)(`interval 'value'`, {
            type: 'cast',
            to: { name: 'interval' },
            operand: { type: 'string', value: 'value' },
        });
        (0, helpers_1.checkTreeExpr)(['"a"+"b"::"JSONB"'], {
            type: 'binary',
            op: '+',
            left: {
                type: 'ref',
                name: 'a',
            },
            right: {
                type: 'cast',
                to: { name: 'JSONB', doubleQuoted: true },
                operand: {
                    type: 'ref',
                    name: 'b',
                },
            },
        });
        (0, helpers_1.checkTreeExpr)(['(a + b)::"jsonb"'], {
            type: 'cast',
            to: { name: 'jsonb', doubleQuoted: true },
            operand: {
                type: 'binary',
                op: '+',
                left: {
                    type: 'ref',
                    name: 'a',
                },
                right: {
                    type: 'ref',
                    name: 'b',
                }
            },
        });
        (0, helpers_1.checkTreeExpr)(['(a + b)::jsonb'], {
            type: 'cast',
            to: { name: 'jsonb' },
            operand: {
                type: 'binary',
                op: '+',
                left: {
                    type: 'ref',
                    name: 'a',
                },
                right: {
                    type: 'ref',
                    name: 'b',
                }
            },
        });
        (0, helpers_1.checkTreeExpr)(`('now'::text)::timestamp(4) with time zone`, {
            type: 'cast',
            to: {
                name: 'timestamp with time zone',
                config: [4],
            },
            operand: {
                type: 'cast',
                to: { name: 'text' },
                operand: { type: 'string', value: 'now' },
            },
        });
    });
    // ====================================
    // =============== UNARIES ============
    // ====================================
    describe('Unaries', () => {
        (0, helpers_1.checkTreeExprLoc)(['not e and b'], {
            _location: { start: 0, end: 11 },
            type: 'binary',
            op: 'AND',
            left: {
                _location: { start: 0, end: 5 },
                type: 'unary',
                op: 'NOT',
                operand: {
                    _location: { start: 4, end: 5 },
                    type: 'ref', name: 'e'
                },
            },
            right: {
                _location: { start: 10, end: 11 },
                type: 'ref', name: 'b'
            },
        });
        (0, helpers_1.checkTreeExpr)(['NOT"e"and"b"'], {
            type: 'binary',
            op: 'AND',
            left: {
                type: 'unary',
                op: 'NOT',
                operand: { type: 'ref', name: 'e' },
            },
            right: { type: 'ref', name: 'b' },
        });
        (0, helpers_1.checkInvalidExpr)('"*"');
        (0, helpers_1.checkInvalidExpr)('(*)');
        (0, helpers_1.checkTreeExpr)(['not a is null', 'not"a"is null', 'not a isnull', 'not"a"isnull'], {
            type: 'unary',
            op: 'NOT',
            operand: {
                type: 'unary',
                op: 'IS NULL',
                operand: { type: 'ref', name: 'a' }
            }
        });
        (0, helpers_1.checkTreeExpr)(['a is not null', 'a notnull', '"a"notnull'], {
            type: 'unary',
            op: 'IS NOT NULL',
            operand: { type: 'ref', name: 'a' }
        });
        (0, helpers_1.checkTreeExpr)(['a is null is null', '(a is null) is null', 'a isnull isnull', '(a isnull) isnull', 'a is null isnull', 'a isnull is null'], {
            type: 'unary',
            op: 'IS NULL',
            operand: {
                type: 'unary',
                op: 'IS NULL',
                operand: { type: 'ref', name: 'a' },
            }
        });
        (0, helpers_1.checkTreeExpr)(['a is false is true'], {
            type: 'unary',
            op: 'IS TRUE',
            operand: {
                type: 'unary',
                op: 'IS FALSE',
                operand: { type: 'ref', name: 'a' },
            }
        });
        (0, helpers_1.checkTreeExpr)(['a is not false is not true'], {
            type: 'unary',
            op: 'IS NOT TRUE',
            operand: {
                type: 'unary',
                op: 'IS NOT FALSE',
                operand: { type: 'ref', name: 'a' },
            }
        });
        (0, helpers_1.checkTreeExpr)(['+a', '+ a', '+"a"'], {
            type: 'unary',
            op: '+',
            operand: { type: 'ref', name: 'a' }
        });
        (0, helpers_1.checkTreeExpr)(['-a', '- a', '-"a"'], {
            type: 'unary',
            op: '-',
            operand: { type: 'ref', name: 'a' }
        });
        (0, helpers_1.checkTreeExpr)('operator(pg_catalog.-) a', {
            type: 'unary',
            op: '-',
            opSchema: 'pg_catalog',
            operand: { type: 'ref', name: 'a' }
        });
    });
    // ====================================
    // ============== BINARIES ============
    // ====================================
    describe('Binaries', () => {
        (0, helpers_1.checkTreeExpr)(['a > b', 'a>b', '"a">"b"'], {
            type: 'binary',
            op: '>',
            left: { type: 'ref', name: 'a' },
            right: { type: 'ref', name: 'b' },
        });
        (0, helpers_1.checkTreeExpr)(['a like b', '"a"LIKE"b"', 'a ~~ b', 'a~~b'], {
            type: 'binary',
            op: 'LIKE',
            left: { type: 'ref', name: 'a' },
            right: { type: 'ref', name: 'b' },
        });
        (0, helpers_1.checkTreeExpr)(['a not like b', 'a!~~b', '"a"not LIKE"b"'], {
            type: 'binary',
            op: 'NOT LIKE',
            left: { type: 'ref', name: 'a' },
            right: { type: 'ref', name: 'b' },
        });
        (0, helpers_1.checkTreeExpr)(['a ilike b', 'a~~*b'], {
            type: 'binary',
            op: 'ILIKE',
            left: { type: 'ref', name: 'a' },
            right: { type: 'ref', name: 'b' },
        });
        (0, helpers_1.checkTreeExpr)(['a not ilike b', 'a!~~*b'], {
            type: 'binary',
            op: 'NOT ILIKE',
            left: { type: 'ref', name: 'a' },
            right: { type: 'ref', name: 'b' },
        });
        (0, helpers_1.checkTreeExpr)(['a in b', '"a"IN"b"'], {
            type: 'binary',
            op: 'IN',
            left: { type: 'ref', name: 'a' },
            right: { type: 'ref', name: 'b' },
        });
        (0, helpers_1.checkTreeExpr)(['a not in b', '"a"NOT IN"b"'], {
            type: 'binary',
            op: 'NOT IN',
            left: { type: 'ref', name: 'a' },
            right: { type: 'ref', name: 'b' },
        });
        (0, helpers_1.checkTreeExpr)(['a = b', '"a"="b"'], {
            type: 'binary',
            op: '=',
            left: { type: 'ref', name: 'a' },
            right: { type: 'ref', name: 'b' },
        });
        (0, helpers_1.checkTreeExpr)([`$1 ~ '.*'`], {
            type: 'binary',
            op: '~',
            left: { type: 'parameter', name: '$1' },
            right: { type: 'string', value: '.*' },
        });
        (0, helpers_1.checkTreeExpr)([`$1 ~* '.*'`], {
            type: 'binary',
            op: '~*',
            left: { type: 'parameter', name: '$1' },
            right: { type: 'string', value: '.*' },
        });
        (0, helpers_1.checkTreeExpr)([`$1 !~ '.*'`], {
            type: 'binary',
            op: '!~',
            left: { type: 'parameter', name: '$1' },
            right: { type: 'string', value: '.*' },
        });
        (0, helpers_1.checkTreeExpr)([`$1 !~* '.*'`], {
            type: 'binary',
            op: '!~*',
            left: { type: 'parameter', name: '$1' },
            right: { type: 'string', value: '.*' },
        });
        (0, helpers_1.checkTreeExpr)(['a != b', '"a"!="b"', 'a<>b'], {
            type: 'binary',
            op: '!=',
            left: { type: 'ref', name: 'a' },
            right: { type: 'ref', name: 'b' },
        });
        (0, helpers_1.checkTreeExpr)(['(a, b, c)', '( a , b, c )'], {
            type: 'list',
            expressions: [
                { type: 'ref', name: 'a' },
                { type: 'ref', name: 'b' },
                { type: 'ref', name: 'c' },
            ]
        });
        (0, helpers_1.checkTreeExpr)(['a in (a, b, c)', 'a in ( a , b, c )'], {
            type: 'binary',
            op: 'IN',
            left: { type: 'ref', name: 'a' },
            right: {
                type: 'list',
                expressions: [
                    { type: 'ref', name: 'a' },
                    { type: 'ref', name: 'b' },
                    { type: 'ref', name: 'c' },
                ]
            },
        });
        it('does not wrap list expressions in parenthesis', () => {
            const generated = toSql_1.toSql.expr({
                type: 'binary',
                op: 'IN',
                left: { type: 'ref', name: 'a' },
                right: {
                    type: 'list',
                    expressions: [
                        { type: 'ref', name: 'a' },
                        { type: 'ref', name: 'b' },
                        { type: 'ref', name: 'c' },
                    ]
                },
            });
            expect(generated).toBe('(a IN (a, b, c))');
        });
        (0, helpers_1.checkTreeExpr)(['a in (b)', 'a in ( b )'], {
            type: 'binary',
            op: 'IN',
            left: { type: 'ref', name: 'a' },
            right: { type: 'ref', name: 'b' },
        });
        (0, helpers_1.checkTreeExpr)(['a^b', '"a"^"b"', 'a ^ b'], {
            type: 'binary',
            op: '^',
            left: { type: 'ref', name: 'a' },
            right: { type: 'ref', name: 'b' },
        });
        (0, helpers_1.checkTreeExpr)(['a&b'], {
            type: 'binary',
            op: '&',
            left: { type: 'ref', name: 'a' },
            right: { type: 'ref', name: 'b' },
        });
        (0, helpers_1.checkTreeExpr)(['a>>b'], {
            type: 'binary',
            op: '>>',
            left: { type: 'ref', name: 'a' },
            right: { type: 'ref', name: 'b' },
        });
        (0, helpers_1.checkTreeExpr)(`a operator(pg_catalog.+) b`, {
            type: 'binary',
            op: '+',
            opSchema: 'pg_catalog',
            left: { type: 'ref', name: 'a' },
            right: { type: 'ref', name: 'b' },
        });
    });
    // ====================================
    // =============== TERNARIES ==========
    // ====================================
    describe('Ternaries', () => {
        // === RANGE: between
        (0, helpers_1.checkTreeExpr)(['"a"between"b"and 42'], {
            type: 'ternary',
            op: 'BETWEEN',
            value: { type: 'ref', name: 'a' },
            lo: { type: 'ref', name: 'b' },
            hi: { type: 'integer', value: 42 },
        });
        (0, helpers_1.checkTreeExprLoc)(['a between b and 42'], {
            _location: { start: 0, end: 18 },
            type: 'ternary',
            op: 'BETWEEN',
            value: {
                _location: { start: 0, end: 1 },
                type: 'ref', name: 'a'
            },
            lo: {
                _location: { start: 10, end: 11 },
                type: 'ref', name: 'b'
            },
            hi: {
                _location: { start: 16, end: 18 },
                type: 'integer', value: 42
            },
        });
        (0, helpers_1.checkTreeExpr)(['a not between b and 42', 'a not     between b and 42', '"a"not between"b"and 42'], {
            type: 'ternary',
            op: 'NOT BETWEEN',
            value: { type: 'ref', name: 'a' },
            lo: { type: 'ref', name: 'b' },
            hi: { type: 'integer', value: 42 },
        });
        // SUBSTRING FROM-FOR
        (0, helpers_1.checkTreeExprLoc)(`substring('val' from 2 for 3)`, {
            _location: { start: 0, end: 29 },
            type: 'substring',
            value: {
                _location: { start: 10, end: 15 },
                type: 'string', value: 'val'
            },
            from: {
                _location: { start: 21, end: 22 },
                type: 'integer', value: 2,
            },
            for: {
                _location: { start: 27, end: 28 },
                type: 'integer', value: 3
            },
        });
        (0, helpers_1.checkTreeExpr)(`substring('val' from 2)`, {
            type: 'substring',
            value: { type: 'string', value: 'val' },
            from: { type: 'integer', value: 2 },
        });
        (0, helpers_1.checkTreeExpr)(`substring('val' for 2)`, {
            type: 'substring',
            value: { type: 'string', value: 'val' },
            for: { type: 'integer', value: 2 },
        });
        // OVERLAY
        (0, helpers_1.checkTreeExpr)(`overlay('12345678' placing 'ab' from 2 for 4)`, {
            type: 'overlay',
            value: { type: 'string', value: '12345678' },
            placing: { type: 'string', value: 'ab' },
            from: { type: 'integer', value: 2 },
            for: { type: 'integer', value: 4 },
        });
        (0, helpers_1.checkTreeExprLoc)(`overlay('12345678' placing 'ab' from 2)`, {
            _location: { start: 0, end: 39 },
            type: 'overlay',
            value: {
                _location: { start: 8, end: 18 },
                type: 'string', value: '12345678'
            },
            placing: {
                _location: { start: 27, end: 31 },
                type: 'string', value: 'ab'
            },
            from: {
                _location: { start: 37, end: 38 },
                type: 'integer', value: 2
            },
        });
        (0, helpers_1.checkInvalid)(`overlay('12345678' placing 'ab' for 4)`);
        (0, helpers_1.checkInvalid)(`overlay('12345678' from 2 for 4)`);
    });
    // ====================================
    // =============== MEMBERS ============
    // ====================================
    describe('Member access', () => {
        (0, helpers_1.checkTreeExprLoc)(['a.b[c]'], {
            _location: { start: 0, end: 6 },
            type: 'arrayIndex',
            array: {
                _location: { start: 0, end: 3 },
                type: 'ref',
                table: {
                    _location: { start: 0, end: 1 },
                    name: 'a'
                },
                name: 'b',
            },
            index: {
                _location: { start: 4, end: 5 },
                type: 'ref', name: 'c'
            }
        });
        (0, helpers_1.checkTreeExpr)(['a . b[c]', 'a."b"["c"]', '(("a"."b")[("c")] )'], {
            type: 'arrayIndex',
            array: {
                type: 'ref',
                table: { name: 'a' },
                name: 'b',
            },
            index: { type: 'ref', name: 'c' }
        });
        (0, helpers_1.checkTreeExpr)(['a[c+2]', '"a"["c"+2]', '(("a")[("c"+2)] )'], {
            type: 'arrayIndex',
            array: {
                type: 'ref',
                name: 'a',
            },
            index: {
                type: 'binary',
                op: '+',
                left: { type: 'ref', name: 'c' },
                right: { type: 'integer', value: 2 },
            }
        });
    });
    // ====================================
    // ============== FUNCTIONS ===========
    // ====================================
    describe('Function calls', () => {
        (0, helpers_1.checkTreeExpr)(['ab (c)', '"ab"( "c" )', 'AB(c)'], {
            type: 'call',
            function: { name: 'ab' },
            args: [{ type: 'ref', name: 'c' }],
        });
        (0, helpers_1.checkTreeExprLoc)('"ab" ( "c" )', {
            _location: { start: 0, end: 12 },
            type: 'call',
            function: {
                _location: { start: 0, end: 4 },
                name: 'ab'
            },
            args: [{
                    _location: { start: 7, end: 10 },
                    type: 'ref',
                    name: 'c'
                }],
        });
        (0, helpers_1.checkTreeExprLoc)([`any(c)`], {
            _location: { start: 0, end: 6 },
            type: 'call',
            function: {
                _location: { start: 0, end: 3 },
                name: 'any'
            },
            args: [{
                    _location: { start: 4, end: 5 },
                    type: 'ref',
                    name: 'c'
                }],
        });
        (0, helpers_1.checkTreeExprLoc)([`some(c)`], {
            _location: { start: 0, end: 7 },
            type: 'call',
            function: {
                _location: { start: 0, end: 4 },
                name: 'some'
            },
            args: [{
                    _location: { start: 5, end: 6 },
                    type: 'ref',
                    name: 'c'
                }],
        });
        (0, helpers_1.checkTreeExprLoc)([`all(c)`], {
            _location: { start: 0, end: 6 },
            type: 'call',
            function: {
                _location: { start: 0, end: 3 },
                name: 'all'
            },
            args: [{
                    _location: { start: 4, end: 5 },
                    type: 'ref',
                    name: 'c'
                }],
        });
        (0, helpers_1.checkTreeExprLoc)([`now()`], {
            _location: { start: 0, end: 5 },
            type: 'call',
            function: {
                _location: { start: 0, end: 3 },
                name: 'now'
            },
            args: [],
        });
        (0, helpers_1.checkTreeExprLoc)([`pg_catalog.col_description(23208,4)`], {
            _location: { start: 0, end: 35 },
            type: 'call',
            function: {
                _location: { start: 0, end: 26 },
                name: 'col_description',
                schema: 'pg_catalog'
            },
            args: [{
                    _location: { start: 27, end: 32 },
                    type: 'integer',
                    value: 23208,
                }, {
                    _location: { start: 33, end: 34 },
                    type: 'integer',
                    value: 4,
                }]
        });
        (0, helpers_1.checkTreeExpr)([`pg_catalog.set_config('search_path', '', false)`], {
            type: 'call',
            function: { name: 'set_config', schema: 'pg_catalog' },
            args: [{
                    type: 'string',
                    value: 'search_path',
                }, {
                    type: 'string',
                    value: '',
                }, {
                    type: 'boolean',
                    value: false,
                }]
        });
        (0, helpers_1.checkTreeExpr)([`extract (century from timestamp 'value')`], {
            type: 'extract',
            field: { name: 'century' },
            from: {
                type: 'cast',
                to: { name: 'timestamp' },
                operand: { type: 'string', value: 'value' },
            },
        });
        (0, helpers_1.checkTreeExprLoc)([`EXTRACT (CENTURY FROM 'value'::TIMESTAMP)`], {
            _location: { start: 0, end: 41 },
            type: 'extract',
            field: {
                _location: { start: 9, end: 16 },
                name: 'century'
            },
            from: {
                _location: { start: 22, end: 40 },
                type: 'cast',
                to: {
                    _location: { start: 31, end: 40 },
                    name: 'timestamp',
                },
                operand: {
                    _location: { start: 22, end: 29 },
                    type: 'string',
                    value: 'value',
                },
            },
        });
    });
    // ====================================
    // ================ CASE ==============
    // ====================================
    describe('Case expression', () => {
        (0, helpers_1.checkTreeExprLoc)(['case a when b then 1 end'], {
            _location: { start: 0, end: 24 },
            type: 'case',
            value: {
                _location: { start: 5, end: 6 },
                type: 'ref', name: 'a'
            },
            whens: [
                {
                    _location: { start: 7, end: 20 },
                    when: {
                        _location: { start: 12, end: 13 },
                        type: 'ref', name: 'b'
                    },
                    value: {
                        _location: { start: 19, end: 20 },
                        type: 'integer', value: 1
                    }
                }
            ],
        });
        (0, helpers_1.checkTreeExpr)(['case when b then 1 end'], {
            type: 'case',
            whens: [{ when: { type: 'ref', name: 'b' }, value: { type: 'integer', value: 1 } }],
        });
        (0, helpers_1.checkTreeExprLoc)(['case when b then 1 else 2 end'], {
            _location: { start: 0, end: 29 },
            type: 'case',
            whens: [{
                    _location: { start: 5, end: 18 },
                    when: {
                        _location: { start: 10, end: 11 },
                        type: 'ref', name: 'b'
                    },
                    value: {
                        _location: { start: 17, end: 18 },
                        type: 'integer', value: 1
                    }
                }],
            else: {
                _location: { start: 24, end: 25 },
                type: 'integer', value: 2
            },
        });
        // bugfix (was taking E'FALSE' as an escaped string)
        (0, helpers_1.checkTreeExpr)([`case when b then 1 ELSE'FALSE' end`], {
            type: 'case',
            whens: [{
                    when: { type: 'ref', name: 'b' },
                    value: { type: 'integer', value: 1 }
                }],
            else: {
                type: 'string',
                value: 'FALSE',
            }
        });
    });
    // ====================================
    // ============= SUBSELCT =============
    // ====================================
    describe('Selection expressions', () => {
        (0, helpers_1.checkTreeExprLoc)(['a = any(select * from tbl)'], {
            _location: { start: 0, end: 26 },
            type: 'binary',
            op: '=',
            left: {
                _location: { start: 0, end: 1 },
                type: 'ref', name: 'a',
            },
            right: {
                _location: { start: 4, end: 26 },
                type: 'call',
                function: {
                    _location: { start: 4, end: 7 },
                    name: 'any'
                },
                args: [{
                        _location: { start: 8, end: 25 },
                        type: 'select',
                        columns: [{
                                _location: { start: 15, end: 16 },
                                expr: {
                                    _location: { start: 15, end: 16 },
                                    type: 'ref', name: '*'
                                }
                            }],
                        from: [{
                                _location: { start: 22, end: 25 },
                                type: 'table',
                                name: {
                                    _location: { start: 22, end: 25 },
                                    name: 'tbl'
                                },
                            }],
                    }]
            }
        });
        (0, helpers_1.checkTreeExpr)(['a in (select * from tb)'], {
            type: 'binary',
            op: 'IN',
            left: { type: 'ref', name: 'a' },
            right: {
                type: 'select',
                columns: [helpers_1.starCol],
                from: [(0, helpers_1.tbl)('tb')],
            }
        });
        (0, helpers_1.checkTreeExpr)(`array( select 1 )`, {
            type: 'array select',
            select: {
                type: 'select',
                columns: [{ expr: { type: 'integer', value: 1 } }],
            },
        });
    });
    describe('Aggregation expressions', () => {
        (0, helpers_1.checkTreeExpr)(`count(*)`, {
            type: 'call',
            args: [helpers_1.star],
            function: { name: 'count' },
        });
        (0, helpers_1.checkTreeExpr)(`count(ALL *)`, {
            type: 'call',
            args: [helpers_1.star],
            function: { name: 'count' },
            distinct: 'all',
        });
        (0, helpers_1.checkTreeExpr)(`count(DISTINCT *)`, {
            type: 'call',
            args: [helpers_1.star],
            function: { name: 'count' },
            distinct: 'distinct',
        });
        (0, helpers_1.checkTreeExpr)(`string_agg(distinct a, b)`, {
            type: 'call',
            args: [(0, helpers_1.ref)('a'), (0, helpers_1.ref)('b')],
            function: { name: 'string_agg' },
            distinct: 'distinct',
        });
        (0, helpers_1.checkTreeExpr)(`count(distinct (a, b))`, {
            type: 'call',
            args: [{
                    type: 'list',
                    expressions: [(0, helpers_1.ref)('a'), (0, helpers_1.ref)('b')],
                }],
            function: { name: 'count' },
            distinct: 'distinct',
        });
        (0, helpers_1.checkInvalidExpr)(`string_agg(distinct a, distinct  b)`);
        (0, helpers_1.checkTreeExpr)(`count(DISTINCT a, b)`, {
            type: 'call',
            args: [(0, helpers_1.ref)('a'), (0, helpers_1.ref)('b')],
            function: { name: 'count' },
            distinct: 'distinct',
        });
        (0, helpers_1.checkTreeExpr)(`count(*) filter (where val)`, {
            type: 'call',
            args: [helpers_1.star],
            function: { name: 'count' },
            filter: (0, helpers_1.ref)('val'),
        });
        (0, helpers_1.checkTreeExpr)(`ROW_NUMBER() OVER (ORDER BY v DESC)`, {
            type: 'call',
            args: [],
            function: { name: 'row_number' },
            over: {
                orderBy: [{ by: (0, helpers_1.ref)('v'), order: 'DESC' }],
            }
        });
        (0, helpers_1.checkTreeExpr)(`ROW_NUMBER() OVER (PARTITION BY v)`, {
            type: 'call',
            args: [],
            function: { name: 'row_number' },
            over: {
                partitionBy: [(0, helpers_1.ref)('v')],
            }
        });
        (0, helpers_1.checkTreeExpr)(`ROW_NUMBER() OVER ()`, {
            type: 'call',
            args: [],
            function: { name: 'row_number' },
            over: {}
        });
        (0, helpers_1.checkTreeExpr)(`ROW_NUMBER() OVER (PARTITION BY a ORDER BY b DESC)`, {
            type: 'call',
            args: [],
            function: { name: 'row_number' },
            over: {
                partitionBy: [(0, helpers_1.ref)('a')],
                orderBy: [{ by: (0, helpers_1.ref)('b'), order: 'DESC' }],
            }
        });
        (0, helpers_1.checkTreeExpr)(`pg_catalog.count(*) filter (where val)`, {
            type: 'call',
            args: [helpers_1.star],
            function: { name: 'count', schema: 'pg_catalog' },
            filter: (0, helpers_1.ref)('val'),
        });
        (0, helpers_1.checkInvalidExpr)(`count(*) filter where val`);
        (0, helpers_1.checkTreeExpr)(`count(a,b order by c) filter (where val)`, {
            type: 'call',
            function: { name: 'count' },
            args: [(0, helpers_1.ref)('a'), (0, helpers_1.ref)('b')],
            orderBy: [{ by: (0, helpers_1.ref)('c') }],
            filter: (0, helpers_1.ref)('val'),
        });
        (0, helpers_1.checkTreeExpr)(`count(a order by b, c)`, {
            type: 'call',
            function: { name: 'count' },
            args: [(0, helpers_1.ref)('a')],
            orderBy: [{ by: (0, helpers_1.ref)('b') }, { by: (0, helpers_1.ref)('c') }]
        });
        (0, helpers_1.checkTreeExpr)(`count(c order by o)`, {
            type: 'call',
            function: { name: 'count' },
            args: [(0, helpers_1.ref)('c')],
            orderBy: [{ by: (0, helpers_1.ref)('o') }]
        });
    });
    describe('Value keywords', () => {
        (0, helpers_1.checkTreeExprLoc)(['LOCALTIMESTAMP'], {
            _location: { start: 0, end: 14 },
            type: 'keyword',
            keyword: 'localtimestamp',
        });
        (0, helpers_1.checkTreeExprLoc)(['LOCALTIMESTAMP(5)'], {
            _location: { start: 0, end: 14 + 3 },
            type: 'call',
            function: {
                _location: { start: 0, end: 14 },
                name: 'localtimestamp',
            },
            args: [{
                    _location: { start: 15, end: 16 },
                    type: 'integer',
                    value: 5,
                }],
        });
        (0, helpers_1.checkTreeExprLoc)(['current_schema'], {
            _location: { start: 0, end: 14 },
            type: 'keyword',
            keyword: 'current_schema',
        });
        (0, helpers_1.checkTreeExprLoc)(['current_schema()'], {
            _location: { start: 0, end: 14 + 2 },
            type: 'call',
            function: {
                _location: { start: 0, end: 14 },
                name: 'current_schema',
            },
            args: [],
        });
    });
});
//# sourceMappingURL=expr.test.js.map