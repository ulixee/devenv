"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const datastore_plugins_hero_1 = require("@ulixee/datastore-plugins-hero");
const datastore = new datastore_1.default({
    crawlers: {
        defaultCrawl: new datastore_plugins_hero_1.Crawler({
            async run({ Hero, input }) {
                const hero = new Hero();
                await hero.goto(input.url);
                await hero.waitForPaintingStable();
                await hero.setSnippet('title', await hero.document.title);
                return hero;
            },
        }, datastore_plugins_hero_1.HeroExtractorPlugin),
    },
    extractors: {
        default: new datastore_1.Extractor({
            async run({ HeroReplay, Output }) {
                const hero = await HeroReplay.fromCrawler(datastore.crawlers.defaultCrawl);
                new Output({ title: await hero.getSnippet('title') });
            },
        }, datastore_plugins_hero_1.HeroExtractorPlugin),
    },
});
exports.default = datastore;
//# sourceMappingURL=_testDatastore.js.map