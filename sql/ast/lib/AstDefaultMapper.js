"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class AstDefaultMapper {
    super() {
        return new SkipModifier(this);
    }
    statement(val) {
        switch (val.type) {
            case 'delete':
                return this.delete(val);
            case 'insert':
                return this.insert(val);
            case 'select':
                return this.selection(val);
            case 'update':
                return this.update(val);
            case 'comment':
                return this.comment(val);
            case 'values':
                return this.values(val);
            default:
                throw utils_1.NotSupported.never(val);
        }
    }
    comment(val) {
        // not really supported :/
        return val;
    }
    update(val) {
        if (!val) {
            return val;
        }
        const table = this.tableRef(val.table);
        if (!table) {
            return null; // nothing to update
        }
        const from = val.from && this.from(val.from);
        const where = val.where && this.expr(val.where);
        const sets = (0, utils_1.arrayNilMap)(val.sets, x => this.set(x));
        if (!sets?.length) {
            return null; // nothing to update
        }
        const returning = (0, utils_1.arrayNilMap)(val.returning, c => this.selectionColumn(c));
        return (0, utils_1.assignChanged)(val, {
            table,
            where,
            sets,
            from,
            returning,
        });
    }
    insert(val) {
        const into = this.tableRef(val.into);
        if (!into) {
            return null; // nowhere to insert into
        }
        const select = val.insert && this.select(val.insert);
        if (!select) {
            // nothing to insert
            return null;
        }
        const returning = (0, utils_1.arrayNilMap)(val.returning, c => this.selectionColumn(c));
        return (0, utils_1.assignChanged)(val, {
            into,
            insert: select,
            returning,
        });
    }
    delete(val) {
        const from = this.tableRef(val.from);
        if (!from) {
            return null; // nothing to delete
        }
        const where = val.where && this.expr(val.where);
        const returning = (0, utils_1.arrayNilMap)(val.returning, c => this.selectionColumn(c));
        return (0, utils_1.assignChanged)(val, {
            where,
            returning,
            from,
        });
    }
    set(st) {
        const value = this.expr(st.value);
        if (!value) {
            return null;
        }
        return (0, utils_1.assignChanged)(st, {
            value,
        });
    }
    // =========================================
    // ================ STUFF ==================
    // =========================================
    /** Called when a data type definition is encountered */
    dataType(dataType) {
        return dataType;
    }
    /** Called when an alias of a table is created */
    tableRef(st) {
        return st;
    }
    // =========================================
    // ============== SELECTIONS ==============
    // =========================================
    select(val) {
        switch (val.type) {
            case 'select':
                return this.selection(val);
            case 'values':
                return this.values(val);
            default:
                throw utils_1.NotSupported.never(val);
        }
    }
    selection(val) {
        const from = (0, utils_1.arrayNilMap)(val.from, c => this.from(c));
        const columns = (0, utils_1.arrayNilMap)(val.columns, c => this.selectionColumn(c));
        const where = val.where && this.expr(val.where);
        const groupBy = (0, utils_1.arrayNilMap)(val.groupBy, c => this.expr(c));
        const orderBy = this.orderBy(val.orderBy);
        const limit = (0, utils_1.assignChanged)(val.limit, {
            limit: this.expr(val.limit?.limit),
            offset: this.expr(val.limit?.offset),
        });
        return (0, utils_1.assignChanged)(val, {
            from,
            columns,
            where,
            groupBy,
            orderBy,
            limit,
        });
    }
    orderBy(orderBy) {
        return (0, utils_1.arrayNilMap)(orderBy, c => {
            const by = this.expr(c.by);
            if (!by) {
                return null;
            }
            if (by === c.by) {
                return c;
            }
            return {
                ...c,
                by,
            };
        });
    }
    from(from) {
        switch (from.type) {
            case 'table':
                return this.fromTable(from);
            case 'statement':
                return this.fromStatement(from);
            case 'call':
                return this.fromCall(from);
            default:
                throw utils_1.NotSupported.never(from);
        }
    }
    fromCall(from) {
        const call = this.call(from);
        if (!call || call.type !== 'call') {
            return null;
        }
        return (0, utils_1.assignChanged)(from, call);
    }
    fromStatement(from) {
        const statement = this.select(from.statement);
        if (!statement) {
            return null; // nothing to select from
        }
        const join = from.join && this.join(from.join);
        return (0, utils_1.assignChanged)(from, {
            statement,
            join,
        });
    }
    values(from) {
        const values = (0, utils_1.arrayNilMap)(from.values, x => (0, utils_1.arrayNilMap)(x, y => this.expr(y)));
        if (!values?.length) {
            return null; // nothing to select from
        }
        return (0, utils_1.assignChanged)(from, {
            values,
        });
    }
    join(join) {
        const on = join.on && this.expr(join.on);
        if (!on && !join.using) {
            return join;
        }
        return (0, utils_1.assignChanged)(join, {
            on,
        });
    }
    fromTable(from) {
        const nfrom = this.tableRef(from.name);
        if (!nfrom) {
            return null; // nothing to select from
        }
        const join = from.join && this.join(from.join);
        return (0, utils_1.assignChanged)(from, {
            name: nfrom,
            join,
        });
    }
    selectionColumn(val) {
        const expr = this.expr(val.expr);
        if (!expr) {
            return null; // not selected anymore
        }
        return (0, utils_1.assignChanged)(val, {
            expr,
        });
    }
    // =========================================
    // ============== EXPRESSIONS ==============
    // =========================================
    expr(val) {
        if (!val) {
            return val;
        }
        switch (val.type) {
            case 'binary':
                return this.binary(val);
            case 'unary':
                return this.unary(val);
            case 'ref':
                return this.ref(val);
            case 'string':
            case 'numeric':
            case 'integer':
            case 'boolean':
            case 'constant':
            case 'null':
                return this.constant(val);
            case 'list':
            case 'array':
                return this.array(val);
            case 'array select':
                return this.arraySelect(val);
            case 'call':
                return this.call(val);
            case 'cast':
                return this.cast(val);
            case 'case':
                return this.case(val);
            case 'member':
                return this.member(val);
            case 'arrayIndex':
                return this.arrayIndex(val);
            case 'ternary':
                return this.ternary(val);
            case 'select':
                return this.select(val);
            case 'keyword':
                return this.valueKeyword(val);
            case 'parameter':
                return this.parameter(val);
            case 'extract':
                return this.extract(val);
            case 'overlay':
                return this.callOverlay(val);
            case 'substring':
                return this.callSubstring(val);
            case 'values':
                return this.values(val);
            case 'default':
                return this.default(val);
            default:
                throw utils_1.NotSupported.never(val);
        }
    }
    arraySelect(val) {
        const select = this.select(val.select);
        if (!select) {
            return null;
        }
        return (0, utils_1.assignChanged)(val, { select });
    }
    extract(st) {
        const from = this.expr(st.from);
        if (!from) {
            return null;
        }
        return (0, utils_1.assignChanged)(st, { from });
    }
    valueKeyword(val) {
        return val;
    }
    ternary(val) {
        const value = this.expr(val.value);
        const lo = this.expr(val.lo);
        const hi = this.expr(val.hi);
        if (!value || !lo || !hi) {
            return null; // missing a branch
        }
        return (0, utils_1.assignChanged)(val, {
            value,
            lo,
            hi,
        });
    }
    parameter(st) {
        return st;
    }
    arrayIndex(val) {
        const array = this.expr(val.array);
        const index = this.expr(val.index);
        if (!array || !index) {
            return null;
        }
        return (0, utils_1.assignChanged)(val, {
            array,
            index,
        });
    }
    member(val) {
        const operand = this.expr(val.operand);
        if (!operand) {
            return null;
        }
        return (0, utils_1.assignChanged)(val, {
            operand,
        });
    }
    case(value) {
        const val = value.value && this.expr(value.value);
        const whens = (0, utils_1.arrayNilMap)(value.whens, when => {
            const w = this.expr(when.when);
            const v = this.expr(when.value);
            if (!w || !v) {
                return null;
            }
            return (0, utils_1.assignChanged)(when, {
                value: v,
                when: w,
            });
        });
        if (!whens?.length) {
            return null; // no case
        }
        const els = value.else && this.expr(value.else);
        return (0, utils_1.assignChanged)(value, {
            value: val,
            whens,
            else: els,
        });
    }
    cast(val) {
        const operand = this.expr(val.operand);
        if (!operand) {
            return null;
        }
        return (0, utils_1.assignChanged)(val, {
            operand,
        });
    }
    call(val) {
        const args = (0, utils_1.arrayNilMap)(val.args, arg => this.expr(arg));
        if (!args) {
            return null;
        }
        const orderBy = this.orderBy(val.orderBy);
        const filter = this.expr(val.filter);
        return (0, utils_1.assignChanged)(val, {
            args,
            orderBy,
            filter,
        });
    }
    callSubstring(val) {
        return (0, utils_1.assignChanged)(val, {
            value: this.expr(val.value),
            from: this.expr(val.from),
            for: this.expr(val.for),
        });
    }
    callOverlay(val) {
        return (0, utils_1.assignChanged)(val, {
            value: this.expr(val.value),
            placing: this.expr(val.placing),
            from: this.expr(val.from),
            for: this.expr(val.for),
        });
    }
    array(val) {
        const expressions = (0, utils_1.arrayNilMap)(val.expressions, exp => this.expr(exp));
        if (!expressions) {
            return null;
        }
        return (0, utils_1.assignChanged)(val, {
            expressions,
        });
    }
    constant(value) {
        return value;
    }
    default(value) {
        return value;
    }
    /** Called when a reference is used */
    ref(val) {
        return val;
    }
    unary(val) {
        const operand = this.expr(val.operand);
        if (!operand) {
            return null;
        }
        return (0, utils_1.assignChanged)(val, {
            operand,
        });
    }
    binary(val) {
        const left = this.expr(val.left);
        const right = this.expr(val.right);
        if (!left || !right) {
            return null;
        }
        return (0, utils_1.assignChanged)(val, {
            left,
            right,
        });
    }
}
exports.default = AstDefaultMapper;
// ====== auto implement the replace mechanism
const proto = AstDefaultMapper.prototype;
for (const k of Object.getOwnPropertyNames(proto)) {
    const orig = proto[k];
    if (k === 'constructor' || k === 'super' || typeof orig !== 'function') {
        continue;
    }
    Object.defineProperty(proto, k, {
        configurable: false,
        get() {
            // eslint-disable-next-line func-names
            return function (...args) {
                if (this.skipNext) {
                    this.skipNext = false;
                    return orig.apply(this, args);
                }
                const impl = this.wrapped?.[k];
                if (!impl) {
                    return orig.apply(this, args);
                }
                return impl.apply(this.wrapped, args);
            };
        }
    });
}
// ====== auto implement the skip mechanism
class SkipModifier extends AstDefaultMapper {
    constructor(parent) {
        super();
        this.parent = parent;
    }
}
for (const k of Object.getOwnPropertyNames(proto)) {
    const orig = proto[k];
    if (k === 'constructor' || k === 'super' || typeof orig !== 'function') {
        continue;
    }
    Object.defineProperty(SkipModifier.prototype, k, {
        configurable: false,
        get() {
            // eslint-disable-next-line func-names
            return function (...args) {
                this.parent.skipNext = true;
                return orig.apply(this.parent, args);
            };
        }
    });
}
//# sourceMappingURL=AstDefaultMapper.js.map