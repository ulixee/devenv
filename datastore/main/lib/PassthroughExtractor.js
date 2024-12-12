"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = require("node:assert");
const Extractor_1 = require("./Extractor");
const ResultIterable_1 = require("./ResultIterable");
class PassthroughExtractor extends Extractor_1.default {
    constructor(components, ...plugins) {
        super({ ...components }, ...plugins);
        this.components.run = this.run.bind(this);
        this.basePrice = BigInt(components.upcharge ?? 0);
        (0, node_assert_1.strict)(components.remoteExtractor, 'A remote extractor name is required');
        (0, node_assert_1.strict)(components.remoteExtractor.includes('.'), 'A remote function source is required');
        this.passThroughComponents = components;
        const [source, remoteExtractor] = components.remoteExtractor.split('.');
        this.remoteExtractor = remoteExtractor;
        this.remoteSource = source;
    }
    async run(context) {
        await this.injectRemoteClient();
        if (this.passThroughComponents.onRequest) {
            await this.passThroughComponents.onRequest(context);
        }
        const queryResult = this.upstreamClient.stream(this.remoteDatastoreId, this.remoteVersion, this.remoteExtractor, context.input, {
            paymentService: this.datastoreInternal.remotePaymentService,
            authentication: context.authentication,
            affiliateId: context.datastoreAffiliateId,
            domain: this.remoteDomain,
            queryId: context.queryId,
            onQueryResult: context.onQueryResult,
        });
        if (this.passThroughComponents.onResponse) {
            const secondPassResults = new ResultIterable_1.default();
            const responseContext = context;
            responseContext.stream = secondPassResults;
            const onResponsePromiseOrError = this.passThroughComponents
                .onResponse(responseContext)
                .catch(err => err);
            try {
                for await (const result of queryResult) {
                    secondPassResults.push(result);
                }
                secondPassResults.done();
            }
            catch (error) {
                secondPassResults.reject(error);
            }
            const response = await onResponsePromiseOrError;
            if (response instanceof Error)
                throw response;
        }
        else {
            for await (const result of queryResult) {
                context.Output.emit(result);
            }
        }
        const finalResult = await queryResult.resultMetadata;
        if (finalResult.latestVersion !== this.remoteVersion) {
            console.warn('Newer Datastore Version is available', {
                newVersion: finalResult.latestVersion,
                usingVersion: this.remoteVersion,
                host: this.passThroughComponents.remoteExtractor,
            });
        }
    }
    async injectRemoteClient() {
        if (this.upstreamClient)
            return;
        const { datastoreHost, client } = await this.datastoreInternal.getRemoteApiClient(this.remoteSource);
        this.remoteDatastoreId = datastoreHost.datastoreId;
        this.remoteVersion = datastoreHost.version;
        this.remoteDomain = datastoreHost.domain;
        this.upstreamClient = client;
    }
}
exports.default = PassthroughExtractor;
//# sourceMappingURL=PassthroughExtractor.js.map