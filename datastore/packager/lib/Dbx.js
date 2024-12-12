"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatastoreManifest_1 = require("@ulixee/datastore-core/lib/DatastoreManifest");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const ExtractorInternal_1 = require("@ulixee/datastore/lib/ExtractorInternal");
const Fs = require("fs/promises");
const Path = require("path");
const Tar = require("tar");
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
class Dbx {
    get entrypoint() {
        return `${this.path}/datastore.js`;
    }
    constructor(path) {
        this.path = path;
        this.manifest = new DatastoreManifest_1.default(Path.join(this.path, 'datastore-manifest.json'));
    }
    async getEmbeddedManifest() {
        // read from the dbx if from file
        const manifest = this.manifest;
        await manifest.load();
        return manifest;
    }
    async createOrUpdateDocpage(meta, manifest, entrypoint) {
        const title = meta.name || entrypoint.match(/([^/\\]+)\.(js|ts)$/)[1] || 'Untitled';
        let defaultExample;
        for (const table of Object.values(meta.tablesByName)) {
            if (table.isPublic) {
                defaultExample = {
                    type: 'table',
                    formatted: table.name,
                    args: null,
                    name: table.name,
                };
                break;
            }
        }
        if (!defaultExample) {
            const functions = [
                ...Object.values(meta.crawlersByName),
                ...Object.values(meta.extractorsByName),
            ];
            const useFunction = functions.find(x => x.schema?.inputExamples?.length) ?? functions[0];
            const type = meta.extractorsByName[useFunction?.name] ? 'extractor' : 'crawler';
            if (useFunction) {
                const { formatted, args } = ExtractorInternal_1.default.createExampleCall(useFunction?.name, useFunction?.schema);
                defaultExample = {
                    type,
                    name: useFunction.name,
                    formatted,
                    args,
                };
            }
        }
        defaultExample ??= { type: 'table', formatted: 'default', args: null, name: 'default' };
        const config = {
            datastoreId: manifest.id,
            version: manifest.version,
            name: title.charAt(0).toUpperCase() + title.slice(1),
            description: meta.description,
            defaultExample,
            createdAt: new Date(manifest.versionTimestamp).toISOString(),
            extractorsByName: Object.entries(meta.extractorsByName).reduce((obj, [name, entry]) => {
                return Object.assign(obj, {
                    [name]: {
                        name,
                        description: entry.description || '',
                        schema: entry.schema ?? { input: {}, output: {} },
                        prices: manifest.extractorsByName[name].prices,
                    },
                });
            }, {}),
            crawlersByName: Object.entries(meta.crawlersByName).reduce((obj, [name, entry]) => {
                return Object.assign(obj, {
                    [name]: {
                        name,
                        description: entry.description || '',
                        schema: entry.schema ?? { input: {}, output: {} },
                        prices: manifest.crawlersByName[name].prices,
                    },
                });
            }, {}),
            tablesByName: Object.entries(meta.tablesByName).reduce((obj, [name, entry]) => {
                if (entry.isPublic === false)
                    return;
                return Object.assign(obj, {
                    [name]: {
                        name,
                        description: entry.description || '',
                        schema: entry.schema ?? {},
                        prices: manifest.tablesByName[name].prices,
                    },
                });
            }, {}),
        };
        await Fs.writeFile(Path.join(this.path, 'docpage.json'), TypeSerializer_1.default.stringify(config));
    }
    async tarGzip() {
        await Tar.create({
            gzip: true,
            cwd: this.path,
            file: `${this.path}.tgz`,
        }, ['datastore.js', 'datastore.js.map', 'datastore-manifest.json', 'docpage.json']);
        const buffer = await Fs.readFile(`${this.path}.tgz`);
        await Fs.unlink(`${this.path}.tgz`);
        return buffer;
    }
    async upload(host, options = {}) {
        const compressedDbx = await this.tarGzip();
        const client = new DatastoreApiClient_1.default(host);
        try {
            return await client.upload(compressedDbx, options);
        }
        finally {
            await client.disconnect();
        }
    }
}
exports.default = Dbx;
//# sourceMappingURL=Dbx.js.map