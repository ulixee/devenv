"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const localDatastore_1 = require("./datastores/localDatastore");
test('should be able to query a datastore using sql', async () => {
    const client = __1.default.forDatastore(localDatastore_1.default);
    const results = await client.query('SELECT * FROM test(shouldTest => $1) LEFT JOIN testers on testers.lastName=test.lastName', [true]);
    expect(results).toEqual([
        {
            testerEcho: true,
            lastName: 'Clark',
            greeting: 'Hello world',
            firstName: 'Caleb',
            isTester: true,
        },
    ]);
});
test('should be able to run a datastore extractor', async () => {
    const client = __1.default.forDatastore(localDatastore_1.default);
    // @ts-expect-error - must be a valid function
    await expect(() => client.run('test1', {})).toThrow();
    // @ts-expect-error
    await expect(client.run('test', { notValid: 1 })).rejects.toThrow('Extractor input');
    const results = await client.run('test', { shouldTest: true });
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
//# sourceMappingURL=localDatastore.test.js.map