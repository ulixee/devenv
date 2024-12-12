"use strict";
// NOTE: you must start your own Ulixee Cloud to run this example.
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_plugins_hero_1 = require("@ulixee/datastore-plugins-hero");
const schema_1 = require("@ulixee/schema");
const crawl = new datastore_plugins_hero_1.Crawler({
    async run({ Hero, input }) {
        const hero = new Hero();
        await hero.goto(input.url);
        const h1 = await hero.querySelector('h1').$waitForVisible();
        // Extract the DOM Element at this moment in time.
        await h1.$addToDetachedElements('h1');
        return hero;
    },
    disableCache: false,
    schema: {
        input: {
            url: (0, schema_1.string)({ format: 'url' }),
        },
    },
}, datastore_plugins_hero_1.HeroExtractorPlugin);
const datastore = new datastore_plugins_hero_1.Datastore({
    crawlers: {
        crawl,
    },
    extractors: {
        extract: new datastore_plugins_hero_1.Extractor(async ({ HeroReplay, Output }) => {
            const heroReplay = await HeroReplay.fromCrawler(crawl, {
                input: {
                    url: 'https://ulixee.org',
                },
            });
            const h1 = await heroReplay.detachedElements.get('h1');
            // NOTE: synchronous APIs. No longer running in browser.
            const output = new Output();
            output.text = h1.textContent;
            const divs = h1.querySelectorAll('div');
            output.divs = { count: divs.length, textLengths: [...divs].map(x => x.textContent.length) };
            console.log(output);
        }, datastore_plugins_hero_1.HeroExtractorPlugin),
    },
});
exports.default = datastore;
//# sourceMappingURL=extractElements.js.map