"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generated automatically by nearley, version unknown
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d) { return d[0]; }
const interval_lexer_1 = require("./interval-lexer");
;
;
;
;
const grammar = {
    Lexer: interval_lexer_1.lexerAny,
    ParserRules: [
        { "name": "main$ebnf$1", "symbols": ["elt"] },
        { "name": "main$ebnf$1", "symbols": ["main$ebnf$1", "elt"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "main", "symbols": ["main$ebnf$1"], "postprocess": ([elts]) => {
                // check unicity
                const s = new Set();
                for (const e of elts) {
                    const k = typeof e[1] === 'number'
                        ? e[0]
                        : 'time';
                    if (s.has(k)) {
                        return 'invalid';
                    }
                    s.add(k);
                }
                return elts;
            } },
        { "name": "elt", "symbols": ["time"] },
        { "name": "elt", "symbols": ["num", "unit"], "postprocess": ([[n], u]) => {
                u = u[0].type;
                return [u, n];
            } },
        { "name": "unit", "symbols": [(interval_lexer_1.lexerAny.has("years") ? { type: "years" } : years)] },
        { "name": "unit", "symbols": [(interval_lexer_1.lexerAny.has("months") ? { type: "months" } : months)] },
        { "name": "unit", "symbols": [(interval_lexer_1.lexerAny.has("days") ? { type: "days" } : days)] },
        { "name": "unit", "symbols": [(interval_lexer_1.lexerAny.has("hours") ? { type: "hours" } : hours)] },
        { "name": "unit", "symbols": [(interval_lexer_1.lexerAny.has("minutes") ? { type: "minutes" } : minutes)] },
        { "name": "unit", "symbols": [(interval_lexer_1.lexerAny.has("seconds") ? { type: "seconds" } : seconds)] },
        { "name": "unit", "symbols": [(interval_lexer_1.lexerAny.has("milliseconds") ? { type: "milliseconds" } : milliseconds)] },
        { "name": "num", "symbols": ["int"] },
        { "name": "num", "symbols": ["float"] },
        { "name": "uint", "symbols": [(interval_lexer_1.lexerAny.has("int") ? { type: "int" } : int)], "postprocess": ([x]) => parseInt(x, 10) },
        { "name": "int$ebnf$1$subexpression$1", "symbols": [(interval_lexer_1.lexerAny.has("neg") ? { type: "neg" } : neg)] },
        { "name": "int$ebnf$1", "symbols": ["int$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "int$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "int", "symbols": ["int$ebnf$1", (interval_lexer_1.lexerAny.has("int") ? { type: "int" } : int)], "postprocess": ([neg, x]) => parseInt(x, 10) * (neg ? -1 : 1) },
        { "name": "float$ebnf$1$subexpression$1", "symbols": [(interval_lexer_1.lexerAny.has("neg") ? { type: "neg" } : neg)] },
        { "name": "float$ebnf$1", "symbols": ["float$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "float$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "float$ebnf$2", "symbols": [(interval_lexer_1.lexerAny.has("int") ? { type: "int" } : int)], "postprocess": id },
        { "name": "float$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "float", "symbols": ["float$ebnf$1", "float$ebnf$2", (interval_lexer_1.lexerAny.has("dot") ? { type: "dot" } : dot), (interval_lexer_1.lexerAny.has("int") ? { type: "int" } : int)], "postprocess": ([neg, ...v]) => parseFloat(v.map(v => v ? v.text : '0').join('')) * (neg ? -1 : 1) },
        { "name": "time$ebnf$1$subexpression$1", "symbols": [(interval_lexer_1.lexerAny.has("colon") ? { type: "colon" } : colon), "uint"] },
        { "name": "time$ebnf$1", "symbols": ["time$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "time$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "time$ebnf$2$subexpression$1", "symbols": [(interval_lexer_1.lexerAny.has("dot") ? { type: "dot" } : dot), (interval_lexer_1.lexerAny.has("int") ? { type: "int" } : int)] },
        { "name": "time$ebnf$2", "symbols": ["time$ebnf$2$subexpression$1"], "postprocess": id },
        { "name": "time$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "time", "symbols": ["uint", (interval_lexer_1.lexerAny.has("colon") ? { type: "colon" } : colon), "uint", "time$ebnf$1", "time$ebnf$2"], "postprocess": ([a, _, b, c, d]) => {
                c = c && c[1];
                d = d && d[1];
                const ret = typeof c === 'number' ? [
                    ['hours', a],
                    ['minutes', b],
                    ['seconds', c],
                ] : [
                    ['minutes', a],
                    ['seconds', b],
                ];
                if (d) {
                    ret.push(['milliseconds', parseFloat('0.' + d) * 1000]);
                }
                return ret;
            } }
    ],
    ParserStart: "main",
};
exports.default = grammar;
//# sourceMappingURL=interval.js.map