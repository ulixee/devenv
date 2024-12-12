"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SourceMapSupport_1 = require("@ulixee/commons/lib/SourceMapSupport");
const VersionUtils_1 = require("@ulixee/commons/lib/VersionUtils");
const datastore_1 = require("@ulixee/datastore");
const Extractor_1 = require("@ulixee/datastore/lib/Extractor");
const fs_1 = require("fs");
const node_vm_1 = require("node:vm");
const Path = require("path");
const vm_1 = require("vm");
const { version } = require('../package.json');
class DatastoreVm {
    constructor(connectionToDatastoreCore, apiClientCache, plugins, datastoreLookup, remotePaymentService) {
        this.plugins = plugins;
        this.datastoreLookup = datastoreLookup;
        this.remotePaymentService = remotePaymentService;
        this.compiledScriptsByPath = new Map();
        this.apiClientCache = apiClientCache;
        this.connectionToDatastoreCore = connectionToDatastoreCore;
        this.whitelist = new Set([
            ...this.plugins.map(x => x.nodeVmRequireWhitelist || []).flat(),
            '@ulixee/datastore',
            '@ulixee/*-plugin',
            '@ulixee/net',
            '@ulixee/commons',
            '@ulixee/schema',
            '@ulixee/platform-specification',
        ]);
    }
    async getDatastore(path) {
        const script = await this.getVMScript(path);
        const customRequire = this.buildCustomRequire(path);
        const moduleExports = {};
        const ctx = (0, vm_1.createContext)({
            ...this.getDefaultContext(),
            require: customRequire,
            module: { exports: moduleExports },
            exports: moduleExports,
        }, { name: path });
        let datastore = script.runInContext(ctx);
        if (datastore instanceof Extractor_1.default) {
            const extractor = datastore;
            datastore = new datastore_1.default({
                extractors: { [extractor.name ?? 'default']: extractor },
            });
        }
        else if (datastore instanceof datastore_1.Crawler) {
            const crawler = datastore;
            datastore = new datastore_1.default({
                crawlers: { [crawler.name ?? 'default']: crawler },
            });
        }
        return datastore;
    }
    async open(path, storage, manifest) {
        if (!(0, VersionUtils_1.isSemverSatisfied)(manifest.coreVersion, version)) {
            throw new Error(`The current version of Core (${version}) is incompatible with this Datastore version (${manifest.coreVersion})`);
        }
        const datastore = await this.getDatastore(path);
        if (!(datastore instanceof datastore_1.default)) {
            throw new Error('The default export from this script needs to inherit from "@ulixee/datastore"');
        }
        await this.remotePaymentService?.whitelistRemotes?.(datastore.metadata, this.datastoreLookup);
        await datastore.bind({
            connectionToCore: this.connectionToDatastoreCore,
            storageEngine: storage,
            manifest,
            apiClientLoader: this.apiClientCache.get.bind(this.apiClientCache),
            datastoreHostLookup: this.datastoreLookup,
            remotePaymentService: this.remotePaymentService,
        });
        return datastore;
    }
    getDefaultContext() {
        return {
            ...global,
            Date,
            RegExp,
            Error,
            Number,
            String,
            Boolean,
            BigInt,
            URL,
            Map,
            Set,
            Array,
            Buffer,
            Symbol,
            process: {
                ...process,
                env: undefined,
                exit: undefined,
            },
            console,
        };
    }
    getVMScript(path) {
        path = Path.resolve(path);
        if (this.compiledScriptsByPath.has(path) && !DatastoreVm.doNotCacheList.has(path)) {
            return this.compiledScriptsByPath.get(path);
        }
        const dir = Path.dirname(path);
        const srcDir = `${Path.dirname(dir)}${Path.sep}`;
        SourceMapSupport_1.SourceMapSupport.clearStackPath(srcDir);
        SourceMapSupport_1.SourceMapSupport.retrieveSourceMap(path, dir);
        const script = new Promise(async (resolve) => {
            const file = await fs_1.promises.readFile(path, 'utf8');
            const vmScript = new node_vm_1.Script(file, {
                filename: path,
            });
            resolve(vmScript);
        });
        if (!DatastoreVm.doNotCacheList.has(path)) {
            this.compiledScriptsByPath.set(path, script);
        }
        return script;
    }
    buildCustomRequire(appPath) {
        // Cache for modules loaded in the custom require
        const moduleCache = {};
        const moduleCode = (0, fs_1.readFileSync)(appPath, 'utf8');
        const boundRequire = require;
        const whitelist = this.whitelist;
        const defaultContext = this.getDefaultContext();
        return function requirer(mod) {
            if (!mod.includes('TypeSerializer')) {
                for (const builtin of whitelist) {
                    if (mod.startsWith(builtin) || mod.match(builtin)) {
                        return boundRequire(mod);
                    }
                }
            }
            const moduleExports = {};
            const moduleContext = {
                require: (name) => requirer(name),
                module: { exports: moduleExports },
                exports: moduleExports,
                ...defaultContext,
            };
            const script = new node_vm_1.Script(moduleCode);
            script.runInNewContext(moduleContext);
            moduleCache[mod] = moduleExports;
            return moduleExports;
        };
    }
}
DatastoreVm.doNotCacheList = new Set();
exports.default = DatastoreVm;
//# sourceMappingURL=DatastoreVm.js.map