"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientForTable {
    constructor(table, options) {
        this.table = table;
        this.readyPromise = this.table.bind(options).catch(() => null);
    }
    async fetch(inputFilter) {
        await this.readyPromise;
        return this.table.fetchInternal({ input: inputFilter });
    }
    async run(inputFilter) {
        await this.readyPromise;
        return this.fetch(inputFilter);
    }
    async query(sql, boundValues = []) {
        await this.readyPromise;
        return this.table.queryInternal(sql, boundValues);
    }
}
exports.default = ClientForTable;
//# sourceMappingURL=ClientForTable.js.map