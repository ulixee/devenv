"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientForDatastore {
    constructor(datastore, options) {
        this.datastore = datastore;
        this.readyPromise = this.datastore.bind(options).catch(() => null);
    }
    fetch(name, inputFilter) {
        const instance = this.datastore.extractors[name] || this.datastore.tables[name];
        if (!instance)
            throw new Error(`${name} is not a valid Datastore Extractor or Table name.`);
        return instance.runInternal({ input: inputFilter }, {
            beforeQuery: () => this.readyPromise,
        });
    }
    run(name, inputFilter) {
        return this.fetch(name, inputFilter);
    }
    async crawl(name, inputFilter) {
        await this.readyPromise;
        const result = await this.datastore.crawlers[name].runInternal({ input: inputFilter });
        return result[0];
    }
    async query(sql, boundValues) {
        await this.readyPromise;
        return this.datastore.queryInternal(sql, boundValues);
    }
}
exports.default = ClientForDatastore;
//# sourceMappingURL=ClientForDatastore.js.map