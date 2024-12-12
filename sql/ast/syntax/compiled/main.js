"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generated automatically by nearley, version unknown
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d) { return d[0]; }
const { lexerAny } = require('../../lib/helpers/lexer');
const { track, box, unbox, doubleQuoted } = require('../../lib/helpers/lexer');
// usage ex:  replace track(whatever) with debug(track)(whatever)
function debug(fn) {
    fn = fn || ((x) => x);
    return ((x, ...args) => {
        debugger;
        return fn(x, ...args);
    });
}
function asName(val) {
    return asNameWithColumns(val, undefined);
}
function asNameWithColumns(val, columns) {
    const name = toStr(val);
    if (!columns || columns.length === 0) {
        return track(val, { name });
    }
    return track(val, {
        name,
        columns: columns.map(c => ({ name: toStr(c) })),
    });
}
function asLit(val) {
    const value = toStr(val);
    return track(val, { value });
}
function unwrap(e) {
    if (Array.isArray(e) && e.length === 1) {
        e = unwrap(e[0]);
    }
    if (Array.isArray(e) && !e.length) {
        return null;
    }
    return unbox(e);
}
const get = (i) => (x) => track(x, x[i]);
const last = (x) => Array.isArray(x) ? track(x[x.length - 1], x[x.length - 1]) : x;
const trim = (x) => x && x.trim();
const value = (x) => x && x.value;
function flatten(e) {
    if (Array.isArray(e)) {
        const ret = [];
        for (const i of e) {
            ret.push(...flatten(i));
        }
        return ret;
    }
    if (!e) {
        return [];
    }
    return [e];
}
function asStr(value) {
    value = unbox(value);
    return value?.value ?? value;
}
function flattenStr(e) {
    const fl = flatten(unbox(e));
    return fl.filter(x => !!x)
        .map(x => asStr(x))
        .filter(x => typeof x === 'string')
        .map(x => x.trim())
        .filter(x => !!x);
}
function toStr(e, join) {
    return flattenStr(e).join(join || '');
}
function fromEntries(vals) {
    const ret = {};
    for (const [k, v] of vals) {
        ret[k] = v;
    }
    return ret;
}
const kwSensitivity = { sensitivity: 'accent' };
const eqInsensitive = (a, b) => a.localeCompare(b, undefined, kwSensitivity) === 0;
const notReservedKw = (kw) => (x, _, rej) => {
    const val = asStr(x[0]);
    if (eqInsensitive(val, kw)) {
        return box(x, kw);
    }
    return rej;
};
const kw = notReservedKw;
const anyKw = (...kw) => {
    const kwSet = new Set(kw);
    return (x, _, rej) => {
        const val = typeof x[0] === 'string' ? x[0] : x[0].value;
        return kwSet.has(val) ? val : rej;
    };
};
;
;
;
;
const grammar = {
    Lexer: lexerAny,
    ParserRules: [
        { "name": "lparen", "symbols": [(lexerAny.has("lparen") ? { type: "lparen" } : lparen)] },
        { "name": "rparen", "symbols": [(lexerAny.has("rparen") ? { type: "rparen" } : rparen)] },
        { "name": "number$subexpression$1", "symbols": ["float"] },
        { "name": "number$subexpression$1", "symbols": ["int"] },
        { "name": "number", "symbols": ["number$subexpression$1"], "postprocess": unwrap },
        { "name": "dot", "symbols": [(lexerAny.has("dot") ? { type: "dot" } : dot)], "postprocess": id },
        { "name": "float", "symbols": [(lexerAny.has("float") ? { type: "float" } : float)], "postprocess": x => box(x, parseFloat(unwrap(x))) },
        { "name": "int", "symbols": [(lexerAny.has("int") ? { type: "int" } : int)], "postprocess": x => box(x, parseInt(unwrap(x), 10)) },
        { "name": "comma", "symbols": [(lexerAny.has("comma") ? { type: "comma" } : comma)], "postprocess": id },
        { "name": "star", "symbols": [(lexerAny.has("star") ? { type: "star" } : star)], "postprocess": x => box(x, x[0].value) },
        { "name": "string$subexpression$1", "symbols": [(lexerAny.has("string") ? { type: "string" } : string)] },
        { "name": "string$subexpression$1", "symbols": [(lexerAny.has("eString") ? { type: "eString" } : eString)] },
        { "name": "string", "symbols": ["string$subexpression$1"], "postprocess": x => box(x, unwrap(x[0]).value) },
        { "name": "ident", "symbols": ["word"], "postprocess": get(0) },
        { "name": "word", "symbols": [(lexerAny.has("kw_primary") ? { type: "kw_primary" } : kw_primary)], "postprocess": x => box(x, 'primary') },
        { "name": "word", "symbols": [(lexerAny.has("kw_unique") ? { type: "kw_unique" } : kw_unique)], "postprocess": x => box(x, 'unique') },
        { "name": "word", "symbols": [(lexerAny.has("quoted_word") ? { type: "quoted_word" } : quoted_word)], "postprocess": x => box(x, x[0].value, true) },
        { "name": "word", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": x => box(x, x[0].value) },
        { "name": "collist_paren", "symbols": ["lparen", "collist", "rparen"], "postprocess": get(1) },
        { "name": "collist$ebnf$1", "symbols": [] },
        { "name": "collist$ebnf$1$subexpression$1", "symbols": ["comma", "ident"], "postprocess": last },
        { "name": "collist$ebnf$1", "symbols": ["collist$ebnf$1", "collist$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "collist", "symbols": ["ident", "collist$ebnf$1"], "postprocess": ([head, tail]) => {
                return [head, ...(tail || [])];
            } },
        { "name": "kw_between", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('between') },
        { "name": "kw_nothing", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('nothing') },
        { "name": "kw_if", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('if') },
        { "name": "kw_exists", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('exists') },
        { "name": "kw_key", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('key') },
        { "name": "kw_index", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('index') },
        { "name": "kw_extension", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('extension') },
        { "name": "kw_schema", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('schema') },
        { "name": "kw_nulls", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('nulls') },
        { "name": "kw_first", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('first') },
        { "name": "kw_last", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('last') },
        { "name": "kw_restart", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('restart') },
        { "name": "kw_filter", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('filter') },
        { "name": "kw_work", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('work') },
        { "name": "kw_read", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('read') },
        { "name": "kw_write", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('write') },
        { "name": "kw_isolation", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('isolation') },
        { "name": "kw_level", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('level') },
        { "name": "kw_serializable", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('serializable') },
        { "name": "kw_insert", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('insert') },
        { "name": "kw_value", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('value') },
        { "name": "kw_values", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('values') },
        { "name": "kw_update", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('update') },
        { "name": "kw_column", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('column') },
        { "name": "kw_set", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('set') },
        { "name": "kw_version", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('version') },
        { "name": "kw_rename", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('rename') },
        { "name": "kw_sequence", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('sequence') },
        { "name": "kw_temp", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('temp') },
        { "name": "kw_temporary", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('temporary') },
        { "name": "kw_add", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('add') },
        { "name": "kw_owner", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('owner') },
        { "name": "kw_owned", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('owned') },
        { "name": "kw_including", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('including') },
        { "name": "kw_excluding", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('excluding') },
        { "name": "kw_none", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('none') },
        { "name": "kw_operator", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('operator') },
        { "name": "kw_minvalue", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('minvalue') },
        { "name": "kw_maxvalue", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('maxvalue') },
        { "name": "kw_data", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('data') },
        { "name": "kw_type", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('type') },
        { "name": "kw_trigger", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('trigger') },
        { "name": "kw_delete", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('delete') },
        { "name": "kw_cache", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('cache') },
        { "name": "kw_cascade", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('cascade') },
        { "name": "kw_no", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('no') },
        { "name": "kw_timestamp", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('timestamp') },
        { "name": "kw_cycle", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('cycle') },
        { "name": "kw_function", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('function') },
        { "name": "kw_returns", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('returns') },
        { "name": "kw_language", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('language') },
        { "name": "kw_out", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('out') },
        { "name": "kw_inout", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('inout') },
        { "name": "kw_variadic", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('variadic') },
        { "name": "kw_action", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('action') },
        { "name": "kw_restrict", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('restrict') },
        { "name": "kw_increment", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('increment') },
        { "name": "kw_by", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('by') },
        { "name": "kw_row", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('row') },
        { "name": "kw_rows", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('rows') },
        { "name": "kw_next", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('next') },
        { "name": "kw_match", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('match') },
        { "name": "kw_replace", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('replace') },
        { "name": "kw_recursive", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('recursive') },
        { "name": "kw_view", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('view') },
        { "name": "kw_cascaded", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('cascaded') },
        { "name": "kw_unlogged", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('unlogged') },
        { "name": "kw_global", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('global') },
        { "name": "kw_option", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('option') },
        { "name": "kw_partial", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('partial') },
        { "name": "kw_partition", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('partition') },
        { "name": "kw_simple", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('simple') },
        { "name": "kw_generated", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('generated') },
        { "name": "kw_always", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('always') },
        { "name": "kw_identity", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('identity') },
        { "name": "kw_name", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('name') },
        { "name": "kw_enum", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('enum') },
        { "name": "kw_ordinality", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('ordinality') },
        { "name": "kw_overriding", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('overriding') },
        { "name": "kw_over", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('over') },
        { "name": "kw_system", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('system') },
        { "name": "kw_comment", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('comment') },
        { "name": "kw_time", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('time') },
        { "name": "kw_at", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('at') },
        { "name": "kw_zone", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('zone') },
        { "name": "kw_interval", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('interval') },
        { "name": "kw_hour", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('hour') },
        { "name": "kw_minute", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('minute') },
        { "name": "kw_local", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('local') },
        { "name": "kw_continue", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('continue') },
        { "name": "kw_share", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('share') },
        { "name": "kw_refresh", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": notReservedKw('refresh') },
        { "name": "kw_ifnotexists", "symbols": ["kw_if", (lexerAny.has("kw_not") ? { type: "kw_not" } : kw_not), "kw_exists"] },
        { "name": "kw_ifexists", "symbols": ["kw_if", "kw_exists"] },
        { "name": "kw_withordinality", "symbols": [(lexerAny.has("kw_with") ? { type: "kw_with" } : kw_with), "kw_ordinality"] },
        { "name": "kw_not_null", "symbols": [(lexerAny.has("kw_not") ? { type: "kw_not" } : kw_not), (lexerAny.has("kw_null") ? { type: "kw_null" } : kw_null)] },
        { "name": "kw_primary_key", "symbols": [(lexerAny.has("kw_primary") ? { type: "kw_primary" } : kw_primary), "kw_key"] },
        { "name": "data_type$ebnf$1$subexpression$1$macrocall$2", "symbols": ["int"] },
        { "name": "data_type$ebnf$1$subexpression$1$macrocall$1$ebnf$1", "symbols": [] },
        { "name": "data_type$ebnf$1$subexpression$1$macrocall$1$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("comma") ? { type: "comma" } : comma), "data_type$ebnf$1$subexpression$1$macrocall$2"], "postprocess": last },
        { "name": "data_type$ebnf$1$subexpression$1$macrocall$1$ebnf$1", "symbols": ["data_type$ebnf$1$subexpression$1$macrocall$1$ebnf$1", "data_type$ebnf$1$subexpression$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "data_type$ebnf$1$subexpression$1$macrocall$1", "symbols": ["data_type$ebnf$1$subexpression$1$macrocall$2", "data_type$ebnf$1$subexpression$1$macrocall$1$ebnf$1"], "postprocess": ([head, tail]) => {
                return [head, ...(tail || [])];
            } },
        { "name": "data_type$ebnf$1$subexpression$1", "symbols": ["lparen", "data_type$ebnf$1$subexpression$1$macrocall$1", "rparen"], "postprocess": get(1) },
        { "name": "data_type$ebnf$1", "symbols": ["data_type$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "data_type$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "data_type$ebnf$2$subexpression$1", "symbols": [(lexerAny.has("kw_array") ? { type: "kw_array" } : kw_array)] },
        { "name": "data_type$ebnf$2$subexpression$1$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("lbracket") ? { type: "lbracket" } : lbracket), (lexerAny.has("rbracket") ? { type: "rbracket" } : rbracket)] },
        { "name": "data_type$ebnf$2$subexpression$1$ebnf$1", "symbols": ["data_type$ebnf$2$subexpression$1$ebnf$1$subexpression$1"] },
        { "name": "data_type$ebnf$2$subexpression$1$ebnf$1$subexpression$2", "symbols": [(lexerAny.has("lbracket") ? { type: "lbracket" } : lbracket), (lexerAny.has("rbracket") ? { type: "rbracket" } : rbracket)] },
        { "name": "data_type$ebnf$2$subexpression$1$ebnf$1", "symbols": ["data_type$ebnf$2$subexpression$1$ebnf$1", "data_type$ebnf$2$subexpression$1$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "data_type$ebnf$2$subexpression$1", "symbols": ["data_type$ebnf$2$subexpression$1$ebnf$1"] },
        { "name": "data_type$ebnf$2", "symbols": ["data_type$ebnf$2$subexpression$1"], "postprocess": id },
        { "name": "data_type$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "data_type", "symbols": ["data_type_simple", "data_type$ebnf$1", "data_type$ebnf$2"], "postprocess": x => {
                let asArray = x[2];
                const name = unwrap(x[0]);
                let ret;
                ret = {
                    ...name,
                    ...Array.isArray(x[1]) && x[1].length ? { config: x[1].map(unwrap) } : {},
                };
                if (asArray) {
                    if (asArray[0].type === 'kw_array') {
                        asArray = [['array']];
                    }
                    for (const _ of asArray[0]) {
                        ret = {
                            kind: 'array',
                            arrayOf: ret,
                        };
                    }
                }
                return track(x, ret);
            } },
        { "name": "data_type_list$ebnf$1", "symbols": [] },
        { "name": "data_type_list$ebnf$1$subexpression$1", "symbols": ["comma", "data_type"], "postprocess": last },
        { "name": "data_type_list$ebnf$1", "symbols": ["data_type_list$ebnf$1", "data_type_list$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "data_type_list", "symbols": ["data_type", "data_type_list$ebnf$1"], "postprocess": ([head, tail]) => {
                return [head, ...(tail || [])];
            } },
        { "name": "data_type_simple", "symbols": ["data_type_text"], "postprocess": x => track(x, { name: toStr(x, ' ') }) },
        { "name": "data_type_simple", "symbols": ["data_type_numeric"], "postprocess": x => track(x, { name: toStr(x, ' ') }) },
        { "name": "data_type_simple", "symbols": ["data_type_date"] },
        { "name": "data_type_simple", "symbols": ["qualified_name_mark_quotes"] },
        { "name": "data_type_numeric$subexpression$1", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": kw('double') },
        { "name": "data_type_numeric", "symbols": ["data_type_numeric$subexpression$1", (lexerAny.has("kw_precision") ? { type: "kw_precision" } : kw_precision)] },
        { "name": "data_type_text$subexpression$1", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": anyKw('character', 'bit') },
        { "name": "data_type_text$subexpression$2", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": kw('varying') },
        { "name": "data_type_text", "symbols": ["data_type_text$subexpression$1", "data_type_text$subexpression$2"] },
        { "name": "data_type_date$subexpression$1", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": anyKw('timestamp', 'time') },
        { "name": "data_type_date$subexpression$2", "symbols": [(lexerAny.has("kw_with") ? { type: "kw_with" } : kw_with)] },
        { "name": "data_type_date$subexpression$2", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": kw('without') },
        { "name": "data_type_date$subexpression$3", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": kw('time') },
        { "name": "data_type_date$subexpression$4", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": kw('zone') },
        { "name": "data_type_date", "symbols": ["data_type_date$subexpression$1", "data_type_date$subexpression$2", "data_type_date$subexpression$3", "data_type_date$subexpression$4"], "postprocess": x => track(x, { name: toStr(x, ' ') }) },
        { "name": "data_type_date$subexpression$5", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": anyKw('timestamp', 'time') },
        { "name": "data_type_date$subexpression$6", "symbols": ["lparen", "int", "rparen"], "postprocess": get(1) },
        { "name": "data_type_date$subexpression$7", "symbols": [(lexerAny.has("kw_with") ? { type: "kw_with" } : kw_with)] },
        { "name": "data_type_date$subexpression$7", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": kw('without') },
        { "name": "data_type_date$subexpression$8", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": kw('time') },
        { "name": "data_type_date$subexpression$9", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": kw('zone') },
        { "name": "data_type_date", "symbols": ["data_type_date$subexpression$5", "data_type_date$subexpression$6", "data_type_date$subexpression$7", "data_type_date$subexpression$8", "data_type_date$subexpression$9"], "postprocess": x => track(x, { name: `timestamp ${toStr(x[2])} time zone`, config: [unbox(x[1])] }) },
        { "name": "ident_aliased$subexpression$1", "symbols": [(lexerAny.has("kw_as") ? { type: "kw_as" } : kw_as), "ident"], "postprocess": last },
        { "name": "ident_aliased", "symbols": ["ident_aliased$subexpression$1"] },
        { "name": "ident_aliased", "symbols": ["ident"], "postprocess": unwrap },
        { "name": "table_ref", "symbols": ["qualified_name"], "postprocess": unwrap },
        { "name": "qcolumn$ebnf$1$subexpression$1", "symbols": ["dot", "ident"], "postprocess": last },
        { "name": "qcolumn$ebnf$1", "symbols": ["qcolumn$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "qcolumn$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "qcolumn", "symbols": ["ident", "dot", "ident", "qcolumn$ebnf$1"], "postprocess": x => {
                if (!x[3]) {
                    return track(x, {
                        table: unbox(x[0]),
                        column: unbox(x[2]),
                    });
                }
                return track(x, {
                    schema: unbox(x[0]),
                    table: unbox(x[2]),
                    column: unbox(x[3]),
                });
            } },
        { "name": "table_ref_aliased$ebnf$1", "symbols": ["ident_aliased"], "postprocess": id },
        { "name": "table_ref_aliased$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "table_ref_aliased", "symbols": ["table_ref", "table_ref_aliased$ebnf$1"], "postprocess": x => {
                const alias = unwrap(x[1]);
                return track(x, {
                    ...unwrap(x[0]),
                    ...alias ? { alias } : {},
                });
            } },
        { "name": "qualified_name", "symbols": ["qname_ident"], "postprocess": x => track(x, { name: toStr(x) }) },
        { "name": "qualified_name", "symbols": ["ident", "dot", "ident_extended"], "postprocess": x => {
                const schema = toStr(x[0]);
                const name = toStr(x[2]);
                return track(x, { schema, name });
            } },
        { "name": "qualified_name", "symbols": [(lexerAny.has("kw_current_schema") ? { type: "kw_current_schema" } : kw_current_schema)], "postprocess": x => track(x, { name: 'current_schema' }) },
        { "name": "qualified_name_mark_quotes", "symbols": ["qname_ident"], "postprocess": x => track(x, { name: toStr(x), ...doubleQuoted(x) }) },
        { "name": "qualified_name_mark_quotes", "symbols": ["ident", "dot", "ident_extended"], "postprocess": x => {
                const schema = toStr(x[0]);
                const name = toStr(x[2]);
                return track(x, { schema, name, ...doubleQuoted(x[2]) });
            } },
        { "name": "qualified_name_mark_quotes", "symbols": [(lexerAny.has("kw_current_schema") ? { type: "kw_current_schema" } : kw_current_schema)], "postprocess": x => track(x, { name: 'current_schema' }) },
        { "name": "qname_ident", "symbols": ["ident"] },
        { "name": "qname_ident", "symbols": [(lexerAny.has("kw_precision") ? { type: "kw_precision" } : kw_precision)] },
        { "name": "qname", "symbols": ["qualified_name"], "postprocess": unwrap },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_all") ? { type: "kw_all" } : kw_all)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_analyse") ? { type: "kw_analyse" } : kw_analyse)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_analyze") ? { type: "kw_analyze" } : kw_analyze)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_and") ? { type: "kw_and" } : kw_and)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_any") ? { type: "kw_any" } : kw_any)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_array") ? { type: "kw_array" } : kw_array)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_as") ? { type: "kw_as" } : kw_as)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_asc") ? { type: "kw_asc" } : kw_asc)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_asymmetric") ? { type: "kw_asymmetric" } : kw_asymmetric)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_authorization") ? { type: "kw_authorization" } : kw_authorization)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_binary") ? { type: "kw_binary" } : kw_binary)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_both") ? { type: "kw_both" } : kw_both)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_case") ? { type: "kw_case" } : kw_case)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_cast") ? { type: "kw_cast" } : kw_cast)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_check") ? { type: "kw_check" } : kw_check)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_collate") ? { type: "kw_collate" } : kw_collate)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_collation") ? { type: "kw_collation" } : kw_collation)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_concurrently") ? { type: "kw_concurrently" } : kw_concurrently)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_cross") ? { type: "kw_cross" } : kw_cross)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_current_catalog") ? { type: "kw_current_catalog" } : kw_current_catalog)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_current_date") ? { type: "kw_current_date" } : kw_current_date)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_current_role") ? { type: "kw_current_role" } : kw_current_role)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_current_schema") ? { type: "kw_current_schema" } : kw_current_schema)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_current_time") ? { type: "kw_current_time" } : kw_current_time)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_current_timestamp") ? { type: "kw_current_timestamp" } : kw_current_timestamp)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_current_user") ? { type: "kw_current_user" } : kw_current_user)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_default") ? { type: "kw_default" } : kw_default)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_deferrable") ? { type: "kw_deferrable" } : kw_deferrable)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_desc") ? { type: "kw_desc" } : kw_desc)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_distinct") ? { type: "kw_distinct" } : kw_distinct)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_else") ? { type: "kw_else" } : kw_else)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_end") ? { type: "kw_end" } : kw_end)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_false") ? { type: "kw_false" } : kw_false)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_fetch") ? { type: "kw_fetch" } : kw_fetch)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_for") ? { type: "kw_for" } : kw_for)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_foreign") ? { type: "kw_foreign" } : kw_foreign)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_freeze") ? { type: "kw_freeze" } : kw_freeze)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_from") ? { type: "kw_from" } : kw_from)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_full") ? { type: "kw_full" } : kw_full)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_grant") ? { type: "kw_grant" } : kw_grant)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_group") ? { type: "kw_group" } : kw_group)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_having") ? { type: "kw_having" } : kw_having)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_ilike") ? { type: "kw_ilike" } : kw_ilike)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_in") ? { type: "kw_in" } : kw_in)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_initially") ? { type: "kw_initially" } : kw_initially)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_inner") ? { type: "kw_inner" } : kw_inner)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_into") ? { type: "kw_into" } : kw_into)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_is") ? { type: "kw_is" } : kw_is)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_isnull") ? { type: "kw_isnull" } : kw_isnull)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_join") ? { type: "kw_join" } : kw_join)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_lateral") ? { type: "kw_lateral" } : kw_lateral)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_leading") ? { type: "kw_leading" } : kw_leading)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_left") ? { type: "kw_left" } : kw_left)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_like") ? { type: "kw_like" } : kw_like)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_limit") ? { type: "kw_limit" } : kw_limit)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_localtime") ? { type: "kw_localtime" } : kw_localtime)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_localtimestamp") ? { type: "kw_localtimestamp" } : kw_localtimestamp)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_natural") ? { type: "kw_natural" } : kw_natural)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_not") ? { type: "kw_not" } : kw_not)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_notnull") ? { type: "kw_notnull" } : kw_notnull)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_null") ? { type: "kw_null" } : kw_null)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_offset") ? { type: "kw_offset" } : kw_offset)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_on") ? { type: "kw_on" } : kw_on)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_only") ? { type: "kw_only" } : kw_only)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_or") ? { type: "kw_or" } : kw_or)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_order") ? { type: "kw_order" } : kw_order)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_outer") ? { type: "kw_outer" } : kw_outer)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_overlaps") ? { type: "kw_overlaps" } : kw_overlaps)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_placing") ? { type: "kw_placing" } : kw_placing)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_primary") ? { type: "kw_primary" } : kw_primary)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_references") ? { type: "kw_references" } : kw_references)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_returning") ? { type: "kw_returning" } : kw_returning)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_right") ? { type: "kw_right" } : kw_right)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_select") ? { type: "kw_select" } : kw_select)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_session_user") ? { type: "kw_session_user" } : kw_session_user)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_similar") ? { type: "kw_similar" } : kw_similar)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_some") ? { type: "kw_some" } : kw_some)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_symmetric") ? { type: "kw_symmetric" } : kw_symmetric)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_table") ? { type: "kw_table" } : kw_table)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_tablesample") ? { type: "kw_tablesample" } : kw_tablesample)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_then") ? { type: "kw_then" } : kw_then)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_to") ? { type: "kw_to" } : kw_to)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_trailing") ? { type: "kw_trailing" } : kw_trailing)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_true") ? { type: "kw_true" } : kw_true)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_unique") ? { type: "kw_unique" } : kw_unique)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_user") ? { type: "kw_user" } : kw_user)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_using") ? { type: "kw_using" } : kw_using)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_variadic") ? { type: "kw_variadic" } : kw_variadic)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_verbose") ? { type: "kw_verbose" } : kw_verbose)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_when") ? { type: "kw_when" } : kw_when)] },
        { "name": "any_keyword", "symbols": [(lexerAny.has("kw_where") ? { type: "kw_where" } : kw_where)] },
        { "name": "ident_extended", "symbols": ["ident"] },
        { "name": "ident_extended", "symbols": ["any_keyword"] },
        { "name": "select_statement$ebnf$1", "symbols": ["select_from"], "postprocess": id },
        { "name": "select_statement$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "select_statement$ebnf$2", "symbols": ["select_where"], "postprocess": id },
        { "name": "select_statement$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "select_statement$ebnf$3", "symbols": ["select_groupby"], "postprocess": id },
        { "name": "select_statement$ebnf$3", "symbols": [], "postprocess": () => null },
        { "name": "select_statement$ebnf$4", "symbols": ["select_order_by"], "postprocess": id },
        { "name": "select_statement$ebnf$4", "symbols": [], "postprocess": () => null },
        { "name": "select_statement$ebnf$5", "symbols": ["select_limit_offset"], "postprocess": id },
        { "name": "select_statement$ebnf$5", "symbols": [], "postprocess": () => null },
        { "name": "select_statement$ebnf$6", "symbols": ["select_for"], "postprocess": id },
        { "name": "select_statement$ebnf$6", "symbols": [], "postprocess": () => null },
        { "name": "select_statement", "symbols": ["select_what", "select_statement$ebnf$1", "select_statement$ebnf$2", "select_statement$ebnf$3", "select_statement$ebnf$4", "select_statement$ebnf$5", "select_statement$ebnf$6"], "postprocess": x => {
                let [what, from, where, groupBy, orderBy, limit, selectFor] = x;
                from = unwrap(from);
                groupBy = groupBy && (groupBy.length === 1 && groupBy[0].type === 'list' ? groupBy[0].expressions : groupBy);
                return track(x, {
                    ...what,
                    ...from ? { from: Array.isArray(from) ? from : [from] } : {},
                    ...groupBy ? { groupBy } : {},
                    ...limit ? { limit: unwrap(limit) } : {},
                    ...orderBy ? { orderBy } : {},
                    ...where ? { where } : {},
                    ...selectFor ? { for: selectFor[1] } : {},
                    type: 'select',
                });
            } },
        { "name": "selection_statement", "symbols": ["select_statement"], "postprocess": unwrap },
        { "name": "selection_statement", "symbols": ["select_values"], "postprocess": unwrap },
        { "name": "selection_paren", "symbols": ["lparen", "selection_statement", "rparen"], "postprocess": get(1) },
        { "name": "select_from", "symbols": [(lexerAny.has("kw_from") ? { type: "kw_from" } : kw_from), "select_from_items"], "postprocess": last },
        { "name": "select_from_items$ebnf$1", "symbols": [] },
        { "name": "select_from_items$ebnf$1$subexpression$1", "symbols": ["comma", "select_from_item"], "postprocess": last },
        { "name": "select_from_items$ebnf$1", "symbols": ["select_from_items$ebnf$1", "select_from_items$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "select_from_items", "symbols": ["select_from_item", "select_from_items$ebnf$1"], "postprocess": ([head, tail]) => {
                return [...head, ...(flatten(tail) || [])];
            } },
        { "name": "select_from_item", "symbols": ["select_from_subject"] },
        { "name": "select_from_item", "symbols": ["select_from_item_joins"], "postprocess": get(0) },
        { "name": "select_from_item_joins$subexpression$1", "symbols": ["select_from_item"], "postprocess": get(0) },
        { "name": "select_from_item_joins", "symbols": ["select_from_item_joins$subexpression$1", "select_table_join"], "postprocess": flatten },
        { "name": "select_from_item_joins", "symbols": ["lparen", "select_from_item_joins", "rparen"], "postprocess": get(1) },
        { "name": "select_from_subject", "symbols": ["stb_table"], "postprocess": unwrap },
        { "name": "select_from_subject", "symbols": ["stb_statement"], "postprocess": unwrap },
        { "name": "select_from_subject", "symbols": ["stb_call"], "postprocess": unwrap },
        { "name": "stb_opts$ebnf$1", "symbols": ["collist_paren"], "postprocess": id },
        { "name": "stb_opts$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "stb_opts", "symbols": ["ident_aliased", "stb_opts$ebnf$1"], "postprocess": x => track(x, {
                alias: toStr(x[0]),
                ...x[1] && { columnNames: unbox(x[1]).map(asName) },
            }) },
        { "name": "stb_table$ebnf$1", "symbols": ["stb_opts"], "postprocess": id },
        { "name": "stb_table$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "stb_table", "symbols": ["table_ref", "stb_table$ebnf$1"], "postprocess": x => {
                return track(x, {
                    type: 'table',
                    name: track(x, {
                        ...x[0],
                        ...x[1],
                    }),
                });
            } },
        { "name": "stb_statement", "symbols": ["selection_paren", "stb_opts"], "postprocess": x => track(x, {
                type: 'statement',
                statement: unwrap(x[0]),
                ...x[1],
            }) },
        { "name": "select_values", "symbols": ["kw_values", "select_or_insert_values"], "postprocess": x => track(x, {
                type: 'values',
                values: x[1],
            }) },
        { "name": "select_or_insert_values$ebnf$1", "symbols": [] },
        { "name": "select_or_insert_values$ebnf$1$subexpression$1", "symbols": ["comma", "select_value"], "postprocess": last },
        { "name": "select_or_insert_values$ebnf$1", "symbols": ["select_or_insert_values$ebnf$1", "select_or_insert_values$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "select_or_insert_values", "symbols": ["select_value", "select_or_insert_values$ebnf$1"], "postprocess": ([head, tail]) => {
                return [head, ...(tail || [])];
            } },
        { "name": "select_value", "symbols": ["lparen", "select_expr_list_raw", "rparen"], "postprocess": get(1) },
        { "name": "select_expr_list_raw$ebnf$1", "symbols": [] },
        { "name": "select_expr_list_raw$ebnf$1$subexpression$1", "symbols": ["comma", "expr_or_select"], "postprocess": last },
        { "name": "select_expr_list_raw$ebnf$1", "symbols": ["select_expr_list_raw$ebnf$1", "select_expr_list_raw$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "select_expr_list_raw", "symbols": ["expr_or_select", "select_expr_list_raw$ebnf$1"], "postprocess": ([head, tail]) => {
                return [head, ...(tail || [])];
            } },
        { "name": "stb_call$ebnf$1", "symbols": ["kw_withordinality"], "postprocess": id },
        { "name": "stb_call$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "stb_call$ebnf$2", "symbols": ["stb_call_alias"], "postprocess": id },
        { "name": "stb_call$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "stb_call", "symbols": ["expr_function_call", "stb_call$ebnf$1", "stb_call$ebnf$2"], "postprocess": x => {
                const withOrdinality = x[1];
                const alias = x[2];
                if (!withOrdinality && !alias) {
                    return x[0];
                }
                return track(x, {
                    ...x[0],
                    ...withOrdinality && { withOrdinality: true },
                    alias: alias ? asNameWithColumns(alias[0], alias[1]) : undefined,
                });
            } },
        { "name": "stb_call_alias$subexpression$1$ebnf$1", "symbols": [(lexerAny.has("kw_as") ? { type: "kw_as" } : kw_as)], "postprocess": id },
        { "name": "stb_call_alias$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "stb_call_alias$subexpression$1", "symbols": ["stb_call_alias$subexpression$1$ebnf$1", "ident"], "postprocess": last },
        { "name": "stb_call_alias$ebnf$1", "symbols": ["stb_call_alias_list"], "postprocess": id },
        { "name": "stb_call_alias$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "stb_call_alias", "symbols": ["stb_call_alias$subexpression$1", "stb_call_alias$ebnf$1"] },
        { "name": "stb_call_alias_list", "symbols": ["lparen", "stb_call_alias_list_raw", "rparen"], "postprocess": get(1) },
        { "name": "stb_call_alias_list_raw$ebnf$1", "symbols": [] },
        { "name": "stb_call_alias_list_raw$ebnf$1$subexpression$1", "symbols": ["comma", "ident"], "postprocess": last },
        { "name": "stb_call_alias_list_raw$ebnf$1", "symbols": ["stb_call_alias_list_raw$ebnf$1", "stb_call_alias_list_raw$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "stb_call_alias_list_raw", "symbols": ["ident", "stb_call_alias_list_raw$ebnf$1"], "postprocess": ([head, tail]) => {
                return [head, ...(tail || [])];
            } },
        { "name": "select_table_join$ebnf$1", "symbols": ["select_table_join_clause"], "postprocess": id },
        { "name": "select_table_join$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "select_table_join", "symbols": ["select_join_op", (lexerAny.has("kw_join") ? { type: "kw_join" } : kw_join), "select_from_subject", "select_table_join$ebnf$1"], "postprocess": x => track(x, {
                ...unwrap(x[2]),
                join: {
                    type: toStr(x[0], ' '),
                    ...x[3] && unwrap(x[3]),
                }
            }) },
        { "name": "select_table_join_clause", "symbols": [(lexerAny.has("kw_on") ? { type: "kw_on" } : kw_on), "expr"], "postprocess": x => track(x, { on: last(x) }) },
        { "name": "select_table_join_clause$macrocall$2", "symbols": ["ident"] },
        { "name": "select_table_join_clause$macrocall$1$ebnf$1", "symbols": [] },
        { "name": "select_table_join_clause$macrocall$1$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("comma") ? { type: "comma" } : comma), "select_table_join_clause$macrocall$2"], "postprocess": last },
        { "name": "select_table_join_clause$macrocall$1$ebnf$1", "symbols": ["select_table_join_clause$macrocall$1$ebnf$1", "select_table_join_clause$macrocall$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "select_table_join_clause$macrocall$1", "symbols": ["select_table_join_clause$macrocall$2", "select_table_join_clause$macrocall$1$ebnf$1"], "postprocess": ([head, tail]) => {
                return [unwrap(head), ...(tail.map(unwrap) || [])];
            } },
        { "name": "select_table_join_clause", "symbols": [(lexerAny.has("kw_using") ? { type: "kw_using" } : kw_using), "lparen", "select_table_join_clause$macrocall$1", "rparen"], "postprocess": x => track(x, { using: x[2].map(asName) }) },
        { "name": "select_join_op$subexpression$1$ebnf$1", "symbols": [(lexerAny.has("kw_inner") ? { type: "kw_inner" } : kw_inner)], "postprocess": id },
        { "name": "select_join_op$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "select_join_op$subexpression$1", "symbols": ["select_join_op$subexpression$1$ebnf$1"], "postprocess": x => box(x, 'INNER JOIN') },
        { "name": "select_join_op", "symbols": ["select_join_op$subexpression$1"] },
        { "name": "select_join_op$subexpression$2", "symbols": [(lexerAny.has("kw_cross") ? { type: "kw_cross" } : kw_cross)], "postprocess": x => box(x, 'CROSS JOIN') },
        { "name": "select_join_op", "symbols": ["select_join_op$subexpression$2"] },
        { "name": "select_join_op$subexpression$3$ebnf$1", "symbols": [(lexerAny.has("kw_outer") ? { type: "kw_outer" } : kw_outer)], "postprocess": id },
        { "name": "select_join_op$subexpression$3$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "select_join_op$subexpression$3", "symbols": [(lexerAny.has("kw_left") ? { type: "kw_left" } : kw_left), "select_join_op$subexpression$3$ebnf$1"], "postprocess": x => box(x, 'LEFT JOIN') },
        { "name": "select_join_op", "symbols": ["select_join_op$subexpression$3"] },
        { "name": "select_join_op$subexpression$4$ebnf$1", "symbols": [(lexerAny.has("kw_outer") ? { type: "kw_outer" } : kw_outer)], "postprocess": id },
        { "name": "select_join_op$subexpression$4$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "select_join_op$subexpression$4", "symbols": [(lexerAny.has("kw_right") ? { type: "kw_right" } : kw_right), "select_join_op$subexpression$4$ebnf$1"], "postprocess": x => box(x, 'RIGHT JOIN') },
        { "name": "select_join_op", "symbols": ["select_join_op$subexpression$4"] },
        { "name": "select_join_op$subexpression$5$ebnf$1", "symbols": [(lexerAny.has("kw_outer") ? { type: "kw_outer" } : kw_outer)], "postprocess": id },
        { "name": "select_join_op$subexpression$5$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "select_join_op$subexpression$5", "symbols": [(lexerAny.has("kw_full") ? { type: "kw_full" } : kw_full), "select_join_op$subexpression$5$ebnf$1"], "postprocess": x => box(x, 'FULL JOIN') },
        { "name": "select_join_op", "symbols": ["select_join_op$subexpression$5"] },
        { "name": "select_what$ebnf$1", "symbols": ["select_distinct"], "postprocess": id },
        { "name": "select_what$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "select_what$ebnf$2", "symbols": ["select_expr_list_aliased"], "postprocess": id },
        { "name": "select_what$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "select_what", "symbols": [(lexerAny.has("kw_select") ? { type: "kw_select" } : kw_select), "select_what$ebnf$1", "select_what$ebnf$2"], "postprocess": x => track(x, {
                columns: x[2],
                ...x[1] && { distinct: unbox(x[1]) },
            }) },
        { "name": "select_expr_list_aliased$ebnf$1", "symbols": [] },
        { "name": "select_expr_list_aliased$ebnf$1$subexpression$1", "symbols": ["comma", "select_expr_list_item"], "postprocess": last },
        { "name": "select_expr_list_aliased$ebnf$1", "symbols": ["select_expr_list_aliased$ebnf$1", "select_expr_list_aliased$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "select_expr_list_aliased", "symbols": ["select_expr_list_item", "select_expr_list_aliased$ebnf$1"], "postprocess": ([head, tail]) => {
                return [head, ...(tail || [])];
            } },
        { "name": "select_expr_list_item$ebnf$1", "symbols": ["ident_aliased"], "postprocess": id },
        { "name": "select_expr_list_item$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "select_expr_list_item", "symbols": ["expr", "select_expr_list_item$ebnf$1"], "postprocess": x => track(x, {
                expr: x[0],
                ...x[1] ? { alias: asName(x[1]) } : {},
            }) },
        { "name": "select_distinct", "symbols": [(lexerAny.has("kw_all") ? { type: "kw_all" } : kw_all)], "postprocess": x => box(x, 'all') },
        { "name": "select_distinct$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("kw_on") ? { type: "kw_on" } : kw_on), "lparen", "expr_list_raw", "rparen"], "postprocess": get(2) },
        { "name": "select_distinct$ebnf$1", "symbols": ["select_distinct$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "select_distinct$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "select_distinct", "symbols": [(lexerAny.has("kw_distinct") ? { type: "kw_distinct" } : kw_distinct), "select_distinct$ebnf$1"], "postprocess": x => box(x, x[1] || 'distinct') },
        { "name": "select_where", "symbols": [(lexerAny.has("kw_where") ? { type: "kw_where" } : kw_where), "expr"], "postprocess": last },
        { "name": "select_groupby", "symbols": [(lexerAny.has("kw_group") ? { type: "kw_group" } : kw_group), "kw_by", "expr_list_raw"], "postprocess": last },
        { "name": "select_limit_offset$ebnf$1$subexpression$1", "symbols": ["select_offset"] },
        { "name": "select_limit_offset$ebnf$1$subexpression$1", "symbols": ["select_limit"] },
        { "name": "select_limit_offset$ebnf$1", "symbols": ["select_limit_offset$ebnf$1$subexpression$1"] },
        { "name": "select_limit_offset$ebnf$1$subexpression$2", "symbols": ["select_offset"] },
        { "name": "select_limit_offset$ebnf$1$subexpression$2", "symbols": ["select_limit"] },
        { "name": "select_limit_offset$ebnf$1", "symbols": ["select_limit_offset$ebnf$1", "select_limit_offset$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "select_limit_offset", "symbols": ["select_limit_offset$ebnf$1"], "postprocess": (x, rej) => {
                const value = unwrap(x);
                if (!Array.isArray(value)) {
                    return track(x, value);
                }
                if (value.length != 2) {
                    return rej;
                }
                const a = unwrap(value[0]);
                const b = unwrap(value[1]);
                if (a.offset && b.offset || a.limit && b.limit) {
                    return rej;
                }
                return track(x, {
                    ...a,
                    ...b,
                });
            } },
        { "name": "select_offset$ebnf$1$subexpression$1", "symbols": ["kw_row"] },
        { "name": "select_offset$ebnf$1$subexpression$1", "symbols": ["kw_rows"] },
        { "name": "select_offset$ebnf$1", "symbols": ["select_offset$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "select_offset$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "select_offset", "symbols": [(lexerAny.has("kw_offset") ? { type: "kw_offset" } : kw_offset), "expr_nostar", "select_offset$ebnf$1"], "postprocess": x => track(x, { offset: unwrap(x[1]) }) },
        { "name": "select_limit$subexpression$1", "symbols": ["select_limit_1"] },
        { "name": "select_limit$subexpression$1", "symbols": ["select_limit_2"] },
        { "name": "select_limit", "symbols": ["select_limit$subexpression$1"], "postprocess": x => track(x, { limit: unwrap(x) }) },
        { "name": "select_limit_1", "symbols": [(lexerAny.has("kw_limit") ? { type: "kw_limit" } : kw_limit), "expr_nostar"], "postprocess": last },
        { "name": "select_limit_2$ebnf$1$subexpression$1", "symbols": ["kw_first"] },
        { "name": "select_limit_2$ebnf$1$subexpression$1", "symbols": ["kw_next"] },
        { "name": "select_limit_2$ebnf$1", "symbols": ["select_limit_2$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "select_limit_2$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "select_limit_2$subexpression$1", "symbols": ["kw_row"] },
        { "name": "select_limit_2$subexpression$1", "symbols": ["kw_rows"] },
        { "name": "select_limit_2", "symbols": [(lexerAny.has("kw_fetch") ? { type: "kw_fetch" } : kw_fetch), "select_limit_2$ebnf$1", "expr_nostar", "select_limit_2$subexpression$1", (lexerAny.has("kw_only") ? { type: "kw_only" } : kw_only)], "postprocess": get(2) },
        { "name": "select_for$subexpression$1", "symbols": ["kw_update"], "postprocess": x => track(x, { type: 'update' }) },
        { "name": "select_for$subexpression$1", "symbols": ["kw_no", "kw_key", "kw_update"], "postprocess": x => track(x, { type: 'no key update' }) },
        { "name": "select_for$subexpression$1", "symbols": ["kw_share"], "postprocess": x => track(x, { type: 'share' }) },
        { "name": "select_for$subexpression$1", "symbols": ["kw_key", "kw_share"], "postprocess": x => track(x, { type: 'key share' }) },
        { "name": "select_for", "symbols": [(lexerAny.has("kw_for") ? { type: "kw_for" } : kw_for), "select_for$subexpression$1"] },
        { "name": "select_order_by$subexpression$1", "symbols": [(lexerAny.has("kw_order") ? { type: "kw_order" } : kw_order), "kw_by"] },
        { "name": "select_order_by$ebnf$1", "symbols": [] },
        { "name": "select_order_by$ebnf$1$subexpression$1", "symbols": ["comma", "select_order_by_expr"], "postprocess": last },
        { "name": "select_order_by$ebnf$1", "symbols": ["select_order_by$ebnf$1", "select_order_by$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "select_order_by", "symbols": ["select_order_by$subexpression$1", "select_order_by_expr", "select_order_by$ebnf$1"], "postprocess": ([_, head, tail]) => {
                return [head, ...(tail || [])];
            } },
        { "name": "select_order_by_expr$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("kw_asc") ? { type: "kw_asc" } : kw_asc)] },
        { "name": "select_order_by_expr$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("kw_desc") ? { type: "kw_desc" } : kw_desc)] },
        { "name": "select_order_by_expr$ebnf$1", "symbols": ["select_order_by_expr$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "select_order_by_expr$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "select_order_by_expr$ebnf$2$subexpression$1$subexpression$1", "symbols": ["kw_first"] },
        { "name": "select_order_by_expr$ebnf$2$subexpression$1$subexpression$1", "symbols": ["kw_last"] },
        { "name": "select_order_by_expr$ebnf$2$subexpression$1", "symbols": ["kw_nulls", "select_order_by_expr$ebnf$2$subexpression$1$subexpression$1"], "postprocess": last },
        { "name": "select_order_by_expr$ebnf$2", "symbols": ["select_order_by_expr$ebnf$2$subexpression$1"], "postprocess": id },
        { "name": "select_order_by_expr$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "select_order_by_expr", "symbols": ["expr", "select_order_by_expr$ebnf$1", "select_order_by_expr$ebnf$2"], "postprocess": x => track(x, {
                by: x[0],
                ...x[1] && { order: toStr(x[1]).toUpperCase() },
                ...x[2] && { nulls: toStr(x[2]).toUpperCase() },
            }) },
        { "name": "expr", "symbols": ["expr_nostar"], "postprocess": unwrap },
        { "name": "expr", "symbols": ["expr_star"], "postprocess": unwrap },
        { "name": "expr_nostar", "symbols": ["expr_paren"], "postprocess": unwrap },
        { "name": "expr_nostar", "symbols": ["expr_or"], "postprocess": unwrap },
        { "name": "expr_paren$subexpression$1", "symbols": ["expr_or_select"] },
        { "name": "expr_paren$subexpression$1", "symbols": ["expr_list_many"] },
        { "name": "expr_paren", "symbols": ["lparen", "expr_paren$subexpression$1", "rparen"], "postprocess": get(1) },
        { "name": "expr_or$macrocall$2$macrocall$2", "symbols": [(lexerAny.has("kw_or") ? { type: "kw_or" } : kw_or)] },
        { "name": "expr_or$macrocall$2$macrocall$1", "symbols": ["expr_or$macrocall$2$macrocall$2"], "postprocess": x => track(x, {
                op: (toStr(x, ' ') || '<error>').toUpperCase()
            }) },
        { "name": "expr_or$macrocall$2", "symbols": ["expr_or$macrocall$2$macrocall$1"] },
        { "name": "expr_or$macrocall$3", "symbols": ["expr_or"] },
        { "name": "expr_or$macrocall$4", "symbols": ["expr_and"] },
        { "name": "expr_or$macrocall$1$subexpression$1", "symbols": ["expr_or$macrocall$3"] },
        { "name": "expr_or$macrocall$1$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_or$macrocall$1$subexpression$2", "symbols": ["expr_or$macrocall$4"] },
        { "name": "expr_or$macrocall$1$subexpression$2", "symbols": ["expr_paren"] },
        { "name": "expr_or$macrocall$1", "symbols": ["expr_or$macrocall$1$subexpression$1", "expr_or$macrocall$2", "expr_or$macrocall$1$subexpression$2"], "postprocess": x => track(x, {
                type: 'binary',
                left: unwrap(x[0]),
                right: unwrap(x[2]),
                ...unwrap(x[1]),
            }) },
        { "name": "expr_or$macrocall$1", "symbols": ["expr_or$macrocall$4"], "postprocess": unwrap },
        { "name": "expr_or", "symbols": ["expr_or$macrocall$1"] },
        { "name": "expr_and$macrocall$2$macrocall$2", "symbols": [(lexerAny.has("kw_and") ? { type: "kw_and" } : kw_and)] },
        { "name": "expr_and$macrocall$2$macrocall$1", "symbols": ["expr_and$macrocall$2$macrocall$2"], "postprocess": x => track(x, {
                op: (toStr(x, ' ') || '<error>').toUpperCase()
            }) },
        { "name": "expr_and$macrocall$2", "symbols": ["expr_and$macrocall$2$macrocall$1"] },
        { "name": "expr_and$macrocall$3", "symbols": ["expr_and"] },
        { "name": "expr_and$macrocall$4", "symbols": ["expr_not"] },
        { "name": "expr_and$macrocall$1$subexpression$1", "symbols": ["expr_and$macrocall$3"] },
        { "name": "expr_and$macrocall$1$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_and$macrocall$1$subexpression$2", "symbols": ["expr_and$macrocall$4"] },
        { "name": "expr_and$macrocall$1$subexpression$2", "symbols": ["expr_paren"] },
        { "name": "expr_and$macrocall$1", "symbols": ["expr_and$macrocall$1$subexpression$1", "expr_and$macrocall$2", "expr_and$macrocall$1$subexpression$2"], "postprocess": x => track(x, {
                type: 'binary',
                left: unwrap(x[0]),
                right: unwrap(x[2]),
                ...unwrap(x[1]),
            }) },
        { "name": "expr_and$macrocall$1", "symbols": ["expr_and$macrocall$4"], "postprocess": unwrap },
        { "name": "expr_and", "symbols": ["expr_and$macrocall$1"] },
        { "name": "expr_not$macrocall$2$macrocall$2", "symbols": [(lexerAny.has("kw_not") ? { type: "kw_not" } : kw_not)] },
        { "name": "expr_not$macrocall$2$macrocall$1", "symbols": ["expr_not$macrocall$2$macrocall$2"], "postprocess": x => track(x, {
                op: (toStr(x, ' ') || '<error>').toUpperCase()
            }) },
        { "name": "expr_not$macrocall$2", "symbols": ["expr_not$macrocall$2$macrocall$1"] },
        { "name": "expr_not$macrocall$3", "symbols": ["expr_not"] },
        { "name": "expr_not$macrocall$4", "symbols": ["expr_eq"] },
        { "name": "expr_not$macrocall$1$subexpression$1", "symbols": ["expr_not$macrocall$3"] },
        { "name": "expr_not$macrocall$1$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_not$macrocall$1", "symbols": ["expr_not$macrocall$2", "expr_not$macrocall$1$subexpression$1"], "postprocess": x => track(x, {
                type: 'unary',
                ...unwrap(x[0]),
                operand: unwrap(x[1]),
            }) },
        { "name": "expr_not$macrocall$1", "symbols": ["expr_not$macrocall$4"], "postprocess": unwrap },
        { "name": "expr_not", "symbols": ["expr_not$macrocall$1"] },
        { "name": "expr_eq$macrocall$2$macrocall$2$subexpression$1", "symbols": [(lexerAny.has("op_eq") ? { type: "op_eq" } : op_eq)] },
        { "name": "expr_eq$macrocall$2$macrocall$2$subexpression$1", "symbols": [(lexerAny.has("op_neq") ? { type: "op_neq" } : op_neq)] },
        { "name": "expr_eq$macrocall$2$macrocall$2", "symbols": ["expr_eq$macrocall$2$macrocall$2$subexpression$1"] },
        { "name": "expr_eq$macrocall$2$macrocall$1$macrocall$2", "symbols": ["expr_eq$macrocall$2$macrocall$2"] },
        { "name": "expr_eq$macrocall$2$macrocall$1$macrocall$1", "symbols": ["expr_eq$macrocall$2$macrocall$1$macrocall$2"], "postprocess": x => track(x, {
                op: (toStr(x, ' ') || '<error>').toUpperCase()
            }) },
        { "name": "expr_eq$macrocall$2$macrocall$1", "symbols": ["expr_eq$macrocall$2$macrocall$1$macrocall$1"], "postprocess": unwrap },
        { "name": "expr_eq$macrocall$2$macrocall$1", "symbols": ["kw_operator", "lparen", "ident", "dot", "expr_eq$macrocall$2$macrocall$2", "rparen"], "postprocess": x => track(x, {
                op: (toStr(x[4], ' ') || '<error>').toUpperCase(),
                opSchema: toStr(x[2]),
            }) },
        { "name": "expr_eq$macrocall$2", "symbols": ["expr_eq$macrocall$2$macrocall$1"] },
        { "name": "expr_eq$macrocall$3", "symbols": ["expr_eq"] },
        { "name": "expr_eq$macrocall$4", "symbols": ["expr_is"] },
        { "name": "expr_eq$macrocall$1$subexpression$1", "symbols": ["expr_eq$macrocall$3"] },
        { "name": "expr_eq$macrocall$1$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_eq$macrocall$1$subexpression$2", "symbols": ["expr_eq$macrocall$4"] },
        { "name": "expr_eq$macrocall$1$subexpression$2", "symbols": ["expr_paren"] },
        { "name": "expr_eq$macrocall$1", "symbols": ["expr_eq$macrocall$1$subexpression$1", "expr_eq$macrocall$2", "expr_eq$macrocall$1$subexpression$2"], "postprocess": x => track(x, {
                type: 'binary',
                left: unwrap(x[0]),
                right: unwrap(x[2]),
                ...unwrap(x[1]),
            }) },
        { "name": "expr_eq$macrocall$1", "symbols": ["expr_eq$macrocall$4"], "postprocess": unwrap },
        { "name": "expr_eq", "symbols": ["expr_eq$macrocall$1"] },
        { "name": "expr_star", "symbols": ["star"], "postprocess": x => track(x, { type: 'ref', name: '*' }) },
        { "name": "expr_is$subexpression$1", "symbols": ["expr_is"] },
        { "name": "expr_is$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_is$subexpression$2", "symbols": [(lexerAny.has("kw_isnull") ? { type: "kw_isnull" } : kw_isnull)] },
        { "name": "expr_is$subexpression$2", "symbols": [(lexerAny.has("kw_is") ? { type: "kw_is" } : kw_is), (lexerAny.has("kw_null") ? { type: "kw_null" } : kw_null)] },
        { "name": "expr_is", "symbols": ["expr_is$subexpression$1", "expr_is$subexpression$2"], "postprocess": x => track(x, { type: 'unary', op: 'IS NULL', operand: unwrap(x[0]) }) },
        { "name": "expr_is$subexpression$3", "symbols": ["expr_is"] },
        { "name": "expr_is$subexpression$3", "symbols": ["expr_paren"] },
        { "name": "expr_is$subexpression$4", "symbols": [(lexerAny.has("kw_notnull") ? { type: "kw_notnull" } : kw_notnull)] },
        { "name": "expr_is$subexpression$4", "symbols": [(lexerAny.has("kw_is") ? { type: "kw_is" } : kw_is), "kw_not_null"] },
        { "name": "expr_is", "symbols": ["expr_is$subexpression$3", "expr_is$subexpression$4"], "postprocess": x => track(x, { type: 'unary', op: 'IS NOT NULL', operand: unwrap(x[0]) }) },
        { "name": "expr_is$subexpression$5", "symbols": ["expr_is"] },
        { "name": "expr_is$subexpression$5", "symbols": ["expr_paren"] },
        { "name": "expr_is$ebnf$1", "symbols": [(lexerAny.has("kw_not") ? { type: "kw_not" } : kw_not)], "postprocess": id },
        { "name": "expr_is$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "expr_is$subexpression$6", "symbols": [(lexerAny.has("kw_true") ? { type: "kw_true" } : kw_true)] },
        { "name": "expr_is$subexpression$6", "symbols": [(lexerAny.has("kw_false") ? { type: "kw_false" } : kw_false)] },
        { "name": "expr_is", "symbols": ["expr_is$subexpression$5", (lexerAny.has("kw_is") ? { type: "kw_is" } : kw_is), "expr_is$ebnf$1", "expr_is$subexpression$6"], "postprocess": x => track(x, {
                type: 'unary',
                op: 'IS ' + flattenStr([x[2], x[3]])
                    .join(' ')
                    .toUpperCase(),
                operand: unwrap(x[0]),
            }) },
        { "name": "expr_is", "symbols": ["expr_compare"], "postprocess": unwrap },
        { "name": "expr_compare$macrocall$2$macrocall$2", "symbols": [(lexerAny.has("op_compare") ? { type: "op_compare" } : op_compare)] },
        { "name": "expr_compare$macrocall$2$macrocall$1$macrocall$2", "symbols": ["expr_compare$macrocall$2$macrocall$2"] },
        { "name": "expr_compare$macrocall$2$macrocall$1$macrocall$1", "symbols": ["expr_compare$macrocall$2$macrocall$1$macrocall$2"], "postprocess": x => track(x, {
                op: (toStr(x, ' ') || '<error>').toUpperCase()
            }) },
        { "name": "expr_compare$macrocall$2$macrocall$1", "symbols": ["expr_compare$macrocall$2$macrocall$1$macrocall$1"], "postprocess": unwrap },
        { "name": "expr_compare$macrocall$2$macrocall$1", "symbols": ["kw_operator", "lparen", "ident", "dot", "expr_compare$macrocall$2$macrocall$2", "rparen"], "postprocess": x => track(x, {
                op: (toStr(x[4], ' ') || '<error>').toUpperCase(),
                opSchema: toStr(x[2]),
            }) },
        { "name": "expr_compare$macrocall$2", "symbols": ["expr_compare$macrocall$2$macrocall$1"] },
        { "name": "expr_compare$macrocall$3", "symbols": ["expr_compare"] },
        { "name": "expr_compare$macrocall$4", "symbols": ["expr_range"] },
        { "name": "expr_compare$macrocall$1$subexpression$1", "symbols": ["expr_compare$macrocall$3"] },
        { "name": "expr_compare$macrocall$1$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_compare$macrocall$1$subexpression$2", "symbols": ["expr_compare$macrocall$4"] },
        { "name": "expr_compare$macrocall$1$subexpression$2", "symbols": ["expr_paren"] },
        { "name": "expr_compare$macrocall$1", "symbols": ["expr_compare$macrocall$1$subexpression$1", "expr_compare$macrocall$2", "expr_compare$macrocall$1$subexpression$2"], "postprocess": x => track(x, {
                type: 'binary',
                left: unwrap(x[0]),
                right: unwrap(x[2]),
                ...unwrap(x[1]),
            }) },
        { "name": "expr_compare$macrocall$1", "symbols": ["expr_compare$macrocall$4"], "postprocess": unwrap },
        { "name": "expr_compare", "symbols": ["expr_compare$macrocall$1"] },
        { "name": "expr_range$macrocall$2", "symbols": ["ops_between"] },
        { "name": "expr_range$macrocall$3", "symbols": [(lexerAny.has("kw_and") ? { type: "kw_and" } : kw_and)] },
        { "name": "expr_range$macrocall$4", "symbols": ["expr_range"] },
        { "name": "expr_range$macrocall$5", "symbols": ["expr_others"] },
        { "name": "expr_range$macrocall$1$subexpression$1", "symbols": ["expr_range$macrocall$4"] },
        { "name": "expr_range$macrocall$1$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_range$macrocall$1$subexpression$2", "symbols": ["expr_range$macrocall$4"] },
        { "name": "expr_range$macrocall$1$subexpression$2", "symbols": ["expr_paren"] },
        { "name": "expr_range$macrocall$1$subexpression$3", "symbols": ["expr_range$macrocall$5"] },
        { "name": "expr_range$macrocall$1$subexpression$3", "symbols": ["expr_paren"] },
        { "name": "expr_range$macrocall$1", "symbols": ["expr_range$macrocall$1$subexpression$1", "expr_range$macrocall$2", "expr_range$macrocall$1$subexpression$2", "expr_range$macrocall$3", "expr_range$macrocall$1$subexpression$3"], "postprocess": x => track(x, {
                type: 'ternary',
                value: unwrap(x[0]),
                lo: unwrap(x[2]),
                hi: unwrap(x[4]),
                op: (flattenStr(x[1]).join(' ') || '<error>').toUpperCase(),
            }) },
        { "name": "expr_range$macrocall$1", "symbols": ["expr_range$macrocall$5"], "postprocess": unwrap },
        { "name": "expr_range", "symbols": ["expr_range$macrocall$1"] },
        { "name": "expr_others$macrocall$2$macrocall$2", "symbols": [(lexerAny.has("ops_others") ? { type: "ops_others" } : ops_others)] },
        { "name": "expr_others$macrocall$2$macrocall$1$macrocall$2", "symbols": ["expr_others$macrocall$2$macrocall$2"] },
        { "name": "expr_others$macrocall$2$macrocall$1$macrocall$1", "symbols": ["expr_others$macrocall$2$macrocall$1$macrocall$2"], "postprocess": x => track(x, {
                op: (toStr(x, ' ') || '<error>').toUpperCase()
            }) },
        { "name": "expr_others$macrocall$2$macrocall$1", "symbols": ["expr_others$macrocall$2$macrocall$1$macrocall$1"], "postprocess": unwrap },
        { "name": "expr_others$macrocall$2$macrocall$1", "symbols": ["kw_operator", "lparen", "ident", "dot", "expr_others$macrocall$2$macrocall$2", "rparen"], "postprocess": x => track(x, {
                op: (toStr(x[4], ' ') || '<error>').toUpperCase(),
                opSchema: toStr(x[2]),
            }) },
        { "name": "expr_others$macrocall$2", "symbols": ["expr_others$macrocall$2$macrocall$1"] },
        { "name": "expr_others$macrocall$3", "symbols": ["expr_others"] },
        { "name": "expr_others$macrocall$4", "symbols": ["expr_like"] },
        { "name": "expr_others$macrocall$1$subexpression$1", "symbols": ["expr_others$macrocall$3"] },
        { "name": "expr_others$macrocall$1$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_others$macrocall$1$subexpression$2", "symbols": ["expr_others$macrocall$4"] },
        { "name": "expr_others$macrocall$1$subexpression$2", "symbols": ["expr_paren"] },
        { "name": "expr_others$macrocall$1", "symbols": ["expr_others$macrocall$1$subexpression$1", "expr_others$macrocall$2", "expr_others$macrocall$1$subexpression$2"], "postprocess": x => track(x, {
                type: 'binary',
                left: unwrap(x[0]),
                right: unwrap(x[2]),
                ...unwrap(x[1]),
            }) },
        { "name": "expr_others$macrocall$1", "symbols": ["expr_others$macrocall$4"], "postprocess": unwrap },
        { "name": "expr_others", "symbols": ["expr_others$macrocall$1"] },
        { "name": "expr_like$macrocall$2$macrocall$2", "symbols": ["ops_like"] },
        { "name": "expr_like$macrocall$2$macrocall$1", "symbols": ["expr_like$macrocall$2$macrocall$2"], "postprocess": x => track(x, {
                op: (toStr(x, ' ') || '<error>').toUpperCase()
            }) },
        { "name": "expr_like$macrocall$2", "symbols": ["expr_like$macrocall$2$macrocall$1"] },
        { "name": "expr_like$macrocall$3", "symbols": ["expr_like"] },
        { "name": "expr_like$macrocall$4", "symbols": ["expr_in"] },
        { "name": "expr_like$macrocall$1$subexpression$1", "symbols": ["expr_like$macrocall$3"] },
        { "name": "expr_like$macrocall$1$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_like$macrocall$1$subexpression$2", "symbols": ["expr_like$macrocall$4"] },
        { "name": "expr_like$macrocall$1$subexpression$2", "symbols": ["expr_paren"] },
        { "name": "expr_like$macrocall$1", "symbols": ["expr_like$macrocall$1$subexpression$1", "expr_like$macrocall$2", "expr_like$macrocall$1$subexpression$2"], "postprocess": x => track(x, {
                type: 'binary',
                left: unwrap(x[0]),
                right: unwrap(x[2]),
                ...unwrap(x[1]),
            }) },
        { "name": "expr_like$macrocall$1", "symbols": ["expr_like$macrocall$4"], "postprocess": unwrap },
        { "name": "expr_like", "symbols": ["expr_like$macrocall$1"] },
        { "name": "expr_in$macrocall$2$macrocall$2", "symbols": ["ops_in"] },
        { "name": "expr_in$macrocall$2$macrocall$1", "symbols": ["expr_in$macrocall$2$macrocall$2"], "postprocess": x => track(x, {
                op: (toStr(x, ' ') || '<error>').toUpperCase()
            }) },
        { "name": "expr_in$macrocall$2", "symbols": ["expr_in$macrocall$2$macrocall$1"] },
        { "name": "expr_in$macrocall$3", "symbols": ["expr_in"] },
        { "name": "expr_in$macrocall$4", "symbols": ["expr_add"] },
        { "name": "expr_in$macrocall$1$subexpression$1", "symbols": ["expr_in$macrocall$3"] },
        { "name": "expr_in$macrocall$1$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_in$macrocall$1$subexpression$2", "symbols": ["expr_in$macrocall$4"] },
        { "name": "expr_in$macrocall$1$subexpression$2", "symbols": ["expr_paren"] },
        { "name": "expr_in$macrocall$1", "symbols": ["expr_in$macrocall$1$subexpression$1", "expr_in$macrocall$2", "expr_in$macrocall$1$subexpression$2"], "postprocess": x => track(x, {
                type: 'binary',
                left: unwrap(x[0]),
                right: unwrap(x[2]),
                ...unwrap(x[1]),
            }) },
        { "name": "expr_in$macrocall$1", "symbols": ["expr_in$macrocall$4"], "postprocess": unwrap },
        { "name": "expr_in", "symbols": ["expr_in$macrocall$1"] },
        { "name": "expr_add$macrocall$2$macrocall$2$subexpression$1", "symbols": [(lexerAny.has("op_plus") ? { type: "op_plus" } : op_plus)] },
        { "name": "expr_add$macrocall$2$macrocall$2$subexpression$1", "symbols": [(lexerAny.has("op_minus") ? { type: "op_minus" } : op_minus)] },
        { "name": "expr_add$macrocall$2$macrocall$2$subexpression$1", "symbols": [(lexerAny.has("op_additive") ? { type: "op_additive" } : op_additive)] },
        { "name": "expr_add$macrocall$2$macrocall$2", "symbols": ["expr_add$macrocall$2$macrocall$2$subexpression$1"] },
        { "name": "expr_add$macrocall$2$macrocall$1$macrocall$2", "symbols": ["expr_add$macrocall$2$macrocall$2"] },
        { "name": "expr_add$macrocall$2$macrocall$1$macrocall$1", "symbols": ["expr_add$macrocall$2$macrocall$1$macrocall$2"], "postprocess": x => track(x, {
                op: (toStr(x, ' ') || '<error>').toUpperCase()
            }) },
        { "name": "expr_add$macrocall$2$macrocall$1", "symbols": ["expr_add$macrocall$2$macrocall$1$macrocall$1"], "postprocess": unwrap },
        { "name": "expr_add$macrocall$2$macrocall$1", "symbols": ["kw_operator", "lparen", "ident", "dot", "expr_add$macrocall$2$macrocall$2", "rparen"], "postprocess": x => track(x, {
                op: (toStr(x[4], ' ') || '<error>').toUpperCase(),
                opSchema: toStr(x[2]),
            }) },
        { "name": "expr_add$macrocall$2", "symbols": ["expr_add$macrocall$2$macrocall$1"] },
        { "name": "expr_add$macrocall$3", "symbols": ["expr_add"] },
        { "name": "expr_add$macrocall$4", "symbols": ["expr_mult"] },
        { "name": "expr_add$macrocall$1$subexpression$1", "symbols": ["expr_add$macrocall$3"] },
        { "name": "expr_add$macrocall$1$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_add$macrocall$1$subexpression$2", "symbols": ["expr_add$macrocall$4"] },
        { "name": "expr_add$macrocall$1$subexpression$2", "symbols": ["expr_paren"] },
        { "name": "expr_add$macrocall$1", "symbols": ["expr_add$macrocall$1$subexpression$1", "expr_add$macrocall$2", "expr_add$macrocall$1$subexpression$2"], "postprocess": x => track(x, {
                type: 'binary',
                left: unwrap(x[0]),
                right: unwrap(x[2]),
                ...unwrap(x[1]),
            }) },
        { "name": "expr_add$macrocall$1", "symbols": ["expr_add$macrocall$4"], "postprocess": unwrap },
        { "name": "expr_add", "symbols": ["expr_add$macrocall$1"] },
        { "name": "expr_mult$macrocall$2$macrocall$2$subexpression$1", "symbols": [(lexerAny.has("star") ? { type: "star" } : star)] },
        { "name": "expr_mult$macrocall$2$macrocall$2$subexpression$1", "symbols": [(lexerAny.has("op_div") ? { type: "op_div" } : op_div)] },
        { "name": "expr_mult$macrocall$2$macrocall$2$subexpression$1", "symbols": [(lexerAny.has("op_mod") ? { type: "op_mod" } : op_mod)] },
        { "name": "expr_mult$macrocall$2$macrocall$2", "symbols": ["expr_mult$macrocall$2$macrocall$2$subexpression$1"] },
        { "name": "expr_mult$macrocall$2$macrocall$1$macrocall$2", "symbols": ["expr_mult$macrocall$2$macrocall$2"] },
        { "name": "expr_mult$macrocall$2$macrocall$1$macrocall$1", "symbols": ["expr_mult$macrocall$2$macrocall$1$macrocall$2"], "postprocess": x => track(x, {
                op: (toStr(x, ' ') || '<error>').toUpperCase()
            }) },
        { "name": "expr_mult$macrocall$2$macrocall$1", "symbols": ["expr_mult$macrocall$2$macrocall$1$macrocall$1"], "postprocess": unwrap },
        { "name": "expr_mult$macrocall$2$macrocall$1", "symbols": ["kw_operator", "lparen", "ident", "dot", "expr_mult$macrocall$2$macrocall$2", "rparen"], "postprocess": x => track(x, {
                op: (toStr(x[4], ' ') || '<error>').toUpperCase(),
                opSchema: toStr(x[2]),
            }) },
        { "name": "expr_mult$macrocall$2", "symbols": ["expr_mult$macrocall$2$macrocall$1"] },
        { "name": "expr_mult$macrocall$3", "symbols": ["expr_mult"] },
        { "name": "expr_mult$macrocall$4", "symbols": ["expr_exp"] },
        { "name": "expr_mult$macrocall$1$subexpression$1", "symbols": ["expr_mult$macrocall$3"] },
        { "name": "expr_mult$macrocall$1$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_mult$macrocall$1$subexpression$2", "symbols": ["expr_mult$macrocall$4"] },
        { "name": "expr_mult$macrocall$1$subexpression$2", "symbols": ["expr_paren"] },
        { "name": "expr_mult$macrocall$1", "symbols": ["expr_mult$macrocall$1$subexpression$1", "expr_mult$macrocall$2", "expr_mult$macrocall$1$subexpression$2"], "postprocess": x => track(x, {
                type: 'binary',
                left: unwrap(x[0]),
                right: unwrap(x[2]),
                ...unwrap(x[1]),
            }) },
        { "name": "expr_mult$macrocall$1", "symbols": ["expr_mult$macrocall$4"], "postprocess": unwrap },
        { "name": "expr_mult", "symbols": ["expr_mult$macrocall$1"] },
        { "name": "expr_exp$macrocall$2$macrocall$2", "symbols": [(lexerAny.has("op_exp") ? { type: "op_exp" } : op_exp)] },
        { "name": "expr_exp$macrocall$2$macrocall$1$macrocall$2", "symbols": ["expr_exp$macrocall$2$macrocall$2"] },
        { "name": "expr_exp$macrocall$2$macrocall$1$macrocall$1", "symbols": ["expr_exp$macrocall$2$macrocall$1$macrocall$2"], "postprocess": x => track(x, {
                op: (toStr(x, ' ') || '<error>').toUpperCase()
            }) },
        { "name": "expr_exp$macrocall$2$macrocall$1", "symbols": ["expr_exp$macrocall$2$macrocall$1$macrocall$1"], "postprocess": unwrap },
        { "name": "expr_exp$macrocall$2$macrocall$1", "symbols": ["kw_operator", "lparen", "ident", "dot", "expr_exp$macrocall$2$macrocall$2", "rparen"], "postprocess": x => track(x, {
                op: (toStr(x[4], ' ') || '<error>').toUpperCase(),
                opSchema: toStr(x[2]),
            }) },
        { "name": "expr_exp$macrocall$2", "symbols": ["expr_exp$macrocall$2$macrocall$1"] },
        { "name": "expr_exp$macrocall$3", "symbols": ["expr_exp"] },
        { "name": "expr_exp$macrocall$4", "symbols": ["expr_unary_add"] },
        { "name": "expr_exp$macrocall$1$subexpression$1", "symbols": ["expr_exp$macrocall$3"] },
        { "name": "expr_exp$macrocall$1$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_exp$macrocall$1$subexpression$2", "symbols": ["expr_exp$macrocall$4"] },
        { "name": "expr_exp$macrocall$1$subexpression$2", "symbols": ["expr_paren"] },
        { "name": "expr_exp$macrocall$1", "symbols": ["expr_exp$macrocall$1$subexpression$1", "expr_exp$macrocall$2", "expr_exp$macrocall$1$subexpression$2"], "postprocess": x => track(x, {
                type: 'binary',
                left: unwrap(x[0]),
                right: unwrap(x[2]),
                ...unwrap(x[1]),
            }) },
        { "name": "expr_exp$macrocall$1", "symbols": ["expr_exp$macrocall$4"], "postprocess": unwrap },
        { "name": "expr_exp", "symbols": ["expr_exp$macrocall$1"] },
        { "name": "expr_unary_add$macrocall$2$macrocall$2$subexpression$1", "symbols": [(lexerAny.has("op_plus") ? { type: "op_plus" } : op_plus)] },
        { "name": "expr_unary_add$macrocall$2$macrocall$2$subexpression$1", "symbols": [(lexerAny.has("op_minus") ? { type: "op_minus" } : op_minus)] },
        { "name": "expr_unary_add$macrocall$2$macrocall$2", "symbols": ["expr_unary_add$macrocall$2$macrocall$2$subexpression$1"] },
        { "name": "expr_unary_add$macrocall$2$macrocall$1$macrocall$2", "symbols": ["expr_unary_add$macrocall$2$macrocall$2"] },
        { "name": "expr_unary_add$macrocall$2$macrocall$1$macrocall$1", "symbols": ["expr_unary_add$macrocall$2$macrocall$1$macrocall$2"], "postprocess": x => track(x, {
                op: (toStr(x, ' ') || '<error>').toUpperCase()
            }) },
        { "name": "expr_unary_add$macrocall$2$macrocall$1", "symbols": ["expr_unary_add$macrocall$2$macrocall$1$macrocall$1"], "postprocess": unwrap },
        { "name": "expr_unary_add$macrocall$2$macrocall$1", "symbols": ["kw_operator", "lparen", "ident", "dot", "expr_unary_add$macrocall$2$macrocall$2", "rparen"], "postprocess": x => track(x, {
                op: (toStr(x[4], ' ') || '<error>').toUpperCase(),
                opSchema: toStr(x[2]),
            }) },
        { "name": "expr_unary_add$macrocall$2", "symbols": ["expr_unary_add$macrocall$2$macrocall$1"] },
        { "name": "expr_unary_add$macrocall$3", "symbols": ["expr_unary_add"] },
        { "name": "expr_unary_add$macrocall$4", "symbols": ["expr_various_constructs"] },
        { "name": "expr_unary_add$macrocall$1$subexpression$1", "symbols": ["expr_unary_add$macrocall$3"] },
        { "name": "expr_unary_add$macrocall$1$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_unary_add$macrocall$1", "symbols": ["expr_unary_add$macrocall$2", "expr_unary_add$macrocall$1$subexpression$1"], "postprocess": x => track(x, {
                type: 'unary',
                ...unwrap(x[0]),
                operand: unwrap(x[1]),
            }) },
        { "name": "expr_unary_add$macrocall$1", "symbols": ["expr_unary_add$macrocall$4"], "postprocess": unwrap },
        { "name": "expr_unary_add", "symbols": ["expr_unary_add$macrocall$1"] },
        { "name": "expr_various_constructs$macrocall$2$macrocall$2", "symbols": ["various_binaries"] },
        { "name": "expr_various_constructs$macrocall$2$macrocall$1", "symbols": ["expr_various_constructs$macrocall$2$macrocall$2"], "postprocess": x => track(x, {
                op: (toStr(x, ' ') || '<error>').toUpperCase()
            }) },
        { "name": "expr_various_constructs$macrocall$2", "symbols": ["expr_various_constructs$macrocall$2$macrocall$1"] },
        { "name": "expr_various_constructs$macrocall$3", "symbols": ["expr_various_constructs"] },
        { "name": "expr_various_constructs$macrocall$4", "symbols": ["expr_array_index"] },
        { "name": "expr_various_constructs$macrocall$1$subexpression$1", "symbols": ["expr_various_constructs$macrocall$3"] },
        { "name": "expr_various_constructs$macrocall$1$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_various_constructs$macrocall$1$subexpression$2", "symbols": ["expr_various_constructs$macrocall$4"] },
        { "name": "expr_various_constructs$macrocall$1$subexpression$2", "symbols": ["expr_paren"] },
        { "name": "expr_various_constructs$macrocall$1", "symbols": ["expr_various_constructs$macrocall$1$subexpression$1", "expr_various_constructs$macrocall$2", "expr_various_constructs$macrocall$1$subexpression$2"], "postprocess": x => track(x, {
                type: 'binary',
                left: unwrap(x[0]),
                right: unwrap(x[2]),
                ...unwrap(x[1]),
            }) },
        { "name": "expr_various_constructs$macrocall$1", "symbols": ["expr_various_constructs$macrocall$4"], "postprocess": unwrap },
        { "name": "expr_various_constructs", "symbols": ["expr_various_constructs$macrocall$1"] },
        { "name": "expr_array_index$subexpression$1", "symbols": ["expr_array_index"] },
        { "name": "expr_array_index$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_array_index", "symbols": ["expr_array_index$subexpression$1", (lexerAny.has("lbracket") ? { type: "lbracket" } : lbracket), "expr_nostar", (lexerAny.has("rbracket") ? { type: "rbracket" } : rbracket)], "postprocess": x => track(x, {
                type: 'arrayIndex',
                array: unwrap(x[0]),
                index: unwrap(x[2]),
            }) },
        { "name": "expr_array_index", "symbols": ["expr_member"], "postprocess": unwrap },
        { "name": "expr_member$subexpression$1", "symbols": ["expr_member"] },
        { "name": "expr_member$subexpression$1", "symbols": ["expr_paren"] },
        { "name": "expr_member$subexpression$2", "symbols": ["string"] },
        { "name": "expr_member$subexpression$2", "symbols": ["int"] },
        { "name": "expr_member", "symbols": ["expr_member$subexpression$1", "ops_member", "expr_member$subexpression$2"], "postprocess": x => track(x, {
                type: 'member',
                operand: unwrap(x[0]),
                op: x[1],
                member: unwrap(x[2])
            }) },
        { "name": "expr_member$subexpression$3", "symbols": ["expr_member"] },
        { "name": "expr_member$subexpression$3", "symbols": ["expr_paren"] },
        { "name": "expr_member", "symbols": ["expr_member$subexpression$3", (lexerAny.has("op_cast") ? { type: "op_cast" } : op_cast), "data_type"], "postprocess": x => track(x, {
                type: 'cast',
                operand: unwrap(x[0]),
                to: x[2],
            }) },
        { "name": "expr_member", "symbols": [(lexerAny.has("kw_cast") ? { type: "kw_cast" } : kw_cast), "lparen", "expr_nostar", (lexerAny.has("kw_as") ? { type: "kw_as" } : kw_as), "data_type", "rparen"], "postprocess": x => track(x, {
                type: 'cast',
                operand: unwrap(x[2]),
                to: x[4],
            }) },
        { "name": "expr_member", "symbols": ["data_type", "string"], "postprocess": x => {
                console.log('string', x);
                return track(x, {
                    type: 'cast',
                    operand: track(x[1], {
                        type: 'string',
                        value: unbox(x[1]),
                    }),
                    to: unbox(x[0]),
                });
            } },
        { "name": "expr_member", "symbols": ["expr_dot"], "postprocess": unwrap },
        { "name": "expr_dot$subexpression$1", "symbols": ["word"] },
        { "name": "expr_dot$subexpression$1", "symbols": ["star"] },
        { "name": "expr_dot", "symbols": ["qname", (lexerAny.has("dot") ? { type: "dot" } : dot), "expr_dot$subexpression$1"], "postprocess": x => track(x, {
                type: 'ref',
                table: unwrap(x[0]),
                name: toStr(x[2])
            }) },
        { "name": "expr_dot", "symbols": ["expr_final"], "postprocess": unwrap },
        { "name": "expr_final", "symbols": ["expr_basic"] },
        { "name": "expr_final", "symbols": ["expr_primary"] },
        { "name": "expr_basic", "symbols": ["expr_special_calls"] },
        { "name": "expr_basic", "symbols": ["expr_call"] },
        { "name": "expr_basic", "symbols": ["expr_array"] },
        { "name": "expr_basic", "symbols": ["expr_case"] },
        { "name": "expr_basic", "symbols": ["expr_extract"] },
        { "name": "expr_basic", "symbols": ["word"], "postprocess": x => track(x, {
                type: 'ref',
                name: unwrap(x[0]),
            }) },
        { "name": "expr_array$ebnf$1", "symbols": ["expr_subarray_items"], "postprocess": id },
        { "name": "expr_array$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "expr_array", "symbols": [(lexerAny.has("kw_array") ? { type: "kw_array" } : kw_array), (lexerAny.has("lbracket") ? { type: "lbracket" } : lbracket), "expr_array$ebnf$1", (lexerAny.has("rbracket") ? { type: "rbracket" } : rbracket)], "postprocess": x => track(x, {
                type: 'array',
                expressions: x[2] || [],
            }) },
        { "name": "expr_array", "symbols": [(lexerAny.has("kw_array") ? { type: "kw_array" } : kw_array), "lparen", "selection_statement", "rparen"], "postprocess": x => track(x, {
                type: 'array select',
                select: unwrap(x[2]),
            }) },
        { "name": "expr_subarray$ebnf$1", "symbols": ["expr_subarray_items"], "postprocess": id },
        { "name": "expr_subarray$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "expr_subarray", "symbols": [(lexerAny.has("lbracket") ? { type: "lbracket" } : lbracket), "expr_subarray$ebnf$1", (lexerAny.has("rbracket") ? { type: "rbracket" } : rbracket)], "postprocess": get(1) },
        { "name": "expr_subarray_items$macrocall$2", "symbols": ["expr_list_item"] },
        { "name": "expr_subarray_items$macrocall$1$ebnf$1", "symbols": [] },
        { "name": "expr_subarray_items$macrocall$1$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("comma") ? { type: "comma" } : comma), "expr_subarray_items$macrocall$2"], "postprocess": last },
        { "name": "expr_subarray_items$macrocall$1$ebnf$1", "symbols": ["expr_subarray_items$macrocall$1$ebnf$1", "expr_subarray_items$macrocall$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "expr_subarray_items$macrocall$1", "symbols": ["expr_subarray_items$macrocall$2", "expr_subarray_items$macrocall$1$ebnf$1"], "postprocess": ([head, tail]) => {
                return [head, ...(tail || [])];
            } },
        { "name": "expr_subarray_items", "symbols": ["expr_subarray_items$macrocall$1"], "postprocess": x => x[0].map(unwrap) },
        { "name": "expr_subarray_items$macrocall$4", "symbols": ["expr_subarray"] },
        { "name": "expr_subarray_items$macrocall$3$ebnf$1", "symbols": [] },
        { "name": "expr_subarray_items$macrocall$3$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("comma") ? { type: "comma" } : comma), "expr_subarray_items$macrocall$4"], "postprocess": last },
        { "name": "expr_subarray_items$macrocall$3$ebnf$1", "symbols": ["expr_subarray_items$macrocall$3$ebnf$1", "expr_subarray_items$macrocall$3$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "expr_subarray_items$macrocall$3", "symbols": ["expr_subarray_items$macrocall$4", "expr_subarray_items$macrocall$3$ebnf$1"], "postprocess": ([head, tail]) => {
                return [head, ...(tail || [])];
            } },
        { "name": "expr_subarray_items", "symbols": ["expr_subarray_items$macrocall$3"], "postprocess": (x) => {
                return x[0].map((v) => {
                    return track(v, {
                        type: 'array',
                        expressions: v[0].map(unwrap),
                    });
                });
            } },
        { "name": "expr_function_call$ebnf$1", "symbols": ["expr_function_args"], "postprocess": id },
        { "name": "expr_function_call$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "expr_function_call", "symbols": ["expr_fn_name", "lparen", "expr_function_call$ebnf$1", "rparen"], "postprocess": x => track(x, {
                type: 'call',
                function: unwrap(x[0]),
                args: x[2] || [],
            }) },
        { "name": "expr_function_args$macrocall$2", "symbols": ["expr_function_arg_item"] },
        { "name": "expr_function_args$macrocall$1$ebnf$1", "symbols": [] },
        { "name": "expr_function_args$macrocall$1$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("comma") ? { type: "comma" } : comma), "expr_function_args$macrocall$2"], "postprocess": last },
        { "name": "expr_function_args$macrocall$1$ebnf$1", "symbols": ["expr_function_args$macrocall$1$ebnf$1", "expr_function_args$macrocall$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "expr_function_args$macrocall$1", "symbols": ["expr_function_args$macrocall$2", "expr_function_args$macrocall$1$ebnf$1"], "postprocess": ([head, tail]) => {
                return [head, ...(tail || [])];
            } },
        { "name": "expr_function_args", "symbols": ["expr_function_args$macrocall$1"], "postprocess": ([x]) => x.map(unwrap) },
        { "name": "expr_function_arg_item", "symbols": ["word", { "literal": "=>" }, "expr_function_arg_value"], "postprocess": x => unwrap({ key: x[0], ...x[2] }) },
        { "name": "expr_function_arg_item", "symbols": ["expr_function_arg_value"], "postprocess": x => unwrap(x) },
        { "name": "expr_function_arg_value", "symbols": ["data_type", "string"], "postprocess": x => track(x, {
                type: 'cast',
                operand: track(x[1], {
                    type: 'string',
                    value: unbox(x[1]),
                }),
                to: unbox(x[0]),
            }) },
        { "name": "expr_function_arg_value", "symbols": ["expr_dot"], "postprocess": unwrap },
        { "name": "expr_call$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("kw_all") ? { type: "kw_all" } : kw_all)] },
        { "name": "expr_call$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("kw_distinct") ? { type: "kw_distinct" } : kw_distinct)] },
        { "name": "expr_call$ebnf$1", "symbols": ["expr_call$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "expr_call$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "expr_call$ebnf$2", "symbols": ["expr_list_raw"], "postprocess": id },
        { "name": "expr_call$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "expr_call$ebnf$3", "symbols": ["select_order_by"], "postprocess": id },
        { "name": "expr_call$ebnf$3", "symbols": [], "postprocess": () => null },
        { "name": "expr_call$ebnf$4$subexpression$1", "symbols": ["kw_filter", "lparen", (lexerAny.has("kw_where") ? { type: "kw_where" } : kw_where), "expr", "rparen"], "postprocess": get(3) },
        { "name": "expr_call$ebnf$4", "symbols": ["expr_call$ebnf$4$subexpression$1"], "postprocess": id },
        { "name": "expr_call$ebnf$4", "symbols": [], "postprocess": () => null },
        { "name": "expr_call$ebnf$5", "symbols": ["expr_call_over"], "postprocess": id },
        { "name": "expr_call$ebnf$5", "symbols": [], "postprocess": () => null },
        { "name": "expr_call", "symbols": ["expr_fn_name", "lparen", "expr_call$ebnf$1", "expr_call$ebnf$2", "expr_call$ebnf$3", "rparen", "expr_call$ebnf$4", "expr_call$ebnf$5"], "postprocess": x => track(x, {
                type: 'call',
                function: unwrap(x[0]),
                ...x[2] && { distinct: toStr(x[2]) },
                args: x[3] || [],
                ...x[4] && { orderBy: x[4] },
                ...x[6] && { filter: unwrap(x[6]) },
                ...x[7] && { over: unwrap(x[7]) },
            }) },
        { "name": "expr_call_over$ebnf$1$subexpression$1", "symbols": ["kw_partition", "kw_by", "expr_list_raw"], "postprocess": last },
        { "name": "expr_call_over$ebnf$1", "symbols": ["expr_call_over$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "expr_call_over$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "expr_call_over$ebnf$2", "symbols": ["select_order_by"], "postprocess": id },
        { "name": "expr_call_over$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "expr_call_over", "symbols": ["kw_over", "lparen", "expr_call_over$ebnf$1", "expr_call_over$ebnf$2", "rparen"], "postprocess": x => track(x, {
                ...x[2] && { partitionBy: x[2] },
                ...x[3] && { orderBy: x[3] },
            }) },
        { "name": "expr_extract$subexpression$1", "symbols": ["word"], "postprocess": kw('extract') },
        { "name": "expr_extract", "symbols": ["expr_extract$subexpression$1", "lparen", "word", (lexerAny.has("kw_from") ? { type: "kw_from" } : kw_from), "expr", "rparen"], "postprocess": x => track(x, {
                type: 'extract',
                field: asName(x[2]),
                from: x[4],
            }) },
        { "name": "expr_primary", "symbols": ["float"], "postprocess": x => track(x, { type: 'numeric', value: unbox(x[0]) }) },
        { "name": "expr_primary", "symbols": ["int"], "postprocess": x => track(x, { type: 'integer', value: unbox(x[0]) }) },
        { "name": "expr_primary", "symbols": ["string"], "postprocess": x => track(x, { type: 'string', value: unbox(x[0]) }) },
        { "name": "expr_primary", "symbols": [(lexerAny.has("kw_true") ? { type: "kw_true" } : kw_true)], "postprocess": x => track(x, { type: 'boolean', value: true }) },
        { "name": "expr_primary", "symbols": [(lexerAny.has("kw_false") ? { type: "kw_false" } : kw_false)], "postprocess": x => track(x, { type: 'boolean', value: false }) },
        { "name": "expr_primary", "symbols": [(lexerAny.has("kw_null") ? { type: "kw_null" } : kw_null)], "postprocess": x => track(x, { type: 'null' }) },
        { "name": "expr_primary", "symbols": ["value_keyword"], "postprocess": x => track(x, { type: 'keyword', keyword: toStr(x) }) },
        { "name": "expr_primary", "symbols": [(lexerAny.has("qparam") ? { type: "qparam" } : qparam)], "postprocess": x => track(x, { type: 'parameter', name: toStr(x[0]) }) },
        { "name": "expr_primary", "symbols": [(lexerAny.has("kw_default") ? { type: "kw_default" } : kw_default)], "postprocess": x => track(x, { type: 'default' }) },
        { "name": "ops_like", "symbols": ["ops_like_keywors"] },
        { "name": "ops_like", "symbols": ["ops_like_operators"] },
        { "name": "ops_like_keywors$ebnf$1", "symbols": [(lexerAny.has("kw_not") ? { type: "kw_not" } : kw_not)], "postprocess": id },
        { "name": "ops_like_keywors$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "ops_like_keywors$subexpression$1", "symbols": [(lexerAny.has("kw_like") ? { type: "kw_like" } : kw_like)] },
        { "name": "ops_like_keywors$subexpression$1", "symbols": [(lexerAny.has("kw_ilike") ? { type: "kw_ilike" } : kw_ilike)] },
        { "name": "ops_like_keywors", "symbols": ["ops_like_keywors$ebnf$1", "ops_like_keywors$subexpression$1"] },
        { "name": "ops_like_operators$subexpression$1", "symbols": [(lexerAny.has("op_like") ? { type: "op_like" } : op_like)], "postprocess": () => 'LIKE' },
        { "name": "ops_like_operators", "symbols": ["ops_like_operators$subexpression$1"] },
        { "name": "ops_like_operators$subexpression$2", "symbols": [(lexerAny.has("op_ilike") ? { type: "op_ilike" } : op_ilike)], "postprocess": () => 'ILIKE' },
        { "name": "ops_like_operators", "symbols": ["ops_like_operators$subexpression$2"] },
        { "name": "ops_like_operators$subexpression$3", "symbols": [(lexerAny.has("op_not_like") ? { type: "op_not_like" } : op_not_like)], "postprocess": () => 'NOT LIKE' },
        { "name": "ops_like_operators", "symbols": ["ops_like_operators$subexpression$3"] },
        { "name": "ops_like_operators$subexpression$4", "symbols": [(lexerAny.has("op_not_ilike") ? { type: "op_not_ilike" } : op_not_ilike)], "postprocess": () => 'NOT ILIKE' },
        { "name": "ops_like_operators", "symbols": ["ops_like_operators$subexpression$4"] },
        { "name": "ops_in$ebnf$1", "symbols": [(lexerAny.has("kw_not") ? { type: "kw_not" } : kw_not)], "postprocess": id },
        { "name": "ops_in$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "ops_in", "symbols": ["ops_in$ebnf$1", (lexerAny.has("kw_in") ? { type: "kw_in" } : kw_in)] },
        { "name": "ops_between$ebnf$1", "symbols": [(lexerAny.has("kw_not") ? { type: "kw_not" } : kw_not)], "postprocess": id },
        { "name": "ops_between$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "ops_between", "symbols": ["ops_between$ebnf$1", "kw_between"] },
        { "name": "ops_member$subexpression$1", "symbols": [(lexerAny.has("op_member") ? { type: "op_member" } : op_member)] },
        { "name": "ops_member$subexpression$1", "symbols": [(lexerAny.has("op_membertext") ? { type: "op_membertext" } : op_membertext)] },
        { "name": "ops_member", "symbols": ["ops_member$subexpression$1"], "postprocess": x => unwrap(x)?.value },
        { "name": "expr_list_item", "symbols": ["expr_or_select"], "postprocess": unwrap },
        { "name": "expr_list_item", "symbols": ["expr_star"], "postprocess": unwrap },
        { "name": "expr_list_raw$macrocall$2", "symbols": ["expr_list_item"] },
        { "name": "expr_list_raw$macrocall$1$ebnf$1", "symbols": [] },
        { "name": "expr_list_raw$macrocall$1$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("comma") ? { type: "comma" } : comma), "expr_list_raw$macrocall$2"], "postprocess": last },
        { "name": "expr_list_raw$macrocall$1$ebnf$1", "symbols": ["expr_list_raw$macrocall$1$ebnf$1", "expr_list_raw$macrocall$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "expr_list_raw$macrocall$1", "symbols": ["expr_list_raw$macrocall$2", "expr_list_raw$macrocall$1$ebnf$1"], "postprocess": ([head, tail]) => {
                return [head, ...(tail || [])];
            } },
        { "name": "expr_list_raw", "symbols": ["expr_list_raw$macrocall$1"], "postprocess": ([x]) => x.map(unwrap) },
        { "name": "expr_list_raw_many$macrocall$2", "symbols": ["expr_list_item"] },
        { "name": "expr_list_raw_many$macrocall$1$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("comma") ? { type: "comma" } : comma), "expr_list_raw_many$macrocall$2"], "postprocess": last },
        { "name": "expr_list_raw_many$macrocall$1$ebnf$1", "symbols": ["expr_list_raw_many$macrocall$1$ebnf$1$subexpression$1"] },
        { "name": "expr_list_raw_many$macrocall$1$ebnf$1$subexpression$2", "symbols": [(lexerAny.has("comma") ? { type: "comma" } : comma), "expr_list_raw_many$macrocall$2"], "postprocess": last },
        { "name": "expr_list_raw_many$macrocall$1$ebnf$1", "symbols": ["expr_list_raw_many$macrocall$1$ebnf$1", "expr_list_raw_many$macrocall$1$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "expr_list_raw_many$macrocall$1", "symbols": ["expr_list_raw_many$macrocall$2", "expr_list_raw_many$macrocall$1$ebnf$1"], "postprocess": ([head, tail]) => {
                return [head, ...(tail || [])];
            } },
        { "name": "expr_list_raw_many", "symbols": ["expr_list_raw_many$macrocall$1"], "postprocess": ([x]) => x.map(unwrap) },
        { "name": "expr_or_select", "symbols": ["expr_nostar"], "postprocess": unwrap },
        { "name": "expr_or_select", "symbols": ["selection_statement"], "postprocess": unwrap },
        { "name": "expr_list_many", "symbols": ["expr_list_raw_many"], "postprocess": x => track(x, {
                type: 'list',
                expressions: x[0],
            }) },
        { "name": "expr_case$ebnf$1", "symbols": ["expr_nostar"], "postprocess": id },
        { "name": "expr_case$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "expr_case$ebnf$2", "symbols": [] },
        { "name": "expr_case$ebnf$2", "symbols": ["expr_case$ebnf$2", "expr_case_whens"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "expr_case$ebnf$3", "symbols": ["expr_case_else"], "postprocess": id },
        { "name": "expr_case$ebnf$3", "symbols": [], "postprocess": () => null },
        { "name": "expr_case", "symbols": [(lexerAny.has("kw_case") ? { type: "kw_case" } : kw_case), "expr_case$ebnf$1", "expr_case$ebnf$2", "expr_case$ebnf$3", (lexerAny.has("kw_end") ? { type: "kw_end" } : kw_end)], "postprocess": x => track(x, {
                type: 'case',
                value: x[1],
                whens: x[2],
                else: x[3],
            }) },
        { "name": "expr_case_whens", "symbols": [(lexerAny.has("kw_when") ? { type: "kw_when" } : kw_when), "expr_nostar", (lexerAny.has("kw_then") ? { type: "kw_then" } : kw_then), "expr_nostar"], "postprocess": x => track(x, {
                when: x[1],
                value: x[3],
            }) },
        { "name": "expr_case_else", "symbols": [(lexerAny.has("kw_else") ? { type: "kw_else" } : kw_else), "expr_nostar"], "postprocess": last },
        { "name": "expr_fn_name$subexpression$1$ebnf$1$subexpression$1", "symbols": ["word", (lexerAny.has("dot") ? { type: "dot" } : dot)] },
        { "name": "expr_fn_name$subexpression$1$ebnf$1", "symbols": ["expr_fn_name$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "expr_fn_name$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "expr_fn_name$subexpression$1", "symbols": ["expr_fn_name$subexpression$1$ebnf$1", "word_or_keyword"], "postprocess": x => {
                return track(x, {
                    name: unbox(unwrap(x[1])),
                    ...x[0] && { schema: toStr(x[0][0]) },
                });
            } },
        { "name": "expr_fn_name", "symbols": ["expr_fn_name$subexpression$1"] },
        { "name": "expr_fn_name$subexpression$2$subexpression$1", "symbols": [(lexerAny.has("kw_any") ? { type: "kw_any" } : kw_any)] },
        { "name": "expr_fn_name$subexpression$2$subexpression$1", "symbols": [(lexerAny.has("kw_some") ? { type: "kw_some" } : kw_some)] },
        { "name": "expr_fn_name$subexpression$2$subexpression$1", "symbols": [(lexerAny.has("kw_all") ? { type: "kw_all" } : kw_all)] },
        { "name": "expr_fn_name$subexpression$2$subexpression$1", "symbols": [(lexerAny.has("kw_default") ? { type: "kw_default" } : kw_default)] },
        { "name": "expr_fn_name$subexpression$2", "symbols": ["expr_fn_name$subexpression$2$subexpression$1"], "postprocess": x => track(x, {
                name: toStr(unwrap(x)),
            }) },
        { "name": "expr_fn_name", "symbols": ["expr_fn_name$subexpression$2"] },
        { "name": "word_or_keyword", "symbols": ["word"] },
        { "name": "word_or_keyword", "symbols": ["value_keyword"], "postprocess": x => box(x, toStr(x)) },
        { "name": "value_keyword", "symbols": [(lexerAny.has("kw_current_catalog") ? { type: "kw_current_catalog" } : kw_current_catalog)] },
        { "name": "value_keyword", "symbols": [(lexerAny.has("kw_current_date") ? { type: "kw_current_date" } : kw_current_date)] },
        { "name": "value_keyword", "symbols": [(lexerAny.has("kw_current_role") ? { type: "kw_current_role" } : kw_current_role)] },
        { "name": "value_keyword", "symbols": [(lexerAny.has("kw_current_schema") ? { type: "kw_current_schema" } : kw_current_schema)] },
        { "name": "value_keyword", "symbols": [(lexerAny.has("kw_current_timestamp") ? { type: "kw_current_timestamp" } : kw_current_timestamp)] },
        { "name": "value_keyword", "symbols": [(lexerAny.has("kw_current_time") ? { type: "kw_current_time" } : kw_current_time)] },
        { "name": "value_keyword", "symbols": [(lexerAny.has("kw_localtimestamp") ? { type: "kw_localtimestamp" } : kw_localtimestamp)] },
        { "name": "value_keyword", "symbols": [(lexerAny.has("kw_localtime") ? { type: "kw_localtime" } : kw_localtime)] },
        { "name": "value_keyword", "symbols": [(lexerAny.has("kw_session_user") ? { type: "kw_session_user" } : kw_session_user)] },
        { "name": "value_keyword", "symbols": [(lexerAny.has("kw_user") ? { type: "kw_user" } : kw_user)] },
        { "name": "value_keyword", "symbols": [(lexerAny.has("kw_current_user") ? { type: "kw_current_user" } : kw_current_user)] },
        { "name": "expr_special_calls", "symbols": ["spe_overlay"] },
        { "name": "expr_special_calls", "symbols": ["spe_substring"] },
        { "name": "spe_overlay$subexpression$1", "symbols": ["word"], "postprocess": kw('overlay') },
        { "name": "spe_overlay$subexpression$2", "symbols": [(lexerAny.has("lparen") ? { type: "lparen" } : lparen), "expr_nostar"] },
        { "name": "spe_overlay$subexpression$3", "symbols": [(lexerAny.has("kw_placing") ? { type: "kw_placing" } : kw_placing), "expr_nostar"] },
        { "name": "spe_overlay$subexpression$4", "symbols": [(lexerAny.has("kw_from") ? { type: "kw_from" } : kw_from), "expr_nostar"] },
        { "name": "spe_overlay$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("kw_for") ? { type: "kw_for" } : kw_for), "expr_nostar"] },
        { "name": "spe_overlay$ebnf$1", "symbols": ["spe_overlay$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "spe_overlay$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "spe_overlay", "symbols": ["spe_overlay$subexpression$1", "spe_overlay$subexpression$2", "spe_overlay$subexpression$3", "spe_overlay$subexpression$4", "spe_overlay$ebnf$1", (lexerAny.has("rparen") ? { type: "rparen" } : rparen)], "postprocess": x => track(x, {
                type: 'overlay',
                value: x[1][1],
                placing: x[2][1],
                from: x[3][1],
                ...x[4] && { for: x[4][1] },
            }) },
        { "name": "spe_substring$subexpression$1", "symbols": ["word"], "postprocess": kw('substring') },
        { "name": "spe_substring$subexpression$2", "symbols": [(lexerAny.has("lparen") ? { type: "lparen" } : lparen), "expr_nostar"] },
        { "name": "spe_substring$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("kw_from") ? { type: "kw_from" } : kw_from), "expr_nostar"] },
        { "name": "spe_substring$ebnf$1", "symbols": ["spe_substring$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "spe_substring$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "spe_substring$ebnf$2$subexpression$1", "symbols": [(lexerAny.has("kw_for") ? { type: "kw_for" } : kw_for), "expr_nostar"] },
        { "name": "spe_substring$ebnf$2", "symbols": ["spe_substring$ebnf$2$subexpression$1"], "postprocess": id },
        { "name": "spe_substring$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "spe_substring", "symbols": ["spe_substring$subexpression$1", "spe_substring$subexpression$2", "spe_substring$ebnf$1", "spe_substring$ebnf$2", (lexerAny.has("rparen") ? { type: "rparen" } : rparen)], "postprocess": x => track(x, {
                type: 'substring',
                value: x[1][1],
                ...x[2] && { from: x[2][1] },
                ...x[3] && { for: x[3][1] },
            }) },
        { "name": "various_binaries", "symbols": ["kw_at", "kw_time", "kw_zone"], "postprocess": () => 'AT TIME ZONE' },
        { "name": "comment_statement", "symbols": ["kw_comment", (lexerAny.has("kw_on") ? { type: "kw_on" } : kw_on), "comment_what", (lexerAny.has("kw_is") ? { type: "kw_is" } : kw_is), "string"], "postprocess": x => track(x, {
                type: 'comment',
                comment: unbox(last(x)),
                on: unwrap(x[2]),
            }) },
        { "name": "comment_what", "symbols": ["comment_what_col"] },
        { "name": "comment_what", "symbols": ["comment_what_nm"] },
        { "name": "comment_what_nm$subexpression$1", "symbols": [(lexerAny.has("kw_table") ? { type: "kw_table" } : kw_table)] },
        { "name": "comment_what_nm$subexpression$1", "symbols": ["kw_view"] },
        { "name": "comment_what_nm$subexpression$1", "symbols": [(lexerAny.has("word") ? { type: "word" } : word)], "postprocess": anyKw('database', 'index', 'trigger', 'type', 'view') },
        { "name": "comment_what_nm", "symbols": ["comment_what_nm$subexpression$1", "qualified_name"], "postprocess": x => track(x, {
                type: toStr(x[0]),
                name: x[1],
            }) },
        { "name": "comment_what_col", "symbols": ["kw_column", "qcolumn"], "postprocess": x => track(x, {
                type: 'column',
                column: last(x),
            }) },
        { "name": "insert_statement$subexpression$1", "symbols": ["kw_insert", (lexerAny.has("kw_into") ? { type: "kw_into" } : kw_into)] },
        { "name": "insert_statement$ebnf$1", "symbols": ["collist_paren"], "postprocess": id },
        { "name": "insert_statement$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "insert_statement$ebnf$2$subexpression$1$subexpression$1", "symbols": ["kw_system"] },
        { "name": "insert_statement$ebnf$2$subexpression$1$subexpression$1", "symbols": [(lexerAny.has("kw_user") ? { type: "kw_user" } : kw_user)] },
        { "name": "insert_statement$ebnf$2$subexpression$1", "symbols": ["kw_overriding", "insert_statement$ebnf$2$subexpression$1$subexpression$1", "kw_value"], "postprocess": get(1) },
        { "name": "insert_statement$ebnf$2", "symbols": ["insert_statement$ebnf$2$subexpression$1"], "postprocess": id },
        { "name": "insert_statement$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "insert_statement$ebnf$3$subexpression$1", "symbols": ["selection_statement"] },
        { "name": "insert_statement$ebnf$3$subexpression$1", "symbols": ["selection_paren"] },
        { "name": "insert_statement$ebnf$3", "symbols": ["insert_statement$ebnf$3$subexpression$1"], "postprocess": id },
        { "name": "insert_statement$ebnf$3", "symbols": [], "postprocess": () => null },
        { "name": "insert_statement$ebnf$4$subexpression$1", "symbols": [(lexerAny.has("kw_returning") ? { type: "kw_returning" } : kw_returning), "select_expr_list_aliased"], "postprocess": last },
        { "name": "insert_statement$ebnf$4", "symbols": ["insert_statement$ebnf$4$subexpression$1"], "postprocess": id },
        { "name": "insert_statement$ebnf$4", "symbols": [], "postprocess": () => null },
        { "name": "insert_statement", "symbols": ["insert_statement$subexpression$1", "table_ref_aliased", "insert_statement$ebnf$1", "insert_statement$ebnf$2", "insert_statement$ebnf$3", "insert_statement$ebnf$4"], "postprocess": x => {
                const columns = x[2] && x[2].map(asName);
                const overriding = toStr(x[3]);
                const insert = unwrap(x[4]);
                const returning = x[6];
                return track(x, {
                    type: 'insert',
                    into: unwrap(x[1]),
                    insert,
                    ...overriding && { overriding },
                    ...columns && { columns },
                    ...returning && { returning },
                });
            } },
        { "name": "update_statement$ebnf$1$subexpression$1", "symbols": [(lexerAny.has("kw_from") ? { type: "kw_from" } : kw_from), "select_from_subject"], "postprocess": last },
        { "name": "update_statement$ebnf$1", "symbols": ["update_statement$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "update_statement$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "update_statement$ebnf$2", "symbols": ["select_where"], "postprocess": id },
        { "name": "update_statement$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "update_statement$ebnf$3$subexpression$1", "symbols": [(lexerAny.has("kw_returning") ? { type: "kw_returning" } : kw_returning), "select_expr_list_aliased"], "postprocess": last },
        { "name": "update_statement$ebnf$3", "symbols": ["update_statement$ebnf$3$subexpression$1"], "postprocess": id },
        { "name": "update_statement$ebnf$3", "symbols": [], "postprocess": () => null },
        { "name": "update_statement", "symbols": ["kw_update", "table_ref_aliased", "kw_set", "update_set_list", "update_statement$ebnf$1", "update_statement$ebnf$2", "update_statement$ebnf$3"], "postprocess": x => {
                const from = unwrap(x[4]);
                const where = unwrap(x[5]);
                const returning = x[6];
                return track(x, {
                    type: 'update',
                    table: unwrap(x[1]),
                    sets: x[3],
                    ...where ? { where } : {},
                    ...from ? { from } : {},
                    ...returning ? { returning } : {},
                });
            } },
        { "name": "update_set_list$ebnf$1", "symbols": [] },
        { "name": "update_set_list$ebnf$1$subexpression$1", "symbols": ["comma", "update_set"], "postprocess": last },
        { "name": "update_set_list$ebnf$1", "symbols": ["update_set_list$ebnf$1", "update_set_list$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "update_set_list", "symbols": ["update_set", "update_set_list$ebnf$1"], "postprocess": ([head, tail]) => {
                const ret = [];
                for (const _t of [head, ...(tail || [])]) {
                    const t = unwrap(_t);
                    if (Array.isArray(t)) {
                        ret.push(...t);
                    }
                    else {
                        ret.push(t);
                    }
                }
                return ret;
            } },
        { "name": "update_set", "symbols": ["update_set_one"] },
        { "name": "update_set", "symbols": ["update_set_multiple"] },
        { "name": "update_set_one", "symbols": ["ident", (lexerAny.has("op_eq") ? { type: "op_eq" } : op_eq), "expr"], "postprocess": x => box(x, {
                column: asName(x[0]),
                value: unwrap(x[2]),
            }) },
        { "name": "update_set_multiple$subexpression$1", "symbols": ["lparen", "expr_list_raw", "rparen"], "postprocess": get(1) },
        { "name": "update_set_multiple", "symbols": ["collist_paren", (lexerAny.has("op_eq") ? { type: "op_eq" } : op_eq), "update_set_multiple$subexpression$1"], "postprocess": x => {
                const cols = x[0];
                const exprs = x[2];
                if (cols.length !== exprs.length) {
                    throw new Error('number of columns does not match number of values');
                }
                return box(x, cols.map((x, i) => ({
                    column: asName(x),
                    value: unwrap(exprs[i]),
                })));
            } },
        { "name": "delete_statement", "symbols": ["delete_delete"] },
        { "name": "delete_delete$subexpression$1", "symbols": ["kw_delete", (lexerAny.has("kw_from") ? { type: "kw_from" } : kw_from)] },
        { "name": "delete_delete$ebnf$1", "symbols": ["select_where"], "postprocess": id },
        { "name": "delete_delete$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "delete_delete$ebnf$2$subexpression$1", "symbols": [(lexerAny.has("kw_returning") ? { type: "kw_returning" } : kw_returning), "select_expr_list_aliased"], "postprocess": last },
        { "name": "delete_delete$ebnf$2", "symbols": ["delete_delete$ebnf$2$subexpression$1"], "postprocess": id },
        { "name": "delete_delete$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "delete_delete", "symbols": ["delete_delete$subexpression$1", "table_ref_aliased", "delete_delete$ebnf$1", "delete_delete$ebnf$2"], "postprocess": x => {
                const where = x[2];
                const returning = x[3];
                return track(x, {
                    type: 'delete',
                    from: unwrap(x[1]),
                    ...where ? { where } : {},
                    ...returning ? { returning } : {},
                });
            } },
        { "name": "main$ebnf$1", "symbols": [] },
        { "name": "main$ebnf$1", "symbols": ["main$ebnf$1", "statement_separator"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "main$ebnf$2", "symbols": [] },
        { "name": "main$ebnf$2$subexpression$1$ebnf$1", "symbols": ["statement_separator"] },
        { "name": "main$ebnf$2$subexpression$1$ebnf$1", "symbols": ["main$ebnf$2$subexpression$1$ebnf$1", "statement_separator"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "main$ebnf$2$subexpression$1", "symbols": ["main$ebnf$2$subexpression$1$ebnf$1", "statement"] },
        { "name": "main$ebnf$2", "symbols": ["main$ebnf$2", "main$ebnf$2$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "main$ebnf$3", "symbols": [] },
        { "name": "main$ebnf$3", "symbols": ["main$ebnf$3", "statement_separator"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "main", "symbols": ["main$ebnf$1", "statement", "main$ebnf$2", "main$ebnf$3"], "postprocess": ([_, head, _tail]) => {
                const tail = _tail;
                const ret = [unwrap(head), ...tail.map((x) => unwrap(x[1]))];
                return ret.length === 1
                    ? ret[0]
                    : ret;
            } },
        { "name": "statement_separator", "symbols": [(lexerAny.has("semicolon") ? { type: "semicolon" } : semicolon)] },
        { "name": "statement", "symbols": ["statement_noprep"] },
        { "name": "statement_noprep", "symbols": ["selection_statement"] },
        { "name": "statement_noprep", "symbols": ["insert_statement"] },
        { "name": "statement_noprep", "symbols": ["update_statement"] },
        { "name": "statement_noprep", "symbols": ["delete_statement"] },
        { "name": "statement_noprep", "symbols": ["comment_statement"] }
    ],
    ParserStart: "main",
};
exports.default = grammar;
//# sourceMappingURL=main.js.map