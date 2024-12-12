"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChannelHoldApis_1 = require("@ulixee/platform-specification/datastore/ChannelHoldApis");
const ValidatingApiHandler_1 = require("@ulixee/platform-specification/utils/ValidatingApiHandler");
exports.default = new ValidatingApiHandler_1.default('ChannelHold.register', ChannelHoldApis_1.ChannelHoldApisSchema, {
    async handler(request, context) {
        const manifest = await context.datastoreRegistry.get(request.datastoreId, null, false);
        if (!manifest)
            throw new Error(`Unknown datastore requested ${request.datastoreId}`);
        await context.argonPaymentProcessor.importChannelHold(request, manifest);
        return { accepted: true };
    },
});
//# sourceMappingURL=ChannelHold.register.js.map