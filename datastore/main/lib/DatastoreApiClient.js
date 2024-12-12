"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bufferUtils_1 = require("@ulixee/commons/lib/bufferUtils");
const hashUtils_1 = require("@ulixee/commons/lib/hashUtils");
const TimedCache_1 = require("@ulixee/commons/lib/TimedCache");
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
const utils_1 = require("@ulixee/commons/lib/utils");
const localchain_1 = require("@argonprotocol/localchain");
const net_1 = require("@ulixee/net");
const datastore_1 = require("@ulixee/platform-specification/datastore");
const ChannelHoldApis_1 = require("@ulixee/platform-specification/datastore/ChannelHoldApis");
const ValidationError_1 = require("@ulixee/platform-specification/utils/ValidationError");
const nanoid_1 = require("nanoid");
const installDatastoreSchema_1 = require("../types/installDatastoreSchema");
const CreditsTable_1 = require("./CreditsTable");
const DatastoreLookup_1 = require("./DatastoreLookup");
const PricingManager_1 = require("./PricingManager");
const QueryLog_1 = require("./QueryLog");
const ResultIterable_1 = require("./ResultIterable");
class DatastoreApiClient {
    constructor(host, options) {
        this.validateApiParameters = true;
        this.activeStreamByQueryId = new Map();
        this.manifestByDatastoreUrl = new Map();
        this.options = options ?? {};
        this.options.consoleLogErrors ??= process.env.NODE_ENV === 'test';
        this.options.storeQueryLog ??= process.env.NODE_ENV !== 'test';
        const url = (0, utils_1.toUrl)(host);
        this.host = url.host;
        const transport = new net_1.WsTransportToCore(`ws://${url.host}/datastore`);
        this.connectionToCore = new net_1.ConnectionToCore(transport);
        this.connectionToCore.on('event', this.onEvent.bind(this));
        if (this.options.storeQueryLog) {
            this.queryLog = new QueryLog_1.default();
        }
        this.pricing = new PricingManager_1.default(this);
    }
    async disconnect() {
        await Promise.all([this.queryLog?.close(), this.connectionToCore.disconnect()]);
    }
    async getMetaAndSchema(id, version) {
        return await this.runApi('Datastore.meta', {
            id,
            version,
            includeSchemasAsJson: true,
        });
    }
    async registerChannelHold(datastoreId, balanceChange) {
        const result = await this.runApi('ChannelHold.register', {
            channelHold: balanceChange,
            datastoreId,
        });
        return { accepted: result.accepted };
    }
    async getMeta(id, version) {
        const key = `${this.host}/${id}@${version}`;
        let cache = this.manifestByDatastoreUrl.get(key);
        if (!cache) {
            // cache for 24 hours
            cache = new TimedCache_1.default(24 * 60 * 60e3);
            this.manifestByDatastoreUrl.set(key, cache);
        }
        cache.value ??= await this.runApi('Datastore.meta', {
            id,
            version,
            includeSchemasAsJson: false,
        });
        return cache.value;
    }
    async install(id, version, alias) {
        const meta = await this.getMeta(id, version);
        if (meta.extractorsByName && meta.schemaInterface) {
            (0, installDatastoreSchema_1.default)(meta.schemaInterface, id, version);
        }
        if (alias) {
            (0, installDatastoreSchema_1.addDatastoreAlias)(alias, id, version);
        }
        return meta;
    }
    stream(id, version, name, input, options) {
        options ??= {};
        const queryId = options?.queryId ?? (0, nanoid_1.nanoid)(12);
        const startDate = new Date();
        const results = new ResultIterable_1.default();
        this.activeStreamByQueryId.set(id, results);
        const host = this.connectionToCore.transport.host;
        const hostIdentity = null; // TODO: exchange identity
        const query = {
            id,
            version,
            queryId,
            name,
            input,
            authentication: options.authentication,
            affiliateId: options.affiliateId,
        };
        let paymentService = options.paymentService;
        (async () => {
            const price = await this.pricing.getEntityPrice(id, version, name);
            try {
                if (price <= 0)
                    paymentService = null;
                const payment = await paymentService?.reserve({
                    host,
                    id,
                    version,
                    microgons: price,
                    recipient: (await this.getMeta(id, version)).payment,
                    domain: options.domain,
                });
                if (payment) {
                    query.payment = payment;
                }
                const result = await this.runApi('Datastore.stream', query).catch(async (err) => {
                    await paymentService?.finalize({ ...payment, finalMicrogons: 0n });
                    throw err;
                });
                await paymentService?.finalize({
                    ...payment,
                    finalMicrogons: result.metadata.microgons,
                });
                if (options.onQueryResult)
                    await options.onQueryResult(result);
                result.queryId = queryId;
                if (result.runError)
                    results.reject(result.runError, result);
                else
                    results.done(result);
                this.queryLog?.log(query, startDate, results.results, result.metadata, host, hostIdentity);
            }
            catch (error) {
                results.reject(error);
                this.queryLog?.log(query, startDate, null, null, host, hostIdentity, error);
            }
            finally {
                this.activeStreamByQueryId.delete(id);
            }
        })().catch(results.reject);
        return results;
    }
    /**
     * NOTE: any caller must handle tracking local balances of Credits and removing them if they're depleted!
     */
    async query(id, version, sql, options) {
        const startDate = new Date();
        options ??= {};
        const queryId = options?.queryId ?? (0, nanoid_1.nanoid)(12);
        const price = await this.pricing.getQueryPrice(id, version, sql);
        const host = this.connectionToCore.transport.host;
        const paymentInfo = (await this.getMeta(id, version)).payment;
        let paymentService = options.paymentService;
        if (price <= 0)
            paymentService = null;
        const query = {
            id,
            queryId,
            version,
            sql,
            boundValues: options.boundValues ?? [],
            payment: null,
            authentication: options.authentication,
            affiliateId: options.affiliateId,
        };
        const hostIdentity = null; // TODO: exchange identity
        try {
            query.payment = await paymentService?.reserve({
                id,
                version,
                host,
                microgons: price,
                recipient: paymentInfo,
                domain: options.domain,
            });
        }
        catch (error) {
            this.queryLog?.log(query, startDate, null, null, host, hostIdentity, error);
            throw error;
        }
        let result;
        try {
            result = await this.runApi('Datastore.query', query);
        }
        catch (error) {
            // this will only happen if the query is rejected by the server or before getting there. We need to rollback payment
            if (query.payment)
                await paymentService?.finalize({ ...query.payment, finalMicrogons: 0 });
            this.queryLog?.log(query, startDate, null, null, host, hostIdentity, error);
            throw error;
        }
        if (options.onQueryResult)
            await options.onQueryResult(result);
        if (query.payment)
            await paymentService?.finalize({
                ...query.payment,
                finalMicrogons: result.metadata.microgons,
            });
        this.queryLog?.log(query, startDate, result.outputs, result.metadata, host, hostIdentity);
        if (result.runError) {
            throw result.runError;
        }
        result.queryId = queryId;
        return result;
    }
    async upload(compressedDbx, options = {}) {
        options.timeoutMs ??= 120e3;
        const { timeoutMs } = options;
        let adminSignature;
        let adminIdentity;
        if (options.identity) {
            const identity = options.identity;
            adminIdentity = identity.bech32;
            const message = DatastoreApiClient.createUploadSignatureMessage(compressedDbx);
            adminSignature = identity.sign(message);
        }
        else if (options.forwardedSignature) {
            ({ adminIdentity, adminSignature } = options.forwardedSignature);
        }
        const { success } = await this.runApi('Datastore.upload', {
            compressedDbx,
            adminSignature,
            adminIdentity,
        }, timeoutMs);
        return { success };
    }
    async download(id, version, identity, options = {}) {
        options.timeoutMs ??= 120e3;
        const requestDate = new Date();
        const { timeoutMs } = options;
        const adminIdentity = identity.bech32;
        const message = DatastoreApiClient.createDownloadSignatureMessage(id, version, requestDate.getTime());
        const adminSignature = identity.sign(message);
        return await this.runApi('Datastore.download', {
            id,
            version,
            requestDate,
            adminSignature,
            adminIdentity,
        }, timeoutMs);
    }
    async startDatastore(id, dbxPath, watch = false) {
        const { success } = await this.runApi('Datastore.start', {
            id,
            dbxPath,
            watch,
        });
        return { success };
    }
    async getCreditsBalance(id, version, creditId) {
        return await this.runApi('Datastore.creditsBalance', {
            id,
            version,
            creditId,
        });
    }
    async createCredits(id, version, microgons, adminIdentity) {
        return await this.administer(id, version, adminIdentity, {
            ownerType: 'table',
            ownerName: CreditsTable_1.default.tableName,
            functionName: 'create',
        }, [BigInt(microgons)]);
    }
    async administer(id, version, adminIdentity, adminFunction, functionArgs) {
        const message = DatastoreApiClient.createAdminFunctionMessage(id, adminIdentity.bech32, adminFunction.ownerType, adminFunction.ownerName, adminFunction.functionName, functionArgs);
        const adminSignature = adminIdentity.sign(message);
        return await this.runApi('Datastore.admin', {
            id,
            version,
            adminSignature,
            adminFunction,
            adminIdentity: adminIdentity.bech32,
            functionArgs,
        });
    }
    request(command, args, timeoutMs) {
        return this.connectionToCore.sendRequest({ command, args: [args] }, timeoutMs);
    }
    onEvent(evt) {
        const { event } = evt;
        if (event.eventType === 'Stream.output') {
            const data = event.data;
            this.activeStreamByQueryId.get(event.listenerId)?.push(data);
        }
    }
    async runApi(command, args, timeoutMs) {
        try {
            if (this.validateApiParameters) {
                const schema = datastore_1.default[command] ?? ChannelHoldApis_1.ChannelHoldApisSchema[command];
                args = await schema.args.parseAsync(args);
            }
        }
        catch (error) {
            if (this.options.consoleLogErrors) {
                console.error('ERROR running Api', error, {
                    command,
                    args,
                });
            }
            throw ValidationError_1.default.fromZodValidation(`The API parameters for ${command} has some issues`, error);
        }
        return await this.connectionToCore.sendRequest({ command, args: [args] }, timeoutMs);
    }
    static async lookupDatastoreHost(datastoreUrl, argonMainchainUrl) {
        const mainchainClient = argonMainchainUrl
            ? localchain_1.MainchainClient.connect(argonMainchainUrl, 10e3)
            : null;
        try {
            return await new DatastoreLookup_1.default(mainchainClient).getHostInfo(datastoreUrl);
        }
        finally {
            if (mainchainClient) {
                await mainchainClient.then(x => x.close());
            }
        }
    }
    static createExecSignatureMessage(payment, nonce) {
        return (0, hashUtils_1.sha256)((0, bufferUtils_1.concatAsBuffer)('Datastore.exec', payment?.credits?.id, payment?.channelHold?.id, nonce));
    }
    static createExecAuthentication(payment, authenticationIdentity, nonce) {
        nonce ??= (0, nanoid_1.nanoid)(10);
        const message = DatastoreApiClient.createExecSignatureMessage(payment, nonce);
        return {
            identity: authenticationIdentity.bech32,
            signature: authenticationIdentity.sign(message),
            nonce,
        };
    }
    static createAdminFunctionMessage(datastoreId, adminIdentity, ownerType, ownerName, functionName, args) {
        return (0, hashUtils_1.sha256)((0, bufferUtils_1.concatAsBuffer)('Datastore.admin', datastoreId, adminIdentity, ownerType, ownerName, functionName, TypeSerializer_1.default.stringify(args, { sortKeys: true })));
    }
    static createUploadSignatureMessage(compressedDbx) {
        return (0, hashUtils_1.sha256)((0, bufferUtils_1.concatAsBuffer)('Datastore.upload', compressedDbx));
    }
    static createDownloadSignatureMessage(id, version, requestDate) {
        return (0, hashUtils_1.sha256)((0, bufferUtils_1.concatAsBuffer)('Datastore.download', id, version, requestDate));
    }
}
exports.default = DatastoreApiClient;
//# sourceMappingURL=DatastoreApiClient.js.map