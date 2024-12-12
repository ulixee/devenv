"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lexerAny = exports.lexer = void 0;
const moo_1 = require("moo");
// build lexer
exports.lexer = (0, moo_1.compile)({
    int: /\d+/,
    neg: '-',
    dot: '.',
    years: /(?:y|yrs?|years?)\b/,
    months: /(?:mon(?:th)?s?)\b/,
    days: /(?:d|days?)\b/,
    hours: /(?:h|hrs?|hours?)\b/,
    minutes: /(?:m|mins?|minutes?)\b/,
    seconds: /(?:s|secs?|seconds?)\b/,
    milliseconds: /(?:ms|milliseconds?)\b/,
    space: { match: /[\s\t\n\v\f\r]+/, lineBreaks: true, },
    colon: ':',
});
exports.lexer.next = (next => () => {
    let tok;
    // eslint-disable-next-line no-cond-assign
    while ((tok = next.call(exports.lexer)) && (tok.type === 'space')) {
    }
    return tok;
})(exports.lexer.next);
exports.lexerAny = exports.lexer;
//# sourceMappingURL=interval-lexer.js.map