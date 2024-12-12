"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidatingApiHandler_1 = require("@ulixee/platform-specification/utils/ValidatingApiHandler");
const DatabrokerApis_1 = require("@ulixee/platform-specification/datastore/DatabrokerApis");
class DatabrokerApiHandler extends ValidatingApiHandler_1.default {
    constructor(command, args) {
        super(command, DatabrokerApis_1.DatabrokerApisSchema, args);
        this.apiHandler = args.handler.bind(this);
    }
}
exports.default = DatabrokerApiHandler;
//# sourceMappingURL=DatabrokerApiHandler.js.map