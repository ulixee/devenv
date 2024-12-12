"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("../lib/parser");
const toSql_1 = require("../lib/toSql");
describe('SQL builder', () => {
    function parse(str) {
        const ret = (0, parser_1.parse)(str);
        if (ret.length !== 1) {
            throw new Error('Expected single statement');
        }
        return ret[0];
    }
    const expr = (txt) => toSql_1.toSql.expr((0, parser_1.parse)(txt, 'expr'));
    const stm = (txt) => toSql_1.toSql.statement(parse(txt));
    it('type names do not add quotes on special types', () => {
        // see https://github.com/oguimbal/pgsql-ast-parser/issues/38
        expect(expr(`'1'::integer`))
            .toEqual(`(('1')::integer )`);
        expect(expr(`'1'::"precision"`))
            .toEqual(`(('1')::"precision" )`);
        expect(expr(`'1'::double precision`))
            .toEqual(`(('1')::double precision )`);
        expect(expr(`'1'::"ab cd"`))
            .toEqual(`(('1')::"ab cd" )`);
        expect(expr(`'1'::"double cd"`))
            .toEqual(`(('1')::"double cd" )`);
        expect(expr(`'1'::"ab precision"`))
            .toEqual(`(('1')::"ab precision" )`);
        expect(expr(`'1'::character varying`))
            .toEqual(`(('1')::character varying )`);
        expect(expr(`'1'::bit varying`))
            .toEqual(`(('1')::bit varying )`);
        expect(expr(`'2021-04-03 16:16:02'::time without time zone`))
            .toEqual(`(('2021-04-03 16:16:02')::time without time zone )`);
        expect(expr(`'2021-04-03 16:16:02'::time with time zone`))
            .toEqual(`(('2021-04-03 16:16:02')::time with time zone )`);
        expect(expr(`'2021-04-03 16:16:02'::timestamp without time zone`))
            .toEqual(`(('2021-04-03 16:16:02')::timestamp without time zone )`);
        expect(expr(`'2021-04-03 16:16:02'::timestamp with time zone`))
            .toEqual(`(('2021-04-03 16:16:02')::timestamp with time zone )`);
        expect(expr(`('now'::text)::timestamp(4) with time zone`))
            .toEqual(`((('now')::text )::timestamp(4) with time zone )`);
    });
    it('quotes identifiers', () => {
        expect(stm(`select "select"`))
            .toEqual(`SELECT "select"`);
    });
    it('quotes uppercases', () => {
        expect(stm(`select "whAtever"`))
            .toEqual(`SELECT "whAtever"`);
    });
    it('quotes spaced', () => {
        expect(stm(`select "ab cd"`))
            .toEqual(`SELECT "ab cd"`);
    });
    it('doesnt quote simples', () => {
        expect(stm(`select "abc042"`))
            .toEqual(`SELECT abc042`);
        expect(stm(`select "a"`))
            .toEqual(`SELECT a`);
    });
});
//# sourceMappingURL=toSql.test.js.map