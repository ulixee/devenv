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
var _TestCloudNode_childProcess, _TestCloudNode_events;
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDatastore = uploadDatastore;
const EventSubscriber_1 = require("@ulixee/commons/lib/EventSubscriber");
const helpers_1 = require("@ulixee/datastore-testing/helpers");
const node_child_process_1 = require("node:child_process");
const promises_1 = require("node:fs/promises");
const Path = require("node:path");
const utils_1 = require("./utils");
class TestCloudNode {
    constructor(rootDir = (0, utils_1.getPlatformBuild)(), onlyCloseOnFinal = true) {
        this.rootDir = rootDir;
        _TestCloudNode_childProcess.set(this, void 0);
        _TestCloudNode_events.set(this, new EventSubscriber_1.default());
        helpers_1.needsClosing.push({ close: () => this.close(), onlyCloseOnFinal });
    }
    async start(envArgs) {
        __classPrivateFieldSet(this, _TestCloudNode_childProcess, (0, node_child_process_1.spawn)(`npx @ulixee/cloud start`, {
            stdio: ['ignore', 'pipe', 'pipe'],
            cwd: this.rootDir,
            shell: true,
            env: {
                ...process.env,
                ULX_DISABLE_DESKTOP_APIS: 'true',
                DEBUG: 'ulx*',
                ...envArgs,
            },
        }), "f");
        __classPrivateFieldGet(this, _TestCloudNode_childProcess, "f").stdout.setEncoding('utf8');
        __classPrivateFieldGet(this, _TestCloudNode_childProcess, "f").stderr.setEncoding('utf8');
        this.address = await new Promise((resolve, reject) => {
            let isResolved = false;
            const onProcessError = (err) => {
                console.warn('[DATASTORE CORE] Error running cloud node', err);
                reject(err);
                isResolved = true;
            };
            const onError = __classPrivateFieldGet(this, _TestCloudNode_events, "f").once(__classPrivateFieldGet(this, _TestCloudNode_childProcess, "f"), 'error', onProcessError);
            __classPrivateFieldGet(this, _TestCloudNode_events, "f").on(__classPrivateFieldGet(this, _TestCloudNode_childProcess, "f").stderr, 'data', data => {
                console.warn('[DATASTORE CORE] >> %s', data);
                __classPrivateFieldGet(this, _TestCloudNode_events, "f").off(onError);
                reject(data);
                isResolved = true;
            });
            __classPrivateFieldGet(this, _TestCloudNode_events, "f").on(__classPrivateFieldGet(this, _TestCloudNode_childProcess, "f").stdout, 'data', data => {
                console.log('[DATASTORE CORE]', data.trim());
                if (isResolved)
                    return;
                const match = data.match(/Ulixee Cloud listening at (.+)/);
                if (match?.length) {
                    resolve(match[1]);
                    isResolved = true;
                }
            });
        });
        __classPrivateFieldGet(this, _TestCloudNode_events, "f").on(__classPrivateFieldGet(this, _TestCloudNode_childProcess, "f"), 'error', err => {
            throw err;
        });
        __classPrivateFieldGet(this, _TestCloudNode_events, "f").on(__classPrivateFieldGet(this, _TestCloudNode_childProcess, "f"), 'exit', code => {
            console.warn('[DATASTORE CORE] Cloud node exited with code', code);
        });
        return this.address;
    }
    async close() {
        if (!__classPrivateFieldGet(this, _TestCloudNode_childProcess, "f"))
            return;
        __classPrivateFieldGet(this, _TestCloudNode_events, "f").close();
        const launchedProcess = __classPrivateFieldGet(this, _TestCloudNode_childProcess, "f");
        launchedProcess.stderr.destroy();
        launchedProcess.stdout.destroy();
        launchedProcess.kill();
        __classPrivateFieldSet(this, _TestCloudNode_childProcess, null, "f");
    }
}
_TestCloudNode_childProcess = new WeakMap(), _TestCloudNode_events = new WeakMap();
exports.default = TestCloudNode;
async function uploadDatastore(id, buildDir, cloudAddress, manifest, identityPath) {
    const datastorePath = Path.join('end-to-end', 'test', 'datastore', `${id}.js`);
    await (0, promises_1.writeFile)(Path.join(buildDir, datastorePath.replace('.js', '-manifest.json')), JSON.stringify(manifest));
    (0, utils_1.execAndLog)(`npx @ulixee/datastore deploy --skip-docs -u ${cloudAddress} .${Path.sep}${datastorePath}`, {
        cwd: buildDir,
        env: {
            ...process.env,
            ULX_IDENTITY_PATH: identityPath,
        },
    });
}
//# sourceMappingURL=TestCloudNode.js.map