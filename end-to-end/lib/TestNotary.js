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
var _TestNotary_dbName, _TestNotary_dbConnectionString, _TestNotary_childProcess, _TestNotary_stdioInterface;
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = require("nanoid");
const pg_1 = require("pg");
const child_process = require("node:child_process");
const mainchain_1 = require("@argonprotocol/mainchain");
const fs = require("node:fs");
const readline = require("node:readline");
const process = require("node:process");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const paths_1 = require("../paths");
const testHelpers_1 = require("./testHelpers");
const nanoid = (0, nanoid_1.customAlphabet)('0123456789abcdefghijklmnopqrstuvwxyz', 4);
class TestNotary {
    get address() {
        if (this.proxy) {
            const url = new URL(this.proxy);
            url.searchParams.set('target', `ws://${this.ip}:${this.port}`);
            return url.href;
        }
        return `ws://${this.ip}:${this.port}`;
    }
    constructor(dbConnectionString) {
        this.ip = '127.0.0.1';
        this.logLevel = 'warn';
        _TestNotary_dbName.set(this, void 0);
        _TestNotary_dbConnectionString.set(this, void 0);
        _TestNotary_childProcess.set(this, void 0);
        _TestNotary_stdioInterface.set(this, void 0);
        __classPrivateFieldSet(this, _TestNotary_dbConnectionString, dbConnectionString ??
            process.env.NOTARY_DB_URL ??
            'postgres://postgres:postgres@localhost:5432', "f");
    }
    /**
     * Returns the localhost address of the notary (NOTE: not accessible from containers)
     */
    async start(argonMainchainUrl, pathToNotaryBin) {
        this.operator = new mainchain_1.Keyring({ type: 'sr25519' }).createFromUri('//Bob');
        this.registeredPublicKey = new mainchain_1.Keyring({ type: 'ed25519' }).createFromUri('//Ferdie//notary').publicKey;
        let notaryPath = pathToNotaryBin ?? `${paths_1.rootDir}/../../mainchain/target/debug/argon-notary`;
        if (process.env.ULX_USE_DOCKER_BINS) {
            this.containerName = `notary_${nanoid()}`;
            const addHost = process.env.ADD_DOCKER_HOST
                ? ` --add-host=host.docker.internal:host-gateway`
                : '';
            notaryPath = `docker run --rm -p=0:9925${addHost} --name=${this.containerName} -e RUST_LOG=${this.logLevel} ghcr.io/argonprotocol/argon-notary:dev`;
            __classPrivateFieldSet(this, _TestNotary_dbConnectionString, (0, testHelpers_1.cleanHostForDocker)(__classPrivateFieldGet(this, _TestNotary_dbConnectionString, "f")), "f");
        }
        else if (!fs.existsSync(notaryPath)) {
            throw new Error(`Notary binary not found at ${notaryPath}`);
        }
        const client = await this.connect();
        try {
            let tries = 10;
            let dbName = '';
            while (tries > 0) {
                const uid = nanoid();
                dbName = `notary_${uid}`;
                // check if the db path  notary_{id} exists
                const result = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
                if (result.rowCount === 0) {
                    break;
                }
                tries -= 1;
            }
            __classPrivateFieldSet(this, _TestNotary_dbName, dbName, "f");
            await client.query(`CREATE DATABASE "${dbName}"`);
        }
        finally {
            await client.end();
        }
        console.log(`${notaryPath} migrate --db-url ${__classPrivateFieldGet(this, _TestNotary_dbConnectionString, "f")}/${__classPrivateFieldGet(this, _TestNotary_dbName, "f")}`);
        const result = child_process.execSync(`${notaryPath} migrate --db-url ${__classPrivateFieldGet(this, _TestNotary_dbConnectionString, "f")}/${__classPrivateFieldGet(this, _TestNotary_dbName, "f")}`, {
            encoding: 'utf-8',
        });
        if (result.trim().length) {
            console.log(result.trim());
        }
        console.log("Notary >> connecting to mainchain '%s', db %s", argonMainchainUrl, `${__classPrivateFieldGet(this, _TestNotary_dbConnectionString, "f")}/${__classPrivateFieldGet(this, _TestNotary_dbName, "f")}`);
        const execArgs = [
            'run',
            `--db-url=${__classPrivateFieldGet(this, _TestNotary_dbConnectionString, "f")}/${__classPrivateFieldGet(this, _TestNotary_dbName, "f")}`,
            `--dev`,
            `--operator-address=${this.operator.address}`,
            `-t ${argonMainchainUrl}`,
        ];
        if (process.env.ULX_USE_DOCKER_BINS) {
            execArgs.unshift(...notaryPath.replace('docker run', 'run').split(' '));
            execArgs.push('-b=0.0.0.0:9925');
            notaryPath = 'docker';
        }
        console.log(notaryPath, execArgs.join(' '));
        __classPrivateFieldSet(this, _TestNotary_childProcess, child_process.spawn(notaryPath, execArgs, {
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, RUST_LOG: this.logLevel },
        }), "f");
        datastore_testing_1.Helpers.needsClosing.push({ close: () => this.teardown(), onlyCloseOnFinal: true });
        __classPrivateFieldGet(this, _TestNotary_childProcess, "f").stdout.setEncoding('utf8');
        __classPrivateFieldGet(this, _TestNotary_childProcess, "f").stderr.setEncoding('utf8');
        this.port = await new Promise((resolve, reject) => {
            const onProcessError = (err) => {
                console.warn('Error running notary', err);
                reject(err);
            };
            __classPrivateFieldGet(this, _TestNotary_childProcess, "f").once('error', onProcessError);
            __classPrivateFieldGet(this, _TestNotary_childProcess, "f").stderr.on('data', data => {
                console.warn('Notary >> %s', data);
                if (data.startsWith('WARNING'))
                    return;
                __classPrivateFieldGet(this, _TestNotary_childProcess, "f").off('error', onProcessError);
                reject(data);
            });
            __classPrivateFieldSet(this, _TestNotary_stdioInterface, readline
                .createInterface({ input: __classPrivateFieldGet(this, _TestNotary_childProcess, "f").stdout })
                .on('line', line => {
                console.log('Notary >> %s', line);
                const match = line.match(/Listening on ([ws:/\d.]+)/);
                if (match) {
                    resolve(match[1].split(':').pop());
                }
            }), "f");
        });
        __classPrivateFieldGet(this, _TestNotary_childProcess, "f").on('error', err => {
            throw err;
        });
        if (this.containerName) {
            this.port = await (0, testHelpers_1.getDockerPortMapping)(this.containerName, 9925);
            this.proxy = (0, testHelpers_1.cleanHostForDocker)(await (0, testHelpers_1.getProxy)());
        }
        return this.address;
    }
    async register(client) {
        const address = new URL(this.address);
        await new Promise(async (resolve, reject) => {
            await client.tx.notaries
                .propose({
                public: this.registeredPublicKey,
                hosts: [address.href],
            })
                .signAndSend(this.operator, ({ events, status }) => {
                if (status.isInBlock) {
                    void (0, mainchain_1.checkForExtrinsicSuccess)(events, client).then(() => {
                        console.log(`Successful proposal of notary in block ${status.asInBlock.toHex()}`, status.type);
                        resolve();
                        return null;
                    }, reject);
                }
                else {
                    console.log(`Status of notary proposal: ${status.type}`);
                }
            });
        });
    }
    async teardown() {
        const launchedProcess = __classPrivateFieldGet(this, _TestNotary_childProcess, "f");
        if (launchedProcess) {
            launchedProcess?.kill();
            try {
                launchedProcess.stdio.forEach(io => io?.destroy());
            }
            catch { }
            launchedProcess.unref();
        }
        __classPrivateFieldGet(this, _TestNotary_stdioInterface, "f")?.close();
        const client = await this.connect();
        try {
            await client.query(`DROP DATABASE "${__classPrivateFieldGet(this, _TestNotary_dbName, "f")}" WITH (FORCE)`);
        }
        finally {
            await client.end();
        }
        if (this.containerName) {
            try {
                child_process.execSync(`docker rm -f ${this.containerName}`);
            }
            catch { }
        }
    }
    async connect() {
        const client = new pg_1.Client({ connectionString: __classPrivateFieldGet(this, _TestNotary_dbConnectionString, "f") });
        try {
            await client.connect();
        }
        catch (err) {
            console.error('ERROR connecting to postgres client', err);
            throw err;
        }
        return client;
    }
}
_TestNotary_dbName = new WeakMap(), _TestNotary_dbConnectionString = new WeakMap(), _TestNotary_childProcess = new WeakMap(), _TestNotary_stdioInterface = new WeakMap();
exports.default = TestNotary;
//# sourceMappingURL=TestNotary.js.map