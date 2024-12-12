"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotSupported = void 0;
exports.arrayNilMap = arrayNilMap;
exports.assignChanged = assignChanged;
exports.trimNullish = trimNullish;
class NotSupported extends Error {
    constructor(what) {
        super(`Not supported${what ? `: ${what}` : ''}`);
    }
    static never(value, msg) {
        return new NotSupported(`${msg ?? ''} ${JSON.stringify(value)}`);
    }
}
exports.NotSupported = NotSupported;
/**
 * An helper function that returns a map of an array, but:
 * - It will return the original array if it is null-ish
 * - It will remove all null-ish entries
 * - It will return the original array if nothing has changed
 */
function arrayNilMap(collection, mapper) {
    if (!collection?.length) {
        return collection;
    }
    let changed = false;
    let ret = collection;
    for (let i = 0; i < collection.length; i++) {
        const orig = collection[i];
        const val = mapper(orig);
        if (!changed && (!val || val !== orig)) {
            changed = true;
            ret = collection.slice(0, i);
        }
        if (!val) {
            continue;
        }
        if (changed) {
            ret.push(val);
        }
    }
    return ret;
}
/**
 * An helper function that returns a copy of an object with modified properties
 * (similar to Object.assign()), but ONLY if thos properties have changed.
 * Will return the original object if not.
 */
function assignChanged(orig, assign) {
    if (!orig) {
        return orig;
    }
    let changed = false;
    for (const k of Object.keys(assign)) {
        if (orig[k] !== assign[k]) {
            changed = true;
            break;
        }
    }
    if (!changed) {
        return orig;
    }
    return trimNullish({
        ...orig,
        ...assign,
    }, 0);
}
function trimNullish(value, depth = 5) {
    if (depth < 0)
        return value;
    if (value instanceof Array) {
        value.forEach(x => trimNullish(x, depth - 1));
    }
    if (typeof value !== 'object' || value instanceof Date)
        return value;
    if (!value) {
        return value;
    }
    for (const k of Object.keys(value)) {
        const val = value[k];
        if (val === undefined || val === null)
            delete value[k];
        else
            trimNullish(val, depth - 1);
    }
    return value;
}
//# sourceMappingURL=utils.js.map