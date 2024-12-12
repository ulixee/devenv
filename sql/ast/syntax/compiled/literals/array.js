"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generated automatically by nearley, version unknown
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d) { return d[0]; }
const array_lexer_1 = require("./array-lexer");
const get = (i) => (x) => x[i];
const last = (x) => x && x[x.length - 1];
;
;
;
;
const grammar = {
    Lexer: array_lexer_1.lexerAny,
    ParserRules: [
        { "name": "main$ebnf$1", "symbols": ["elements"], "postprocess": id },
        { "name": "main$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "main", "symbols": [(array_lexer_1.lexerAny.has("start_list") ? { type: "start_list" } : start_list), "main$ebnf$1", (array_lexer_1.lexerAny.has("end_list") ? { type: "end_list" } : end_list)], "postprocess": x => x[1] || [] },
        { "name": "elements$ebnf$1", "symbols": [] },
        { "name": "elements$ebnf$1$subexpression$1", "symbols": [(array_lexer_1.lexerAny.has("comma") ? { type: "comma" } : comma), "elt"], "postprocess": last },
        { "name": "elements$ebnf$1", "symbols": ["elements$ebnf$1", "elements$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "elements", "symbols": ["elt", "elements$ebnf$1"], "postprocess": ([head, tail]) => {
                return [head, ...(tail || [])];
            } },
        { "name": "elt", "symbols": [(array_lexer_1.lexerAny.has("value") ? { type: "value" } : value)], "postprocess": x => x[0].value },
        { "name": "elt", "symbols": ["main"], "postprocess": x => x[0] }
    ],
    ParserStart: "main",
};
exports.default = grammar;
//# sourceMappingURL=array.js.map