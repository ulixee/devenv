"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const schema_1 = require("@ulixee/schema");
let runCrawlerTime;
const datastore = new datastore_1.default({
    id: 'crawl',
    version: '0.0.1',
    crawlers: {
        crawl: new datastore_1.Crawler({
            async run(ctx) {
                runCrawlerTime = new Date();
                return {
                    toCrawlerOutput() {
                        return Promise.resolve({
                            sessionId: ctx.input.sessionId,
                            crawler: 'none',
                            version: '1',
                        });
                    },
                };
            },
        }),
        crawlWithSchema: new datastore_1.Crawler({
            async run(ctx) {
                runCrawlerTime = new Date();
                return {
                    toCrawlerOutput() {
                        return Promise.resolve({
                            sessionId: ctx.input.sessionId,
                            crawler: 'none',
                            version: '1',
                        });
                    },
                };
            },
            schema: {
                input: {
                    sessionId: (0, schema_1.string)(),
                    colBool: (0, schema_1.boolean)(),
                    colNum: (0, schema_1.number)(),
                },
            },
        }),
    },
    extractors: {
        crawlCall: new datastore_1.Extractor(async (ctx) => {
            const crawl = await ctx.crawl(datastore.crawlers.crawl, ctx.input);
            ctx.Output.emit({ ...crawl, runCrawlerTime });
        }),
        crawlWithSchemaCall: new datastore_1.Extractor({
            async run(ctx) {
                const crawl = await ctx.crawl(datastore.crawlers.crawlWithSchema, ctx.input);
                ctx.Output.emit({ ...crawl, runCrawlerTime });
            },
            schema: {
                input: {
                    sessionId: (0, schema_1.string)(),
                    colBool: (0, schema_1.boolean)(),
                    colNum: (0, schema_1.number)(),
                },
                output: {
                    sessionId: (0, schema_1.string)(),
                    runCrawlerTime: (0, schema_1.date)({ optional: true }),
                },
            },
        }),
    },
});
exports.default = datastore;
//# sourceMappingURL=crawl.js.map