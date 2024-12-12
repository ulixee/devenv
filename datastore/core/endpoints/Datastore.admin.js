"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const errors_1 = require("@ulixee/platform-utils/lib/errors");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const DatastoreApiHandler_1 = require("../lib/DatastoreApiHandler");
const errors_2 = require("../lib/errors");
exports.default = new DatastoreApiHandler_1.default('Datastore.admin', {
    async handler(request, context) {
        const { adminSignature, adminIdentity, adminFunction, functionArgs } = request;
        const datastoreVersion = await context.datastoreRegistry.get(request.id, request.version);
        const approvedAdmins = new Set([
            ...datastoreVersion.adminIdentities,
            ...context.configuration.cloudAdminIdentities,
        ]);
        if (!adminIdentity || !approvedAdmins.has(adminIdentity)) {
            throw new errors_2.InvalidPermissionsError(`Your Identity is not approved to administer this Datastore.`);
        }
        const { ownerType, ownerName, functionName } = adminFunction;
        const message = DatastoreApiClient_1.default.createAdminFunctionMessage(request.id, adminIdentity, ownerType, ownerName, functionName, functionArgs);
        if (!Identity_1.default.verify(adminIdentity, message, adminSignature)) {
            throw new errors_1.InvalidSignatureError('Your Admin signature is invalid for this function call.');
        }
        const storage = context.storageEngineRegistry.get(datastoreVersion, {
            id: request.id,
            version: request.version,
            queryId: context.connectionToClient?.transport.remoteId ?? 'admin',
        });
        const datastore = await context.vm.open(datastoreVersion.runtimePath, storage, datastoreVersion);
        if (adminFunction.ownerType === 'datastore') {
            if (typeof datastore[functionName] !== 'function')
                throw new Error(`An admin function called ${functionName} could not be found`);
            return datastore[functionName](...functionArgs);
        }
        const ownerCollection = `${adminFunction.ownerType}s`;
        const owner = datastore[ownerCollection][ownerName];
        if (!owner) {
            throw new Error(`The ${adminFunction.ownerType} ${ownerCollection}.${ownerName} could not be found in this Datastore.`);
        }
        if (typeof owner[functionName] !== 'function')
            throw new Error(`An admin function on ${ownerCollection}.${ownerName} called ${functionName} could not be found`);
        return await owner[functionName](...functionArgs);
    },
});
//# sourceMappingURL=Datastore.admin.js.map