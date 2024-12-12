"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const array_lexer_1 = require("../../syntax/raw/literals/array-lexer");
const parser_1 = require("../../lib/parser");
describe('Array literals', () => {
    const hasContent = [
        /^value$/,
    ];
    function next(expected) {
        const result = array_lexer_1.lexer.next();
        delete result.toString;
        delete result.col;
        delete result.line;
        delete result.lineBreaks;
        delete result.offset;
        delete result.text;
        if (!hasContent.some(x => x.test(result.type))) {
            delete result.value;
        }
        expect(result).toEqual(expected);
    }
    it('Lexer: tokenizes simple list', () => {
        array_lexer_1.lexer.reset(`{  a b , " a b " , "a\\" b"}`);
        next({ type: 'start_list' });
        next({ type: 'value', value: 'a b' });
        next({ type: 'comma' });
        next({ type: 'value', value: ' a b ' });
        next({ type: 'comma' });
        next({ type: 'value', value: 'a" b' });
        next({ type: 'end_list' });
    });
    it('parses single array', () => {
        expect((0, parser_1.parseArrayLiteral)('{a}')).toEqual(['a']);
    });
    it('parses double array', () => {
        expect((0, parser_1.parseArrayLiteral)('{a, b}')).toEqual(['a', 'b']);
    });
    it('parses empty array', () => {
        expect((0, parser_1.parseArrayLiteral)('{}')).toEqual([]);
    });
    it('parses two dimensions', () => {
        expect((0, parser_1.parseArrayLiteral)('{{a}, {b, c}}')).toEqual([['a'], ['b', 'c']]);
    });
});
//# sourceMappingURL=array.test.js.map