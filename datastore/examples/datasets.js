"use strict";
// NOTE: you must start your own Ulixee Cloud to run this example.
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_plugins_hero_1 = require("@ulixee/datastore-plugins-hero");
exports.default = new datastore_plugins_hero_1.Extractor(async (context) => {
    const { Output, Hero } = context;
    const hero = new Hero();
    await hero.goto('https://ulixee.org');
    await hero.querySelector('.datasets').$waitForVisible();
    const { document } = hero;
    const datasets = await document.querySelectorAll('.datasets .title');
    const length = await datasets.length;
    for (let i = 0; i < length; i += 1) {
        const dataset = await document.querySelectorAll('.datasets .title')[i];
        const title = await dataset.textContent;
        await hero.click(dataset);
        await hero.waitForLocation('change');
        await hero.waitForState(assert => {
            assert(hero.querySelector('.DatasetHeader .dataset').$isVisible);
            assert(hero.querySelector('.cost .large-text').$isVisible);
        });
        const cost = await hero.querySelector('.cost .large-text').innerText;
        new Output({ cost, title });
        await hero.goBack();
        await hero.waitForLocation('change');
    }
}, datastore_plugins_hero_1.HeroExtractorPlugin);
//# sourceMappingURL=datasets.js.map