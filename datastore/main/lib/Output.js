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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createOutputGenerator;
const util_1 = require("util");
const ObjectObserver_1 = require("./ObjectObserver");
function createOutputGenerator(internal) {
    var _Output_observable, _Output_isEmitted, _Output_index;
    return class Output {
        constructor(data) {
            _Output_observable.set(this, void 0);
            _Output_isEmitted.set(this, false);
            _Output_index.set(this, void 0);
            __classPrivateFieldSet(this, _Output_index, internal.outputs.length, "f");
            __classPrivateFieldSet(this, _Output_observable, new ObjectObserver_1.default(data ?? {}), "f");
            __classPrivateFieldGet(this, _Output_observable, "f").proxiedFunctions.emit = this.emit.bind(this);
            __classPrivateFieldGet(this, _Output_observable, "f").proxiedFunctions.toJSON = this.toJSON.bind(this);
            __classPrivateFieldGet(this, _Output_observable, "f").onChanges = internal.onOutputChanges.bind(null, __classPrivateFieldGet(this, _Output_index, "f"), __classPrivateFieldGet(this, _Output_observable, "f").target);
            internal.outputs.push(__classPrivateFieldGet(this, _Output_observable, "f").proxy);
            internal.onNewOutput(__classPrivateFieldGet(this, _Output_index, "f"));
            if (data && Object.keys(data).length) {
                process.nextTick(__classPrivateFieldGet(this, _Output_observable, "f").emitTarget.bind(__classPrivateFieldGet(this, _Output_observable, "f")));
            }
            // eslint-disable-next-line no-constructor-return
            return __classPrivateFieldGet(this, _Output_observable, "f").proxy;
        }
        toJSON() {
            const target = __classPrivateFieldGet(this, _Output_observable, "f").target;
            const result = {};
            if (!target)
                return result;
            for (const [key, value] of Object.entries(target)) {
                result[key] = value;
            }
            return result;
        }
        [(_Output_observable = new WeakMap(), _Output_isEmitted = new WeakMap(), _Output_index = new WeakMap(), util_1.inspect.custom)]() {
            return this.toJSON();
        }
        emit() {
            if (__classPrivateFieldGet(this, _Output_isEmitted, "f"))
                return;
            __classPrivateFieldSet(this, _Output_isEmitted, true, "f");
            const target = __classPrivateFieldGet(this, _Output_observable, "f").target;
            Object.freeze(target);
            internal.onOutputEmitted(__classPrivateFieldGet(this, _Output_index, "f"), this.toJSON());
        }
        static emit(data) {
            new Output(data).emit();
        }
    };
}
//# sourceMappingURL=Output.js.map