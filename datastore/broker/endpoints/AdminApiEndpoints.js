"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConnectionToClient_1 = require("@ulixee/net/lib/ConnectionToClient");
const DatabrokerAdminApis_1 = require("@ulixee/platform-specification/datastore/DatabrokerAdminApis");
const ValidationError_1 = require("@ulixee/platform-specification/utils/ValidationError");
class AdminApiEndpoints {
    constructor() {
        this.connections = new Set();
        this.handlersByCommand = {
            'Organization.create': async ({ name, balance }, ctx) => {
                const id = ctx.db.organizations.create(name, balance);
                return { id };
            },
            'Organization.editName': async ({ organizationId, name }, ctx) => {
                ctx.db.organizations.updateName(organizationId, name);
                return { success: true };
            },
            'Organization.delete': async ({ organizationId }, ctx) => {
                ctx.db.organizations.delete(organizationId);
                return { success: true };
            },
            'Organization.grant': async ({ organizationId, amount }, ctx) => {
                ctx.db.organizations.grant(organizationId, amount);
                return { success: true };
            },
            'Organization.get': async ({ organizationId }, ctx) => {
                return ctx.db.organizations.get(organizationId);
            },
            'Organization.list': async (_, ctx) => {
                return ctx.db.organizations.list();
            },
            'Organization.users': async ({ organizationId }, ctx) => {
                return ctx.db.users.listByOrganization(organizationId);
            },
            'System.overview': async (_, ctx) => {
                const localchainOverview = await ctx.localchain.accountOverview();
                return {
                    localchainBalance: localchainOverview.balance,
                    localchainAddress: localchainOverview.address,
                    totalOrganizationBalance: ctx.db.organizations.totalBalance(),
                    grantedBalance: ctx.db.organizations.totalGranted(),
                    organizations: ctx.db.organizations.count(),
                    users: ctx.db.users.count(),
                    channelHolds: ctx.db.channelHolds.count(),
                    openChannelHolds: ctx.db.channelHolds.countOpen(),
                    balancePendingChannelHoldSettlement: ctx.db.channelHolds.pendingBalance(),
                };
            },
            'User.create': async ({ name, organizationId, identity }, ctx) => {
                ctx.db.users.create(identity, name, organizationId);
                return { success: true };
            },
            'User.editName': async ({ identity, name }, ctx) => {
                ctx.db.users.editName(identity, name);
                return { success: true };
            },
            'User.delete': async ({ identity }, ctx) => {
                ctx.db.users.delete(identity);
                return { success: true };
            },
            'WhitelistedDomains.list': async (_, ctx) => {
                return ctx.datastoreWhitelist.list();
            },
            'WhitelistedDomains.add': async ({ domain }, ctx) => {
                ctx.datastoreWhitelist.add(domain);
                return { success: true };
            },
            'WhitelistedDomains.delete': async ({ domain }, ctx) => {
                ctx.datastoreWhitelist.delete(domain);
                return { success: true };
            },
        };
        for (const [api, handler] of Object.entries(this.handlersByCommand)) {
            const validationSchema = DatabrokerAdminApis_1.DatabrokerAdminApisSchema[api];
            this.handlersByCommand[api] = validateThenRun.bind(this, api, handler.bind(this), validationSchema);
        }
    }
    addConnection(transport, context) {
        const connection = new ConnectionToClient_1.default(transport, this.handlersByCommand);
        connection.handlerMetadata = context;
        this.connections.add(connection);
        connection.once('disconnected', () => {
            this.connections.delete(connection);
        });
        return connection;
    }
}
exports.default = AdminApiEndpoints;
function validateThenRun(api, handler, validationSchema, args, context) {
    if (!validationSchema)
        return handler(args, context);
    // NOTE: mutates `errors`
    const result = validationSchema.args.safeParse(args);
    if (result.success === true)
        return handler(result.data, context);
    throw ValidationError_1.default.fromZodValidation(`The parameters for this command (${api}) are invalid.`, result.error);
}
//# sourceMappingURL=AdminApiEndpoints.js.map