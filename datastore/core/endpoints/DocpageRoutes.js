"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.datastorePathRegex = void 0;
const datastore_docpage_1 = require("@ulixee/datastore-docpage");
const datastoreIdValidation_1 = require("@ulixee/platform-specification/types/datastoreIdValidation");
const semverValidation_1 = require("@ulixee/platform-specification/types/semverValidation");
const fs_1 = require("fs");
const staticServe_1 = require("@ulixee/platform-utils/lib/staticServe");
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
exports.datastorePathRegex = new RegExp(`/(${datastoreIdValidation_1.datastoreRegex.source})@v(${semverValidation_1.semverRegex.source})(/(.+)?)?`);
class DocpageRoutes {
    constructor(datastoreRegistry, serverAddress, getCredits, cacheTime = 3600) {
        this.datastoreRegistry = datastoreRegistry;
        this.serverAddress = serverAddress;
        this.getCredits = getCredits;
        this.cacheTime = cacheTime;
        this.staticServe = (0, staticServe_1.default)(datastore_docpage_1.default, this.cacheTime);
    }
    async routeCreditsBalanceApi(req, res) {
        if (req.headers.accept !== 'application/json')
            return false;
        let version = '';
        let datastoreId = '';
        let host = req.headers.host ?? this.serverAddress.host;
        if (!host.includes('://'))
            host = `http://${host}`;
        const url = new URL(req.url, host);
        if (!version) {
            const match = url.pathname.match(exports.datastorePathRegex);
            datastoreId = match[1];
            version = match[2];
        }
        if (!version) {
            res.writeHead(409, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ error: 'No valid Datastore version could be found.' }));
        }
        const creditId = url.searchParams.keys().next().value.split(':').shift();
        const result = await this.getCredits({ id: datastoreId, version, creditId });
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(TypeSerializer_1.default.stringify(result));
        return true;
    }
    async routeHttp(req, res, params) {
        if (!params[2]) {
            const url = new URL(req.url, 'http://localhost/');
            url.pathname += '/';
            const search = url.search !== '?' ? url.search : '';
            res.writeHead(301, { location: `${url.pathname}${search}` });
            res.end();
            return true;
        }
        if (req.url.includes('docpage.json')) {
            const datastoreId = params[0];
            const version = params[1];
            const { runtimePath } = await this.datastoreRegistry.get(datastoreId, version);
            const docpagePath = runtimePath.replace('datastore.js', 'docpage.json');
            res.writeHead(200, { 'content-type': 'application/json' });
            (0, fs_1.createReadStream)(docpagePath, { autoClose: true }).pipe(res, { end: true });
            return true;
        }
        if (params[2].startsWith('/assets/') || params[2] === '/favicon.ico') {
            req.url = params[2];
        }
        else {
            req.url = '/';
        }
        await this.staticServe(req, res);
        return true;
    }
}
exports.default = DocpageRoutes;
//# sourceMappingURL=DocpageRoutes.js.map