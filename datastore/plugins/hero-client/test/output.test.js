"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Resolvable_1 = require("@ulixee/commons/lib/Resolvable");
const datastore_1 = require("@ulixee/datastore");
const datastore_testing_1 = require("@ulixee/datastore-testing");
// eslint-disable-next-line import/no-extraneous-dependencies
const OutputRebuilder_1 = require("@ulixee/desktop-core/lib/OutputRebuilder");
const hero_1 = require("@ulixee/hero");
const hero_core_1 = require("@ulixee/hero-core");
const ConnectionFactory_1 = require("@ulixee/hero/connections/ConnectionFactory");
const TransportBridge_1 = require("@ulixee/net/lib/TransportBridge");
const schema_1 = require("@ulixee/schema");
const index_1 = require("../index");
const _MockConnectionToHeroCore_1 = require("./_MockConnectionToHeroCore");
let connectionToCore;
const core = new hero_core_1.default();
beforeAll(() => {
    const bridge = new TransportBridge_1.default();
    core.addConnection(bridge.transportToClient);
    connectionToCore = new hero_1.ConnectionToHeroCore(bridge.transportToCore);
    datastore_testing_1.Helpers.onClose(() => connectionToCore.disconnect(), true);
});
afterAll(datastore_testing_1.Helpers.afterAll);
afterEach(datastore_testing_1.Helpers.afterEach);
describe('basic output tests', () => {
    it('sends output changes to core', async () => {
        const connection = new _MockConnectionToHeroCore_1.default(({ command, messageId: responseId }) => {
            const response = {
                responseId,
                data: {},
            };
            if (command === 'Core.createSession')
                response.data = { sessionId: 'session-id' };
            return response;
        });
        jest.spyOn(ConnectionFactory_1.default, 'createConnection').mockImplementationOnce(() => connection);
        await new datastore_1.Extractor(async (ctx) => {
            const output = new ctx.Output();
            output.test = true;
            const hero = new ctx.Hero();
            await hero.sessionId;
        }, index_1.HeroExtractorPlugin).runInternal({});
        const outgoingCommands = connection.outgoingSpy.mock.calls;
        expect(outgoingCommands.map(c => c[0].command)).toMatchObject([
            'Core.connect',
            'Core.createSession',
            'Session.flush',
            'Session.close',
            'Core.disconnect',
        ]);
        const outputChange = outgoingCommands[2][0].recordCommands[0].args[1];
        expect(outputChange).toMatchObject({
            type: 'insert',
            value: true,
            path: '[0,"test"]',
            timestamp: expect.any(Number),
            lastCommandId: 0,
        });
    });
    it('records object changes', async () => {
        const schema = {
            output: {
                started: (0, schema_1.date)(),
                page: (0, schema_1.object)({
                    fields: {
                        url: (0, schema_1.string)(),
                        title: (0, schema_1.string)({ optional: false }),
                        data: (0, schema_1.buffer)({ optional: true }),
                    },
                }),
            },
        };
        const sessionIdPromise = new Resolvable_1.default();
        const started = new Date();
        let stringified;
        const url = 'https://example.org';
        const title = 'Example Domain';
        const extractor = new datastore_1.Extractor({
            async run({ Output, Hero }) {
                const output = new Output();
                output.started = started;
                output.page = {
                    url,
                    title,
                };
                output.page.data = Buffer.from('I am buffer');
                stringified = JSON.stringify(output);
                const hero = new Hero();
                const sessionId = await hero.sessionId;
                sessionIdPromise.resolve(sessionId);
            },
            schema,
        }, index_1.HeroExtractorPlugin);
        await extractor.runInternal({ connectionToCore });
        const sessionId = await sessionIdPromise;
        const db = await core.sessionRegistry.get(sessionId);
        const outputs = db.output.all();
        expect(outputs).toHaveLength(4);
        expect(outputs[1]).toEqual({
            type: 'insert',
            value: expect.any(Date),
            timestamp: expect.any(Number),
            lastCommandId: expect.any(Number),
            path: '[0,"started"]',
        });
        expect(outputs[2]).toEqual({
            type: 'insert',
            value: { url, title },
            timestamp: expect.any(Number),
            lastCommandId: 0,
            path: '[0,"page"]',
        });
        expect(outputs[3]).toEqual({
            type: 'insert',
            value: Buffer.from('I am buffer'),
            timestamp: expect.any(Number),
            lastCommandId: 0,
            path: '[0,"page","data"]',
        });
        expect(stringified).toEqual(JSON.stringify({
            started,
            page: {
                url,
                title,
                data: Buffer.from('I am buffer'),
            },
        }));
        const rebuilder = new OutputRebuilder_1.default();
        rebuilder.applyChanges(outputs);
        expect(rebuilder.getLatestSnapshot().output).toEqual([
            {
                started,
                page: {
                    url,
                    title,
                    data: Buffer.from('I am buffer'),
                },
            },
        ]);
    });
    it('can add observables directly', async () => {
        const sessionIdPromise = new Resolvable_1.default();
        let stringified;
        const extractor = new datastore_1.Extractor(async ({ Output, Hero }) => {
            const output = new Output();
            const record = (0, datastore_1.Observable)({});
            output.records = [record];
            record.test = 1;
            record.watch = 2;
            record.any = { more: true };
            stringified = JSON.stringify(output);
            const hero = new Hero();
            const sessionId = await hero.sessionId;
            sessionIdPromise.resolve(sessionId);
        }, index_1.HeroExtractorPlugin);
        await extractor.runInternal({ connectionToCore });
        const sessionId = await sessionIdPromise;
        const db = await core.sessionRegistry.get(sessionId);
        const outputs = db.output.all();
        expect(outputs).toHaveLength(5);
        expect(outputs[1]).toEqual({
            type: 'insert',
            value: [{}],
            timestamp: expect.any(Number),
            lastCommandId: 0,
            path: '[0,"records"]',
        });
        expect(stringified).toEqual(JSON.stringify({
            records: [
                {
                    test: 1,
                    watch: 2,
                    any: { more: true },
                },
            ],
        }));
    });
});
//# sourceMappingURL=output.test.js.map