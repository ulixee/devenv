"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generated automatically by nearley, version unknown
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d) { return d[0]; }
const geometric_lexer_1 = require("./geometric-lexer");
const get = (i) => (x) => x[i];
const last = (x) => x && x[x.length - 1];
function unwrap(e) {
    if (Array.isArray(e) && e.length === 1) {
        e = unwrap(e[0]);
    }
    if (Array.isArray(e) && !e.length) {
        return null;
    }
    return e;
}
;
;
;
;
const grammar = {
    Lexer: geometric_lexer_1.lexerAny,
    ParserRules: [
        { "name": "number$subexpression$1", "symbols": ["float"] },
        { "name": "number$subexpression$1", "symbols": ["int"] },
        { "name": "number", "symbols": ["number$subexpression$1"], "postprocess": unwrap },
        { "name": "float", "symbols": [(geometric_lexer_1.lexerAny.has("float") ? { type: "float" } : float)], "postprocess": args => parseFloat(unwrap(args)) },
        { "name": "int", "symbols": [(geometric_lexer_1.lexerAny.has("int") ? { type: "int" } : int)], "postprocess": arg => parseInt(unwrap(arg), 10) },
        { "name": "comma", "symbols": [(geometric_lexer_1.lexerAny.has("comma") ? { type: "comma" } : comma)], "postprocess": id },
        { "name": "point$macrocall$2", "symbols": ["point_content"] },
        { "name": "point$macrocall$1$subexpression$1", "symbols": ["point$macrocall$2"] },
        { "name": "point$macrocall$1$subexpression$1", "symbols": [(geometric_lexer_1.lexerAny.has("lparen") ? { type: "lparen" } : lparen), "point$macrocall$2", (geometric_lexer_1.lexerAny.has("rparen") ? { type: "rparen" } : rparen)], "postprocess": get(1) },
        { "name": "point$macrocall$1", "symbols": ["point$macrocall$1$subexpression$1"], "postprocess": unwrap },
        { "name": "point", "symbols": ["point$macrocall$1"], "postprocess": unwrap },
        { "name": "point_content", "symbols": ["number", "comma", "number"], "postprocess": x => ({ x: x[0], y: x[2] }) },
        { "name": "line", "symbols": [(geometric_lexer_1.lexerAny.has("lcurl") ? { type: "lcurl" } : lcurl), "number", "comma", "number", "comma", "number", (geometric_lexer_1.lexerAny.has("rcurl") ? { type: "rcurl" } : rcurl)], "postprocess": x => ({
                a: x[1],
                b: x[3],
                c: x[5],
            }) },
        { "name": "box", "symbols": ["closed_path"], "postprocess": ([x], rej) => {
                if (x.length !== 2) {
                    return rej;
                }
                return x;
            } },
        { "name": "lseg", "symbols": ["path"], "postprocess": ([x], rej) => {
                if (x.path.length !== 2) {
                    return rej;
                }
                return x.path;
            } },
        { "name": "path", "symbols": ["open_path"], "postprocess": ([path]) => ({ closed: false, path }) },
        { "name": "path", "symbols": ["closed_path"], "postprocess": ([path]) => ({ closed: true, path }) },
        { "name": "open_path$macrocall$2", "symbols": [(geometric_lexer_1.lexerAny.has("lbracket") ? { type: "lbracket" } : lbracket)] },
        { "name": "open_path$macrocall$3", "symbols": [(geometric_lexer_1.lexerAny.has("rbracket") ? { type: "rbracket" } : rbracket)] },
        { "name": "open_path$macrocall$1$macrocall$2", "symbols": ["point"] },
        { "name": "open_path$macrocall$1$macrocall$1$ebnf$1", "symbols": [] },
        { "name": "open_path$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": [(geometric_lexer_1.lexerAny.has("comma") ? { type: "comma" } : comma), "open_path$macrocall$1$macrocall$2"], "postprocess": last },
        { "name": "open_path$macrocall$1$macrocall$1$ebnf$1", "symbols": ["open_path$macrocall$1$macrocall$1$ebnf$1", "open_path$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "open_path$macrocall$1$macrocall$1", "symbols": ["open_path$macrocall$1$macrocall$2", "open_path$macrocall$1$macrocall$1$ebnf$1"], "postprocess": ([head, tail]) => {
                return [unwrap(head), ...(tail.map(unwrap) || [])];
            } },
        { "name": "open_path$macrocall$1", "symbols": ["open_path$macrocall$2", "open_path$macrocall$1$macrocall$1", "open_path$macrocall$3"], "postprocess": get(1) },
        { "name": "open_path", "symbols": ["open_path$macrocall$1"], "postprocess": last },
        { "name": "closed_path$subexpression$1$macrocall$2", "symbols": [(geometric_lexer_1.lexerAny.has("lparen") ? { type: "lparen" } : lparen)] },
        { "name": "closed_path$subexpression$1$macrocall$3", "symbols": [(geometric_lexer_1.lexerAny.has("rparen") ? { type: "rparen" } : rparen)] },
        { "name": "closed_path$subexpression$1$macrocall$1$macrocall$2", "symbols": ["point"] },
        { "name": "closed_path$subexpression$1$macrocall$1$macrocall$1$ebnf$1", "symbols": [] },
        { "name": "closed_path$subexpression$1$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": [(geometric_lexer_1.lexerAny.has("comma") ? { type: "comma" } : comma), "closed_path$subexpression$1$macrocall$1$macrocall$2"], "postprocess": last },
        { "name": "closed_path$subexpression$1$macrocall$1$macrocall$1$ebnf$1", "symbols": ["closed_path$subexpression$1$macrocall$1$macrocall$1$ebnf$1", "closed_path$subexpression$1$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "closed_path$subexpression$1$macrocall$1$macrocall$1", "symbols": ["closed_path$subexpression$1$macrocall$1$macrocall$2", "closed_path$subexpression$1$macrocall$1$macrocall$1$ebnf$1"], "postprocess": ([head, tail]) => {
                return [unwrap(head), ...(tail.map(unwrap) || [])];
            } },
        { "name": "closed_path$subexpression$1$macrocall$1", "symbols": ["closed_path$subexpression$1$macrocall$2", "closed_path$subexpression$1$macrocall$1$macrocall$1", "closed_path$subexpression$1$macrocall$3"], "postprocess": get(1) },
        { "name": "closed_path$subexpression$1", "symbols": ["closed_path$subexpression$1$macrocall$1"], "postprocess": last },
        { "name": "closed_path$subexpression$1$macrocall$5", "symbols": ["point"] },
        { "name": "closed_path$subexpression$1$macrocall$4$ebnf$1", "symbols": [] },
        { "name": "closed_path$subexpression$1$macrocall$4$ebnf$1$subexpression$1", "symbols": [(geometric_lexer_1.lexerAny.has("comma") ? { type: "comma" } : comma), "closed_path$subexpression$1$macrocall$5"], "postprocess": last },
        { "name": "closed_path$subexpression$1$macrocall$4$ebnf$1", "symbols": ["closed_path$subexpression$1$macrocall$4$ebnf$1", "closed_path$subexpression$1$macrocall$4$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "closed_path$subexpression$1$macrocall$4", "symbols": ["closed_path$subexpression$1$macrocall$5", "closed_path$subexpression$1$macrocall$4$ebnf$1"], "postprocess": ([head, tail]) => {
                return [unwrap(head), ...(tail.map(unwrap) || [])];
            } },
        { "name": "closed_path$subexpression$1", "symbols": ["closed_path$subexpression$1$macrocall$4"], "postprocess": last },
        { "name": "closed_path", "symbols": ["closed_path$subexpression$1"], "postprocess": get(0) },
        { "name": "polygon", "symbols": ["closed_path"], "postprocess": get(0) },
        { "name": "circle_body", "symbols": ["point", "comma", "number"], "postprocess": x => ({ c: x[0], r: x[2] }) },
        { "name": "circle$subexpression$1$macrocall$2", "symbols": [(geometric_lexer_1.lexerAny.has("lcomp") ? { type: "lcomp" } : lcomp)] },
        { "name": "circle$subexpression$1$macrocall$3", "symbols": [(geometric_lexer_1.lexerAny.has("rcomp") ? { type: "rcomp" } : rcomp)] },
        { "name": "circle$subexpression$1$macrocall$1", "symbols": ["circle$subexpression$1$macrocall$2", "circle_body", "circle$subexpression$1$macrocall$3"], "postprocess": get(1) },
        { "name": "circle$subexpression$1", "symbols": ["circle$subexpression$1$macrocall$1"] },
        { "name": "circle$subexpression$1$macrocall$5", "symbols": [(geometric_lexer_1.lexerAny.has("lparen") ? { type: "lparen" } : lparen)] },
        { "name": "circle$subexpression$1$macrocall$6", "symbols": [(geometric_lexer_1.lexerAny.has("rparen") ? { type: "rparen" } : rparen)] },
        { "name": "circle$subexpression$1$macrocall$4", "symbols": ["circle$subexpression$1$macrocall$5", "circle_body", "circle$subexpression$1$macrocall$6"], "postprocess": get(1) },
        { "name": "circle$subexpression$1", "symbols": ["circle$subexpression$1$macrocall$4"] },
        { "name": "circle$subexpression$1", "symbols": ["circle_body"] },
        { "name": "circle", "symbols": ["circle$subexpression$1"], "postprocess": unwrap }
    ],
    ParserStart: "number",
};
exports.default = grammar;
//# sourceMappingURL=geometric.js.map