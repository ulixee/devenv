"use strict";
// NOTE: you must start your own Ulixee Cloud to run this example.
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_plugins_hero_1 = require("@ulixee/datastore-plugins-hero");
const schema_1 = require("@ulixee/schema");
exports.default = new datastore_plugins_hero_1.Datastore({
    name: 'Hackernews',
    description: 'Collect all the top stories from news.ycombinator.com',
    extractors: {
        latest: new datastore_plugins_hero_1.Extractor({
            async run({ Hero, Output }) {
                const hero = new Hero();
                await hero.goto('https://news.ycombinator.com/');
                await hero.waitForPaintingStable();
                const stories = await hero.document.querySelectorAll('.athing');
                let lastStory;
                for (const story of stories) {
                    const extraElem = await story.nextElementSibling;
                    const record = new Output();
                    const titleElem = story.querySelector('.titleline > a');
                    record.score = parseInt(await extraElem.querySelector('.score').textContent.catch(() => '0'), 10);
                    record.id = await story.getAttribute('id');
                    record.age = await extraElem.querySelector('.age a').textContent;
                    record.title = await titleElem.textContent;
                    const contributor = await extraElem
                        .querySelector('.hnuser')
                        .textContent.catch(() => '');
                    record.contributor = { id: contributor, username: contributor };
                    const links = [...(await extraElem.querySelectorAll('.subtext > a'))];
                    const commentsLink = links[links.length - 1];
                    const commentText = await commentsLink.textContent;
                    record.commentCount = commentText.includes('comment')
                        ? parseInt(commentText.trim().match(/(\d+)\s/)[0], 10)
                        : 0;
                    lastStory = commentsLink;
                    let url = await titleElem.getAttribute('href');
                    if (!url.includes('://'))
                        url = new URL(url, 'https://news.ycombinator.com/').href;
                    record.url = url;
                    record.emit();
                }
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
                await hero.close();
            },
            schema: {
                output: {
                    score: (0, schema_1.number)(),
                    id: (0, schema_1.string)(),
                    age: (0, schema_1.string)(),
                    title: (0, schema_1.string)(),
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
//# sourceMappingURL=news.ycombinator.com.js.map