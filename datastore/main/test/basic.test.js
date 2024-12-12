"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
describe('basic Datastore tests', () => {
    it('waits until run method is explicitly called', async () => {
        let wasRun = false;
        const extractor = new index_1.Extractor(async (ctx) => {
            new ctx.Output({ ran: 'success' });
            wasRun = true;
        });
        await extractor.runInternal({});
        await new Promise(resolve => process.nextTick(resolve));
        expect(await wasRun).toBe(true);
    });
});
//# sourceMappingURL=basic.test.js.map