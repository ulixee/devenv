"use strict";
// NOTE: you must start your own Ulixee Cloud to run this example.
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_plugins_hero_1 = require("@ulixee/datastore-plugins-hero");
const { string } = datastore_plugins_hero_1.Schema;
exports.default = new datastore_plugins_hero_1.Datastore({
    name: 'Example',
    extractors: {
        exampleOrg: new datastore_plugins_hero_1.Extractor({
            async run(context) {
                const { input, Output, Hero } = context;
                const hero = new Hero();
                await hero.goto(input.url);
                const title = await hero.document.title;
                const output = new Output();
                output.title = title;
                output.body = await hero.document.body.textContent;
                console.log(`LOADED ${input.url}: ${title}`);
                await hero.close();
            },
            schema: {
                input: {
                    url: string({ format: 'url' }),
                },
                output: {
                    title: string(),
                    body: string(),
                },
                inputExamples: [
                    {
                        url: 'https://example.org',
                    },
                ],
            },
        }, datastore_plugins_hero_1.HeroExtractorPlugin),
    },
});
//# sourceMappingURL=example.org.js.map