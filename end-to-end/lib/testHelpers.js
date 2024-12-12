"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeIntegration = void 0;
exports.getProxy = getProxy;
exports.getDockerPortMapping = getDockerPortMapping;
exports.cleanHostForDocker = cleanHostForDocker;
const datastore_testing_1 = require("@ulixee/datastore-testing");
// eslint-disable-next-line import/no-extraneous-dependencies
const HttpProxy = require("http-proxy");
const node_child_process_1 = require("node:child_process");
const http = require("node:http");
const url = require("node:url");
exports.describeIntegration = (process.env.SKIP_E2E === "true" || process.env.SKIP_E2E === "1") ? describe.skip : describe;
let proxy;
let proxyServer;
async function getProxy() {
    if (!proxy) {
        proxy = HttpProxy.createProxyServer({
            changeOrigin: true,
            ws: true,
            autoRewrite: true,
        });
        proxy.on('error', console.error);
        proxyServer = http.createServer((req, res) => {
            // parse query string and get targetUrl
            const queryData = url.parse(req.url, true).query;
            if (!queryData.target) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Target parameter is required');
                return;
            }
            console.log('Proxying http request', queryData.target);
            proxy.web(req, res, { target: queryData.target });
        });
        proxyServer.on('upgrade', (req, clientSocket, head) => {
            const queryData = url.parse(req.url, true).query;
            const target = url.parse(queryData.target);
            proxy.ws(req, clientSocket, head, {
                target: target.href,
                ws: true,
            });
            clientSocket.on('error', console.error);
        });
        await new Promise(resolve => proxyServer.listen(0, resolve));
        datastore_testing_1.Helpers.needsClosing.push({
            close: () => new Promise(resolve => {
                proxy.close();
                proxyServer.close(_ => null);
                proxy = null;
                proxyServer = null;
                resolve();
            }),
            onlyCloseOnFinal: true,
        });
    }
    const port = proxyServer.address().port;
    return `ws://host.docker.internal:${port}`;
}
async function getDockerPortMapping(containerName, port) {
    return (0, node_child_process_1.execSync)(`docker port ${containerName} ${port}`, { encoding: 'utf8' })
        .trim()
        .split(':')
        .pop();
}
function cleanHostForDocker(host) {
    if (process.env.ULX_USE_DOCKER_BINS) {
        const replacer = 'host.docker.internal';
        return host
            .replace('localhost', replacer)
            .replace('127.0.0.1', replacer)
            .replace('0.0.0.0', replacer);
    }
    return host;
}
//# sourceMappingURL=testHelpers.js.map