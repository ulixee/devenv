"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapAsyncCall = wrapAsyncCall;
exports.proxyWrapper = proxyWrapper;
const types_1 = require("node:util/types");
async function wrapAsyncCall(owner, name, ...args) {
    try {
        const result = await owner[name].call(owner, ...args);
        return proxyIfNeeded(result);
    }
    catch (error) {
        const stack = new Error('').stack.slice(8).split(/\r?\n/g).slice(1).join('\n');
        const message = `Localchain - ${error.toString().replace('Error: ', '')}`;
        const newError = new Error(message);
        if ('code' in error) {
            newError.code = error.code;
        }
        newError.stack = `${message}\n${stack}`;
        throw newError;
    }
}
function isPrimitive(value) {
    if (!value ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'bigint' ||
        typeof value === 'symbol' ||
        typeof value === 'undefined') {
        return true;
    }
    return (value instanceof BigInt ||
        value instanceof Date ||
        value instanceof Buffer ||
        Buffer.isBuffer(value) ||
        value instanceof ArrayBuffer ||
        value instanceof Set ||
        value instanceof Map ||
        value instanceof RegExp);
}
const proxies = new WeakSet();
const proxiedObjects = new WeakSet();
function proxyIfNeeded(value, calledFromPromise = false) {
    if (isPrimitive(value))
        return value;
    if ((0, types_1.isPromise)(value)) {
        if (calledFromPromise)
            return value;
        return value.then(x => proxyIfNeeded(x, true));
    }
    if (Array.isArray(value))
        return value.map(x => proxyIfNeeded(x));
    return proxyWrapper(value);
}
function proxyWrapper(proxyTarget) {
    if (!proxyTarget)
        return proxyTarget;
    if (proxiedObjects.has(proxyTarget))
        return proxyTarget;
    proxiedObjects.add(proxyTarget);
    const proxy = new Proxy(proxyTarget, {
        get(target, prop) {
            const descriptor = Object.getOwnPropertyDescriptor(target, prop);
            if (descriptor && descriptor.get) {
                const result = descriptor.get.call(target);
                return proxyIfNeeded(result);
            }
            const entry = target[prop];
            if (typeof prop === 'symbol')
                return entry;
            if (proxies.has(target))
                return entry;
            if (entry && typeof entry === 'function') {
                if ((0, types_1.isAsyncFunction)(entry)) {
                    return (...args) => wrapAsyncCall(target, prop, ...args);
                }
                return (...args) => proxyIfNeeded(entry.call(target, ...args));
            }
            return proxyIfNeeded(entry);
        },
    });
    proxies.add(proxy);
    return proxy;
}
//# sourceMappingURL=nativeUtils.js.map