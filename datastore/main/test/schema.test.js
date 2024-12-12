"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@ulixee/schema");
const Resolvable_1 = require("@ulixee/commons/lib/Resolvable");
const moment = require("moment");
const index_1 = require("../index");
describe('Schemas', () => {
    it('will validate input to a funner', async () => {
        const schema = {
            input: {
                req: (0, schema_1.string)(),
            },
        };
        const extractor = new index_1.Extractor({
            async run(ctx) {
                ctx.Output.emit({ test: true });
            },
            schema,
        });
        await expect(extractor.runInternal({ input: {} })).rejects.toThrow('input did not match');
    });
    it('will supply defaults to params if not given', async () => {
        const schema = (0, index_1.ExtractorSchema)({
            input: {
                plan: (0, schema_1.boolean)(),
                for: (0, schema_1.number)(),
                a: (0, schema_1.string)({ optional: true }),
                date: (0, schema_1.string)({ format: 'date' }),
            },
            inputExamples: [
                {
                    date: (0, schema_1.dateAdd)(1, 'days'),
                    plan: true,
                },
            ],
        });
        const runResolver = new Resolvable_1.default();
        const extractor = new index_1.Extractor({
            async run(ctx) {
                runResolver.resolve(ctx.input);
                ctx.Output.emit({ test: true });
            },
            schema,
        });
        await expect(extractor.runInternal({ input: { plan: false, for: 1 } })).resolves.toBeTruthy();
        const input = await runResolver;
        expect(input.date).toBe(moment().add(1, 'days').format('YYYY-MM-DD'));
        expect(input.plan).toBe(false);
        expect(input.a).toBeUndefined();
    });
    it('will validate output errors for a extractor', async () => {
        const schema = {
            output: {
                test: (0, schema_1.string)(),
            },
        };
        const extractor = new index_1.Extractor({
            async run(ctx) {
                // @ts-expect-error
                ctx.Output.emit({ test: 1 });
            },
            schema,
        });
        await expect(extractor.runInternal({})).rejects.toThrow('Output did not match');
    });
    it('will validate output and abort at the first error', async () => {
        const schema = {
            output: {
                str: (0, schema_1.string)(),
                arr: (0, schema_1.array)((0, schema_1.object)({
                    num: (0, schema_1.number)(),
                    bool: (0, schema_1.boolean)(),
                })),
            },
        };
        let counter = 0;
        const extractor = new index_1.Extractor({
            schema,
            async run({ Output }) {
                const output = new Output();
                output.str = 'test';
                counter += 1;
                output.arr = [];
                counter += 1;
                // @ts-expect-error
                output.arr.push({ num: 't', bool: true });
                counter += 1;
            },
        });
        await expect(extractor.runInternal({})).rejects.toThrow('Output did not match');
        expect(counter).toBe(2);
    });
    it('will allow valid output for a datastore', async () => {
        const schema = {
            input: {
                url: (0, schema_1.string)({ format: 'url' }),
            },
            output: {
                test: (0, schema_1.string)(),
            },
        };
        const extractor = new index_1.Extractor({
            async run(ctx) {
                new ctx.Output({ test: 'good to go' });
            },
            schema,
        });
        await expect(extractor.runInternal({ input: { url: 'https://url.com' } })).resolves.toEqual([
            {
                test: 'good to go',
            },
        ]);
    });
});
//# sourceMappingURL=schema.test.js.map