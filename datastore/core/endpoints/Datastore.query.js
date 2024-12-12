"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatastoreApiHandler_1 = require("../lib/DatastoreApiHandler");
const QueryRunner_1 = require("../lib/QueryRunner");
exports.default = new DatastoreApiHandler_1.default('Datastore.query', {
    async handler(request, context) {
        request.boundValues ??= [];
        const { sql, boundValues, queryId, payment, authentication, version, id } = request;
        const queryRunner = new QueryRunner_1.default(context, request);
        const datastore = await queryRunner.openDatastore();
        const innerOptions = {
            payment,
            authentication,
            version,
            id,
            queryId,
        };
        const finalResult = await datastore
            .queryInternal(sql, boundValues, innerOptions, {
            async beforeQuery({ sqlParser, entityCalls }) {
                if (!sqlParser.isSelect())
                    throw new Error('Invalid SQL command');
                for (const name of sqlParser.tableNames) {
                    const table = datastore.tables[name];
                    if (!table)
                        throw new Error(`There is no table named "${name}" in this datastore.`);
                    if (!table.isPublic)
                        throw new Error(`Table ${name} is not publicly accessible.`);
                }
                const didFail = await queryRunner.beforeAll(sql, boundValues, entityCalls);
                if (didFail)
                    throw new BreakWithResultError(didFail);
            },
            async onFunction(...args) {
                return await queryRunner.runFunction(...args);
            },
            async onPassthroughTable(...args) {
                return await queryRunner.onPassthroughTable(...args);
            },
            beforeStorageEngine(options) {
                return queryRunner.beforeStorageEngine(options);
            },
        })
            .catch(error => error);
        if (finalResult instanceof BreakWithResultError) {
            return finalResult.result;
        }
        await new Promise(setImmediate);
        return queryRunner.finalize(sql, boundValues, finalResult);
    },
});
class BreakWithResultError extends Error {
    constructor(result) {
        super();
        this.result = result;
    }
}
//# sourceMappingURL=Datastore.query.js.map