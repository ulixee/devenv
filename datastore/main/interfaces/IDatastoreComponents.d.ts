import Crawler from '../lib/Crawler';
import Extractor from '../lib/Extractor';
import Table from '../lib/Table';
import CreditsTable from '../lib/CreditsTable';
import Datastore from '../lib/Datastore';
export default interface IDatastoreComponents<TTable extends TTables, TExtractor extends TExtractors, TCrawler extends TCrawlers> {
    name?: string;
    description?: string;
    id?: string;
    version?: string;
    storageEngineHost?: string;
    remoteDatastores?: {
        [source: string]: string;
    };
    remoteDatastoreEmbeddedCredits?: {
        [source: string]: {
            id: string;
            secret: string;
        };
    };
    tables?: TTable & {
        credits?: CreditsTable;
    };
    extractors?: TExtractor;
    crawlers?: TCrawler;
    paymentAddress?: string;
    affiliateId?: string;
    adminIdentities?: string[];
    onCreated?(this: Datastore<TTable, TExtractor, TCrawler, this>): Promise<void>;
    onVersionMigrated?(this: Datastore<TTable, TExtractor, TCrawler, this>, previousVersion: Datastore): Promise<void>;
    authenticateIdentity?(identity: string, nonce: string): Promise<boolean> | boolean;
}
export declare type TExtractors<T = any, TFunc extends Extractor = Extractor> = T extends Record<string, TFunc> ? {
    [K in keyof T]: T[K];
} : never;
export declare type TTables<T = any, TTable extends Table = Table> = T extends Record<string, TTable> ? {
    [K in keyof T]: T[K];
} : never;
export declare type TCrawlers<T = any, TCrawler extends Crawler = Crawler> = T extends Record<string, TCrawler> ? {
    [K in keyof T]: T[K];
} : never;
