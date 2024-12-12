"use strict";
// NOTE: you must start your own Ulixee Cloud to run this example.
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_plugins_hero_1 = require("@ulixee/datastore-plugins-hero");
const schema_1 = require("@ulixee/schema");
const datastore = new datastore_plugins_hero_1.Datastore({
    crawlers: {
        hackernewsCrawler: new datastore_plugins_hero_1.Crawler(async ({ Hero }) => {
            const hero = new Hero();
            await hero.goto('https://news.ycombinator.com/');
            await hero.waitForPaintingStable();
            await hero.document.querySelector('#hnmain').$addToDetachedElements('table');
            const links = await hero.document.querySelectorAll('.subtext > a');
            const lastStory = await links[(await links.length) - 1];
            if (lastStory) {
                await hero.click(lastStory);
                await hero.waitForLocation('change');
                await hero.waitForElement(hero.document.querySelector('textarea'));
                await hero.click(hero.document.querySelector('textarea'));
                await hero.type('Hackernews!');
                // const comments = [...(await hero.document.querySelectorAll('.commtext'))];
                // await hero.interact({
                //   move: comments[comments.length - 1],
                // });
            }
            return hero;
        }, datastore_plugins_hero_1.HeroExtractorPlugin),
    },
    extractors: {
        hackernews: new datastore_plugins_hero_1.Extractor({
            async run({ Output, HeroReplay }) {
                const { detachedElements } = await HeroReplay.fromCrawler(datastore.crawlers.hackernewsCrawler, {
                    input: {
                        maxTimeInCache: 24 * 60 * 60,
                    },
                });
                const storyElement = await detachedElements.get('table');
                const stories = storyElement.querySelectorAll('.athing');
                for (const story of stories) {
                    const extraElem = story.nextElementSibling;
                    const record = new Output();
                    const titleElem = story.querySelector('.titleline > a');
                    record.score = parseInt(extraElem.querySelector('.score')?.textContent ?? '0', 10);
                    record.id = story.getAttribute('id');
                    record.age = extraElem.querySelector('.age a').textContent;
                    record.subject = titleElem.textContent;
                    const contributor = extraElem.querySelector('.hnuser')?.textContent ?? '';
                    record.contributor = { id: contributor, username: contributor };
                    const links = extraElem.querySelectorAll('.subtext > a');
                    const commentsLink = links[links.length - 1];
                    const commentText = commentsLink.textContent;
                    record.commentCount = commentText.includes('comment')
                        ? parseInt(commentText.trim().match(/(\d+)\s/)[0], 10)
                        : 0;
                    let url = titleElem.getAttribute('href');
                    if (!url.includes('://'))
                        url = new URL(url, 'https://news.ycombinator.com/').href;
                    record.url = url;
                    record.emit();
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
//# sourceMappingURL=news.ycombinator.com-extract.js.map