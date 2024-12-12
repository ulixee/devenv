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
var _TestDatabroker_events, _TestDatabroker_childProcess;
Object.defineProperty(exports, "__esModule", { value: true });
const EventSubscriber_1 = require("@ulixee/commons/lib/EventSubscriber");
const helpers_1 = require("@ulixee/datastore-testing/helpers");
const net_1 = require("@ulixee/net");
const HttpTransportToCore_1 = require("@ulixee/net/lib/HttpTransportToCore");
const node_child_process_1 = require("node:child_process");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const utils_1 = require("./utils");
class TestDatabroker {
    constructor(rootDir = (0, utils_1.getPlatformBuild)()) {
        this.rootDir = rootDir;
        _TestDatabroker_events.set(this, new EventSubscriber_1.default());
        _TestDatabroker_childProcess.set(this, void 0);
        helpers_1.needsClosing.push({ close: () => this.close(), onlyCloseOnFinal: true });
    }
    async start(envArgs) {
        __classPrivateFieldSet(this, _TestDatabroker_childProcess, (0, node_child_process_1.spawn)(`npx @ulixee/databroker start`, {
            stdio: ['ignore', 'pipe', 'pipe'],
            cwd: this.rootDir,
            shell: true,
            env: {
                ...process.env,
                DEBUG: 'ulx*',
                ...envArgs,
            },
        }), "f");
        __classPrivateFieldGet(this, _TestDatabroker_childProcess, "f").stdout.setEncoding('utf8');
        __classPrivateFieldGet(this, _TestDatabroker_childProcess, "f").stderr.setEncoding('utf8');
        const ports = await new Promise((resolve, reject) => {
            let isResolved = false;
            const onError = __classPrivateFieldGet(this, _TestDatabroker_events, "f").once(__classPrivateFieldGet(this, _TestDatabroker_childProcess, "f"), 'error', (err) => {
                console.warn('[DATABROKER] Error running cloud node', err);
                reject(err);
                isResolved = true;
            });
            __classPrivateFieldGet(this, _TestDatabroker_events, "f").on(__classPrivateFieldGet(this, _TestDatabroker_childProcess, "f").stderr, 'data', data => {
                console.warn('[DATABROKER] >> %s', data);
                __classPrivateFieldGet(this, _TestDatabroker_events, "f").off(onError);
                reject(data);
                isResolved = true;
            });
            __classPrivateFieldGet(this, _TestDatabroker_events, "f").on(__classPrivateFieldGet(this, _TestDatabroker_childProcess, "f").stdout, 'data', data => {
                console.log('[DATABROKER]', data.trim());
                if (isResolved)
                    return;
                const match = data.match(/Databroker listening at .*:(\d+). Admin server at: .+:(\d+)/);
                if (match?.length) {
                    resolve([match[1], match[2]]);
                    isResolved = true;
                }
            });
        });
        this.address = `http://localhost:${ports[0]}`;
        this.adminAddress = `ws://localhost:${ports[1]}`;
        __classPrivateFieldGet(this, _TestDatabroker_events, "f").on(__classPrivateFieldGet(this, _TestDatabroker_childProcess, "f"), 'error', err => {
            throw err;
        });
        __classPrivateFieldGet(this, _TestDatabroker_events, "f").on(__classPrivateFieldGet(this, _TestDatabroker_childProcess, "f"), 'exit', code => {
            console.warn('[DATABROKER] Server exited with code', code);
        });
        return this.address;
    }
    async close() {
        if (!__classPrivateFieldGet(this, _TestDatabroker_childProcess, "f"))
            return;
        __classPrivateFieldGet(this, _TestDatabroker_events, "f").close();
        const launchedProcess = __classPrivateFieldGet(this, _TestDatabroker_childProcess, "f");
        launchedProcess.stderr.destroy();
        launchedProcess.stdout.destroy();
        launchedProcess.kill();
        __classPrivateFieldSet(this, _TestDatabroker_childProcess, null, "f");
    }
    async whitelistDomain(domain) {
        const adminTransport = new net_1.WsTransportToCore(this.adminAddress);
        const adminConnection = new net_1.ConnectionToCore(adminTransport);
        datastore_testing_1.Helpers.onClose(() => adminConnection.disconnect());
        await adminConnection.connect();
        await adminConnection.sendRequest({
            command: 'WhitelistedDomains.add',
            args: [{ domain }],
        });
        console.log('[DATABROKER] Whitelisted domain', domain);
        await adminConnection.disconnect();
    }
    async registerUser(identityPath, amount) {
        console.log('[DATABROKER] Registering user with balance', amount, this.adminAddress);
        const adminTransport = new net_1.WsTransportToCore(this.adminAddress);
        const adminConnection = new net_1.ConnectionToCore(adminTransport);
        datastore_testing_1.Helpers.onClose(() => adminConnection.disconnect());
        await adminConnection.connect();
        await new Promise(setImmediate);
        const { id } = await adminConnection.sendRequest({
            command: 'Organization.create',
            args: [
                {
                    name: 'Test Organization',
                    balance: amount,
                },
            ],
        }, 10e3);
        const identity = Identity_1.default.loadFromFile(identityPath).bech32;
        console.log('[DATABROKER] Registering user', identity);
        await adminConnection.sendRequest({
            command: 'User.create',
            args: [
                {
                    identity,
                    organizationId: id,
                },
            ],
        }, 10e3);
        console.log('[DATABROKER] Registered user', identity);
        await adminConnection.disconnect();
    }
    async getBalance(identity) {
        const adminTransport = new HttpTransportToCore_1.default(this.address);
        const adminConnection = new net_1.ConnectionToCore(adminTransport);
        const { balance } = await adminConnection.sendRequest({
            command: 'Databroker.getBalance',
            args: [{ identity }],
        });
        return balance;
    }
}
_TestDatabroker_events = new WeakMap(), _TestDatabroker_childProcess = new WeakMap();
exports.default = TestDatabroker;
//# sourceMappingURL=TestDatabroker.js.map