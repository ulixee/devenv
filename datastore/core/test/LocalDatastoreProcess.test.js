"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const LocalDatastoreProcess_1 = require("../lib/LocalDatastoreProcess");
test('it can extract the datastore runtime', async () => {
    const scriptPath = Path.resolve(__dirname, 'datastores/meta.js');
    const datastoreProcess = new LocalDatastoreProcess_1.default(scriptPath);
    const meta = await datastoreProcess.fetchMeta();
    await datastoreProcess.close();
    expect(meta.coreVersion).toBe('1.0.0');
});
test('it can extract the datastore schema', async () => {
    const scriptPath = Path.resolve(__dirname, 'datastores/schema.js');
    const datastoreProcess = new LocalDatastoreProcess_1.default(scriptPath);
    const meta = await datastoreProcess.fetchMeta();
    await datastoreProcess.close();
    expect(meta.extractorsByName.default.schema).toEqual({
        input: {
            field: {
                typeName: 'string',
                minLength: 1,
                description: 'a field you should use',
            },
        },
        output: {
            success: {
                typeName: 'boolean',
            },
        },
    });
});
//# sourceMappingURL=LocalDatastoreProcess.test.js.map