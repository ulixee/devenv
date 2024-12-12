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
var _LocalDatastoreProcess_isSpawned, _LocalDatastoreProcess_child, _LocalDatastoreProcess_pendingMessage;
Object.defineProperty(exports, "__esModule", { value: true });
require("@ulixee/commons/lib/SourceMapSupport");
const Path = require("path");
const eventUtils_1 = require("@ulixee/commons/lib/eventUtils");
const utils_1 = require("@ulixee/commons/lib/utils");
const child_process_1 = require("child_process");
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
const datastoreProcessJsPath = require.resolve('../bin/datastore-process.js');
class LocalDatastoreProcess extends eventUtils_1.TypedEventEmitter {
    constructor(scriptPath) {
        super();
        _LocalDatastoreProcess_isSpawned.set(this, false);
        _LocalDatastoreProcess_child.set(this, void 0);
        _LocalDatastoreProcess_pendingMessage.set(this, void 0);
        this.scriptPath = scriptPath;
    }
    async fetchMeta() {
        return await this.sendMessageToChild({
            action: 'fetchMeta',
            scriptPath: this.scriptPath,
        });
    }
    close() {
        const promise = (0, utils_1.createPromise)();
        if (!__classPrivateFieldGet(this, _LocalDatastoreProcess_child, "f")) {
            promise.resolve();
            return;
        }
        __classPrivateFieldGet(this, _LocalDatastoreProcess_child, "f").once('exit', () => promise.resolve());
        __classPrivateFieldGet(this, _LocalDatastoreProcess_child, "f").kill('SIGKILL');
        this.closeCleanup();
        return promise.promise;
    }
    closeCleanup() {
        __classPrivateFieldSet(this, _LocalDatastoreProcess_child, undefined, "f");
    }
    get child() {
        if (__classPrivateFieldGet(this, _LocalDatastoreProcess_child, "f"))
            return __classPrivateFieldGet(this, _LocalDatastoreProcess_child, "f");
        const execArgv = [];
        const scriptDir = Path.dirname(this.scriptPath);
        const scriptIsTsFile = this.scriptPath.endsWith('.ts');
        if (scriptIsTsFile) {
            execArgv.push('-r', 'ts-node/register');
        }
        __classPrivateFieldSet(this, _LocalDatastoreProcess_child, (0, child_process_1.fork)(datastoreProcessJsPath, [], {
            execArgv,
            cwd: scriptDir,
            stdio: ['ignore', 'inherit', 'inherit', 'ipc'],
            env: { ...process.env, ULX_CLI_NOPROMPT: 'true' },
        }), "f");
        __classPrivateFieldGet(this, _LocalDatastoreProcess_child, "f").once('message', x => this.handleMessageFromChild(x));
        __classPrivateFieldGet(this, _LocalDatastoreProcess_child, "f").once('error', error => {
            console.error('ERROR in LocalDatastoreProcess', error);
            this.emit('error', error);
        });
        __classPrivateFieldGet(this, _LocalDatastoreProcess_child, "f").once('spawn', () => (__classPrivateFieldSet(this, _LocalDatastoreProcess_isSpawned, true, "f")));
        __classPrivateFieldGet(this, _LocalDatastoreProcess_child, "f").once('exit', () => this.closeCleanup());
        return __classPrivateFieldGet(this, _LocalDatastoreProcess_child, "f");
    }
    handleMessageFromChild(responseJson) {
        const response = TypeSerializer_1.default.parse(responseJson);
        const promise = __classPrivateFieldGet(this, _LocalDatastoreProcess_pendingMessage, "f");
        if (!promise)
            return;
        if (response.data instanceof Error)
            promise.reject(response.data);
        else
            promise.resolve(response.data);
        __classPrivateFieldSet(this, _LocalDatastoreProcess_pendingMessage, null, "f");
    }
    sendMessageToChild(message) {
        const promise = (0, utils_1.createPromise)();
        __classPrivateFieldSet(this, _LocalDatastoreProcess_pendingMessage, promise, "f");
        this.child.send(TypeSerializer_1.default.stringify(message));
        return promise.promise;
    }
}
_LocalDatastoreProcess_isSpawned = new WeakMap(), _LocalDatastoreProcess_child = new WeakMap(), _LocalDatastoreProcess_pendingMessage = new WeakMap();
exports.default = LocalDatastoreProcess;
//# sourceMappingURL=LocalDatastoreProcess.js.map