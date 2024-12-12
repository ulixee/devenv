"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatastoreApiHandler_1 = require("../lib/DatastoreApiHandler");
const QueryRunner_1 = require("../lib/QueryRunner");
exports.default = new DatastoreApiHandler_1.default('Datastore.stream', {
    async handler(request, context) {
        const name = request.name;
        const queryRunner = new QueryRunner_1.default(context, request);
        const datastore = await queryRunner.openDatastore();
        const datastoreFunction = datastore.extractors[name] ?? datastore.crawlers[name];
        const datastoreTable = datastore.tables[name];
        if (!datastoreFunction && !datastoreTable) {
            throw new Error(`${name} is not a valid Entity name for this Datastore.`);
        }
        const query = `stream(${name})`;
        const didFail = await queryRunner.beforeAll(query, request.input, [name]);
        if (didFail)
            return didFail;
        const callbacks = {
            async onFunction(...args) {
                return await queryRunner.runFunction(...args);
            },
            async onPassthroughTable(...args) {
                return await queryRunner.onPassthroughTable(...args);
            },
            beforeStorageEngine(options) {
                return queryRunner.beforeStorageEngine(options);
            },
        };
        try {
            let streamer;
            if (datastoreFunction) {
                streamer = datastoreFunction.runInternal(request, callbacks);
            }
            else {
                let metadata;
                streamer = await datastoreTable.fetchInternal({
                    ...request,
                    onQueryResult(result) {
                        metadata ??= result.metadata;
                    },
                }, callbacks);
                const price = datastore.tables[name].basePrice;
                if (price)
                    queryRunner.paymentsProcessor.trackCallResult(name, price, metadata);
            }
            for await (const record of streamer) {
                context.connectionToClient.sendEvent({
                    listenerId: request.id,
                    data: record,
                    eventType: 'Stream.output',
                });
            }
            await new Promise(setImmediate);
            return queryRunner.finalize(query, request.input, streamer.results);
        }
        catch (error) {
            return queryRunner.finalize(query, request.input, error);
        }
    },
});
//# sourceMappingURL=Datastore.stream.js.map