"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const datastore = new datastore_1.default({
    id: 'datastore-registry-service1',
    version: '0.0.1',
    extractors: {
        streamer: new datastore_1.Extractor(async (ctx) => {
            for (let i = 0; i < 3; i += 1) {
                ctx.Output.emit({ record: i });
            }
        }),
    },
});
exports.default = datastore;
//# sourceMappingURL=datastoreRegistryService1.js.map