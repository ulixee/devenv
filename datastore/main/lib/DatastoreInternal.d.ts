import { IApiSpec } from '@ulixee/net/interfaces/IApiHandlers';
import ICoreResponsePayload from '@ulixee/net/interfaces/ICoreResponsePayload';
import IUnixTime from '@ulixee/net/interfaces/IUnixTime';
import { IDatastoreApis } from '@ulixee/platform-specification/datastore';
import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';
import { SqlParser } from '@ulixee/sql-engine';
import ConnectionToDatastoreCore from '../connections/ConnectionToDatastoreCore';
import IDatastoreComponents, { TCrawlers, TExtractors, TTables } from '../interfaces/IDatastoreComponents';
import IDatastoreHostLookup, { IDatastoreHost } from '../interfaces/IDatastoreHostLookup';
import IDatastoreMetadata from '../interfaces/IDatastoreMetadata';
import IExtractorRunOptions from '../interfaces/IExtractorRunOptions';
import IPaymentService from '../interfaces/IPaymentService';
import IQueryOptions from '../interfaces/IQueryOptions';
import IStorageEngine from '../interfaces/IStorageEngine';
import type Crawler from './Crawler';
import DatastoreApiClient from './DatastoreApiClient';
import Extractor from './Extractor';
import Table from './Table';
export default class DatastoreInternal<TTable extends TTables = TTables, TExtractor extends TExtractors = TExtractors, TCrawler extends TCrawlers = TCrawlers, TComponents extends IDatastoreComponents<TTable, TExtractor, TCrawler> = IDatastoreComponents<TTable, TExtractor, TCrawler>> {
    #private;
    storageEngine: IStorageEngine;
    manifest: IDatastoreManifest;
    remotePaymentService: IPaymentService;
    readonly metadata: IDatastoreMetadata;
    instanceId: string;
    components: TComponents;
    readonly extractors: TExtractor;
    readonly tables: TTable;
    readonly crawlers: TCrawler;
    readonly affiliateId: string;
    get remoteDatastores(): TComponents['remoteDatastores'];
    get authenticateIdentity(): TComponents['authenticateIdentity'];
    get connectionToCore(): ConnectionToDatastoreCore;
    set connectionToCore(connectionToCore: ConnectionToDatastoreCore);
    get onCreated(): TComponents['onCreated'];
    get onVersionMigrated(): TComponents['onVersionMigrated'];
    constructor(components: TComponents);
    bind(config: IDatastoreBinding): Promise<DatastoreInternal>;
    sendRequest<T extends keyof IDatastoreApis & string>(payload: {
        command: T;
        args: IApiSpec<IDatastoreApis>[T]['args'];
        commandId?: number;
        startTime?: IUnixTime;
    }, timeoutMs?: number): Promise<ICoreResponsePayload<IDatastoreApis, T>['data']>;
    queryInternal<TResultType = any[]>(sql: string, boundValues?: any[], options?: IQueryOptions, callbacks?: IQueryInternalCallbacks): Promise<TResultType>;
    getRemoteApiClient(remoteSource: string): Promise<{
        client: DatastoreApiClient;
        datastoreHost: IDatastoreHost;
    }>;
    close(): Promise<void>;
    attachExtractor(extractor: Extractor, nameOverride?: string, isAlreadyAttachedToDatastore?: boolean): void;
    attachCrawler(crawler: Crawler, nameOverride?: string, isAlreadyAttachedToDatastore?: boolean): void;
    attachTable(table: Table, nameOverride?: string, isAlreadyAttachedToDatastore?: boolean): void;
    protected getHostInfo(_datastoreUrl: string): Promise<IDatastoreHost>;
    protected apiClientLoader(host: string): DatastoreApiClient;
    private createMetadata;
}
export interface IDatastoreBinding {
    connectionToCore?: ConnectionToDatastoreCore;
    storageEngine?: IStorageEngine;
    manifest?: IDatastoreManifest;
    datastoreHostLookup?: IDatastoreHostLookup;
    apiClientLoader?: (host: string) => DatastoreApiClient;
    remotePaymentService?: IPaymentService;
}
export interface IQueryInternalCallbacks {
    beforeQuery?(args: {
        sqlParser: SqlParser;
        entityCalls: string[];
    }): Promise<void>;
    onFunction?<TOutput = any[], TSchema = any>(name: string, options: IExtractorRunOptions<TSchema>, run: (options: IExtractorRunOptions<TSchema>) => Promise<TOutput>): Promise<TOutput>;
    onPassthroughTable?<TOutput = any[]>(name: string, options: IQueryOptions, run: (options: IQueryOptions) => Promise<TOutput>): Promise<TOutput>;
    beforeStorageEngine?(options: IQueryOptions): IQueryOptions;
}
