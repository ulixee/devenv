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
var _TestMainchain_binPath, _TestMainchain_process, _TestMainchain_interfaces;
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerZoneRecord = registerZoneRecord;
exports.activateNotary = activateNotary;
const datastore_testing_1 = require("@ulixee/datastore-testing");
const mainchain_1 = require("@argonprotocol/mainchain");
const nanoid_1 = require("nanoid");
const node_child_process_1 = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const readline = require("node:readline");
const paths_1 = require("../paths");
const testHelpers_1 = require("./testHelpers");
const nanoid = (0, nanoid_1.customAlphabet)('0123456789abcdefghijklmnopqrstuvwxyz', 4);
class TestMainchain {
    get address() {
        if (this.proxy) {
            const url = new URL(this.proxy);
            url.searchParams.set('target', `ws://${this.ip}:${this.port}`);
            return url.href;
        }
        return `ws://${this.ip}:${this.port}`;
    }
    constructor(binPath) {
        this.ip = '127.0.0.1';
        this.loglevel = 'warn';
        _TestMainchain_binPath.set(this, void 0);
        _TestMainchain_process.set(this, void 0);
        _TestMainchain_interfaces.set(this, []);
        __classPrivateFieldSet(this, _TestMainchain_binPath, binPath ?? `${paths_1.rootDir}/../../mainchain/target/debug/argon-node`, "f");
        __classPrivateFieldSet(this, _TestMainchain_binPath, path.resolve(__classPrivateFieldGet(this, _TestMainchain_binPath, "f")), "f");
        if (!process.env.ULX_USE_DOCKER_BINS && !fs.existsSync(__classPrivateFieldGet(this, _TestMainchain_binPath, "f"))) {
            throw new Error(`Mainchain binary not found at ${__classPrivateFieldGet(this, _TestMainchain_binPath, "f")}`);
        }
        datastore_testing_1.Helpers.needsClosing.push({ close: () => this.teardown(), onlyCloseOnFinal: true });
    }
    /**
     * Launch and return the localhost url. NOTE: this url will not work cross-docker. You need to use the containerAddress property
     * @param miningThreads
     */
    async launch(miningThreads = os.cpus().length - 1) {
        let port = 0;
        let rpcPort = 0;
        if (miningThreads === 0)
            miningThreads = 1;
        let execArgs = [];
        let containerName;
        if (process.env.ULX_USE_DOCKER_BINS) {
            containerName = `miner_${nanoid()}`;
            this.containerName = containerName;
            __classPrivateFieldSet(this, _TestMainchain_binPath, 'docker', "f");
            port = 33344;
            rpcPort = 9944;
            execArgs = [
                'run',
                '--rm',
                `--name=${containerName}`,
                `-p=0:${port}`,
                `-p=0:${rpcPort}`,
                '-e',
                `RUST_LOG=${this.loglevel},sc_rpc_server=info`,
                'ghcr.io/argonprotocol/argon-miner:dev',
            ];
            if (process.env.ADD_DOCKER_HOST) {
                execArgs.splice(2, 0, `--add-host=host.docker.internal:host-gateway`);
            }
        }
        const bitcoinRpcUrl = await this.startBitcoin();
        execArgs.push('--dev', '--alice', `--compute-miners=${miningThreads}`, `--port=${port}`, `--rpc-port=${rpcPort}`, '--rpc-external', `--bitcoin-rpc-url=${bitcoinRpcUrl}`);
        __classPrivateFieldSet(this, _TestMainchain_process, (0, node_child_process_1.spawn)(__classPrivateFieldGet(this, _TestMainchain_binPath, "f"), execArgs, {
            stdio: ['ignore', 'pipe', 'pipe', 'ignore'],
            env: { ...process.env, RUST_LOG: `${this.loglevel},sc_rpc_server=info` },
        }), "f");
        __classPrivateFieldGet(this, _TestMainchain_process, "f").stderr.setEncoding('utf8');
        __classPrivateFieldGet(this, _TestMainchain_process, "f").stdout.setEncoding('utf8');
        __classPrivateFieldGet(this, _TestMainchain_process, "f").stdout.on('data', data => {
            console.log('Main >> %s', data);
        });
        const int1 = readline.createInterface({ input: __classPrivateFieldGet(this, _TestMainchain_process, "f").stdout }).on('line', line => {
            if (line)
                console.log('Main >> %s', line);
        });
        __classPrivateFieldGet(this, _TestMainchain_interfaces, "f").push(int1);
        this.port = await new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _TestMainchain_process, "f").on('error', err => {
                console.warn('Error running mainchain', err);
                reject(err);
            });
            const int2 = readline.createInterface({ input: __classPrivateFieldGet(this, _TestMainchain_process, "f").stderr }).on('line', line => {
                console.log('Main >> %s', line);
                const match = line.match(/Running JSON-RPC server: addr=([\d.:]+)/);
                if (match) {
                    const ipv4 = match[1].split(',').at(0);
                    resolve(ipv4.split(':').pop());
                }
            });
            __classPrivateFieldGet(this, _TestMainchain_interfaces, "f").push(int2);
        });
        if (this.containerName) {
            this.port = await (0, testHelpers_1.getDockerPortMapping)(this.containerName, rpcPort);
            this.proxy = (0, testHelpers_1.cleanHostForDocker)(await (0, testHelpers_1.getProxy)());
        }
        console.log(`Ulx Node listening at ${this.address}`);
        return this.address;
    }
    async teardown() {
        if (process.env.ULX_USE_DOCKER_BINS) {
            try {
                (0, node_child_process_1.execSync)(`docker rm -f ${this.containerName}`);
            }
            catch { }
        }
        const launchedProcess = __classPrivateFieldGet(this, _TestMainchain_process, "f");
        if (launchedProcess) {
            launchedProcess?.kill();
            try {
                launchedProcess.stdio.forEach(io => io?.destroy());
            }
            catch { }
            launchedProcess.unref();
        }
        for (const i of __classPrivateFieldGet(this, _TestMainchain_interfaces, "f")) {
            i.close();
        }
    }
    async startBitcoin() {
        const rpcPort = 14338;
        // const rpcPort = await PortFinder.getPortPromise();
        //
        // const path = child_process.execSync(`${__dirname}/../../target/debug/ulx-testing-bitcoin`, {encoding: 'utf8'}).trim();
        //
        // const tmpDir = fs.mkdtempSync('/tmp/ulx-bitcoin-');
        //
        // this.#bitcoind = spawn(path, ['-regtest', '-fallbackfee=0.0001', '-listen=0', `-datadir=${tmpDir}`, '-blockfilterindex', '-txindex', `-rpcport=${rpcPort}`, '-rpcuser=bitcoin', '-rpcpassword=bitcoin'], {
        //     stdio: ['ignore', 'inherit', 'inherit', "ignore"],
        // });
        // return a fake url - not part of testing localchain
        return (0, testHelpers_1.cleanHostForDocker)(`http://bitcoin:bitcoin@localhost:${rpcPort}`);
    }
}
_TestMainchain_binPath = new WeakMap(), _TestMainchain_process = new WeakMap(), _TestMainchain_interfaces = new WeakMap();
exports.default = TestMainchain;
async function registerZoneRecord(client, domainHash, owner, paymentAccount, notaryId, versions) {
    const codecVersions = new Map();
    for (const [version, host] of Object.entries(versions)) {
        const [major, minor, patch] = version.split('.');
        const versionCodec = client.createType('ArgonPrimitivesDomainSemver', {
            major,
            minor,
            patch,
        });
        codecVersions.set(versionCodec, client.createType('ArgonPrimitivesDomainVersionHost', host));
    }
    await new Promise((resolve, reject) => {
        return client.tx.domains
            .setZoneRecord(domainHash, {
            paymentAccount,
            notaryId,
            versions: codecVersions,
        })
            .signAndSend(owner, ({ events, status }) => {
            if (status.isFinalized) {
                (0, mainchain_1.checkForExtrinsicSuccess)(events, client).then(resolve).catch(reject);
            }
            if (status.isInBlock) {
                (0, mainchain_1.checkForExtrinsicSuccess)(events, client).catch(reject);
            }
        })
            .catch(reject);
    });
}
async function activateNotary(sudo, client, notary) {
    await notary.register(client);
    await new Promise((resolve, reject) => {
        void client.tx.sudo
            .sudo(client.tx.notaries.activate(notary.operator.publicKey))
            .signAndSend(sudo, ({ events, status }) => {
            if (status.isInBlock) {
                // eslint-disable-next-line promise/always-return
                return (0, mainchain_1.checkForExtrinsicSuccess)(events, client).then(() => {
                    console.log(`Successful activation of notary in block ${status.asInBlock.toHex()}`);
                    resolve();
                }, reject);
            }
            console.log(`Status of notary activation: ${status.type}`);
        });
    });
}
//# sourceMappingURL=TestMainchain.js.map