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
var _ClientForRemote_apiClient;
Object.defineProperty(exports, "__esModule", { value: true });
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const localchain_1 = require("@argonprotocol/localchain");
const node_net_1 = require("node:net");
const ClientForCrawler_1 = require("./ClientForCrawler");
const ClientForDatastore_1 = require("./ClientForDatastore");
const ClientForExtractor_1 = require("./ClientForExtractor");
const ClientForTable_1 = require("./ClientForTable");
const ConnectionParameters_1 = require("./ConnectionParameters");
class ClientForRemote {
    constructor(uriOrObject = {}, config) {
        this.config = config;
        _ClientForRemote_apiClient.set(this, void 0);
        const connectionParameters = new ConnectionParameters_1.default(uriOrObject);
        this.user = connectionParameters.user;
        this.port = connectionParameters.port;
        this.host = connectionParameters.host;
        this.password = connectionParameters.password;
        if (connectionParameters.database) {
            this.database = connectionParameters.database;
            const [datastoreId, version] = this.database.split('@');
            this.datastoreId = datastoreId;
            if (version)
                this.version = version.replace('v', '');
        }
        const isDnsOrDomain = !(0, node_net_1.isIP)(this.host) && this.host !== 'localhost';
        if (isDnsOrDomain && typeof uriOrObject === 'string') {
            try {
                // see if this is a domain
                localchain_1.DomainStore.parse(this.host);
                if (!config?.argonMainchainUrl)
                    throw new Error('No mainchain url provided to lookup this datastore host');
                this.domainLookupPromise = this.lookupDomain(uriOrObject);
            }
            catch (err) {
                this.isDnsHost = true;
                // not a domain name
            }
        }
    }
    async run(extractorOrTableName, inputFilter) {
        return await this.fetch(extractorOrTableName, inputFilter);
    }
    async fetch(extractorOrTableName, inputFilter) {
        if (!this.database) {
            throw new Error('You Client connection must specific a datastore to fetch');
        }
        await this.loadPayments();
        const apiClient = await this.getApiClient();
        return (await apiClient.stream(this.datastoreId, this.version, extractorOrTableName, inputFilter, { domain: this.domain, ...this.config }));
    }
    async crawl(name, inputFilter) {
        if (!this.database) {
            throw new Error('You Client connection must specific a datastore to crawl');
        }
        await this.loadPayments();
        const apiClient = await this.getApiClient();
        const [crawlerOutput] = await apiClient.stream(this.datastoreId, this.version, name, inputFilter, {
            domain: this.domain,
            ...this.config,
        });
        return crawlerOutput;
    }
    async query(sql, boundValues = []) {
        if (!this.database) {
            throw new Error('You Client connection must specific a datastore to query');
        }
        const apiClient = await this.getApiClient();
        const { outputs } = await apiClient.query(this.datastoreId, this.version, sql, {
            boundValues,
            domain: this.domain,
            ...this.config,
        });
        return outputs;
    }
    disconnect() {
        return __classPrivateFieldGet(this, _ClientForRemote_apiClient, "f")?.disconnect();
    }
    async getApiClient() {
        if (__classPrivateFieldGet(this, _ClientForRemote_apiClient, "f") === undefined) {
            __classPrivateFieldSet(this, _ClientForRemote_apiClient, null, "f");
            await this.domainLookupPromise;
            const address = `${this.host}:${this.port}`;
            __classPrivateFieldSet(this, _ClientForRemote_apiClient, new DatastoreApiClient_1.default(address), "f");
        }
        return __classPrivateFieldGet(this, _ClientForRemote_apiClient, "f");
    }
    async lookupDomain(domainName) {
        const lookup = await DatastoreApiClient_1.default.lookupDatastoreHost(domainName, this.config.argonMainchainUrl);
        this.datastoreId = lookup.datastoreId;
        this.domain = lookup.domain;
        this.version = lookup.version;
        const parsed = new ConnectionParameters_1.default(lookup.host);
        this.host = parsed.host;
        this.port = parsed.port;
    }
    loadPayments() {
        if (this.loadPaymentsPromise)
            return this.loadPaymentsPromise;
        if (this.user && this.config?.paymentService) {
            this.loadPaymentsPromise = this.config.paymentService.attachCredit(`ulx://${this.host}:${this.port}/${this.datastoreId}@v${this.version}`, {
                secret: this.password,
                id: this.user,
            });
        }
        else {
            this.loadPaymentsPromise = Promise.resolve();
        }
        return this.loadPaymentsPromise;
    }
    static forDatastore(datastore, options) {
        return new ClientForDatastore_1.default(datastore, options);
    }
    static forTable(table, options) {
        return new ClientForTable_1.default(table, options);
    }
    static forExtractor(extractor, options) {
        return new ClientForExtractor_1.default(extractor, options);
    }
    static forCrawler(datastore, options) {
        return new ClientForCrawler_1.default(datastore, options);
    }
}
_ClientForRemote_apiClient = new WeakMap();
exports.default = ClientForRemote;
//# sourceMappingURL=Client.js.map