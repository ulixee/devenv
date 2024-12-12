"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const datastore_plugins_hero_1 = require("@ulixee/datastore-plugins-hero");
const schema_1 = require("@ulixee/schema");
const datastore = new datastore_1.default({
    name: 'Tutorial',
    extractors: {
        docPages: new datastore_1.Extractor({
            async run({ input, Hero, Output }) {
                const hero = new Hero();
                await hero.goto(`https://ulixee.org/docs/${input.tool}`);
                await hero.querySelector('.LEFTBAR').$waitForVisible();
                const links = await hero.querySelectorAll('.LEFTBAR a');
                for (const link of await links) {
                    Output.emit({
                        title: await link.innerText,
                        href: await link.href,
                    });
                }
                await hero.close();
            },
            schema: {
                input: {
                    tool: (0, schema_1.string)({
                        enum: ['hero', 'datastore', 'cloud', 'client'],
                    }),
                },
                output: {
                    title: (0, schema_1.string)(),
                    href: (0, schema_1.string)({ format: 'url' }),
                },
            },
        }, datastore_plugins_hero_1.HeroExtractorPlugin),
    },
});
exports.default = datastore;
//# sourceMappingURL=ulixee.org.js.map