"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const localExtractor_1 = require("./datastores/localExtractor");
test('should be able to query a datastore using sql', async () => {
    const client = __1.default.forExtractor(localExtractor_1.default);
    const results = await client.query('SELECT * FROM test(shouldTest => $1)', [true]);
    expect(results).toEqual([
        {
            testerEcho: true,
            lastName: 'Clark',
            greeting: 'Hello world',
        },
    ]);
});
test('should be able to run a datastore function', async () => {
    const client = __1.default.forExtractor(localExtractor_1.default);
    const testTypes = () => {
        // @ts-expect-error
        void client.run({ notValid: 1 });
    };
    const results = await client.run({ shouldTest: true });
    expect(results).toEqual([
        {
            testerEcho: true,
            lastName: 'Clark',
            greeting: 'Hello world',
        },
    ]);
    // @ts-expect-error - Test typing works
    const test = results[0].testerEcho;
    expect(test).not.toBe(expect.any(Number));
    // @ts-expect-error
    const first = results[0].firstName;
    expect(first).toBeUndefined();
});
//# sourceMappingURL=localExtractor.test.js.map