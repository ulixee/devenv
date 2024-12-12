"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.starCol = exports.star = void 0;
exports.checkSelect = checkSelect;
exports.checkInsert = checkInsert;
exports.checkInsertLoc = checkInsertLoc;
exports.checkDelete = checkDelete;
exports.checkUpdate = checkUpdate;
exports.checkStatement = checkStatement;
exports.checkInvalid = checkInvalid;
exports.checkValid = checkValid;
exports.checkInvalidExpr = checkInvalidExpr;
exports.checkTreeExpr = checkTreeExpr;
exports.checkTreeExprLoc = checkTreeExprLoc;
exports.columns = columns;
exports.checkInterval = checkInterval;
exports.col = col;
exports.ref = ref;
exports.binary = binary;
exports.name = name;
exports.qname = qname;
exports.int = int;
exports.tbl = tbl;
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jest/no-jasmine-globals */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jest/no-export */
const nearley_1 = require("nearley");
const main_1 = require("../syntax/compiled/main");
const utils_1 = require("../lib/utils");
const astMapper_1 = require("../lib/astMapper");
const toSql_1 = require("../lib/toSql");
const parser_1 = require("../lib/parser");
const IntervalUtils_1 = require("../lib/helpers/IntervalUtils");
const lexer_1 = require("../lib/helpers/lexer");
function checkSelect(value, expected) {
    checkTree(value, expected, (p, m) => m.statement(p));
}
function checkInsert(value, expected) {
    checkTree(value, expected, (p, m) => m.statement(p));
}
function checkInsertLoc(value, expected) {
    checkTree(value, expected, (p, m) => m.statement(p), undefined, true);
}
function checkDelete(value, expected) {
    checkTree(value, expected, (p, m) => m.statement(p));
}
function checkUpdate(value, expected) {
    checkTree(value, expected, (p, m) => m.statement(p));
}
function checkStatement(value, expected) {
    checkTree(value, expected, (p, m) => m.statement(p));
}
function hideLocs(val) {
    if (!val) {
        return val;
    }
    if (typeof val !== 'object') {
        return val;
    }
    if (Array.isArray(val)) {
        return val.map(hideLocs);
    }
    const ret = {};
    for (const [k, v] of Object.entries(val)) {
        ret[k] = hideLocs(v);
    }
    delete ret._location;
    return ret;
}
function deepEqual(a, b, strict, depth = 10, numberDelta = 0.0001) {
    if (depth < 0) {
        throw new Error('Comparing too deep entities');
    }
    if (a === b) {
        return true;
    }
    if (!strict) {
        // should not use '==' because it could call .toString() on objects when compared to strings.
        // ... which is not ok. Especially when working with translatable objects, which .toString() returns a transaltion (a string, thus)
        if (!a && !b) {
            return true;
        }
    }
    if (Array.isArray(a)) {
        if (!Array.isArray(b) || a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i], strict, depth - 1, numberDelta))
                return false;
        }
        return true;
    }
    // handle dates
    if (a instanceof Date || b instanceof Date) {
        return a === b;
    }
    const fa = Number.isFinite(a);
    const fb = Number.isFinite(b);
    if (fa || fb) {
        return fa && fb && Math.abs(a - b) <= numberDelta;
    }
    // handle plain objects
    if (typeof a !== 'object' || typeof a !== typeof b)
        return false;
    if (!a || !b) {
        return false;
    }
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (strict && ak.length !== bk.length)
        return false;
    const set = strict
        ? Object.keys(a)
        : new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of set) {
        if (!deepEqual(a[k], b[k], strict, depth - 1, numberDelta))
            return false;
    }
    return true;
}
function inspect(elt) {
    return require('util').inspect(elt);
}
function checkTree(value, expected, mapper, start, checkLocations) {
    if (typeof value === 'string') {
        value = [value];
    }
    for (const sql of value) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        it(`parses ${sql}`, () => {
            const gram = nearley_1.Grammar.fromCompiled(main_1.default);
            if (start) {
                gram.start = start;
            }
            function doParse(psql) {
                const parser = new nearley_1.Parser(gram);
                parser.feed(psql);
                const ret = parser.finish();
                if (!ret.length) {
                    fail('Unexpected end of input');
                }
                if (ret.length !== 1) {
                    const noLocs = ret.map(hideLocs);
                    if (noLocs.slice(1).every(p => deepEqual(p, noLocs[0]))) {
                        fail(`${noLocs.length} ambiguous syntaxes, but they yielded the same ASTs : ${inspect(noLocs[0])}`);
                    }
                    else {
                        fail(`${noLocs.length} ambiguous syntaxes, AND THEY HAVE YIELDED DIFFERENT ASTs : \n${noLocs
                            .map(inspect)
                            .join('\n\n           ======================      \n\n')}`);
                    }
                }
                return (0, utils_1.trimNullish)(ret[0]);
            }
            const parsedWithLocations = (0, lexer_1.tracking)(() => doParse(sql));
            const parsedWithoutTracking = doParse(sql);
            const parsed = checkLocations
                ? parsedWithLocations
                : parsedWithoutTracking;
            // check that it is the AST we expected
            expect(parsed).toEqual(expected);
            // check that top-level statements always have at least some kind of basic position
            expect(parsedWithLocations._location).toBeTruthy();
            // check that it generates the same with/without location tracking
            expect(hideLocs(parsedWithLocations)).toEqual(hideLocs(parsedWithoutTracking));
            // check that it is stable through ast modifier
            const modified = mapper(parsed, (0, astMapper_1.astMapper)(() => ({})));
            expect(modified).toEqual(parsed);
            // check that it procuces sql
            let newSql;
            try {
                newSql = mapper(parsed, toSql_1.toSql);
                expect(newSql).toEqual(expect.any(String));
            }
            catch (e) {
                e.message = `⛔ ⛔ ⛔ ⛔ ⛔ ⛔ ⛔ ⛔ ⛔
        Failed to generate SQL from the parsed AST
            => There should be something wrong in toSql.ts
⛔ ⛔ ⛔ ⛔ ⛔ ⛔ ⛔ ⛔ ⛔
            ${e.message}`;
                throw e;
            }
            // reparse the generated sql...
            let reparsed;
            try {
                expect(typeof newSql).toBe('string');
                reparsed = checkLocations
                    ? (0, lexer_1.tracking)(() => doParse(newSql))
                    : doParse(newSql);
            }
            catch (e) {
                e.message = `⛔ ⛔ ⛔ ⛔ ⛔ ⛔ ⛔ ⛔ ⛔
        The parsed AST converted-back to SQL generated invalid SQL.
            => There should be something wrong in toSql.ts
⛔ ⛔ ⛔ ⛔ ⛔ ⛔ ⛔ ⛔ ⛔
            ${e.message}`;
                throw e;
            }
            // ...and check it still produces the same ast.
            expect(hideLocs(reparsed)).toEqual(hideLocs(expected));
        });
    }
}
function checkInvalid(sql, start) {
    it(`does not parses ${sql}`, () => {
        const gram = nearley_1.Grammar.fromCompiled(main_1.default);
        if (start) {
            gram.start = start;
        }
        const parser = new nearley_1.Parser(gram);
        parser.feed(sql);
        expect(parser.results).not.toEqual([]);
    });
}
function checkValid(sql, start) {
    it(`parses ${sql}`, () => {
        const gram = nearley_1.Grammar.fromCompiled(main_1.default);
        if (start) {
            gram.start = start;
        }
        const parser = new nearley_1.Parser(gram);
        parser.feed(sql);
        expect(parser.results).not.toEqual([]);
    });
}
function checkInvalidExpr(sql) {
    return checkInvalid(sql, 'expr');
}
function checkTreeExpr(value, expected) {
    checkTree(value, expected, (p, m) => m.expr(p), 'expr');
}
function checkTreeExprLoc(value, expected) {
    checkTree(value, expected, (p, m) => m.expr(p), 'expr', true);
}
function columns(...vals) {
    return vals.map(expr => typeof expr === 'string'
        ? { expr: { type: 'ref', name: expr } }
        : { expr });
}
function checkInterval(input, expected) {
    for (const v of Array.isArray(input) ? input : [input]) {
        it(`parses interval "${v}"`, () => {
            expect((0, IntervalUtils_1.normalizeInterval)((0, parser_1.parseIntervalLiteral)(v))).toEqual(expected);
        });
    }
}
exports.star = { type: 'ref', name: '*' };
exports.starCol = { expr: exports.star };
function col(n, alias) {
    return {
        expr: ref(n),
        ...alias ? { name: alias } : undefined,
    };
}
function ref(n) {
    return { type: 'ref', name: n };
}
function binary(left, op, right) {
    return { type: 'binary', left, op, right };
}
function name(n) {
    return { name: n };
}
function qname(n, schema) {
    return { name: n, schema };
}
function int(value) {
    return { type: 'integer', value };
}
function tbl(nm) {
    return {
        type: 'table',
        name: name(nm),
    };
}
//# sourceMappingURL=helpers.js.map