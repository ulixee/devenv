"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSql = void 0;
const astVisitor_1 = require("./astVisitor");
const utils_1 = require("./utils");
const pgEscape_1 = require("./pgEscape");
const keywords_1 = require("./helpers/keywords");
const AstDefaultMapper_1 = require("./AstDefaultMapper");
const kwSet = new Set(keywords_1.sqlKeywords.map(x => x.toLowerCase()));
let ret = [];
function name(nm) {
    return ident(nm.name);
}
function ident(nm, forceDoubleQuote) {
    if (!forceDoubleQuote) {
        // only add quotes if has upper cases, or if it is a keyword.
        const low = nm.toLowerCase();
        if (low === nm && !kwSet.has(low) && /^[a-z][a-z0-9_]*$/.test(low)) {
            return nm;
        }
    }
    return `"${nm}"`;
}
function list(elems, act, addParen) {
    if (addParen) {
        ret.push('(');
    }
    let first = true;
    for (const e of elems) {
        if (!first) {
            ret.push(', ');
        }
        first = false;
        act(e);
    }
    if (addParen) {
        ret.push(')');
    }
}
function visitQualifiedName(cs, forceDoubleQuote) {
    if (cs.schema) {
        ret.push(ident(cs.schema), '.');
    }
    ret.push(ident(cs.name, forceDoubleQuote), ' ');
}
function visitOrderBy(m, orderBy) {
    ret.push(' ORDER BY ');
    list(orderBy, e => {
        m.expr(e.by);
        if (e.order) {
            ret.push(' ', e.order, ' ');
        }
        if (e.nulls) {
            ret.push(' NULLS ', e.nulls, ' ');
        }
    }, false);
}
function visitQColumn(col) {
    if (col.schema) {
        ret.push(ident(col.schema), '.');
    }
    ret.push(ident(col.table), '.', ident(col.column), ' ');
}
function join(m, j, tbl) {
    if (!j) {
        tbl();
        return;
    }
    ret.push(j.type, ' ');
    tbl();
    if (j.on) {
        ret.push('ON ');
        m.expr(j.on);
    }
    if (j.using) {
        ret.push('USING (');
        list(j.using, x => ret.push(name(x)), false);
        ret.push(') ');
    }
    ret.push(' ');
}
function visitOp(v) {
    if (v.opSchema) {
        ret.push(' operator(', ident(v.opSchema), '.', v.op, ') ');
    }
    else {
        ret.push(' ', v.op, ' ');
    }
}
const visitor = (0, astVisitor_1.astVisitor)(m => ({
    array: v => {
        ret.push(v.type === 'array' ? 'ARRAY[' : '(');
        list(v.expressions, e => m.expr(e), false);
        ret.push(v.type === 'array' ? ']' : ')');
    },
    arrayIndex: v => {
        m.expr(v.array);
        ret.push('[');
        m.expr(v.index);
        ret.push('] ');
    },
    expr: e => {
        if (e.type === 'ref') {
            m.ref(e);
            return;
        }
        // lists can become incorrect with an additional set of parentheses
        if (e.type === 'list' || e.type === 'parameter') {
            m.super().expr(e);
            return;
        }
        // this forces to respect precedence
        // (however, it will introduce lots of unnecessary parenthesis)
        ret.push('(');
        m.super().expr(e);
        ret.push(')');
    },
    callOverlay: o => {
        ret.push('OVERLAY(');
        m.expr(o.value);
        ret.push(' PLACING ');
        m.expr(o.placing);
        ret.push(' FROM ');
        m.expr(o.from);
        if (o.for) {
            ret.push(' FOR ');
            m.expr(o.for);
        }
        ret.push(')');
    },
    callSubstring: s => {
        ret.push('SUBSTRING(');
        m.expr(s.value);
        if (s.from) {
            ret.push(' FROM ');
            m.expr(s.from);
        }
        if (s.for) {
            ret.push(' FOR ');
            m.expr(s.for);
        }
        ret.push(')');
    },
    binary: v => {
        m.expr(v.left);
        visitOp(v);
        m.expr(v.right);
    },
    call: v => {
        visitQualifiedName(v.function);
        ret.push('(');
        if (v.distinct) {
            ret.push(v.distinct, ' ');
        }
        list(v.args, e => {
            if (e.type === 'integer' ||
                e.type === 'string' ||
                e.type === 'boolean' ||
                e.type === 'numeric' ||
                e.type === 'constant' ||
                e.type === 'null')
                return m.constant(e);
            if (e.type === 'parameter')
                return m.parameter(e);
            if (e.type === 'values')
                return m.values(e);
            return m.expr(e);
        }, false);
        if (v.orderBy) {
            visitOrderBy(m, v.orderBy);
        }
        ret.push(') ');
        if (v.filter) {
            ret.push('filter (where ');
            m.expr(v.filter);
            ret.push(') ');
        }
        if (v.over) {
            ret.push('over (');
            if (v.over.partitionBy) {
                ret.push('PARTITION BY ');
                list(v.over.partitionBy, x => m.expr(x), false);
                ret.push(' ');
            }
            if (v.over.orderBy) {
                visitOrderBy(m, v.over.orderBy);
                ret.push(' ');
            }
            ret.push(') ');
        }
    },
    case: c => {
        ret.push('CASE ');
        if (c.value) {
            m.expr(c.value);
        }
        for (const e of c.whens) {
            ret.push(' WHEN ');
            m.expr(e.when);
            ret.push(' THEN ');
            m.expr(e.value);
        }
        if (c.else) {
            ret.push(' ELSE ');
            m.expr(c.else);
        }
        ret.push(' END ');
    },
    cast: c => {
        m.expr(c.operand);
        ret.push('::');
        m.dataType(c.to);
    },
    constant: c => {
        switch (c.type) {
            case 'boolean':
                ret.push(c.value ? 'true' : 'false');
                break;
            case 'integer':
                ret.push(c.value.toString(10));
                break;
            case 'numeric':
                ret.push(c.value.toString());
                if (Number.isInteger(c.value)) {
                    ret.push('.');
                }
                break;
            case 'null':
                ret.push('null');
                break;
            case 'constant':
                break;
            case 'string':
                ret.push((0, pgEscape_1.default)(c.value));
                break;
            default:
                throw utils_1.NotSupported.never(c);
        }
    },
    valueKeyword: v => {
        ret.push(v.keyword, ' ');
    },
    comment: c => {
        ret.push('COMMENT ON ', c.on.type.toUpperCase(), ' ');
        switch (c.on.type) {
            case 'column':
                visitQColumn(c.on.column);
                break;
            default:
                visitQualifiedName(c.on.name);
                break;
        }
        ret.push(' IS ', (0, pgEscape_1.default)(c.comment), ' ');
    },
    extract: v => {
        ret.push('EXTRACT (', v.field.name.toUpperCase(), ' FROM ');
        m.expr(v.from);
        ret.push(') ');
    },
    dataType: (d) => {
        if (d?.kind === 'array') {
            m.dataType(d.arrayOf);
            ret.push('[]');
            return;
        }
        d = d;
        if (!d?.name) {
            ret.push('unknown');
            return;
        }
        let appendConfig = true;
        if (d.schema) {
            visitQualifiedName(d, d.doubleQuoted);
        }
        else if (d.doubleQuoted) {
            // see https://www.postgresql.org/docs/13/datatype.html
            // & issue https://github.com/oguimbal/pgsql-ast-parser/issues/38
            visitQualifiedName(d, true);
        }
        else {
            switch (d.name) {
                case 'double precision':
                case 'character varying':
                case 'bit varying':
                    ret.push(d.name, ' ');
                    break;
                case 'time without time zone':
                case 'timestamp without time zone':
                case 'time with time zone':
                case 'timestamp with time zone':
                    const parts = d.name.split(' ');
                    const part = parts.shift();
                    if (part)
                        ret.push(part);
                    if (d.config?.length) {
                        list(d.config, v => ret.push(v.toString(10)), true);
                    }
                    ret.push(' ');
                    ret.push(parts.join(' '), ' ');
                    appendConfig = false;
                    break;
                default:
                    visitQualifiedName(d);
                    break;
            }
        }
        if (appendConfig && d.config?.length) {
            list(d.config, v => ret.push(v.toString(10)), true);
        }
    },
    delete: t => {
        ret.push('DELETE FROM ');
        m.tableRef(t.from);
        if (t.where) {
            ret.push(' WHERE ');
            m.expr(t.where);
        }
        if (t.returning) {
            ret.push(' RETURNING ');
            list(t.returning, r => m.selectionColumn(r), false);
        }
        ret.push(' ');
    },
    from: t => m.super().from(t),
    fromCall: s => {
        join(m, s.join, () => {
            m.call(s);
            if (s.withOrdinality) {
                ret.push(' WITH ORDINALITY');
            }
            if (s.alias) {
                ret.push(' AS ', name(s.alias), ' ');
                const len = s.alias.columns?.length ?? 0;
                if (len > 0) {
                    ret.push('(');
                    for (let ix = 0; ix < len; ++ix) {
                        if (ix !== 0) {
                            ret.push(', ');
                        }
                        ret.push(name(s.alias.columns[ix]));
                    }
                    ret.push(')');
                }
            }
        });
        ret.push(' ');
    },
    fromStatement: s => {
        // todo: use 's.db' if defined
        join(m, s.join, () => {
            ret.push('(');
            m.select(s.statement);
            ret.push(') ');
            if (s.alias) {
                ret.push(' AS ', ident(s.alias));
                if (s.columnNames) {
                    list(s.columnNames, c => ret.push(name(c)), true);
                }
                ret.push(' ');
            }
        });
        ret.push(' ');
    },
    values: s => {
        ret.push('VALUES ');
        list(s.values, vlist => {
            list(vlist, e => {
                m.expr(e);
            }, true);
        }, false);
    },
    fromTable: s => {
        join(m, s.join, () => {
            m.tableRef(s.name);
            if (s.name.columnNames) {
                if (!s.name.alias) {
                    throw new Error('Cannot specify aliased column names without an alias');
                }
                list(s.name.columnNames, c => ret.push(name(c)), true);
            }
        });
    },
    join: () => {
        throw new Error('Should not happen 💀');
    },
    insert: i => {
        ret.push('INSERT INTO ');
        m.tableRef(i.into);
        if (i.columns) {
            ret.push('(', i.columns.map(name).join(', '), ')');
        }
        ret.push(' ');
        if (i.overriding) {
            ret.push('OVERRIDING ', i.overriding.toUpperCase(), ' VALUE ');
        }
        m.select(i.insert);
        ret.push(' ');
        if (i.returning) {
            ret.push(' RETURNING ');
            list(i.returning, r => m.selectionColumn(r), false);
        }
    },
    default: () => {
        ret.push(' DEFAULT ');
    },
    member: e => {
        m.expr(e.operand);
        ret.push(e.op);
        ret.push(typeof e.member === 'number' ? e.member.toString(10) : (0, pgEscape_1.default)(e.member));
    },
    ref: r => {
        if (r.table) {
            visitQualifiedName(r.table);
            ret.push('.');
        }
        ret.push(r.name === '*' ? '*' : ident(r.name));
    },
    parameter: p => {
        // NOTE: commented out because this isn't supported in Sqlite, but will be needed in Postgres
        // if ('key' in p) {
        //   ret.push(ident((p as any).key), ' => ');
        // }
        ret.push(p.name);
    },
    select: s => m.super().select(s),
    selection: s => {
        ret.push('SELECT ');
        if (s.distinct) {
            if (typeof s.distinct === 'string') {
                ret.push(s.distinct.toUpperCase());
            }
            else {
                ret.push(' DISTINCT ON ');
                list(s.distinct, v => m.expr(v), true);
            }
            ret.push(' ');
        }
        if (s.columns) {
            list(s.columns, c => m.selectionColumn(c), false);
        }
        ret.push(' ');
        if (s.from) {
            ret.push('FROM ');
            const tblCnt = s.from.length;
            for (let i = 0; i < tblCnt; i++) {
                const f = s.from[i];
                if (i > 0 && !f.join) {
                    // implicit cross join (https://www.postgresql.org/docs/9.5/sql-select.html#SQL-FROM)
                    ret.push(',');
                }
                m.from(f);
            }
            ret.push(' ');
        }
        if (s.where) {
            ret.push('WHERE ');
            m.expr(s.where);
            ret.push(' ');
        }
        if (s.groupBy) {
            ret.push('GROUP BY ');
            list(s.groupBy, e => m.expr(e), false);
            ret.push(' ');
        }
        if (s.orderBy) {
            visitOrderBy(m, s.orderBy);
            ret.push(' ');
        }
        if (s.limit) {
            if (s.limit.offset) {
                ret.push(`OFFSET `);
                m.expr(s.limit.offset);
            }
            if (s.limit.limit) {
                ret.push(`LIMIT `);
                m.expr(s.limit.limit);
            }
        }
        if (s.for) {
            ret.push('FOR ', s.for.type.toUpperCase());
        }
    },
    arraySelect: s => {
        ret.push('array(');
        m.select(s.select);
        ret.push(')');
    },
    selectionColumn: c => {
        m.expr(c.expr);
        if (c.alias) {
            ret.push(' AS ', name(c.alias));
        }
        ret.push(' ');
    },
    set: s => {
        ret.push(name(s.column), ' = ');
        m.expr(s.value);
        ret.push(' ');
    },
    statement: s => m.super().statement(s),
    tableRef: r => {
        visitQualifiedName(r);
        if (r.alias) {
            ret.push(' AS ', ident(r.alias));
        }
        ret.push(' ');
    },
    ternary: t => {
        m.expr(t.value);
        ret.push(' ', t.op, ' ');
        m.expr(t.lo);
        ret.push(' AND ');
        m.expr(t.hi);
        ret.push(' ');
    },
    unary: t => {
        switch (t.op) {
            case '+':
            case '-':
                // prefix ops
                visitOp(t);
                m.expr(t.operand);
                break;
            case 'NOT':
                // prefix ops
                ret.push(t.op);
                ret.push(' ');
                m.expr(t.operand);
                break;
            default:
                // postfix ops
                m.expr(t.operand);
                ret.push(' ');
                ret.push(t.op);
        }
    },
    update: u => {
        ret.push('UPDATE ');
        m.tableRef(u.table);
        ret.push(' SET ');
        list(u.sets, s => m.set(s), false);
        ret.push(' ');
        if (u.from) {
            ret.push('FROM ');
            m.from(u.from);
            ret.push(' ');
        }
        if (u.where) {
            ret.push('WHERE ');
            m.expr(u.where);
            ret.push(' ');
        }
        if (u.returning) {
            ret.push(' RETURNING ');
            list(u.returning, r => m.selectionColumn(r), false);
            ret.push(' ');
        }
    },
}));
exports.toSql = {};
const proto = AstDefaultMapper_1.default.prototype;
for (const k of Object.getOwnPropertyNames(proto)) {
    const orig = proto[k];
    if (k === 'constructor' || k === 'super' || typeof orig !== 'function') {
        continue;
    }
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    exports.toSql[k] = (...args) => {
        try {
            visitor[k].apply(visitor, args);
            return ret.join('').trim();
        }
        finally {
            ret = [];
        }
    };
}
//# sourceMappingURL=toSql.js.map