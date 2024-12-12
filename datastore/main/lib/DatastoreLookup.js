"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainTopLevel = void 0;
const TimedCache_1 = require("@ulixee/commons/lib/TimedCache");
const utils_1 = require("@ulixee/commons/lib/utils");
const localchain_1 = require("@argonprotocol/localchain");
Object.defineProperty(exports, "DomainTopLevel", { enumerable: true, get: function () { return localchain_1.DomainTopLevel; } });
const datastoreIdValidation_1 = require("@ulixee/platform-specification/types/datastoreIdValidation");
const semverValidation_1 = require("@ulixee/platform-specification/types/semverValidation");
const net = require("node:net");
/**
 * Singleton that will track payments for each channelHold for a datastore
 */
class DatastoreLookup {
    constructor(mainchainClient) {
        this.mainchainClient = mainchainClient;
        this.zoneRecordByDomain = {};
        if (mainchainClient) {
            mainchainClient.catch(() => null);
        }
        (0, utils_1.bindFunctions)(this);
    }
    async getHostInfo(datastoreUrl) {
        const url = (0, utils_1.toUrl)(datastoreUrl);
        const ipHost = DatastoreLookup.parseDatastoreIpHost(url);
        if (ipHost)
            return ipHost;
        // ulx://delta.Flights/@v1.5.0
        const version = url.pathname.split('@v').pop();
        return await this.lookupDatastoreDomain(url.host, version);
    }
    async validatePayment(paymentInfo) {
        if (paymentInfo.domain && paymentInfo.recipient) {
            const zoneRecord = await this.lookupDatastoreDomain(paymentInfo.domain, 'any');
            if (zoneRecord) {
                if (zoneRecord.payment.notaryId !== paymentInfo.recipient.notaryId) {
                    throw new Error('Payment notaryId does not match Domain record');
                }
                if (zoneRecord.payment.address !== paymentInfo.recipient.address) {
                    throw new Error('Payment address does not match Domain record');
                }
            }
        }
    }
    async lookupDatastoreDomain(domain, version) {
        let zoneRecord = this.zoneRecordByDomain[domain]?.value;
        const mainchainClient = await this.mainchainClient;
        if (!zoneRecord) {
            if (!mainchainClient)
                throw new Error('Unable to lookup a datastore in the mainchain. Please connect a mainchainClient');
            const parsed = DatastoreLookup.readDomain(domain);
            const zone = await mainchainClient.getDomainZoneRecord(parsed.name, parsed.topLevel);
            if (!zone)
                throw new Error(`Zone record for Domain (${domain}) not found`);
            this.zoneRecordByDomain[domain] ??= new TimedCache_1.default(24 * 60 * 60e3);
            this.zoneRecordByDomain[domain].value = {
                ...zone,
                domain,
            };
            zoneRecord = this.zoneRecordByDomain[domain].value;
        }
        let versionHost = zoneRecord.versions[version];
        if (!versionHost && version === 'any') {
            versionHost = Object.values(zoneRecord.versions)[0];
        }
        if (!versionHost)
            throw new Error('Version not found');
        this.chainIdentity ??= mainchainClient.getChainIdentity();
        const chainIdentity = await this.chainIdentity;
        return {
            datastoreId: versionHost.datastoreId,
            host: versionHost.host,
            version,
            domain,
            payment: {
                address: zoneRecord.paymentAddress,
                notaryId: zoneRecord.notaryId,
                ...chainIdentity,
            },
        };
    }
    static readDomain(domain) {
        const [name, tldStr] = domain.split('.');
        const tld = DatastoreLookup.parseTld(tldStr);
        if (!tld)
            throw new Error(`Unknown domain top level domain ${tldStr}`);
        return { name, topLevel: tld };
    }
    static parseTld(tld) {
        return localchain_1.DomainTopLevel[tld.toLowerCase()] ?? localchain_1.DomainTopLevel[tld[0].toUpperCase() + tld.slice(1)];
    }
    static parseDatastoreIpHost(url) {
        if (url.hostname === 'localhost' || net.isIP(url.hostname)) {
            const urlParts = url.pathname.split('/');
            let id;
            let datastoreVersion;
            for (let i = 0; i < urlParts.length; i += 1) {
                if (urlParts[i].includes('@v')) {
                    [id, datastoreVersion] = urlParts[i].split('@v');
                    break;
                }
            }
            const version = datastoreVersion?.match(semverValidation_1.semverRegex)?.pop();
            if (!version)
                throw new Error('Invalid version in url');
            const datastoreId = id?.match(datastoreIdValidation_1.datastoreRegex)?.pop();
            if (!datastoreId)
                throw new Error('Invalid datastoreId in url');
            return {
                datastoreId,
                version,
                domain: null,
                host: url.host,
            };
        }
        return null;
    }
}
exports.default = DatastoreLookup;
//# sourceMappingURL=DatastoreLookup.js.map