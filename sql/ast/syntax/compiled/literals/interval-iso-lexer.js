"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lexerAny = exports.lexer = void 0;
const moo_1 = require("moo");
// build lexer
exports.lexer = (0, moo_1.compile)({
    int: /-?\d+(?![.\d])/,
    float: /-?(?:(?:\d*\.\d+)|(?:\d+\.\d*))/,
    P: 'P',
    Y: 'Y',
    M: 'M',
    W: 'W',
    D: 'D',
    H: 'H',
    S: 'S',
    T: 'T',
});
exports.lexerAny = exports.lexer;
//# sourceMappingURL=interval-iso-lexer.js.map