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
var _DatastoreInternal_connectionToCore, _DatastoreInternal_isClosingPromise;
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@ulixee/commons/lib/utils");
const sql_engine_1 = require("@ulixee/sql-engine");
const ConnectionFactory_1 = require("../connections/ConnectionFactory");
const SqliteStorageEngine_1 = require("../storage-engines/SqliteStorageEngine");
const CreditsTable_1 = require("./CreditsTable");
const DatastoreApiClient_1 = require("./DatastoreApiClient");
const DatastoreLookup_1 = require("./DatastoreLookup");
const Extractor_1 = require("./Extractor");
const Table_1 = require("./Table");
const pkg = require('../package.json');
let lastInstanceId = 0;
class DatastoreInternal {
    get remoteDatastores() {
        return this.components.remoteDatastores;
    }
    get authenticateIdentity() {
        return this.components.authenticateIdentity;
    }
    get connectionToCore() {
        if (!__classPrivateFieldGet(this, _DatastoreInternal_connectionToCore, "f")) {
            __classPrivateFieldSet(this, _DatastoreInternal_connectionToCore, ConnectionFactory_1.default.createConnection(), "f");
        }
        return __classPrivateFieldGet(this, _DatastoreInternal_connectionToCore, "f");
    }
    set connectionToCore(connectionToCore) {
        __classPrivateFieldSet(this, _DatastoreInternal_connectionToCore, connectionToCore, "f");
    }
    get onCreated() {
        return this.components.onCreated;
    }
    get onVersionMigrated() {
        return this.components.onVersionMigrated;
    }
    constructor(components) {
        _DatastoreInternal_connectionToCore.set(this, void 0);
        _DatastoreInternal_isClosingPromise.set(this, void 0);
        this.extractors = {};
        this.tables = {};
        this.crawlers = {};
        lastInstanceId++;
        this.instanceId = `${process.pid}-${lastInstanceId}`;
        this.components = components;
        const names = new Set();
        for (const [name, extractor] of Object.entries(components.extractors || [])) {
            if (names.has(name)) {
                throw new Error(`${name} already exists in this datastore`);
            }
            this.attachExtractor(extractor, name);
            names.add(name);
        }
        for (const [name, table] of Object.entries(components.tables || [])) {
            if (names.has(name)) {
                throw new Error(`${name} already exists in this datastore`);
            }
            this.attachTable(table, name);
            names.add(name);
        }
        this.attachTable(new CreditsTable_1.default());
        for (const [name, crawler] of Object.entries(components.crawlers || [])) {
            if (names.has(name)) {
                throw new Error(`${name} already exists in this datastore`);
            }
            this.attachCrawler(crawler, name);
            names.add(name);
        }
        this.affiliateId = components.affiliateId;
        this.metadata = this.createMetadata();
    }
    async bind(config) {
        const { manifest, storageEngine, connectionToCore, apiClientLoader, datastoreHostLookup } = config ?? {};
        this.manifest = manifest;
        this.storageEngine = storageEngine;
        if (!this.storageEngine) {
            this.storageEngine = new SqliteStorageEngine_1.default();
            await this.storageEngine.create(this);
        }
        this.storageEngine.bind(this);
        this.connectionToCore = connectionToCore;
        if (apiClientLoader)
            this.apiClientLoader = apiClientLoader;
        if (datastoreHostLookup)
            this.getHostInfo = datastoreHostLookup.getHostInfo.bind(datastoreHostLookup);
        this.remotePaymentService = config.remotePaymentService;
        return this;
    }
    sendRequest(payload, timeoutMs) {
        return this.connectionToCore.sendRequest(payload, timeoutMs);
    }
    async queryInternal(sql, boundValues, options, callbacks = {}) {
        boundValues ??= [];
        const sqlParser = new sql_engine_1.SqlParser(sql);
        const inputSchemas = {};
        for (const [key, extractor] of Object.entries(this.extractors)) {
            if (extractor.schema)
                inputSchemas[key] = extractor.schema.input;
        }
        for (const [key, crawler] of Object.entries(this.crawlers)) {
            if (crawler.schema)
                inputSchemas[key] = crawler.schema.input;
        }
        const inputByFunctionName = sqlParser.extractFunctionCallInputs(boundValues);
        const entityCalls = sqlParser.extractCalls();
        const functionCalls = Object.keys(inputByFunctionName);
        if (callbacks.beforeQuery) {
            await callbacks.beforeQuery({ sqlParser, entityCalls });
        }
        const virtualEntitiesByName = {};
        for (const name of functionCalls) {
            const parameters = inputByFunctionName[name];
            virtualEntitiesByName[name] = { parameters, records: [] };
            const func = this.extractors[name] ?? this.crawlers[name];
            virtualEntitiesByName[name].records = await func.runInternal({ ...options, input: parameters }, callbacks);
        }
        for (const tableName of sqlParser.tableNames) {
            if (!this.storageEngine.virtualTableNames.has(tableName))
                continue;
            virtualEntitiesByName[tableName] = { records: [] };
            const sqlInputs = sqlParser.extractTableQuery(tableName, boundValues);
            virtualEntitiesByName[tableName].records = await this.tables[tableName].queryInternal(sqlInputs.sql, sqlInputs.args, options, callbacks);
        }
        return await this.storageEngine.query(sqlParser, boundValues, options, virtualEntitiesByName, callbacks);
    }
    async getRemoteApiClient(remoteSource) {
        // need lookup
        const remoteDatastore = this.remoteDatastores[remoteSource];
        (0, utils_1.assert)(remoteDatastore, `A remote datastore source could not be found for ${remoteSource}`);
        try {
            const datastoreHost = DatastoreLookup_1.default.parseDatastoreIpHost((0, utils_1.toUrl)(remoteDatastore)) ??
                (await this.getHostInfo(remoteDatastore));
            const client = this.apiClientLoader(datastoreHost.host);
            return { client, datastoreHost };
        }
        catch (error) {
            throw new Error('A valid url was not supplied for this remote datastore. Format should be ulx://<host>/<datastoreID>@v<datastoreVersion>');
        }
    }
    close() {
        return (__classPrivateFieldSet(this, _DatastoreInternal_isClosingPromise, __classPrivateFieldGet(this, _DatastoreInternal_isClosingPromise, "f") ?? new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _DatastoreInternal_connectionToCore, "f")?.disconnect().then(resolve, reject);
        }), "f"));
    }
    attachExtractor(extractor, nameOverride, isAlreadyAttachedToDatastore) {
        const isExtractor = extractor instanceof Extractor_1.default;
        const name = nameOverride || extractor.name;
        if (!name)
            throw new Error(`Extractor requires a name`);
        if (!isExtractor)
            throw new Error(`${name} must be an instance of Extractor`);
        if (this.extractors[name])
            throw new Error(`Extractor already exists with name: ${name}`);
        if (!isAlreadyAttachedToDatastore)
            extractor.attachToDatastore(this, name);
        this.extractors[name] = extractor;
    }
    attachCrawler(crawler, nameOverride, isAlreadyAttachedToDatastore) {
        // NOTE: can't check instanceof Crawler because it creates a dependency loop
        const isCrawler = crawler instanceof Extractor_1.default && crawler.extractorType === 'crawler';
        const name = nameOverride || crawler.name;
        if (!name)
            throw new Error(`Crawler requires a name`);
        if (!isCrawler)
            throw new Error(`${name} must be an instance of Crawler`);
        if (this.crawlers[name])
            throw new Error(`Crawler already exists with name: ${name}`);
        if (!isAlreadyAttachedToDatastore)
            crawler.attachToDatastore(this, name);
        this.crawlers[name] = crawler;
    }
    attachTable(table, nameOverride, isAlreadyAttachedToDatastore) {
        const isTable = table instanceof Table_1.default;
        const name = nameOverride || table.name;
        if (!name)
            throw new Error(`Table requires a name`);
        if (!isTable)
            throw new Error(`${name || 'table'} must be an instance of Table`);
        if (this.tables[name])
            throw new Error(`Table already exists with name: ${name}`);
        if (!isAlreadyAttachedToDatastore)
            table.attachToDatastore(this, name);
        this.tables[name] = table;
    }
    getHostInfo(_datastoreUrl) {
        throw new Error('No zone record host lookup has been injected');
    }
    apiClientLoader(host) {
        return new DatastoreApiClient_1.default(host);
    }
    createMetadata() {
        const { version, id, name, description, payment, domain, affiliateId, remoteDatastores, remoteDatastoreEmbeddedCredits, adminIdentities, storageEngineHost, } = this.components;
        const metadata = {
            version,
            id,
            name,
            description,
            affiliateId,
            payment,
            domain,
            remoteDatastores,
            remoteDatastoreEmbeddedCredits,
            adminIdentities,
            storageEngineHost,
            coreVersion: pkg.version,
            tablesByName: {},
            extractorsByName: {},
            crawlersByName: {},
        };
        metadata.remoteDatastoreEmbeddedCredits ??= {};
        for (const [extractorName, extractor] of Object.entries(this.extractors)) {
            const passThrough = extractor;
            metadata.extractorsByName[extractorName] = {
                name: extractor.name,
                description: extractor.description,
                corePlugins: extractor.corePlugins ?? {},
                schema: extractor.schema,
                basePrice: extractor.basePrice,
                remoteSource: passThrough?.remoteSource,
                remoteExtractor: passThrough?.remoteExtractor,
                remoteDatastoreId: passThrough?.remoteDatastoreId,
                remoteDatastoreVersion: passThrough?.remoteVersion,
            };
        }
        for (const [crawlerName, crawler] of Object.entries(this.crawlers)) {
            metadata.crawlersByName[crawlerName] = {
                name: crawler.name,
                description: crawler.description,
                corePlugins: crawler.corePlugins ?? {},
                schema: crawler.schema,
                basePrice: crawler.basePrice,
            };
        }
        for (const [extractorName, table] of Object.entries(this.tables ?? {})) {
            const passThrough = table;
            metadata.tablesByName[extractorName] = {
                name: table.name,
                description: table.description,
                isPublic: table.isPublic !== false,
                schema: table.schema,
                basePrice: table.basePrice,
                remoteSource: passThrough?.remoteSource,
                remoteTable: passThrough?.remoteTable,
                remoteDatastoreId: passThrough?.remoteDatastoreId,
                remoteDatastoreVersion: passThrough?.remoteVersion,
            };
        }
        return metadata;
    }
}
_DatastoreInternal_connectionToCore = new WeakMap(), _DatastoreInternal_isClosingPromise = new WeakMap();
exports.default = DatastoreInternal;
//# sourceMappingURL=DatastoreInternal.js.map