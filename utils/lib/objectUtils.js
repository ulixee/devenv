"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gettersToObject = gettersToObject;
async function gettersToObject(obj) {
    if (obj === null || obj === undefined || typeof obj !== 'object')
        return obj;
    const keys = [];
    // eslint-disable-next-line guard-for-in
    for (const key in obj) {
        keys.push(key);
    }
    if (obj[Symbol.iterator]) {
        const iterableToArray = [];
        // @ts-ignore
        for (const item of obj) {
            iterableToArray.push(await gettersToObject(item));
        }
        return iterableToArray;
    }
    const result = {};
    for (const key of keys) {
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        // Skip functions
        if (descriptor && typeof descriptor.value === 'function') {
            continue;
        }
        const value = descriptor && descriptor.get ? descriptor.get.call(obj) : obj[key];
        if (typeof value === 'function')
            continue;
        result[key] = await gettersToObject(value);
    }
    return result;
}
//# sourceMappingURL=objectUtils.js.map