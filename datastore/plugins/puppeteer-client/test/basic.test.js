"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_testing_1 = require("@ulixee/datastore-testing");
const index_1 = require("../index");
afterAll(datastore_testing_1.Helpers.afterAll);
describe('basic puppeteerExtractor tests', () => {
    it('waits until run method is explicitly called', async () => {
        let hasCompleted = false;
        const puppeteerExtractor = new index_1.Extractor(async (ctx) => {
            const browser = await ctx.launchBrowser();
            const page = await browser.newPage();
            await page.goto('https://example.org');
            await page.close();
            hasCompleted = true;
        }, index_1.PuppeteerExtractorPlugin);
        await puppeteerExtractor.runInternal({});
        expect(hasCompleted).toBe(true);
    }, 30e3);
    it('should call close on puppeteer automatically', async () => {
        let closeSpy;
        const puppeteerExtractor = new index_1.Extractor(async (ctx) => {
            const browser = await ctx.launchBrowser();
            closeSpy = jest.spyOn(browser, 'close');
            const page = await browser.newPage();
            await page.goto('https://example.org');
        }, index_1.PuppeteerExtractorPlugin);
        await puppeteerExtractor.runInternal({});
        expect(closeSpy).toHaveBeenCalledTimes(1);
    });
    it('should emit close puppeteer on error', async () => {
        let closeSpy;
        const puppeteerExtractor = new index_1.Extractor(async (ctx) => {
            const browser = await ctx.launchBrowser();
            closeSpy = jest.spyOn(browser, 'close');
            const page = await browser.newPage();
            await page.goto('https://example.org').then(() => {
                throw new Error('testy');
            });
        }, index_1.PuppeteerExtractorPlugin);
        await expect(puppeteerExtractor.runInternal({})).rejects.toThrow('testy');
        expect(closeSpy).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=basic.test.js.map