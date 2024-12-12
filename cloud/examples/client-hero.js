"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hero_1 = require("@ulixee/hero");
(async () => {
    const hero = new hero_1.default({ connectionToCore: 'ws://localhost:1818' });
    await hero.goto('https://ycombinator.com');
    const title = await hero.document.title;
    console.log('loaded -> ', title);
    await hero.close();
})().catch(error => {
    console.log('ERROR starting core', error);
    process.exit(1);
});
//# sourceMappingURL=client-hero.js.map