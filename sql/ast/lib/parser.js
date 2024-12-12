"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFirst = parseFirst;
exports.parseWithComments = parseWithComments;
exports.parse = parse;
exports.parseArrayLiteral = parseArrayLiteral;
exports.parseIntervalLiteral = parseIntervalLiteral;
exports.parseGeometricLiteral = parseGeometricLiteral;
const nearley_1 = require("nearley");
const array_1 = require("../syntax/compiled/literals/array");
const geometric_1 = require("../syntax/compiled/literals/geometric");
const interval_1 = require("../syntax/compiled/literals/interval");
const interval_iso_1 = require("../syntax/compiled/literals/interval-iso");
const main_1 = require("../syntax/compiled/main");
const IntervalUtils_1 = require("./helpers/IntervalUtils");
const lexer_1 = require("./helpers/lexer");
let sqlCompiled;
let arrayCompiled;
let geometricCompiled;
let intervalTextCompiled;
let intervalIsoCompiled;
/** Parse the first SQL statement in the given text (discards the rest), and return its AST */
function parseFirst(sql) {
    const first = parse(sql);
    return first[0];
}
/** Parse an AST from SQL, and get the comments */
function parseWithComments(sql, options) {
    return (0, lexer_1.trackingComments)(() => parse(sql, options));
}
function parse(sql, optEntry) {
    if (!sqlCompiled) {
        sqlCompiled = nearley_1.Grammar.fromCompiled(main_1.default);
    }
    const entry = typeof optEntry === 'string'
        ? optEntry
        : optEntry?.entry;
    const opts = typeof optEntry === 'string' ? null : optEntry;
    // parse sql
    const doParse = () => _parse(sql, sqlCompiled, entry);
    let parsed = opts?.locationTracking
        ? (0, lexer_1.tracking)(doParse)
        : doParse();
    // always return an array of statements.
    if (typeof optEntry !== 'string' && !Array.isArray(parsed)) {
        parsed = [parsed];
    }
    return parsed;
}
function parseArrayLiteral(sql) {
    if (!arrayCompiled) {
        arrayCompiled = nearley_1.Grammar.fromCompiled(array_1.default);
    }
    return _parse(sql, arrayCompiled);
}
function parseIntervalLiteral(literal) {
    if (literal.startsWith('P')) {
        if (!intervalIsoCompiled) {
            intervalIsoCompiled = nearley_1.Grammar.fromCompiled(interval_iso_1.default);
        }
        return (0, IntervalUtils_1.buildInterval)(literal, _parse(literal, intervalIsoCompiled));
    }
    if (!intervalTextCompiled) {
        intervalTextCompiled = nearley_1.Grammar.fromCompiled(interval_1.default);
    }
    const low = literal.toLowerCase(); // full text syntax is case insensitive
    return (0, IntervalUtils_1.buildInterval)(literal, _parse(low, intervalTextCompiled));
}
function parseGeometricLiteral(sql, type) {
    if (!geometricCompiled) {
        geometricCompiled = nearley_1.Grammar.fromCompiled(geometric_1.default);
    }
    return _parse(sql, geometricCompiled, type);
}
// eslint-disable-next-line @typescript-eslint/naming-convention
function _parse(sql, grammar, entry) {
    try {
        grammar.start = entry ?? 'main';
        const parser = new nearley_1.Parser(grammar);
        parser.feed(sql);
        const asts = parser.finish();
        if (!asts.length) {
            throw new Error('Unexpected end of input');
        }
        else if (asts.length !== 1) {
            throw new Error(`💀 Ambiguous SQL syntax: Please file an issue stating the request that has failed at https://github.com/oguimbal/pgsql-ast-parser:

        ${sql}

        `);
        }
        return asts[0];
    }
    catch (e) {
        if (typeof e?.message !== 'string') {
            throw e;
        }
        let msg = e.message;
        // remove all the stack crap of nearley parser
        let begin = null;
        const parts = [];
        const reg = /A (.+) token based on:/g;
        let m;
        // eslint-disable-next-line no-cond-assign
        while (m = reg.exec(msg)) {
            begin = begin ?? msg.substr(0, m.index);
            parts.push(`    - A "${m[1]}" token`);
        }
        if (begin) {
            msg = `${begin}${parts.join('\n')}\n\n`;
        }
        e.message = msg;
        throw e;
    }
}
//# sourceMappingURL=parser.js.map