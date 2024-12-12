"use strict";
// NOTE: you must start your own Ulixee Cloud to run this example.
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_plugins_hero_1 = require("@ulixee/datastore-plugins-hero");
const datastore = new datastore_plugins_hero_1.Datastore({
    crawlers: {
        crawl: new datastore_plugins_hero_1.Crawler(async ({ Hero }) => {
            const hero = new Hero();
            await hero.goto('https://ulixee.org');
            const resources = await hero.activeTab.waitForResources({ url: 'index.json' });
            for (const resource of resources)
                await resource.$addToDetachedResources('xhr');
            return hero;
        }, datastore_plugins_hero_1.HeroExtractorPlugin),
    },
    extractors: {
        extract: new datastore_plugins_hero_1.Extractor(async ({ HeroReplay, Output }) => {
            const heroReplay = await HeroReplay.fromCrawler(datastore.crawlers.crawl, {
                input: { maxTimeInCache: 24 * 60 * 60 },
            });
            const { detachedResources } = heroReplay;
            const xhrs = await detachedResources.getAll('xhr');
            console.log(xhrs);
            const output = new Output();
            output.gridsomeData = [];
            for (const xhr of xhrs) {
                // NOTE: synchronous APIs.
                const jsonObject = xhr.json;
                console.log(jsonObject);
                if (jsonObject.data) {
                    output.gridsomeData.push(jsonObject.data);
                }
            }
        }, datastore_plugins_hero_1.HeroExtractorPlugin),
    },
});
exports.default = datastore;
//# sourceMappingURL=extractResources.js.map