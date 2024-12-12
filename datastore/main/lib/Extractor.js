"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Extractor_isRunning, _Extractor_datastoreInternal;
Object.defineProperty(exports, "__esModule", { value: true });
const sql_engine_1 = require("@ulixee/sql-engine");
const addGlobalInstance_1 = require("@ulixee/commons/lib/addGlobalInstance");
const ExtractorInternal_1 = require("./ExtractorInternal");
const ExtractorPlugins_1 = require("./ExtractorPlugins");
const DatastoreInternal_1 = require("./DatastoreInternal");
const ResultIterable_1 = require("./ResultIterable");
class Extractor {
    get schema() {
        return this.components.schema;
    }
    get name() {
        return this.components.name;
    }
    get description() {
        return this.components.description;
    }
    get datastoreInternal() {
        __classPrivateFieldSet(this, _Extractor_datastoreInternal, __classPrivateFieldGet(this, _Extractor_datastoreInternal, "f") ?? new DatastoreInternal_1.default({ extractors: { [this.name]: this } }), "f");
        return __classPrivateFieldGet(this, _Extractor_datastoreInternal, "f");
    }
    constructor(components, ...plugins) {
        _Extractor_isRunning.set(this, false);
        _Extractor_datastoreInternal.set(this, void 0);
        this.extractorType = 'basic';
        this.corePlugins = {};
        this.pluginClasses = [];
        this.successCount = 0;
        this.errorCount = 0;
        this.basePrice = 0n;
        this.components =
            typeof components === 'function'
                ? {
                    run: components,
                }
                : { ...components };
        this.components.name ??= 'default';
        for (const Plugin of plugins) {
            if (!Plugin)
                continue;
            this.pluginClasses.push(Plugin);
            const plugin = new Plugin(this.components);
            this.corePlugins[plugin.name] = plugin.version;
        }
        this.basePrice = BigInt(this.components.basePrice ?? 0);
    }
    runInternal(options, callbacks) {
        if (__classPrivateFieldGet(this, _Extractor_isRunning, "f")) {
            throw new Error('Datastore already running');
        }
        const resultsIterable = new ResultIterable_1.default();
        callbacks ??= {};
        callbacks.onFunction ??= async (_name, opts, run) => run(opts);
        callbacks
            .onFunction(this.name, options, async (finalOptions) => {
            const extractorInternal = new ExtractorInternal_1.default(finalOptions, this.components);
            const plugins = new ExtractorPlugins_1.default(this.components, this.pluginClasses);
            let context;
            try {
                __classPrivateFieldSet(this, _Extractor_isRunning, true, "f");
                extractorInternal.validateInput();
                context = await plugins.initialize(extractorInternal, this.datastoreInternal, callbacks);
                const extractorResults = extractorInternal.run(context);
                let counter = 0;
                for await (const output of extractorResults) {
                    extractorInternal.validateOutput(output, counter++);
                    resultsIterable.push(output);
                }
                await plugins.setResolution(extractorInternal.outputs);
                this.successCount++;
            }
            catch (error) {
                this.errorCount++;
                error.stack = error.stack.split('at Extractor.runInternal').shift().trim();
                await plugins.setResolution(null, error).catch(() => null);
                resultsIterable.reject(error);
            }
            finally {
                await extractorInternal.close();
                __classPrivateFieldSet(this, _Extractor_isRunning, false, "f");
                resultsIterable.done();
            }
        })
            .catch(resultsIterable.reject);
        return resultsIterable;
    }
    async queryInternal(sql, boundValues = [], options) {
        const name = this.components.name;
        const sqlParser = new sql_engine_1.SqlParser(sql, { function: name });
        if (!sqlParser.isSelect()) {
            throw new Error('Invalid SQL command');
        }
        const inputsByFunction = sqlParser.extractFunctionCallInputs(boundValues);
        const input = inputsByFunction[name];
        const records = await this.runInternal({ input });
        const engine = this.datastoreInternal.storageEngine;
        return engine.query(sqlParser, boundValues, options, {
            [name]: { records, parameters: input },
        });
    }
    attachToDatastore(datastoreInternal, extractorName) {
        this.components.name = extractorName;
        if (__classPrivateFieldGet(this, _Extractor_datastoreInternal, "f") && __classPrivateFieldGet(this, _Extractor_datastoreInternal, "f") === datastoreInternal)
            return;
        if (__classPrivateFieldGet(this, _Extractor_datastoreInternal, "f")) {
            throw new Error(`${extractorName} Extractor is already attached to a Datastore`);
        }
        __classPrivateFieldSet(this, _Extractor_datastoreInternal, datastoreInternal, "f");
    }
    bind(config) {
        return this.datastoreInternal.bind(config ?? {});
    }
}
_Extractor_isRunning = new WeakMap(), _Extractor_datastoreInternal = new WeakMap();
exports.default = Extractor;
(0, addGlobalInstance_1.default)(Extractor);
//# sourceMappingURL=Extractor.js.map