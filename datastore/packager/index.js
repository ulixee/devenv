"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@ulixee/commons/config");
const bufferUtils_1 = require("@ulixee/commons/lib/bufferUtils");
const eventUtils_1 = require("@ulixee/commons/lib/eventUtils");
const hashUtils_1 = require("@ulixee/commons/lib/hashUtils");
const objectUtils_1 = require("@ulixee/commons/lib/objectUtils");
const DatastoreManifest_1 = require("@ulixee/datastore-core/lib/DatastoreManifest");
const LocalDatastoreProcess_1 = require("@ulixee/datastore-core/lib/LocalDatastoreProcess");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const datastoreIdValidation_1 = require("@ulixee/platform-specification/types/datastoreIdValidation");
const semverValidation_1 = require("@ulixee/platform-specification/types/semverValidation");
const schema_1 = require("@ulixee/schema");
const schemaFromJson_1 = require("@ulixee/schema/lib/schemaFromJson");
const schemaToInterface_1 = require("@ulixee/schema/lib/schemaToInterface");
const Path = require("path");
const Dbx_1 = require("./lib/Dbx");
const rollupDatastore_1 = require("./lib/rollupDatastore");
class DatastorePackager extends eventUtils_1.TypedEventEmitter {
    get manifest() {
        return this.dbx.manifest;
    }
    get dbxPath() {
        return Path.join(this.outDir, `${this.filename}.dbx`);
    }
    constructor(entrypoint, outDir, logToConsole = false) {
        super();
        this.outDir = outDir;
        this.logToConsole = logToConsole;
        this.onClose = [];
        this.entrypoint = Path.resolve(entrypoint);
        this.outDir ??=
            config_1.default.load({ entrypoint: this.entrypoint, workingDirectory: process.cwd() })
                ?.datastoreOutDir ?? Path.dirname(this.entrypoint);
        this.outDir = Path.resolve(this.outDir);
        this.filename = Path.basename(this.entrypoint, Path.extname(this.entrypoint));
        this.dbx = new Dbx_1.default(this.dbxPath);
    }
    async close() {
        for (const onclose of this.onClose) {
            await onclose();
        }
    }
    async build(options) {
        const rollup = await (0, rollupDatastore_1.default)(options?.compiledSourcePath ?? this.entrypoint, {
            outDir: this.dbx.path,
            tsconfig: options?.tsconfig,
            watch: options?.watch,
        });
        if (options?.watch) {
            this.onClose.push(() => rollup.close());
        }
        this.meta ??= await this.findDatastoreMeta();
        if (!this.meta.coreVersion) {
            throw new Error('Datastore must specify a coreVersion');
        }
        await this.generateDetails(rollup.code, rollup.sourceMap, options?.createTemporaryVersion);
        if (options?.watch) {
            rollup.events.on('change', async ({ code, sourceMap }) => await this.generateDetails(code, sourceMap, options?.createTemporaryVersion));
        }
        return this.dbx;
    }
    async createOrUpdateManifest(sourceCode, sourceMap, createTemporaryVersion = false) {
        this.meta ??= await this.findDatastoreMeta();
        if (!this.meta.coreVersion) {
            throw new Error('Datastore must specify a coreVersion');
        }
        const extractorsByName = {};
        const crawlersByName = {};
        const tablesByName = {};
        const schemaInterface = { tables: {}, extractors: {}, crawlers: {} };
        if (this.meta.extractorsByName) {
            for (const [name, extractorMeta] of Object.entries(this.meta.extractorsByName)) {
                const { schema, basePrice, corePlugins, description } = extractorMeta;
                if (schema) {
                    const fields = (0, objectUtils_1.filterUndefined)({
                        input: (0, schemaFromJson_1.default)(schema?.input),
                        output: (0, schemaFromJson_1.default)(schema?.output),
                    });
                    if (Object.keys(fields).length) {
                        schemaInterface.extractors[name] = (0, schema_1.object)(fields);
                    }
                }
                extractorsByName[name] = {
                    description,
                    corePlugins,
                    prices: [
                        {
                            basePrice: BigInt(basePrice ?? 0),
                        },
                    ],
                    schemaAsJson: schema,
                };
                // lookup upstream pricing
                if (extractorMeta.remoteExtractor) {
                    const extractorDetails = await this.lookupRemoteDatastoreExtractorPricing(this.meta, extractorMeta);
                    extractorsByName[name].prices.push(...extractorDetails.priceBreakdown);
                }
            }
        }
        if (this.meta.crawlersByName) {
            for (const [name, crawler] of Object.entries(this.meta.crawlersByName)) {
                const { schema, basePrice, corePlugins, description } = crawler;
                if (schema) {
                    const fields = (0, objectUtils_1.filterUndefined)({
                        input: (0, schemaFromJson_1.default)(schema?.input),
                        output: (0, schemaFromJson_1.default)(schema?.output),
                    });
                    if (Object.keys(fields).length) {
                        schemaInterface.crawlers[name] = (0, schema_1.object)(fields);
                    }
                }
                crawlersByName[name] = {
                    description,
                    corePlugins,
                    prices: [
                        {
                            basePrice: BigInt(basePrice ?? 0),
                        },
                    ],
                    schemaAsJson: schema,
                };
                // lookup upstream pricing
                if (crawler.remoteCrawler) {
                    const extractorDetails = await this.lookupRemoteDatastoreCrawlerPricing(this.meta, crawler);
                    crawlersByName[name].prices.push(...extractorDetails.priceBreakdown);
                }
            }
        }
        if (this.meta.tablesByName) {
            for (const [name, tableMeta] of Object.entries(this.meta.tablesByName)) {
                // don't publish private tables
                if (tableMeta.isPublic === false)
                    continue;
                const { schema, description } = tableMeta;
                if (schema) {
                    schemaInterface.tables[name] = (0, schemaFromJson_1.default)(schema);
                }
                tablesByName[name] = {
                    description,
                    schemaAsJson: schema,
                    prices: [{ basePrice: BigInt(tableMeta.basePrice ?? 0) }],
                };
                // lookup upstream pricing
                if (tableMeta.remoteTable) {
                    const paymentDetails = await this.lookupRemoteDatastoreTablePricing(this.meta, tableMeta);
                    tablesByName[name].prices.push(...paymentDetails.priceBreakdown);
                }
            }
        }
        const interfaceString = (0, schemaToInterface_1.printNode)((0, schemaToInterface_1.default)(schemaInterface));
        const hash = (0, hashUtils_1.sha256)(Buffer.from(sourceCode));
        const scriptVersion = (0, bufferUtils_1.encodeBuffer)(hash, 'scr');
        await this.manifest.update(this.entrypoint, scriptVersion, Date.now(), interfaceString, extractorsByName, crawlersByName, tablesByName, this.meta, this.logToConsole ? console.log : undefined, createTemporaryVersion);
        const entitiesNeedingPayment = [];
        for (const [name, entity] of [
            ...Object.entries(this.manifest.tablesByName),
            ...Object.entries(this.manifest.extractorsByName),
            ...Object.entries(this.manifest.crawlersByName),
        ]) {
            if (entity.prices?.some(x => x.basePrice > 0))
                entitiesNeedingPayment.push(name);
        }
        this.script = sourceCode;
        this.sourceMap = sourceMap;
        return this.manifest;
    }
    async generateDetails(code, sourceMap, createTemporaryVersion) {
        this.meta = await this.findDatastoreMeta();
        const dbx = this.dbx;
        await this.createOrUpdateManifest(code, sourceMap, createTemporaryVersion);
        await dbx.createOrUpdateDocpage(this.meta, this.manifest, this.entrypoint);
        this.emit('build');
    }
    async lookupRemoteDatastoreExtractorPricing(meta, extractor) {
        const name = extractor.remoteExtractor.split('.').pop();
        const { remoteHost, datastoreId, datastoreVersion } = this.getRemoteSourceAndVersion(meta, extractor.remoteSource);
        const remoteMeta = {
            host: remoteHost,
            datastoreId,
            datastoreVersion,
            name,
        };
        try {
            const upstreamMeta = await this.getDatastoreMeta(remoteHost, datastoreId, datastoreVersion);
            if (!upstreamMeta.extractorsByName[name]) {
                throw new Error(`${name} is not a valid extractor for ${datastoreId}@v${datastoreVersion}. Valid names are: ${Object.keys(upstreamMeta.extractorsByName).join(', ')}.`);
            }
            const remoteExtractorDetails = upstreamMeta.extractorsByName[name];
            remoteExtractorDetails.priceBreakdown[0].remoteMeta = remoteMeta;
            return remoteExtractorDetails;
        }
        catch (error) {
            console.error('ERROR loading remote datastore pricing', remoteMeta, error);
            throw error;
        }
    }
    async lookupRemoteDatastoreCrawlerPricing(meta, crawler) {
        const name = crawler.remoteCrawler.split('.').pop();
        const { remoteHost, datastoreId, datastoreVersion } = this.getRemoteSourceAndVersion(meta, crawler.remoteSource);
        const remoteMeta = {
            host: remoteHost,
            datastoreId,
            datastoreVersion,
            name,
        };
        try {
            const upstreamMeta = await this.getDatastoreMeta(remoteHost, datastoreId, datastoreVersion);
            if (!upstreamMeta.crawlersByName[name]) {
                throw new Error(`${name} is not a valid crawler for ${datastoreId}@v${datastoreVersion} Valid names are: ${Object.keys(upstreamMeta.crawlersByName).join(', ')}.`);
            }
            const remoteExtractorDetails = upstreamMeta.crawlersByName[name];
            remoteExtractorDetails.priceBreakdown[0].remoteMeta = remoteMeta;
            return remoteExtractorDetails;
        }
        catch (error) {
            console.error('ERROR loading remote datastore pricing', remoteMeta, error);
            throw error;
        }
    }
    async lookupRemoteDatastoreTablePricing(meta, table) {
        const name = table.remoteTable.split('.').pop();
        const { remoteHost, datastoreId, datastoreVersion } = this.getRemoteSourceAndVersion(meta, table.remoteSource);
        const remoteMeta = {
            host: remoteHost,
            datastoreId,
            datastoreVersion,
            name,
        };
        try {
            const upstreamMeta = await this.getDatastoreMeta(remoteHost, datastoreId, datastoreVersion);
            if (!upstreamMeta.tablesByName[name]) {
                throw new Error(`${name} is not a valid table for ${datastoreId}@v${datastoreVersion}.  Valid names are: ${Object.keys(upstreamMeta.tablesByName).join(', ')}.`);
            }
            const remoteDetails = upstreamMeta.tablesByName[name];
            remoteDetails.priceBreakdown[0].remoteMeta = remoteMeta;
            return remoteDetails;
        }
        catch (error) {
            console.error('ERROR loading remote datastore pricing', remoteMeta, error);
            throw error;
        }
    }
    async getDatastoreMeta(host, datastoreId, datastoreVersion) {
        const datastoreApiClient = new DatastoreApiClient_1.default(host, {
            consoleLogErrors: this.logToConsole,
        });
        try {
            return await datastoreApiClient.getMeta(datastoreId, datastoreVersion);
        }
        finally {
            await datastoreApiClient.disconnect();
        }
    }
    getRemoteSourceAndVersion(meta, remoteSource) {
        const url = meta.remoteDatastores[remoteSource];
        if (!url)
            throw new Error(`The remoteDatastore could not be found for the key - ${remoteSource}. It should be defined in remoteDatastores on your Datastore.`);
        let remoteUrl;
        try {
            remoteUrl = new URL(url);
        }
        catch (err) {
            throw new Error(`The remoteDatastore url for "${remoteSource}" is not a valid url (${url})`);
        }
        const match = remoteUrl.pathname.match(new RegExp(`(${datastoreIdValidation_1.datastoreRegex.source})@v(${semverValidation_1.semverRegex.source})`));
        if (!match || match.length < 3)
            throw new Error(`Invalid remote Datastore source provided (${url})`);
        const [, datastoreId, datastoreVersion] = match;
        DatastoreManifest_1.default.validateId(datastoreId);
        if (!semverValidation_1.semverRegex.test(datastoreVersion))
            throw new Error(`The remote datastore version is not a semver (${datastoreVersion})`);
        return { datastoreId, datastoreVersion, remoteHost: remoteUrl.host };
    }
    async findDatastoreMeta() {
        const entrypoint = this.dbx.entrypoint;
        const datastoreProcess = new LocalDatastoreProcess_1.default(entrypoint);
        const meta = await datastoreProcess.fetchMeta();
        await new Promise(resolve => setTimeout(resolve, 1e3));
        await datastoreProcess.close();
        return meta;
    }
}
exports.default = DatastorePackager;
//# sourceMappingURL=index.js.map