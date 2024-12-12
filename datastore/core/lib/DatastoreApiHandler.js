"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidatingApiHandler_1 = require("@ulixee/platform-specification/utils/ValidatingApiHandler");
const DatastoreApis_1 = require("@ulixee/platform-specification/datastore/DatastoreApis");
class DatastoreApiHandler extends ValidatingApiHandler_1.default {
    constructor(command, args) {
        super(command, DatastoreApis_1.DatastoreApiSchemas, args);
        this.apiHandler = args.handler.bind(this);
    }
}
exports.default = DatastoreApiHandler;
//# sourceMappingURL=DatastoreApiHandler.js.map