"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const Extractor_1 = require("@ulixee/datastore/lib/Extractor");
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
function sendToParent(response) {
    process.send(TypeSerializer_1.default.stringify(response));
}
function exit() {
    process.exit();
}
process.on('SIGINT', exit);
process.on('SIGTERM', exit);
process.on('SIGHUP', exit);
process.on('exit', exit);
process.on('message', async (messageJson) => {
    const message = TypeSerializer_1.default.parse(messageJson);
    await new Promise(process.nextTick);
    try {
        if (message.action === 'fetchMeta') {
            let datastore = requireDatastore(message.scriptPath);
            // wrap function in a default datastore
            if (datastore instanceof Extractor_1.default) {
                const extractorName = datastore.name ?? 'default';
                datastore = new datastore_1.default({
                    extractors: { [extractorName]: datastore },
                    tables: {},
                });
            }
            const metadata = datastore.metadata;
            const tableSeedlingsByName = {};
            for (const [name, table] of Object.entries(datastore.tables ?? {})) {
                tableSeedlingsByName[name] = table.seedlings;
            }
            return sendToParent({
                data: {
                    ...metadata,
                    tableSeedlingsByName,
                },
            });
        }
        // @ts-ignore
        throw new Error(`unknown action: ${message.action}`);
    }
    catch (error) {
        sendToParent({
            data: error,
        });
    }
});
function requireDatastore(scriptPath) {
    const imported = require(scriptPath); // eslint-disable-line import/no-dynamic-require
    const defaultExport = imported.default || imported;
    if (!defaultExport)
        throw new Error(`Datastore script has no default export`);
    return defaultExport;
}
//# sourceMappingURL=datastore-process.js.map