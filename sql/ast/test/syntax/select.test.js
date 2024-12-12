"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../testing/helpers");
describe('Select statements', () => {
    // yea... thats a valid query. Try it oO'
    (0, helpers_1.checkSelect)(['select'], {
        type: 'select',
    });
    (0, helpers_1.checkSelect)(['select 42', 'select(42)'], {
        type: 'select',
        columns: (0, helpers_1.columns)({
            type: 'integer',
            value: 42
        }),
    });
    (0, helpers_1.checkSelect)(['select * from default'], {
        type: 'select',
        from: [{ type: 'table', name: (0, helpers_1.qname)('default') }],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
    });
    function aliased(alias) {
        return {
            type: 'select',
            columns: [{
                    expr: {
                        type: 'integer',
                        value: 42
                    },
                    alias: { name: alias },
                }],
        };
    }
    // bugfix
    (0, helpers_1.checkSelect)(['select 42 as primary'], aliased('primary'));
    (0, helpers_1.checkSelect)(['select 42 as unique'], aliased('unique'));
    (0, helpers_1.checkSelect)(['select count(*)'], {
        type: 'select',
        columns: (0, helpers_1.columns)({
            type: 'call',
            function: { name: 'count' },
            args: [{ type: 'ref', name: '*' }],
        })
    });
    (0, helpers_1.checkSelect)(['select 42, 53', 'select 42,53', 'select(42),53'], {
        type: 'select',
        columns: (0, helpers_1.columns)({
            type: 'integer',
            value: 42
        }, {
            type: 'integer',
            value: 53
        }),
    });
    (0, helpers_1.checkSelect)(['select * from test', 'select*from"test"', 'select* from"test"', 'select *from"test"', 'select*from "test"', 'select * from "test"'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' })
    });
    (0, helpers_1.checkSelect)(['select * from current_schema()', 'select * from current_schema ( )'], {
        type: 'select',
        from: [{ type: 'call', function: { name: 'current_schema' }, args: [] }],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' })
    });
    (0, helpers_1.checkSelect)(['select a as a1, b as b1 from test', 'select a a1,b b1 from test', 'select a a1 ,b b1 from test'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: [{
                expr: { type: 'ref', name: 'a' },
                alias: { name: 'a1' },
            }, {
                expr: { type: 'ref', name: 'b' },
                alias: { name: 'b1' },
            }],
    });
    (0, helpers_1.checkSelect)(['select * from db.test'], {
        type: 'select',
        from: [{ type: 'table', name: (0, helpers_1.qname)('test', 'db') }],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
    });
    (0, helpers_1.checkSelect)(['select * from test limit 5', 'select * from test fetch first 5 row only', 'select * from test fetch next 5 rows only'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        limit: {
            limit: { type: 'integer', value: 5 }
        },
    });
    (0, helpers_1.checkSelect)(['select * from unnest(generate_series(1, 10)) AS test(num)'], {
        type: 'select',
        from: [{
                type: 'call',
                function: { name: 'unnest' },
                alias: {
                    name: 'test',
                    columns: [
                        { name: 'num' },
                    ],
                },
                args: [
                    {
                        type: 'call',
                        function: { name: 'generate_series' },
                        args: [
                            { type: 'integer', value: 1 },
                            { type: 'integer', value: 10 },
                        ],
                    },
                ],
            }],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
    });
    (0, helpers_1.checkSelect)(['select * from unnest(ARRAY[\'foo\', \'bar\', \'baz\']) with ordinality AS test(thing, num)'], {
        type: 'select',
        from: [{
                type: 'call',
                function: { name: 'unnest' },
                withOrdinality: true,
                alias: {
                    name: 'test',
                    columns: [
                        { name: 'thing' },
                        { name: 'num' },
                    ],
                },
                args: [
                    {
                        type: 'array',
                        expressions: [
                            { type: 'string', value: 'foo' },
                            { type: 'string', value: 'bar' },
                            { type: 'string', value: 'baz' },
                        ]
                    }
                ],
            }],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
    });
    (0, helpers_1.checkSelect)(['select t.* from things AS t join unnest(ARRAY[\'foo\', \'bar\']) with ordinality AS f(thing, ord) using (thing) order by f.ord'], {
        type: 'select',
        from: [
            {
                type: 'table',
                name: { name: 'things', alias: 't' }
            },
            {
                type: 'call',
                function: { name: 'unnest' },
                join: {
                    type: 'INNER JOIN',
                    using: [
                        { name: 'thing' }
                    ],
                },
                withOrdinality: true,
                alias: {
                    name: 'f',
                    columns: [
                        { name: 'thing' },
                        { name: 'ord' },
                    ],
                },
                args: [
                    {
                        type: 'array',
                        expressions: [
                            { type: 'string', value: 'foo' },
                            { type: 'string', value: 'bar' },
                        ],
                    }
                ],
            }
        ],
        columns: (0, helpers_1.columns)({
            type: 'ref',
            table: { name: 't' },
            name: '*',
        }),
        orderBy: [
            {
                by: {
                    type: 'ref',
                    table: { name: 'f' },
                    name: 'ord',
                }
            }
        ]
    });
    (0, helpers_1.checkSelect)(['select * from test limit 0'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        limit: {
            limit: { type: 'integer', value: 0 }
        },
    });
    (0, helpers_1.checkSelect)(['select * from test limit 5 offset 3', 'select * from test offset 3 limit 5', 'select * from test offset 3 rows fetch first 5 rows only'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        limit: {
            limit: { type: 'integer', value: 5 },
            offset: { type: 'integer', value: 3 },
        },
    });
    (0, helpers_1.checkSelect)(['select * from test limit $1 offset $2'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        limit: {
            limit: { type: 'parameter', name: '$1' },
            offset: { type: 'parameter', name: '$2' },
        },
    });
    (0, helpers_1.checkSelect)(['select * from test offset 3', 'select * from test offset 3 rows'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        limit: {
            offset: { type: 'integer', value: 3 },
        },
    });
    (0, helpers_1.checkSelect)(['select * from test order by a asc limit 3'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        limit: {
            limit: { type: 'integer', value: 3 }
        },
        orderBy: [{
                by: { type: 'ref', name: 'a' },
                order: 'ASC',
            }]
    });
    (0, helpers_1.checkSelect)(['select * from test order by a limit 3'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        limit: {
            limit: { type: 'integer', value: 3 }
        },
        orderBy: [{
                by: { type: 'ref', name: 'a' },
            }]
    });
    (0, helpers_1.checkSelect)(['select * from test order by a asc, b desc'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        orderBy: [{
                by: { type: 'ref', name: 'a' },
                order: 'ASC',
            }, {
                by: { type: 'ref', name: 'b' },
                order: 'DESC',
            }]
    });
    (0, helpers_1.checkSelect)(['select * from test order by a asc nulls first'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        orderBy: [{
                by: { type: 'ref', name: 'a' },
                order: 'ASC',
                nulls: 'FIRST',
            }]
    });
    (0, helpers_1.checkSelect)(['select * from test order by a asc nulls last'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        orderBy: [{
                by: { type: 'ref', name: 'a' },
                order: 'ASC',
                nulls: 'LAST',
            }]
    });
    (0, helpers_1.checkSelect)(['select a.*, b.*'], {
        type: 'select',
        columns: (0, helpers_1.columns)({
            type: 'ref',
            name: '*',
            table: { name: 'a' },
        }, {
            type: 'ref',
            name: '*',
            table: { name: 'b' },
        })
    });
    (0, helpers_1.checkSelect)(['select a, b'], {
        type: 'select',
        columns: (0, helpers_1.columns)({ type: 'ref', name: 'a' }, { type: 'ref', name: 'b' })
    });
    (0, helpers_1.checkSelect)(['select * from test a where a.b > 42' // yea yea, all those are valid & equivalent..
        ,
        'select*from test"a"where a.b > 42',
        'select*from test as"a"where a.b > 42',
        'select*from test as a where a.b > 42'], {
        type: 'select',
        from: [{ type: 'table', name: { name: 'test', alias: 'a' } }],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        where: {
            type: 'binary',
            op: '>',
            left: {
                type: 'ref',
                table: { name: 'a' },
                name: 'b',
            },
            right: {
                type: 'integer',
                value: 42,
            },
        }
    });
    (0, helpers_1.checkInvalid)('select "*" from test');
    (0, helpers_1.checkInvalid)('select (*) from test');
    (0, helpers_1.checkInvalid)('select ("*") from test');
    (0, helpers_1.checkInvalid)('select * from (test)');
    (0, helpers_1.checkInvalid)('select * from (select id from test)'); // <== missing alias
    (0, helpers_1.checkInvalid)('select * from sum(DISTINCT whatever)');
    (0, helpers_1.checkSelect)('select * from (select id from test) d', {
        type: 'select',
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        from: [{
                type: 'statement',
                statement: {
                    type: 'select',
                    from: [(0, helpers_1.tbl)('test')],
                    columns: (0, helpers_1.columns)({ type: 'ref', name: 'id' }),
                },
                alias: 'd',
            }]
    });
    (0, helpers_1.checkSelect)(['select * from test group by grp', 'select * from test group by (grp)'], {
        type: 'select',
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        from: [(0, helpers_1.tbl)('test')],
        groupBy: [{ type: 'ref', name: 'grp' }]
    });
    (0, helpers_1.checkSelect)(['select * from test group by a,b', 'select * from test group by (a,b)'], {
        type: 'select',
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        from: [(0, helpers_1.tbl)('test')],
        groupBy: [
            { type: 'ref', name: 'a' },
            { type: 'ref', name: 'b' }
        ]
    });
    function buildJoin(t) {
        return {
            type: 'select',
            columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
            from: [(0, helpers_1.tbl)('ta'), {
                    type: 'table',
                    name: (0, helpers_1.name)('tb'),
                    join: {
                        type: t,
                        on: {
                            type: 'binary',
                            op: '=',
                            left: {
                                type: 'ref',
                                table: { name: 'ta' },
                                name: 'id',
                            },
                            right: {
                                type: 'ref',
                                table: { name: 'tb' },
                                name: 'id',
                            },
                        }
                    }
                }]
        };
    }
    (0, helpers_1.checkInvalid)('select * from ta full inner join tb on ta.id=tb.id');
    (0, helpers_1.checkInvalid)('select * from ta left inner join tb on ta.id=tb.id');
    (0, helpers_1.checkInvalid)('select * from ta right inner join tb on ta.id=tb.id');
    (0, helpers_1.checkInvalid)('select * from ta cross inner join tb on ta.id=tb.id');
    (0, helpers_1.checkInvalid)('select * from ta cross outer join tb on ta.id=tb.id');
    (0, helpers_1.checkSelect)(['select * from ta join tb on ta.id=tb.id',
        'select * from ta inner join tb on ta.id=tb.id',
        'select * from (ta join tb on ta.id=tb.id)',
        'select * from (((ta join tb on ta.id=tb.id)))'], buildJoin('INNER JOIN'));
    (0, helpers_1.checkSelect)(['select * from ta left join tb on ta.id=tb.id',
        'select * from ta left outer join tb on ta.id=tb.id'], buildJoin('LEFT JOIN'));
    (0, helpers_1.checkSelect)(['select * from ta right join tb on ta.id=tb.id',
        'select * from ta right outer join tb on ta.id=tb.id'], buildJoin('RIGHT JOIN'));
    (0, helpers_1.checkSelect)(['select * from ta full join tb on ta.id=tb.id',
        'select * from ta full outer join tb on ta.id=tb.id'], buildJoin('FULL JOIN'));
    (0, helpers_1.checkSelect)('select * from ta cross join tb on ta.id=tb.id', buildJoin('CROSS JOIN'));
    // implicit cross join
    (0, helpers_1.checkSelect)('select * from ta, tb where ta.id=tb.id', {
        type: 'select',
        columns: [{ expr: helpers_1.star }],
        from: [
            (0, helpers_1.tbl)('ta'),
            (0, helpers_1.tbl)('tb'),
        ],
        where: {
            type: 'binary',
            op: '=',
            left: {
                type: 'ref',
                table: { name: 'ta' },
                name: 'id',
            },
            right: {
                type: 'ref',
                table: { name: 'tb' },
                name: 'id',
            }
        }
    });
    // implicit cross join multiple tables
    (0, helpers_1.checkSelect)('select * from ta, tb, tc, td', {
        type: 'select',
        columns: [{ expr: helpers_1.star }],
        from: [
            (0, helpers_1.tbl)('ta'),
            (0, helpers_1.tbl)('tb'),
            (0, helpers_1.tbl)('tc'),
            (0, helpers_1.tbl)('td'),
        ]
    });
    // mixed join
    (0, helpers_1.checkSelect)('select * from ta, tb cross join tc, (select * from td) as te', {
        type: 'select',
        columns: [{ expr: helpers_1.star }],
        from: [
            (0, helpers_1.tbl)('ta'),
            (0, helpers_1.tbl)('tb'),
            {
                type: 'table',
                name: (0, helpers_1.name)('tc'),
                join: {
                    type: 'CROSS JOIN',
                },
            },
            {
                type: 'statement',
                alias: 'te',
                statement: {
                    type: 'select',
                    columns: [{ expr: helpers_1.star }],
                    from: [(0, helpers_1.tbl)('td')],
                },
            },
        ],
    });
    // double join with and without parens
    (0, helpers_1.checkSelect)([`select * from ta cross join tb cross join tc`,
        `select * from (ta cross join tb) cross join tc`], {
        type: 'select',
        columns: [{ expr: helpers_1.star }],
        from: [
            (0, helpers_1.tbl)('ta'),
            {
                type: 'table',
                name: (0, helpers_1.name)('tb'),
                join: {
                    type: 'CROSS JOIN',
                },
            },
            {
                type: 'table',
                name: (0, helpers_1.name)('tc'),
                join: {
                    type: 'CROSS JOIN',
                },
            }
        ],
    });
    // join, then implicit cross join
    (0, helpers_1.checkSelect)(`select * from (ta cross join tb), tc`, {
        type: 'select',
        columns: [{ expr: helpers_1.star }],
        from: [
            (0, helpers_1.tbl)('ta'),
            {
                type: 'table',
                name: (0, helpers_1.name)('tb'),
                join: {
                    type: 'CROSS JOIN',
                },
            },
            (0, helpers_1.tbl)('tc'),
        ],
    });
    (0, helpers_1.checkSelect)(`SELECT *
                FROM STUD_ASS_PROGRESS
                LEFT JOIN ACCURACY
                USING("studentId")`, {
        type: 'select',
        columns: [{ expr: helpers_1.star }],
        from: [(0, helpers_1.tbl)('stud_ass_progress'),
            {
                type: 'table',
                name: (0, helpers_1.name)('accuracy'),
                join: {
                    type: 'LEFT JOIN',
                    using: [{ name: 'studentId' }],
                }
            }
        ]
    });
    (0, helpers_1.checkSelect)(['select current_schema()'], {
        type: 'select',
        columns: [{
                expr: {
                    type: 'call',
                    function: {
                        name: 'current_schema',
                    },
                    args: [],
                }
            }]
    });
    (0, helpers_1.checkSelect)(`select '1'::double precision`, {
        type: 'select',
        columns: [{
                expr: {
                    type: 'cast',
                    operand: { type: 'string', value: '1' },
                    to: { name: 'double precision' },
                }
            }]
    });
    (0, helpers_1.checkSelect)(`select '1'::"double precision"`, {
        type: 'select',
        columns: [{
                expr: {
                    type: 'cast',
                    operand: { type: 'string', value: '1' },
                    to: { name: 'double precision', doubleQuoted: true },
                }
            }]
    });
    (0, helpers_1.checkSelect)(`select '1'::double precision x`, {
        type: 'select',
        columns: [{
                alias: { name: 'x' },
                expr: {
                    type: 'cast',
                    operand: { type: 'string', value: '1' },
                    to: { name: 'double precision' },
                }
            }]
    });
    (0, helpers_1.checkSelect)(['select now()::time without time zone'], {
        type: 'select',
        columns: [{
                expr: {
                    type: 'cast',
                    operand: {
                        type: 'call',
                        function: { name: 'now' },
                        args: [],
                    },
                    to: { name: 'time without time zone' },
                }
            }]
    });
    (0, helpers_1.checkSelect)(['select distinct a from test'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        distinct: 'distinct',
        columns: (0, helpers_1.columns)({ type: 'ref', name: 'a' }),
    });
    (0, helpers_1.checkSelect)(['select distinct on (a) a from test'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        distinct: [{ type: 'ref', name: 'a' }],
        columns: (0, helpers_1.columns)({ type: 'ref', name: 'a' }),
    });
    (0, helpers_1.checkSelect)(['select distinct on (a, b) a from test'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        distinct: [{ type: 'ref', name: 'a' }, { type: 'ref', name: 'b' }],
        columns: (0, helpers_1.columns)({ type: 'ref', name: 'a' }),
    });
    (0, helpers_1.checkSelect)(['select count(distinct("userId")) from photo'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('photo')],
        columns: (0, helpers_1.columns)({
            type: 'call',
            function: { name: 'count' },
            distinct: 'distinct',
            args: [(0, helpers_1.ref)('userId')],
        })
    });
    (0, helpers_1.checkSelect)(['select max(distinct("userId")) from photo'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('photo')],
        columns: (0, helpers_1.columns)({
            type: 'call',
            function: { name: 'max' },
            distinct: 'distinct',
            args: [(0, helpers_1.ref)('userId')],
        })
    });
    (0, helpers_1.checkSelect)(['select all a from test'], {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        distinct: 'all',
        columns: (0, helpers_1.columns)({ type: 'ref', name: 'a' }),
    });
    (0, helpers_1.checkStatement)(`VALUES (1, 1+1), (3, 4)`, {
        type: 'values',
        values: [
            [(0, helpers_1.int)(1), (0, helpers_1.binary)((0, helpers_1.int)(1), '+', (0, helpers_1.int)(1))],
            [(0, helpers_1.int)(3), (0, helpers_1.int)(4)],
        ]
    });
    (0, helpers_1.checkSelect)([`select * from (values (1, 'one'), (2, 'two')) as vals (num, letter)`], {
        type: 'select',
        from: [{
                type: 'statement',
                statement: {
                    type: 'values',
                    values: [
                        [{ type: 'integer', value: 1 }, { type: 'string', value: 'one' }],
                        [{ type: 'integer', value: 2 }, { type: 'string', value: 'two' }],
                    ],
                },
                alias: 'vals',
                columnNames: [{ name: 'num' }, { name: 'letter' }],
            }],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' })
    });
    (0, helpers_1.checkSelect)([`select * from (values (1, 'one'), (2, 'two')) as vals`], {
        type: 'select',
        from: [{
                type: 'statement',
                statement: {
                    type: 'values',
                    values: [
                        [{ type: 'integer', value: 1 }, { type: 'string', value: 'one' }],
                        [{ type: 'integer', value: 2 }, { type: 'string', value: 'two' }],
                    ],
                },
                alias: 'vals',
            }],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' })
    });
    (0, helpers_1.checkSelect)([`SELECT t1.id FROM (ta t1 JOIN tb t2 ON ((t1.id = t2.n)));`], {
        type: 'select',
        columns: (0, helpers_1.columns)({
            type: 'ref',
            name: 'id',
            table: { name: 't1' },
        }),
        from: [{
                type: 'table',
                name: {
                    name: 'ta',
                    alias: 't1',
                },
            }, {
                type: 'table',
                name: {
                    name: 'tb',
                    alias: 't2',
                },
                join: {
                    type: 'INNER JOIN',
                    on: {
                        type: 'binary',
                        op: '=',
                        left: {
                            type: 'ref',
                            table: { name: 't1' },
                            name: 'id',
                        },
                        right: {
                            type: 'ref',
                            table: { name: 't2' },
                            name: 'n',
                        },
                    }
                }
            }]
    });
    (0, helpers_1.checkSelect)([`select * from concat('a', 'b')`], {
        type: 'select',
        from: [{
                type: 'call',
                function: { name: 'concat' },
                args: [
                    { type: 'string', value: 'a' },
                    { type: 'string', value: 'b' },
                ]
            }],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
    });
    (0, helpers_1.checkSelect)([`select * from concat('a') as a join concat('b') as b on b=a`], {
        type: 'select',
        from: [{
                type: 'call',
                function: { name: 'concat' },
                alias: { name: 'a' },
                args: [
                    { type: 'string', value: 'a' },
                ]
            }, {
                type: 'call',
                function: { name: 'concat' },
                args: [
                    { type: 'string', value: 'b' },
                ],
                alias: { name: 'b' },
                join: {
                    type: 'INNER JOIN',
                    on: {
                        type: 'binary',
                        op: '=',
                        left: {
                            type: 'ref',
                            name: 'b',
                        },
                        right: {
                            type: 'ref',
                            name: 'a',
                        },
                    }
                },
            }],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
    });
    (0, helpers_1.checkSelect)([`select * from concat('a', 'b') as tbl`], {
        type: 'select',
        from: [{
                type: 'call',
                function: { name: 'concat' },
                alias: { name: 'tbl' },
                args: [
                    { type: 'string', value: 'a' },
                    { type: 'string', value: 'b' },
                ]
            }],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
    });
    (0, helpers_1.checkSelect)([`select 1 from fn() alias`, `select 1 from fn() as alias`], {
        type: 'select',
        from: [{
                type: 'call',
                function: { name: 'fn' },
                alias: { name: 'alias' },
                args: [],
            }],
        columns: (0, helpers_1.columns)({ type: 'integer', value: 1 }),
    });
    (0, helpers_1.checkSelect)('select * from test for update', {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        for: {
            type: 'update',
        }
    });
    (0, helpers_1.checkSelect)('select * from test for no key update', {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        for: {
            type: 'no key update',
        }
    });
    (0, helpers_1.checkSelect)('select * from test for share', {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        for: {
            type: 'share',
        }
    });
    (0, helpers_1.checkSelect)('select * from test for key share', {
        type: 'select',
        from: [(0, helpers_1.tbl)('test')],
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        for: {
            type: 'key share',
        }
    });
});
//# sourceMappingURL=select.test.js.map