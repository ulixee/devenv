"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConnectionFactory_1 = require("@ulixee/hero/connections/ConnectionFactory");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const datastore_1 = require("@ulixee/datastore");
const index_1 = require("../index");
const _MockConnectionToHeroCore_1 = require("./_MockConnectionToHeroCore");
afterAll(datastore_testing_1.Helpers.afterAll);
function createConnectionToHeroCore() {
    return new _MockConnectionToHeroCore_1.default(({ command, messageId: responseId }) => {
        if (command === 'Core.createSession') {
            return {
                responseId,
                data: { sessionId: 'session-id' },
            };
        }
        if (command === 'Session.getDetachedElements') {
            return {
                responseId,
                data: [],
            };
        }
        if (command === 'Session.getDetachedResources') {
            return {
                responseId,
                data: [],
            };
        }
        return { responseId, data: {} };
    });
}
describe('basic Datastore tests', () => {
    it('waits until run method is explicitly called', async () => {
        const connection = createConnectionToHeroCore();
        jest.spyOn(ConnectionFactory_1.default, 'createConnection').mockImplementationOnce(() => connection);
        const datastoreExtractor = new datastore_1.Extractor(async ({ Hero }) => {
            const hero = new Hero();
            await hero.goto('https://news.ycombinator.org');
            await hero.close();
        }, index_1.HeroExtractorPlugin);
        expect(connection.outgoingSpy.mock.calls).toHaveLength(0);
        await datastoreExtractor.runInternal({});
        const outgoingHeroCommands = connection.outgoingSpy.mock.calls;
        expect(outgoingHeroCommands.map(c => c[0].command)).toMatchObject([
            'Core.connect',
            'Core.createSession',
            'Tab.goto',
            'Session.close',
            'Core.disconnect',
        ]);
    });
    it('should call close on hero automatically', async () => {
        const connection = createConnectionToHeroCore();
        jest.spyOn(ConnectionFactory_1.default, 'createConnection').mockImplementationOnce(() => connection);
        const datastoreExtractor = new datastore_1.Extractor(async (context) => {
            const hero = new context.Hero();
            await hero.goto('https://news.ycombinator.org');
        }, index_1.HeroExtractorPlugin);
        await datastoreExtractor.runInternal({});
        const outgoingHeroCommands = connection.outgoingSpy.mock.calls;
        expect(outgoingHeroCommands.map(c => c[0].command)).toContain('Session.close');
    });
    it('should emit close hero on error', async () => {
        const connection = createConnectionToHeroCore();
        jest.spyOn(ConnectionFactory_1.default, 'createConnection').mockImplementationOnce(() => connection);
        const datastoreExtractor = new datastore_1.Extractor(async (context) => {
            const hero = new context.Hero();
            await hero.goto('https://news.ycombinator.org').then(() => {
                throw new Error('test');
            });
            await hero.interact('click');
        }, index_1.HeroExtractorPlugin);
        await expect(datastoreExtractor.runInternal({})).rejects.toThrow();
        const outgoingHeroCommands = connection.outgoingSpy.mock.calls;
        expect(outgoingHeroCommands.map(c => c[0].command)).toContain('Session.close');
    });
});
//# sourceMappingURL=basic.test.js.map