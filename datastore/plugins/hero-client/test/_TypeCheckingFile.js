"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeChecking = typeChecking;
const datastore_1 = require("@ulixee/datastore");
const node_assert_1 = require("node:assert");
const schema_1 = require("@ulixee/schema");
const index_1 = require("../index");
function typeChecking() {
    const extractor = new datastore_1.Extractor({
        async run(context) {
            const { Hero, input } = context;
            const hero = new Hero();
            await hero.goto('t');
            // @ts-expect-error - make sure hero is type checked (not any)
            await hero.unsupportedMethod();
            // @ts-expect-error
            const s = input.text;
            const heroReplay = new context.HeroReplay({ replaySessionId: '1' });
            const detached = heroReplay.detachedElements.getAll('test');
            (0, node_assert_1.strict)(detached, 'should exist');
            // @ts-expect-error - make sure heroReplay is type checked (not any)
            await heroReplay.goto();
            // @ts-expect-error
            input.text = 1;
        },
        schema: {
            input: {
                text: (0, schema_1.string)(),
                field2: (0, schema_1.boolean)({ optional: true }),
            },
        },
    }, index_1.HeroExtractorPlugin);
    void extractor.runInternal({ showChrome: true, input: { text: '123' } });
    const crawler = new datastore_1.Crawler({
        async run(ctx) {
            // @ts-expect-error
            const num = ctx.input.colBool;
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
                colBool: (0, schema_1.boolean)({ optional: true }),
                colNum: (0, schema_1.number)(),
            },
        },
    }, index_1.HeroExtractorPlugin);
    // @ts-expect-error
    void crawler.runInternal({ showChrome: true, input: { text: '123' } });
    void crawler.runInternal({ showChrome: true, input: { colNum: 1, sessionId: '123' } });
    const crawlerWithoutSchema = new datastore_1.Crawler({
        async run(ctx) {
            // Can't get typescript to check this field when no schema
            // @ts-expect-error
            const num = ctx.input.maxTimeInCache;
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
    });
    // Can't get typescript to check this field when no schema  // @ts-expect-error
    void crawlerWithoutSchema.runInternal({ input: { maxTimeInCache: new Date() } });
    const datastore = new datastore_1.default({
        crawlers: {
            plain: new datastore_1.Crawler(async ({ Hero }) => {
                return new Hero();
            }, index_1.HeroExtractorPlugin),
            crawlerSchema: new datastore_1.Crawler({
                async run({ Hero, input }) {
                    const hero = new Hero();
                    await hero.goto(input.url);
                    // @ts-expect-error: value isn't on input
                    const x = input.value;
                    return hero;
                },
                schema: {
                    input: {
                        url: (0, schema_1.string)({ format: 'url' }),
                    },
                },
            }, index_1.HeroExtractorPlugin),
        },
        extractors: {
            hero: new datastore_1.Extractor(async ({ Hero }) => {
                const hero = new Hero();
                await hero.goto('place');
                // @ts-expect-error - make sure hero is type checked (not any)
                await hero.unsupportedMethod();
            }, index_1.HeroExtractorPlugin),
            heroSchema: new datastore_1.Extractor({
                schema: {
                    input: {
                        url: (0, schema_1.string)({ format: 'url' }),
                    },
                    output: {
                        html: (0, schema_1.string)(),
                        title: (0, schema_1.boolean)({ optional: true }),
                    },
                },
                async run({ Hero, input, Output, crawl }) {
                    const { plain, crawlerSchema } = datastore.crawlers;
                    await crawl(plain, {
                        input: { maxTimeInCache: 500, anyTest: 1 },
                    });
                    await crawl(crawlerSchema, {
                        input: { maxTimeInCache: 500, url: '1' },
                    });
                    // @ts-expect-error
                    await crawl(crawlerSchema, { input: { url: 1 } });
                    const hero = new Hero();
                    await hero.goto(input.url);
                    const output = new Output();
                    output.html = await hero.document.body.outerHTML;
                    // @ts-expect-error: value isn't on input
                    const x = input.value;
                },
            }, index_1.HeroExtractorPlugin),
        },
    });
    void (async () => {
        await datastore.extractors.hero.runInternal({ replaySessionId: '1' });
        // @ts-expect-error
        await datastore.extractors.hero.runInternal({ showChrome: '1,', replaySessionId: '1' });
        await datastore.crawlers.plain
            // Can't get typescript to check this field when no schema // @ts-expect-error
            .runInternal({ input: { maxTimeInCache: new Date(), anyTest: 1 } });
        await datastore.crawlers.crawlerSchema
            // @ts-expect-error
            .runInternal({ input: { urls: '1', maxTimeInCache: 100 } });
        // @ts-expect-error
        await datastore.crawl('crawlerSchema', { urls: '1', maxTimeInCache: 100 });
    })();
}
//# sourceMappingURL=_TypeCheckingFile.js.map