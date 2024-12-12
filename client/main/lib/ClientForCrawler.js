"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientForCrawler {
    constructor(crawler, options) {
        this.crawler = crawler;
        this.readyPromise = this.crawler.bind(options).catch(() => null);
    }
    crawl(inputFilter) {
        return this.crawler.runInternal(inputFilter, {
            beforeQuery: () => this.readyPromise,
        });
    }
}
exports.default = ClientForCrawler;
//# sourceMappingURL=ClientForCrawler.js.map