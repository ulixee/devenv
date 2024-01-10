"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_1 = require("@ulixee/cloud");
const asyncUtils_1 = require("@ulixee/commons/lib/asyncUtils");
const errors_1 = require("@ulixee/commons/lib/errors");
const hashUtils_1 = require("@ulixee/commons/lib/hashUtils");
const Ed25519_1 = require("@ulixee/crypto/lib/Ed25519");
const Identity_1 = require("@ulixee/crypto/lib/Identity");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const Fs = require("fs");
const Path = require("path");
const ConnectionToKadCore_1 = require("../lib/ConnectionToKadCore");
const KadRecord_1 = require("../lib/KadRecord");
const dbFolder = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'KadNode.test');
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(datastore_testing_1.Helpers.afterAll);
test('should correctly register peers', async () => {
    const node1 = await startKadNode();
    const node2 = await startKadNode();
    await node2.kad.addPeer(node1.kad.nodeInfo);
    await node2.kad.ensureNetworkConnected();
    const nodeInfos1 = node1.kad.getKnownNodes();
    const nodeInfos2 = node2.kad.getKnownNodes();
    expect(nodeInfos1[0].nodeId).toBe(node2.kad.nodeId);
    expect(nodeInfos1[0].kadHost).toBe(node2.kad.nodeInfo.kadHost);
    expect(nodeInfos2[0].nodeId).toBe(node1.kad.nodeId);
    expect(nodeInfos2[0].kadHost).toBe(node1.kad.nodeInfo.kadHost);
});
test('should provide and find providers', async () => {
    const connectSpy = jest.spyOn(ConnectionToKadCore_1.default.prototype, 'sendRequest');
    const node1 = await startKadNode();
    const node2 = await startKadNode({
        boostrapList: [node1.kad.nodeHost],
    });
    const key = (0, hashUtils_1.sha256)('test');
    await node2.kad.provide(key);
    const providerPeers = [];
    for await (const node of node1.kad.findProviderNodes(key)) {
        providerPeers.push(node);
    }
    expect(providerPeers).toHaveLength(1);
    const commands = connectSpy.mock.calls.map(x => x[0].command);
    // should re-use the initial connection for both directions
    expect(commands.filter(x => x === 'Kad.connect')).toHaveLength(1);
    expect(commands.filter(x => x === 'Kad.verify')).toHaveLength(1);
    expect(commands.filter(x => x === 'Kad.provide')).toHaveLength(1);
    expect(commands.filter(x => x === 'Kad.findProviders')).toHaveLength(1);
});
test('start and connect multiple nodes', async () => {
    const nodes = await Promise.all(Array(10)
        .fill(0)
        .map(() => startKadNode()));
    for (let i = 0; i < nodes.length; i += 1) {
        let nextIdx = i + 1;
        if (nextIdx > nodes.length - 1)
            nextIdx = 0;
        await nodes[i].kad.addPeer(nodes[nextIdx].kad.nodeInfo);
    }
    await Promise.all(nodes.map(x => x.kad.ensureNetworkConnected()));
    let i = 0;
    for (const conn of nodes) {
        const peerIds = conn.kad.peerStore.all();
        expect(peerIds.length).toBeGreaterThanOrEqual(1);
        i++;
    }
    // findPeer test
    const peerLookup = await nodes[2].kad.findPeer(nodes[8].kad.nodeId);
    expect(peerLookup).toBeTruthy();
    expect(nodes[8].kad.nodeInfo.apiHost).toContain(peerLookup.apiHost);
}, 30000);
test('can find closer peers in the network', async () => {
    const nDHTs = 30;
    const dhts = await Promise.all(Array(nDHTs)
        .fill(0)
        .map(() => startKadNode({})));
    const connected = [];
    for (let i = 0; i < dhts.length - 1; i++) {
        connected.push(dhts[i].kad.addPeer(dhts[(i + 1) % dhts.length].kad.nodeInfo));
    }
    await Promise.all(connected);
    const closers = await dhts[1].kad.findClosestNodes((0, hashUtils_1.sha256)('foo'));
    expect(closers).not.toHaveLength(0);
});
test('can put a secure record and get it from another node', async () => {
    const keypair = await Ed25519_1.default.create();
    const { key, record } = KadRecord_1.default.create(keypair.privateKey, 'put - get', Date.now());
    const [dhtA, dhtB] = await Promise.all([startKadNode(), startKadNode()]);
    // Connect nodes
    await dhtA.kad.addPeer(dhtB.kad.nodeInfo);
    // Exchange data through the dht
    await (0, asyncUtils_1.all)(dhtA.kad.put(key, record));
    const res = await (0, asyncUtils_1.first)(dhtB.kad.get(key));
    expect(res).toHaveProperty('value', 'put - get');
});
test('should not accept an invalid signed record', async () => {
    const keypair = await Ed25519_1.default.create();
    const { key, record } = KadRecord_1.default.create(keypair.privateKey, 'invalid', Date.now());
    record.signature = Buffer.concat([record.signature, Buffer.from([0])]);
    const [dhtA, dhtB] = await Promise.all([startKadNode(), startKadNode()]);
    await dhtA.kad.addPeer(dhtB.kad.nodeInfo);
    await expect((0, asyncUtils_1.all)(dhtA.kad.put(key, record))).rejects.toThrow();
    await expect((0, asyncUtils_1.last)(dhtB.kad.get(key))).resolves.toBeUndefined();
});
test('should require a minimum number of peers to have successful puts', async () => {
    const errCode = 'ERR_NOT_AVAILABLE';
    const error = new errors_1.CodeError('fake error', errCode);
    const value = 'put - minimum';
    const keypair = await Ed25519_1.default.create();
    const { key, record } = KadRecord_1.default.create(keypair.privateKey, value, Date.now());
    const [dhtA, dhtB, dhtC, dhtD] = await Promise.all([
        startKadNode(),
        startKadNode(),
        startKadNode(),
        startKadNode(),
    ]);
    jest.spyOn(dhtD.kad.contentFetching, 'putLocal').mockImplementationOnce(async () => {
        throw error;
    });
    await Promise.all([
        dhtA.kad.addPeer(dhtB.kad.nodeInfo),
        dhtA.kad.addPeer(dhtC.kad.nodeInfo),
        dhtA.kad.addPeer(dhtD.kad.nodeInfo),
    ]);
    await (0, asyncUtils_1.all)(dhtA.kad.put(key, record, { minPutPeers: 2 }));
    const res = await (0, asyncUtils_1.last)(dhtB.kad.get(key));
    expect(res).toHaveProperty('value', value);
});
test('should send updates to nodes with an outdated record', async () => {
    const keypair = await Ed25519_1.default.create();
    const { record: recordB } = KadRecord_1.default.create(keypair.privateKey, 'worldB', Date.now());
    // A is newer, so should be sent out as the updated value
    const { key, record: recordA } = KadRecord_1.default.create(keypair.privateKey, 'worldA', Date.now() + 1);
    const [dhtA, dhtB] = await Promise.all([startKadNode(), startKadNode()]);
    const dhtASpy = jest.spyOn(dhtA.kad.network, 'sendRequest');
    // Put before peers connected
    await dhtA.kad.contentFetching.putLocal(key, recordA);
    await dhtB.kad.contentFetching.putLocal(key, recordB);
    // Connect peers
    await dhtA.kad.addPeer(dhtB.kad.nodeInfo);
    // Get values
    const resA = await (0, asyncUtils_1.last)(dhtA.kad.get(key));
    expect(resA).toHaveProperty('value', recordA.value);
    const resB = await (0, asyncUtils_1.last)(dhtB.kad.get(key));
    // latest timestamp is used
    expect(resB).toHaveProperty('value', recordA.value);
    let foundGetValue = false;
    let foundPutValue = false;
    for (const call of dhtASpy.mock.calls) {
        if (call[0].nodeId === dhtB.kad.nodeId && call[1] === 'Kad.get') {
            // query B
            foundGetValue = true;
        }
        if (call[0].nodeId === dhtB.kad.nodeId && call[1] === 'Kad.put') {
            // update B
            foundPutValue = true;
        }
    }
    expect(foundGetValue).toBe(true);
    expect(foundPutValue).toBe(true);
});
test('layered get', async () => {
    const value = 'world';
    const keypair = await Ed25519_1.default.create();
    const { key, record } = KadRecord_1.default.create(keypair.privateKey, value, Date.now());
    const dhts = await Promise.all([startKadNode(), startKadNode(), startKadNode(), startKadNode()]);
    // Connect all
    await Promise.all([
        dhts[0].kad.addPeer(dhts[1].kad.nodeInfo),
        dhts[1].kad.addPeer(dhts[2].kad.nodeInfo),
        dhts[2].kad.addPeer(dhts[3].kad.nodeInfo),
    ]);
    // DHT operations
    await (0, asyncUtils_1.all)(dhts[3].kad.put(key, record));
    const res = await (0, asyncUtils_1.last)(dhts[0].kad.get(key));
    expect(res).toHaveProperty('value', value);
});
describe('get/put in network', () => {
    const dhts = [];
    beforeAll(async () => {
        const n = 8;
        for (let i = 0; i < n; i += 1) {
            dhts.push(await startKadNode({
                dontClose: true,
                boostrapList: i === n - 1 ? dhts.map(x => x.kad.nodeHost) : undefined,
            }));
        }
        await Promise.all(dhts.map(x => x.kad.ensureNetworkConnected()));
    });
    afterAll(datastore_testing_1.Helpers.afterAll);
    test('put to "bootstrap" node and get with the others', async () => {
        const keypair = await Ed25519_1.default.create();
        const { key, record } = KadRecord_1.default.create(keypair.privateKey, 'world', Date.now());
        await (0, asyncUtils_1.all)(dhts[7].kad.put(key, record));
        const res = await Promise.all([
            (0, asyncUtils_1.last)(dhts[0].kad.get(key)),
            (0, asyncUtils_1.last)(dhts[1].kad.get(key)),
            (0, asyncUtils_1.last)(dhts[2].kad.get(key)),
            (0, asyncUtils_1.last)(dhts[3].kad.get(key)),
            (0, asyncUtils_1.last)(dhts[4].kad.get(key)),
            (0, asyncUtils_1.last)(dhts[5].kad.get(key)),
            (0, asyncUtils_1.last)(dhts[6].kad.get(key)),
        ]);
        expect(res[0]).toHaveProperty('value', 'world');
        expect(res[1]).toHaveProperty('value', 'world');
        expect(res[2]).toHaveProperty('value', 'world');
        expect(res[3]).toHaveProperty('value', 'world');
        expect(res[4]).toHaveProperty('value', 'world');
        expect(res[5]).toHaveProperty('value', 'world');
        expect(res[6]).toHaveProperty('value', 'world');
    }, 30e3);
    test('put to a node and get with the others', async () => {
        const keypair = await Ed25519_1.default.create();
        const { key, record } = KadRecord_1.default.create(keypair.privateKey, 'world', Date.now());
        await (0, asyncUtils_1.all)(dhts[1].kad.put(key, record));
        const res = await Promise.all([
            (0, asyncUtils_1.last)(dhts[0].kad.get(key)),
            (0, asyncUtils_1.last)(dhts[2].kad.get(key)),
            (0, asyncUtils_1.last)(dhts[3].kad.get(key)),
            (0, asyncUtils_1.last)(dhts[4].kad.get(key)),
            (0, asyncUtils_1.last)(dhts[5].kad.get(key)),
            (0, asyncUtils_1.last)(dhts[6].kad.get(key)),
            (0, asyncUtils_1.last)(dhts[7].kad.get(key)),
        ]);
        expect(res[0]).toHaveProperty('value', 'world');
        expect(res[1]).toHaveProperty('value', 'world');
        expect(res[2]).toHaveProperty('value', 'world');
        expect(res[3]).toHaveProperty('value', 'world');
        expect(res[4]).toHaveProperty('value', 'world');
        expect(res[5]).toHaveProperty('value', 'world');
        expect(res[6]).toHaveProperty('value', 'world');
    });
    test('put to several nodes in series with different values and get the last one in a subset of them', async () => {
        const keypair = await Ed25519_1.default.create();
        const { key, record } = KadRecord_1.default.create(keypair.privateKey, 'world0', Date.now());
        await (0, asyncUtils_1.all)(dhts[0].kad.put(key, record));
        await (0, asyncUtils_1.all)(dhts[1].kad.put(key, KadRecord_1.default.create(keypair.privateKey, 'world1', Date.now()).record));
        await (0, asyncUtils_1.all)(dhts[2].kad.put(key, KadRecord_1.default.create(keypair.privateKey, 'world2', Date.now()).record));
        await (0, asyncUtils_1.all)(dhts[3].kad.put(key, KadRecord_1.default.create(keypair.privateKey, 'world3', Date.now()).record));
        await (0, asyncUtils_1.all)(dhts[4].kad.put(key, KadRecord_1.default.create(keypair.privateKey, 'world4', Date.now()).record));
        const res = await Promise.all([
            (0, asyncUtils_1.last)(dhts[4].kad.get(key)),
            (0, asyncUtils_1.last)(dhts[5].kad.get(key)),
            (0, asyncUtils_1.last)(dhts[6].kad.get(key)),
            (0, asyncUtils_1.last)(dhts[7].kad.get(key)),
        ]);
        expect(res[0]).toHaveProperty('value', 'world4');
        expect(res[1]).toHaveProperty('value', 'world4');
        expect(res[2]).toHaveProperty('value', 'world4');
        expect(res[3]).toHaveProperty('value', 'world4');
    });
});
// HELPERS /////////////////////////////////////////////////////////////////////////////////////////
let counter = 0;
async function startKadNode({ boostrapList, port, dontStart, dontClose, } = {}) {
    const dir = Path.join(dbFolder, String(++counter));
    Fs.mkdirSync(dir, { recursive: true });
    datastore_testing_1.Helpers.onClose(() => Fs.promises.rm(dir, { recursive: true }), dontClose);
    const node = new cloud_1.CloudNode({
        kadEnabled: true,
        networkIdentity: Identity_1.default.createSync(),
        kadBootstrapPeers: boostrapList,
        kadDbPath: Path.join(dir, 'kad.db'),
        port,
    });
    datastore_testing_1.Helpers.onClose(() => node.close(), dontClose);
    if (dontStart === true)
        return node;
    await node.listen();
    return node;
}
//# sourceMappingURL=KadNode.test.js.map