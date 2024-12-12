"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@ulixee/commons/config");
const dirUtils_1 = require("@ulixee/commons/lib/dirUtils");
const fileUtils_1 = require("@ulixee/commons/lib/fileUtils");
const objectUtils_1 = require("@ulixee/commons/lib/objectUtils");
const utils_1 = require("@ulixee/commons/lib/utils");
const datastoreIdValidation_1 = require("@ulixee/platform-specification/types/datastoreIdValidation");
const IDatastoreManifest_1 = require("@ulixee/platform-specification/types/IDatastoreManifest");
const ValidationError_1 = require("@ulixee/platform-specification/utils/ValidationError");
const fs_1 = require("fs");
const Path = require("path");
const env_1 = require("../env");
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
class DatastoreManifest {
    constructor(manifestPath, source = 'dbx', sharedConfigFileKey) {
        this.sharedConfigFileKey = sharedConfigFileKey;
        this.crawlersByName = {};
        this.extractorsByName = {};
        this.tablesByName = {};
        this.path = manifestPath;
        this.source = source;
        if (source === 'global' || source === 'project') {
            (0, utils_1.assert)(sharedConfigFileKey, 'A sharedConfigFileKey must be specified for a Project or Global Datastore Manifests');
        }
    }
    async exists() {
        return await (0, fileUtils_1.existsAsync)(this.path);
    }
    async update(absoluteScriptEntrypoint, scriptHash, versionTimestamp, schemaInterface, extractorsByName, crawlersByName, tablesByName, metadata, logger, createTemporaryVersion = false) {
        await this.load();
        const projectPath = Path.resolve(await (0, dirUtils_1.findProjectPathAsync)(absoluteScriptEntrypoint));
        const scriptEntrypoint = Path.relative(`${projectPath}/..`, absoluteScriptEntrypoint);
        const manifestSources = DatastoreManifest.getCustomSources(absoluteScriptEntrypoint);
        await this.loadGeneratedManifests(manifestSources);
        this.extractorsByName = {};
        this.crawlersByName = {};
        const { name, description, coreVersion, payment, domain, adminIdentities, storageEngineHost, version, id, } = metadata;
        Object.assign(this, (0, objectUtils_1.filterUndefined)({
            coreVersion,
            schemaInterface,
            payment,
            adminIdentities,
            domain,
            description,
            name,
            storageEngineHost,
            version,
            id,
        }));
        this.adminIdentities ??= [];
        for (const [funcName, funcMeta] of Object.entries(extractorsByName)) {
            this.extractorsByName[funcName] = {
                description: funcMeta.description,
                corePlugins: funcMeta.corePlugins ?? {},
                prices: funcMeta.prices ?? [{ basePrice: 0n }],
                schemaAsJson: funcMeta.schemaAsJson,
            };
        }
        for (const [funcName, funcMeta] of Object.entries(crawlersByName)) {
            this.crawlersByName[funcName] = {
                description: funcMeta.description,
                corePlugins: funcMeta.corePlugins ?? {},
                prices: funcMeta.prices ?? [{ basePrice: 0n }],
                schemaAsJson: funcMeta.schemaAsJson,
            };
        }
        for (const [tableName, tableMeta] of Object.entries(tablesByName)) {
            this.tablesByName[tableName] = {
                description: tableMeta.description,
                prices: tableMeta.prices ?? [{ basePrice: 0n }],
                schemaAsJson: tableMeta.schemaAsJson,
            };
        }
        // allow manifest to override above values
        await this.loadExplicitSettings(manifestSources, logger);
        this.scriptEntrypoint = scriptEntrypoint;
        this.versionTimestamp = versionTimestamp;
        this.scriptHash = scriptHash;
        if (createTemporaryVersion) {
            const filename = Path.basename(this.scriptEntrypoint).replace(Path.extname(this.scriptEntrypoint), '');
            this.id = `${DatastoreManifest.TemporaryIdPrefix}-${filename
                .toLowerCase()
                .replaceAll(/[^a-z0-9-]/g, '-')}`;
            this.version ||= '0.0.1';
        }
        await this.save();
        await this.syncGeneratedManifests(manifestSources);
    }
    async load() {
        if (await this.exists()) {
            let data = (await (0, fileUtils_1.readFileAsJson)(this.path)) ?? {};
            // Dbx manifest is just a raw manifest (no manual settings or history
            if (data && this.source === 'dbx') {
                Object.assign(this, (0, objectUtils_1.filterUndefined)(data));
                return true;
            }
            // Global/Project configs store under a key
            if (this.source === 'global' || this.source === 'project') {
                data = data[this.sharedConfigFileKey];
            }
            if (data) {
                const { __GENERATED_LAST_VERSION__: generated, ...explicitSettings } = data;
                this.explicitSettings = (0, objectUtils_1.filterUndefined)(explicitSettings);
                Object.assign(this, (0, objectUtils_1.filterUndefined)(generated));
                return true;
            }
        }
        else if (this.source === 'global') {
            if (!(await (0, fileUtils_1.existsAsync)(Path.dirname(this.path)))) {
                await fs_1.promises.mkdir(Path.dirname(this.path), { recursive: true });
            }
            await (0, fileUtils_1.safeOverwriteFile)(this.path, '{}');
        }
        return false;
    }
    async save() {
        let json;
        if (this.source === 'global' || this.source === 'project') {
            if (!env_1.default.enableGlobalConfigs)
                return;
            const config = (await (0, fileUtils_1.readFileAsJson)(this.path)) ?? {};
            config[this.sharedConfigFileKey] = this.toConfigManifest();
            json = config;
        }
        else if (this.source === 'entrypoint') {
            json = this.toConfigManifest();
        }
        else if (this.source === 'dbx') {
            // dbx stores only the output
            json = this.toJSON();
            DatastoreManifest.validate(json);
        }
        // don't create file if it doesn't exist already
        if (this.source !== 'dbx' && !(await this.exists())) {
            return;
        }
        await DatastoreManifest.writeToDisk(this.path, json);
    }
    toConfigManifest() {
        return {
            ...this.explicitSettings,
            __GENERATED_LAST_VERSION__: this.toJSON(),
        };
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            version: this.version,
            versionTimestamp: this.versionTimestamp,
            scriptEntrypoint: this.scriptEntrypoint,
            scriptHash: this.scriptHash,
            coreVersion: this.coreVersion,
            schemaInterface: this.schemaInterface,
            extractorsByName: this.extractorsByName,
            crawlersByName: this.crawlersByName,
            storageEngineHost: this.storageEngineHost,
            tablesByName: this.tablesByName,
            domain: this.domain,
            adminIdentities: this.adminIdentities,
        };
    }
    async syncGeneratedManifests(sources) {
        for (const source of sources) {
            if (!source || !(await source.exists()))
                continue;
            Object.assign(source, this.toJSON());
            await source.save();
        }
    }
    async loadGeneratedManifests(sources) {
        for (const source of sources) {
            if (!source)
                continue;
            const didLoad = await source.load();
            if (didLoad) {
                const data = (0, objectUtils_1.filterUndefined)(source.toJSON());
                if (!Object.keys(data).length)
                    continue;
                Object.assign(this, data);
            }
        }
    }
    async loadExplicitSettings(sources, logger) {
        for (const source of sources) {
            if (!source)
                continue;
            const didLoad = await source.load();
            if (didLoad) {
                const explicitSettings = (0, objectUtils_1.filterUndefined)(source.explicitSettings);
                if (!explicitSettings || !Object.keys(explicitSettings).length)
                    continue;
                logger?.('Applying Datastore Manifest overrides', {
                    source: source.source,
                    path: source.path,
                    overrides: explicitSettings,
                });
                const { extractorsByName, crawlersByName, tablesByName, ...otherSettings } = explicitSettings;
                if (extractorsByName) {
                    for (const [name, funcMeta] of Object.entries(extractorsByName)) {
                        if (this.extractorsByName[name]) {
                            Object.assign(this.extractorsByName[name], funcMeta);
                        }
                        else {
                            this.extractorsByName[name] = funcMeta;
                        }
                        this.extractorsByName[name].prices ??= [];
                        for (const price of this.extractorsByName[name].prices) {
                            price.basePrice ??= 0n;
                        }
                    }
                }
                if (crawlersByName) {
                    for (const [name, funcMeta] of Object.entries(crawlersByName)) {
                        if (this.crawlersByName[name]) {
                            Object.assign(this.crawlersByName[name], funcMeta);
                        }
                        else {
                            this.crawlersByName[name] = funcMeta;
                        }
                        this.crawlersByName[name].prices ??= [];
                        for (const price of this.crawlersByName[name].prices) {
                            price.basePrice ??= 0n;
                        }
                    }
                }
                if (tablesByName) {
                    for (const [name, meta] of Object.entries(tablesByName)) {
                        if (this.tablesByName[name]) {
                            Object.assign(this.tablesByName[name], meta);
                        }
                        else {
                            this.tablesByName[name] = meta;
                        }
                        this.tablesByName[name].prices ??= [];
                        for (const price of this.tablesByName[name].prices) {
                            price.basePrice ??= 0n;
                        }
                    }
                }
                Object.assign(this, otherSettings);
            }
        }
    }
    static validate(json) {
        try {
            IDatastoreManifest_1.DatastoreManifestSchema.parse(json);
        }
        catch (error) {
            throw ValidationError_1.default.fromZodValidation('This Manifest has errors that need to be fixed.', error);
        }
    }
    static validateId(id) {
        try {
            datastoreIdValidation_1.datastoreIdValidation.parse(id);
        }
        catch (error) {
            throw ValidationError_1.default.fromZodValidation('This is not a valid datastore id', error);
        }
    }
    /// MANIFEST OVERRIDE FILES  /////////////////////////////////////////////////////////////////////////////////////////
    static getCustomSources(absoluteScriptEntrypoint) {
        const manifestPath = absoluteScriptEntrypoint.replace(Path.extname(absoluteScriptEntrypoint), '-manifest.json');
        return [
            this.loadGlobalManifest(manifestPath),
            this.loadProjectManifest(manifestPath),
            this.loadEntrypointManifest(manifestPath),
        ];
    }
    static loadEntrypointManifest(manifestPath) {
        return new DatastoreManifest(manifestPath, 'entrypoint');
    }
    static loadProjectManifest(manifestPath) {
        const path = config_1.default.findConfigDirectory({
            entrypoint: manifestPath,
            workingDirectory: manifestPath,
        }, false);
        if (!path)
            return null;
        return new DatastoreManifest(Path.join(path, 'datastores.json'), 'project', Path.relative(path, manifestPath));
    }
    static loadGlobalManifest(manifestPath) {
        const path = Path.join(config_1.default.global.directoryPath, 'datastores.json');
        return new DatastoreManifest(path, 'global', manifestPath);
    }
    static async writeToDisk(path, json) {
        if (!(await (0, fileUtils_1.existsAsync)(Path.dirname(path)))) {
            await fs_1.promises.mkdir(Path.dirname(path), { recursive: true });
        }
        await (0, fileUtils_1.safeOverwriteFile)(path, TypeSerializer_1.default.stringify(json, { format: true }));
    }
}
DatastoreManifest.TemporaryIdPrefix = 'tmp';
exports.default = DatastoreManifest;
//# sourceMappingURL=DatastoreManifest.js.map