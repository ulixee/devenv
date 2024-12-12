"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const Resolvable_1 = require("@ulixee/commons/lib/Resolvable");
const utils_1 = require("@ulixee/commons/lib/utils");
const WsUtils_1 = require("@ulixee/net/lib/WsUtils");
const Http = require("http");
const pkg = require('../package.json');
const { log } = (0, Logger_1.default)(module);
class RoutableServer {
    get host() {
        return this.listeningPromise.promise.then(x => {
            return `${this.publicHostname}:${x.port}`;
        });
    }
    get port() {
        return this.listeningPromise.promise.then(x => {
            return x.port;
        });
    }
    get hasConnections() {
        return this.wsServer.clients.size > 0;
    }
    get connections() {
        return this.wsServer.clients.size;
    }
    get version() {
        return pkg.version;
    }
    constructor(isReadyToServe, publicHost, addRouters) {
        this.isReadyToServe = isReadyToServe;
        this.sockets = new Set();
        this.listeningPromise = (0, utils_1.createPromise)();
        this.wsRoutes = [];
        this.httpServer = new Http.Server();
        (0, utils_1.bindFunctions)(this);
        this.httpServer.on('error', this.onHttpError);
        if (addRouters !== false) {
            this.httpServer.on('request', this.handleHttpRequest);
        }
        this.httpServer.on('connection', this.handleHttpConnection);
        this.publicHostname = publicHost ?? 'localhost';
        this.wsServer = new WebSocket.Server({
            server: this.httpServer,
            perMessageDeflate: { threshold: 500, serverNoContextTakeover: false },
        });
        if (addRouters !== false) {
            this.wsServer.on('connection', this.handleWsConnection);
        }
        this.httpRoutes = [];
    }
    async listen(options) {
        if (this.listeningPromise.isResolved)
            return this.listeningPromise.promise;
        try {
            options ??= {};
            options.port ??= 0;
            if (options.host) {
                if (this.publicHostname === 'localhost' &&
                    options.host !== 'localhost' &&
                    options.host !== '0.0.0.0' &&
                    options.host !== '::' &&
                    options.host !== '::1' &&
                    options.host !== '127.0.0.1') {
                    this.publicHostname = options.host;
                }
            }
            const addressHost = await new Promise((resolve, reject) => {
                this.httpServer.once('error', reject);
                this.httpServer
                    .listen(options, () => {
                    this.httpServer.off('error', reject);
                    resolve(this.httpServer.address());
                })
                    .ref();
            });
            this.listeningPromise.resolve(addressHost);
        }
        catch (error) {
            this.listeningPromise.reject(error);
        }
        return this.listeningPromise;
    }
    addHttpRoute(route, method, handleFn) {
        this.httpRoutes.push([route, method, handleFn]);
    }
    addWsRoute(route, handleFn) {
        this.wsRoutes.push([route, handleFn]);
    }
    close() {
        if (this.isClosing)
            return this.isClosing;
        const resolvable = new Resolvable_1.default();
        try {
            this.isClosing = resolvable.promise;
            const logid = log.stats('RoutingServer.Closing', {
                sessionId: null,
            });
            for (const ws of this.wsServer.clients) {
                if ((0, WsUtils_1.isWsOpen)(ws))
                    ws.terminate();
            }
            for (const socket of this.sockets) {
                socket.unref();
                socket.destroy();
            }
            if (this.httpServer.listening)
                this.httpServer.unref().close();
            log.stats('RoutingServer.Closed', { parentLogId: logid, sessionId: null });
            resolvable.resolve();
        }
        catch (error) {
            log.error('Error closing socket connections', {
                error,
                sessionId: null,
            });
            resolvable.reject(error);
        }
        return resolvable.promise;
    }
    async handleHttpRequest(req, res) {
        try {
            await this.listeningPromise;
            await this.isReadyToServe;
            for (const [route, method, handlerFn] of this.httpRoutes) {
                if (req.method !== method)
                    continue;
                if (route instanceof RegExp && route.test(req.url)) {
                    const args = route.exec(req.url);
                    const handled = await handlerFn(req, res, args?.length ? args.slice(1) : []);
                    if (handled !== false)
                        return;
                }
                if (req.url === route) {
                    const handled = await handlerFn(req, res, []);
                    if (handled !== false)
                        return;
                }
            }
            res.writeHead(404);
            res.end('Route not found');
        }
        catch (error) {
            res.writeHead(500);
            res.end('Unhandled Error', error.message);
        }
    }
    handleHttpConnection(socket) {
        this.sockets.add(socket);
        socket.on('close', () => this.sockets.delete(socket));
    }
    async handleWsConnection(ws, req) {
        await this.listeningPromise;
        await this.isReadyToServe;
        for (const [route, handlerFn] of this.wsRoutes) {
            if (route instanceof RegExp && route.test(req.url)) {
                const args = route.exec(req.url);
                handlerFn(ws, req, args?.length ? args.slice(1) : []);
                return;
            }
            if (req.url === route) {
                handlerFn(ws, req, []);
                return;
            }
        }
        ws.close();
    }
    onHttpError(error) {
        log.warn('Error on WebsocketServer.httpServer', {
            error,
            sessionId: null,
        });
    }
}
exports.default = RoutableServer;
//# sourceMappingURL=RoutableServer.js.map