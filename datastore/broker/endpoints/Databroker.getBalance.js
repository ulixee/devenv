"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatabrokerApiHandler_1 = require("../lib/DatabrokerApiHandler");
exports.default = new DatabrokerApiHandler_1.default('Databroker.getBalance', {
    async handler(request, context) {
        const organizationId = context.db.users.getOrganizationId(request.identity);
        if (!organizationId)
            throw new Error('User not found');
        const balance = context.db.organizations.get(organizationId).balance;
        return { balance };
    },
});
//# sourceMappingURL=Databroker.getBalance.js.map