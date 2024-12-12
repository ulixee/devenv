"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lexerAny = exports.lexer = void 0;
const moo_1 = require("moo");
// build lexer
exports.lexer = (0, moo_1.compile)({
    comma: ',',
    space: { match: /[\s\t\n\v\f\r]+/, lineBreaks: true, },
    int: /-?\d+(?![.\d])/,
    float: /-?(?:(?:\d*\.\d+)|(?:\d+\.\d*))/,
    lcurl: '{',
    rcurl: '}',
    lparen: '(',
    rparen: ')',
    lbracket: '[',
    rbracket: ']',
    lcomp: '<',
    rcomp: '>',
});
exports.lexer.next = (next => () => {
    let tok;
    // eslint-disable-next-line no-cond-assign
    while ((tok = next.call(exports.lexer)) && (tok.type === 'space')) {
    }
    return tok;
})(exports.lexer.next);
exports.lexerAny = exports.lexer;
//# sourceMappingURL=geometric-lexer.js.map