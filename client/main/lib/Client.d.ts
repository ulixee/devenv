import Datastore, { ConnectionToDatastoreCore, Crawler, Extractor, Table } from '@ulixee/datastore';
import ICrawlerOutputSchema from '@ulixee/datastore/interfaces/ICrawlerOutputSchema';
import IPaymentService from '@ulixee/datastore/interfaces/IPaymentService';
import IQueryOptions from '@ulixee/datastore/interfaces/IQueryOptions';
import { IInputFilter, IOutputSchema } from '../interfaces/IInputOutput';
import ILocationStringOrObject from '../interfaces/ILocationStringOrObject';
import ClientForCrawler from './ClientForCrawler';
import ClientForDatastore from './ClientForDatastore';
import ClientForExtractor from './ClientForExtractor';
import ClientForTable from './ClientForTable';
export interface IClientConfig extends Partial<Pick<IQueryOptions, 'authentication' | 'affiliateId' | 'onQueryResult' | 'queryId'>> {
    paymentService?: IPaymentService;
    argonMainchainUrl?: string;
}
export default class ClientForRemote {
    #private;
    readonly config?: IClientConfig;
    user: string;
    password: string;
    host: string;
    port: number;
    database: string;
    /**
     * This variable is here just to detect when we do not think this host is a domain
     */
    readonly isDnsHost: boolean;
    private datastoreId;
    private version;
    private domain?;
    private loadPaymentsPromise;
    private domainLookupPromise;
    constructor(uriOrObject?: ILocationStringOrObject, config?: IClientConfig);
    run<TInputFilter extends IInputFilter = IInputFilter, TOutputSchema extends IOutputSchema = IOutputSchema>(extractorOrTableName: string, inputFilter?: TInputFilter): Promise<TOutputSchema[]>;
    fetch<TInputFilter extends IInputFilter = IInputFilter, TOutputSchema extends IOutputSchema = IOutputSchema>(extractorOrTableName: string, inputFilter?: TInputFilter): Promise<TOutputSchema[]>;
    crawl<TInputFilter extends IInputFilter = IInputFilter>(name: string, inputFilter?: TInputFilter): Promise<ICrawlerOutputSchema>;
    query<TSchema extends IOutputSchema = IOutputSchema>(sql: string, boundValues?: any[]): Promise<TSchema[]>;
    disconnect(): Promise<void>;
    private getApiClient;
    private lookupDomain;
    private loadPayments;
    static forDatastore<T extends Datastore>(datastore: T, options?: IClientOptions): ClientForDatastore<T>;
    static forTable<T extends Table>(table: T, options?: IClientOptions): ClientForTable<T>;
    static forExtractor<T extends Extractor>(extractor: T, options?: IClientOptions): ClientForExtractor<T>;
    static forCrawler<T extends Crawler>(datastore: T, options?: IClientOptions): ClientForCrawler<T>;
}
interface IClientOptions {
    connectionToCore: ConnectionToDatastoreCore;
}
export {};
