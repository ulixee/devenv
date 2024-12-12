"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../testing/helpers");
const parser_1 = require("../../lib/parser");
describe('Simple statements', () => {
    (0, helpers_1.checkStatement)(`COMMENT ON TABLE groups is 'some text'`, {
        type: 'comment',
        comment: 'some text',
        on: {
            type: 'table',
            name: { name: 'groups' }
        }
    });
    (0, helpers_1.checkStatement)(`COMMENT ON TABLE public.groups is 'some text'`, {
        type: 'comment',
        comment: 'some text',
        on: {
            type: 'table',
            name: { schema: 'public', name: 'groups', }
        }
    });
    (0, helpers_1.checkStatement)(`COMMENT ON COLUMN groups.members is 'some text'`, {
        type: 'comment',
        comment: 'some text',
        on: {
            type: 'column',
            column: { table: 'groups', column: 'members', }
        }
    });
    (0, helpers_1.checkStatement)(`COMMENT ON COLUMN public.groups.members is 'some text'`, {
        type: 'comment',
        comment: 'some text',
        on: {
            type: 'column',
            column: { schema: 'public', table: 'groups', column: 'members', }
        }
    });
    it('can fetch comments', () => {
        const { ast, comments } = (0, parser_1.parseWithComments)('select /* comment a */ * from /* comment b */ tbl');
        expect(ast).toMatchObject([{
                type: 'select',
                columns: [{ expr: { type: 'ref', name: '*' } }],
                from: [(0, helpers_1.tbl)('tbl')],
            }]);
        expect(comments.map(c => c.comment)).toMatchObject(['/* comment a */ ', '/* comment b */ ']);
    });
    // https://www.postgresql.org/docs/13/sql-syntax-lexical.html#SQL-SYNTAX-COMMENTS
    it('can fetch nested comments', () => {
        const { ast, comments } = (0, parser_1.parseWithComments)('select /* comment /* nest */ a */ * from /* comment /* nest1 /* nest2 */ */ b */ tbl');
        expect(ast).toMatchObject([{
                type: 'select',
                columns: [{ expr: { type: 'ref', name: '*' } }],
                from: [(0, helpers_1.tbl)('tbl')],
            }]);
        expect(comments.map(c => c.comment)).toMatchObject(['/* comment /* nest */ a */ ', '/* comment /* nest1 /* nest2 */ */ b */ ']);
    });
    (0, helpers_1.checkStatement)(`select * from (select a from mytable) myalias(col_renamed)`, {
        type: 'select',
        columns: [{ expr: { type: 'ref', name: '*' } }],
        from: [{
                type: 'statement',
                statement: {
                    type: 'select',
                    columns: [{ expr: (0, helpers_1.ref)('a') }],
                    from: [(0, helpers_1.tbl)('mytable')],
                },
                alias: 'myalias',
                columnNames: [(0, helpers_1.name)('col_renamed')],
            }]
    });
    (0, helpers_1.checkStatement)(`select * from mytable "myAlias"(a)`, {
        type: 'select',
        columns: [{ expr: { type: 'ref', name: '*' } }],
        from: [{
                type: 'table',
                name: {
                    name: 'mytable',
                    alias: 'myAlias',
                    columnNames: [(0, helpers_1.name)('a')],
                },
            }]
    });
    (0, helpers_1.checkStatement)(`select * from (select a,b from mytable) "myAlias"(x,y)`, {
        type: 'select',
        columns: [{ expr: { type: 'ref', name: '*' } }],
        from: [{
                type: 'statement',
                statement: {
                    type: 'select',
                    columns: [{ expr: (0, helpers_1.ref)('a') }, { expr: (0, helpers_1.ref)('b') }],
                    from: [(0, helpers_1.tbl)('mytable')],
                },
                alias: 'myAlias',
                columnNames: [(0, helpers_1.name)('x'), (0, helpers_1.name)('y')],
            }]
    });
    // bugfix (Cannot select column named column) https://github.com/oguimbal/pgsql-ast-parser/issues/67
    (0, helpers_1.checkStatement)(`SELECT something AS column FROM whatever`, {
        type: 'select',
        columns: [{ expr: (0, helpers_1.ref)('something'), alias: { name: 'column' } }],
        from: [(0, helpers_1.tbl)('whatever')],
    });
});
//# sourceMappingURL=simpleStatements.test.js.map