"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ExtractorPlugins_components;
Object.defineProperty(exports, "__esModule", { value: true });
const Resolvable_1 = require("@ulixee/commons/lib/Resolvable");
const ExtractorContext_1 = require("./ExtractorContext");
class ExtractorPlugins {
    constructor(components, plugins) {
        _ExtractorPlugins_components.set(this, void 0);
        this.clientPlugins = [];
        this.pluginNextPromises = [];
        this.pluginRunPromises = [];
        __classPrivateFieldSet(this, _ExtractorPlugins_components, components, "f");
        for (const Plugin of plugins) {
            const plugin = new Plugin(__classPrivateFieldGet(this, _ExtractorPlugins_components, "f"));
            this.clientPlugins.push(plugin);
        }
    }
    async initialize(extractorInternal, datastoreInternal, callbacks) {
        const context = new ExtractorContext_1.default(extractorInternal, datastoreInternal, callbacks);
        // plugin `run` phases
        for (const plugin of this.clientPlugins) {
            const outputPromise = new Resolvable_1.default();
            this.pluginNextPromises.push(outputPromise);
            await new Promise((resolve, reject) => {
                try {
                    const promise = plugin
                        .run(extractorInternal, context, () => {
                        // wait for next to be called
                        resolve();
                        return outputPromise.promise;
                    })
                        .catch(err => err)
                        // if promise resolves, next wasn't called... don't hang
                        .finally(resolve);
                    this.pluginRunPromises.push(promise);
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        return context;
    }
    async setResolution(outputs, error) {
        // Resolve plugin next promises
        for (const promise of this.pluginNextPromises) {
            if (error)
                promise.reject(error);
            else
                promise.resolve(outputs);
        }
        // wait for all plugins to complete
        const results = await Promise.all(this.pluginRunPromises);
        for (const result of results) {
            if (result instanceof Error && result !== error)
                throw result;
        }
    }
}
_ExtractorPlugins_components = new WeakMap();
exports.default = ExtractorPlugins;
//# sourceMappingURL=ExtractorPlugins.js.map