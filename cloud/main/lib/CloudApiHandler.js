"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidatingApiHandler_1 = require("@ulixee/platform-specification/utils/ValidatingApiHandler");
const CloudApis_1 = require("@ulixee/platform-specification/cloud/CloudApis");
class CloudApiHandler extends ValidatingApiHandler_1.default {
    constructor(command, args) {
        super(command, CloudApis_1.CloudApiSchemas, args);
        this.apiHandler = args.handler.bind(this);
    }
}
exports.default = CloudApiHandler;
//# sourceMappingURL=CloudApiHandler.js.map