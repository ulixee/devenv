import TimedCache from '@ulixee/commons/lib/TimedCache';
import { ChainIdentity, Domain, DomainTopLevel, ZoneRecord } from '@argonprotocol/localchain';
import IDatastoreHostLookup, { IDatastoreHost } from '../interfaces/IDatastoreHostLookup';
export { DomainTopLevel };
export interface IZoneRecordLookup {
    getDomainZoneRecord(domainName: string, tld: DomainTopLevel): Promise<ZoneRecord | null>;
    getChainIdentity(): Promise<ChainIdentity>;
}
/**
 * Singleton that will track payments for each channelHold for a datastore
 */
export default class DatastoreLookup implements IDatastoreHostLookup {
    private mainchainClient;
    readonly zoneRecordByDomain: {
        [domain: string]: TimedCache<ZoneRecord & {
            domain: string;
        }>;
    };
    private chainIdentity;
    constructor(mainchainClient: Promise<IZoneRecordLookup> | null);
    getHostInfo(datastoreUrl: string): Promise<IDatastoreHost>;
    validatePayment(paymentInfo: {
        recipient?: {
            address?: string;
            notaryId?: number;
        };
        domain?: string;
    }): Promise<void>;
    lookupDatastoreDomain(domain: string, version: string | 'any'): Promise<IDatastoreHost>;
    static readDomain(domain: string): Domain;
    static parseTld(tld: string): DomainTopLevel;
    static parseDatastoreIpHost(url: URL): IDatastoreHost;
}
