"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.needsClosing = void 0;
exports.blockGlobalConfigWrites = blockGlobalConfigWrites;
exports.createLocalNode = createLocalNode;
exports.onClose = onClose;
exports.runKoaServer = runKoaServer;
exports.afterEach = afterEach;
exports.afterAll = afterAll;
const cloud_1 = require("@ulixee/cloud"); // eslint-disable-line import/no-extraneous-dependencies
const config_1 = require("@ulixee/commons/config");
const hosts_1 = require("@ulixee/commons/config/hosts");
const IPendingWaitEvent_1 = require("@ulixee/commons/interfaces/IPendingWaitEvent");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const DatastoreManifest_1 = require("@ulixee/datastore-core/lib/DatastoreManifest");
const hero_core_1 = require("@ulixee/hero-core");
const Fs = require("fs/promises");
const Path = require("path");
const KoaMulter = require("@koa/multer");
const KoaRouter = require("@koa/router");
const Koa = require("koa");
const ArgonPaymentProcessor_1 = require("@ulixee/datastore-core/lib/ArgonPaymentProcessor");
const { log } = (0, Logger_1.default)(module);
let didRegisteryBlock = false;
function blockGlobalConfigWrites() {
    if (didRegisteryBlock)
        return;
    didRegisteryBlock = true;
    // block writing to global files!
    jest.spyOn(hosts_1.default.global, 'save').mockImplementation(() => null);
    // @ts-expect-error
    const write = DatastoreManifest_1.default.writeToDisk;
    // @ts-expect-error
    jest.spyOn(DatastoreManifest_1.default, 'writeToDisk').mockImplementation(async (path, data) => {
        if (path.includes(config_1.default.global.directoryPath))
            return;
        return write.call(DatastoreManifest_1.default, path, data);
    });
}
blockGlobalConfigWrites();
exports.needsClosing = [];
async function createLocalNode(config, onlyCloseOnFinal = false, paymentInfo) {
    const datastoreConfig = config.datastoreConfiguration;
    if (datastoreConfig.datastoresDir) {
        datastoreConfig.datastoresTmpDir ??= Path.join(datastoreConfig.datastoresDir, 'tmp');
        try {
            await Fs.rm(datastoreConfig.datastoresDir, { recursive: true });
        }
        catch { }
        await Fs.mkdir(datastoreConfig.datastoresDir, { recursive: true });
        await Fs.mkdir(datastoreConfig.datastoresTmpDir, { recursive: true });
    }
    const cloudNode = new cloud_1.default(config);
    onClose(() => cloudNode.close(), onlyCloseOnFinal);
    if (paymentInfo) {
        const paymentProcessor = new ArgonPaymentProcessor_1.default(datastoreConfig.datastoresDir, null);
        jest.spyOn(paymentProcessor, 'getPaymentInfo').mockResolvedValue(paymentInfo);
        cloudNode.datastoreCore.argonPaymentProcessor = paymentProcessor;
    }
    await cloudNode.listen();
    return cloudNode;
}
function onClose(closeFn, onlyCloseOnFinal = false) {
    exports.needsClosing.push({ close: closeFn, onlyCloseOnFinal });
}
async function runKoaServer(onlyCloseOnFinal = true) {
    const koa = new Koa();
    const router = new KoaRouter();
    const upload = KoaMulter(); // note you can pass `multer` options here
    koa.use(router.routes()).use(router.allowedMethods());
    koa.on('error', error => log.warn('Koa error', { error }));
    const server = await new Promise(resolve => {
        const koaServer = koa
            .listen(() => {
            resolve(koaServer);
        })
            .unref();
    });
    const destroyer = destroyServerFn(server);
    const port = server.address().port;
    router.baseHost = `localhost:${port}`;
    router.baseUrl = `http://${router.baseHost}`;
    router.get('/', ctx => {
        ctx.body = `<html><body>Blank Page</body></html>`;
    });
    router.close = () => {
        if (router.isClosing) {
            return;
        }
        router.isClosing = true;
        return destroyer();
    };
    router.onlyCloseOnFinal = onlyCloseOnFinal;
    exports.needsClosing.push(router);
    router.koa = koa;
    router.server = server;
    router.upload = upload;
    return router;
}
function afterEach() {
    return closeAll(false);
}
async function afterAll() {
    await closeAll(true);
    await hero_core_1.default.shutdown();
}
async function closeAll(isFinal = false) {
    const closeList = [...exports.needsClosing];
    exports.needsClosing.length = 0;
    await Promise.all(closeList.map(async (toClose, i) => {
        if (!toClose.close) {
            // eslint-disable-next-line no-console
            console.log('Error closing', { closeIndex: i });
            return;
        }
        if (toClose.onlyCloseOnFinal && !isFinal) {
            exports.needsClosing.push(toClose);
            return;
        }
        try {
            await toClose.close();
        }
        catch (err) {
            if (err instanceof IPendingWaitEvent_1.CanceledPromiseError)
                return;
            // eslint-disable-next-line no-console
            console.log('Error shutting down', err);
        }
    }));
}
function destroyServerFn(server) {
    const connections = new Set();
    server.on('connection', (conn) => {
        connections.add(conn);
        conn.on('close', () => connections.delete(conn));
    });
    return () => new Promise(resolve => {
        for (const conn of connections) {
            conn.destroy();
        }
        server.close(() => {
            setTimeout(resolve, 10);
        });
    });
}
//# sourceMappingURL=helpers.js.map