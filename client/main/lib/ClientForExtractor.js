"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientForExtractor {
    constructor(extractor, options) {
        this.extractor = extractor;
        this.readyPromise = this.extractor.bind(options).catch(() => null);
    }
    fetch(inputFilter) {
        return this.extractor.runInternal({ input: inputFilter }, {
            beforeQuery: () => this.readyPromise,
        });
    }
    run(inputFilter) {
        return this.fetch(inputFilter);
    }
    async query(sql, boundValues = []) {
        await this.readyPromise;
        return this.extractor.queryInternal(sql, boundValues);
    }
}
exports.default = ClientForExtractor;
//# sourceMappingURL=ClientForExtractor.js.map