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
var _ExtractorInternal_isClosing, _ExtractorInternal_input, _ExtractorInternal_outputSchema;
Object.defineProperty(exports, "__esModule", { value: true });
const addGlobalInstance_1 = require("@ulixee/commons/lib/addGlobalInstance");
const eventUtils_1 = require("@ulixee/commons/lib/eventUtils");
const utils_1 = require("@ulixee/commons/lib/utils");
const schema_1 = require("@ulixee/schema");
const BaseSchema_1 = require("@ulixee/schema/lib/BaseSchema");
const StringSchema_1 = require("@ulixee/schema/lib/StringSchema");
const moment = require("moment");
const IObservableChange_1 = require("../interfaces/IObservableChange");
const DatastoreSchemaError_1 = require("./DatastoreSchemaError");
const Output_1 = require("./Output");
const ResultIterable_1 = require("./ResultIterable");
class ExtractorInternal extends eventUtils_1.TypedEventEmitter {
    constructor(options, components) {
        super();
        this.components = components;
        _ExtractorInternal_isClosing.set(this, void 0);
        _ExtractorInternal_input.set(this, void 0);
        _ExtractorInternal_outputSchema.set(this, void 0);
        this.outputs = [];
        options ??= {};
        this.options = options;
        this.schema = components.schema;
        __classPrivateFieldSet(this, _ExtractorInternal_input, (options.input ?? {}), "f");
        this.Output = (0, Output_1.default)({
            outputs: this.outputs,
            onNewOutput: this.onNewOutput.bind(this),
            onOutputChanges: this.defaultOnOutputChanges.bind(this),
            onOutputEmitted: this.onOutputEmitted.bind(this),
        });
        if (components.schema?.inputExamples?.length && components.schema.input) {
            ExtractorInternal.fillInputWithExamples(components.schema, __classPrivateFieldGet(this, _ExtractorInternal_input, "f"));
        }
        if (this.schema?.output) {
            let outputSchema = this.schema.output;
            if (!(outputSchema instanceof BaseSchema_1.default)) {
                outputSchema = new schema_1.ObjectSchema({ fields: outputSchema });
            }
            __classPrivateFieldSet(this, _ExtractorInternal_outputSchema, outputSchema, "f");
        }
        (0, utils_1.bindFunctions)(this);
    }
    run(context) {
        const extractorResults = new ResultIterable_1.default();
        this.onOutputRecord = (index, output) => extractorResults.push(output, index);
        void Promise.resolve(this.components.run(context))
            .then(this.emitPendingOutputs)
            .then(extractorResults.done)
            .catch(extractorResults.reject);
        return extractorResults;
    }
    emitPendingOutputs() {
        // emit all outputs
        for (const output of this.outputs)
            output.emit();
    }
    get isClosing() {
        return !!__classPrivateFieldGet(this, _ExtractorInternal_isClosing, "f");
    }
    get input() {
        return __classPrivateFieldGet(this, _ExtractorInternal_input, "f");
    }
    close(closeFn) {
        if (__classPrivateFieldGet(this, _ExtractorInternal_isClosing, "f"))
            return __classPrivateFieldGet(this, _ExtractorInternal_isClosing, "f");
        this.emit('close');
        __classPrivateFieldSet(this, _ExtractorInternal_isClosing, new Promise(async (resolve, reject) => {
            try {
                if (closeFn)
                    await closeFn();
                resolve();
            }
            catch (error) {
                reject(error);
            }
        }), "f");
        return __classPrivateFieldGet(this, _ExtractorInternal_isClosing, "f");
    }
    validateInput() {
        if (!this.schema?.input)
            return;
        const schema = new schema_1.ObjectSchema({ fields: this.schema.input });
        const inputValidation = schema.validate(this.input);
        if (!inputValidation.success) {
            throw new DatastoreSchemaError_1.default('The Extractor input did not match its Schema', inputValidation.errors, this.schema.input);
        }
    }
    validateOutput(output, counter) {
        if (!__classPrivateFieldGet(this, _ExtractorInternal_outputSchema, "f"))
            return;
        let humanCounter = ' ';
        if (counter !== null) {
            humanCounter = '1st ';
            if (counter === 2)
                humanCounter = '2nd ';
            if (counter === 3)
                humanCounter = '3rd ';
            if (counter >= 4)
                humanCounter = `${counter}th `;
        }
        const outputValidation = __classPrivateFieldGet(this, _ExtractorInternal_outputSchema, "f").validate(output);
        if (!outputValidation.success) {
            throw new DatastoreSchemaError_1.default(`The Extractor's ${humanCounter}Output did not match its Schema`, outputValidation.errors, output);
        }
    }
    onOutputEmitted(index, output) {
        if (this.schema?.output) {
            // TODO: follow nested schema columns
            for (const key of Object.keys(output)) {
                if (!this.schema.output[key] && !this.schema.output.fields?.[key])
                    delete output[key];
            }
        }
        this.onOutputRecord?.(index, output);
    }
    onNewOutput(index) {
        if (this.onOutputChanges)
            this.onOutputChanges(index, [{ path: [], value: {}, type: IObservableChange_1.ObservableChangeType.insert }]);
    }
    defaultOnOutputChanges(index, output, changes) {
        if (this.onOutputChanges)
            this.onOutputChanges(index, changes);
        try {
            this.validateOutput(output, index);
        }
        catch (err) {
            // NOTE: filter errors to only changed schema elements. Otherwise, we get incomplete object errors
            if (err instanceof DatastoreSchemaError_1.default) {
                const validErrors = [];
                for (const change of changes) {
                    const path = `.${change.path.join('.')}`;
                    let keyPaths = [];
                    if (change.type === 'insert' && change.value && typeof change.value === 'object') {
                        keyPaths = Object.keys(change.value).map(x => `${path}.${x}`);
                    }
                    for (const error of err.errors) {
                        if (error.path === path || keyPaths.some(x => error.path.startsWith(x)))
                            validErrors.push(error);
                    }
                }
                if (validErrors.length)
                    throw new DatastoreSchemaError_1.default(err.message, validErrors, output);
            }
        }
    }
    static fillInputWithExamples(schema, input) {
        const randomEntry = (0, utils_1.pickRandom)(schema.inputExamples);
        for (const [key, field] of Object.entries(schema.input)) {
            if (input[key] === undefined && field.optional !== true) {
                let value = randomEntry[key];
                if (value instanceof schema_1.DateUtilities &&
                    field instanceof StringSchema_1.default &&
                    (field.format === 'date' || field.format === 'time')) {
                    value = value.evaluate(field.format);
                }
                input[key] = value;
            }
        }
    }
    static createExampleCall(functionName, schema) {
        if (schema) {
            const args = {};
            if (schema.inputExamples?.length) {
                this.fillInputWithExamples(schema, args);
            }
            else {
                for (const [name, field] of Object.entries(schema?.input ?? {})) {
                    if (field.optional === true)
                        continue;
                    if (field.format === 'time')
                        args[name] = moment().format(StringSchema_1.default.TimeFormat);
                    else if (field.format === 'date')
                        args[name] = moment().format(StringSchema_1.default.DateFormat);
                    else if (field.format === 'url')
                        args[name] = '<USER SUPPLIED URL>';
                    else if (field.format === 'email')
                        args[name] = '<USER SUPPLIED EMAIL>';
                    else if (field.enum)
                        args[name] = field.enum[0];
                    args[name] ??= `<USER SUPPLIED ${field.typeName}>`;
                }
            }
            const keys = Object.keys(args).map((key, i) => `${key} => $${i + 1}`);
            return {
                formatted: `${functionName}(${keys.join(', ')})`,
                args,
            };
        }
        return {
            formatted: `${functionName}()`,
            args: {},
        };
    }
}
_ExtractorInternal_isClosing = new WeakMap(), _ExtractorInternal_input = new WeakMap(), _ExtractorInternal_outputSchema = new WeakMap();
exports.default = ExtractorInternal;
(0, addGlobalInstance_1.default)(schema_1.DateUtilities, StringSchema_1.default, ExtractorInternal);
//# sourceMappingURL=ExtractorInternal.js.map