"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lexerAny = exports.lexer = void 0;
const moo_1 = require("moo");
// build lexer
exports.lexer = (0, moo_1.compile)({
    valueString: {
        match: /"(?:\\["\\]|[^\n"\\])*"/,
        value: x => JSON.parse(x),
        type: () => 'value',
    },
    valueRaw: {
        match: /[^\s,{}"](?:[^,{}"]*[^\s,{}"])?/,
        type: () => 'value',
    },
    comma: ',',
    space: { match: /[\s\t\n\v\f\r]+/, lineBreaks: true, },
    start_list: '{',
    end_list: '}',
});
exports.lexer.next = (next => () => {
    let tok;
    // eslint-disable-next-line no-cond-assign
    while ((tok = next.call(exports.lexer)) && (tok.type === 'space')) {
    }
    return tok;
})(exports.lexer.next);
exports.lexerAny = exports.lexer;
//# sourceMappingURL=array-lexer.js.map