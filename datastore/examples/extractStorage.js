"use strict";
// NOTE: you must start your own Ulixee Cloud to run this example.
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_plugins_hero_1 = require("@ulixee/datastore-plugins-hero");
const datastore = new datastore_plugins_hero_1.Datastore({
    crawlers: {
        crawl: new datastore_plugins_hero_1.Crawler(async ({ Hero }) => {
            const hero = new Hero();
            await hero.goto('https://ulixee.org');
            await hero.waitForPaintingStable();
            await hero.setSnippet('localStorage', await hero.getJsValue('JSON.stringify(localStorage)'));
            await hero.setSnippet('sessionStorage', await hero.getJsValue('JSON.stringify(sessionStorage)'));
            await hero.setSnippet('cookies', await hero.activeTab.cookieStorage.getItems());
            await hero.setSnippet('history', await hero.getJsValue(`history.length`));
            return hero;
        }, datastore_plugins_hero_1.HeroExtractorPlugin),
    },
    extractors: {
        extract: new datastore_plugins_hero_1.Extractor(async ({ HeroReplay, Output }) => {
            const heroReplay = await HeroReplay.fromCrawler(datastore.crawlers.crawl, {
                input: { maxTimeInCache: 24 * 60 * 60 },
            });
            const localStorage = await heroReplay.getSnippet('localStorage');
            const sessionStorage = await heroReplay.getSnippet('sessionStorage');
            const cookies = await heroReplay.getSnippet('cookies');
            const history = await heroReplay.getSnippet('history');
            Output.emit({
                rootStorage: {
                    local: localStorage,
                    session: sessionStorage,
                    cookies,
                    history,
                },
            });
        }, datastore_plugins_hero_1.HeroExtractorPlugin),
    },
});
exports.default = datastore;
//# sourceMappingURL=extractStorage.js.map