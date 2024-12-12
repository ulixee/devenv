"use strict";
// NOTE: you must start your own Ulixee Cloud to run this example.
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const datastore_plugins_hero_1 = require("@ulixee/datastore-plugins-hero");
const schema_1 = require("@ulixee/schema");
const datastore = new datastore_1.default({
    name: 'YC News',
    description: 'Gets the latest headlines from news.ycombinator.com',
    crawlers: {
        newsCrawler: new datastore_plugins_hero_1.Crawler({
            async run({ Hero }) {
                const hero = new Hero();
                await hero.goto('https://news.ycombinator.com/');
                await hero.waitForPaintingStable();
                const records = await hero.document.querySelectorAll('.athing');
                await records.$addToDetachedElements('titles');
                for (const record of records) {
                    await record.nextElementSibling.$addToDetachedElements('subtitles');
                }
                const links = await hero.document.querySelectorAll('.subline > a[href^="item?"]');
                const lastStory = await links[(await links.length) - 1];
                if (lastStory) {
                    await hero.click(lastStory);
                    await hero.waitForLocation('change');
                    await hero.waitForElement(hero.document.querySelector('textarea'));
                    await hero.click(hero.document.querySelector('textarea'));
                    await hero.type('Hackernews!');
                    const comments = [...(await hero.document.querySelectorAll('.commtext'))];
                    await hero.interact({
                        move: comments[comments.length - 1],
                    });
                }
                return hero;
            },
        }, datastore_plugins_hero_1.HeroExtractorPlugin),
    },
    extractors: {
        news: new datastore_plugins_hero_1.Extractor({
            async run({ Output, HeroReplay }) {
                const heroReplay = await HeroReplay.fromCrawler(datastore.crawlers.newsCrawler, {
                    input: {
                        maxTimeInCache: 24 * 60 * 60,
                    },
                });
                const titles = await heroReplay.detachedElements.getAll('titles');
                const subtitles = await heroReplay.detachedElements.getAll('subtitles');
                for (let i = 0; i < titles.length; i += 1) {
                    const story = titles[i];
                    const extraElem = subtitles[i];
                    const output = new Output();
                    const titleElem = story.querySelector('.titleline > a');
                    output.score = parseInt(extraElem.querySelector('.score')?.textContent ?? '0', 10);
                    output.id = story.getAttribute('id');
                    output.age = extraElem.querySelector('.age a').textContent;
                    output.subject = titleElem.textContent;
                    const contributor = extraElem.querySelector('.hnuser')?.textContent ?? '';
                    output.contributor = { id: contributor, username: contributor };
                    const links = extraElem.querySelectorAll('.subline > a');
                    const commentsLink = links[links.length - 1];
                    const commentText = commentsLink?.textContent;
                    output.commentCount = commentText?.includes('comment')
                        ? parseInt(commentText.trim().match(/(\d+)\s/)[0], 10)
                        : 0;
                    let url = titleElem.getAttribute('href');
                    if (!url.includes('://'))
                        url = new URL(url, 'https://news.ycombinator.com/').href;
                    output.url = url;
                    output.emit();
                }
            },
            schema: {
                output: {
                    score: (0, schema_1.number)(),
                    id: (0, schema_1.string)(),
                    age: (0, schema_1.string)(),
                    subject: (0, schema_1.string)(),
                    contributor: (0, schema_1.object)({
                        id: (0, schema_1.string)(),
                        username: (0, schema_1.string)(),
                    }),
                    commentCount: (0, schema_1.number)(),
                    url: (0, schema_1.string)({ format: 'url' }),
                },
            },
        }, datastore_plugins_hero_1.HeroExtractorPlugin),
    },
});
exports.default = datastore;
//# sourceMappingURL=news.ycombinator.com-items.js.map