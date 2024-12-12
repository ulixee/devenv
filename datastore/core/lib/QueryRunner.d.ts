import Datastore, { IExtractorRunOptions } from '@ulixee/datastore';
import IQueryOptions from '@ulixee/datastore/interfaces/IQueryOptions';
import IStorageEngine from '@ulixee/datastore/interfaces/IStorageEngine';
import { IDatastoreMetadataResult, IDatastoreQueryMetadata, IDatastoreQueryResult } from '@ulixee/platform-specification/datastore/DatastoreApis';
import IDatastoreApiContext from '../interfaces/IDatastoreApiContext';
import { IDatastoreManifestWithRuntime } from './DatastoreRegistry';
import PaymentsProcessor from './PaymentsProcessor';
export default class QueryRunner {
    readonly context: IDatastoreApiContext;
    readonly queryDetails: IDatastoreQueryMetadata;
    startTime: number;
    heroSessionIds: Set<string>;
    datastoreManifest: IDatastoreManifestWithRuntime;
    microgons: number;
    get milliseconds(): number;
    get cloudNodeHost(): string;
    get cloudNodeIdentity(): string;
    paymentsProcessor?: PaymentsProcessor;
    storageEngineMetadata: IDatastoreMetadataResult;
    storageEngine: IStorageEngine;
    private remoteQueryCounter;
    private localMachineTableCalls;
    constructor(context: IDatastoreApiContext, queryDetails: IDatastoreQueryMetadata);
    openDatastore(): Promise<Datastore>;
    beforeAll(query: string, input: any[], entityCalls: string[]): Promise<IDatastoreQueryResult | undefined>;
    beforeStorageEngine(options: IQueryOptions): IQueryOptions;
    onPassthroughTable<TOutput>(name: string, options: IQueryOptions, run: (options: IQueryOptions) => Promise<TOutput>): Promise<TOutput>;
    runFunction<TSchema, TOutput>(name: string, options: IExtractorRunOptions<TSchema>, run: (options: IExtractorRunOptions<TSchema>) => Promise<TOutput>): Promise<TOutput>;
    finalize(query: string, input: any[], finalResult: Error | any[]): Promise<IDatastoreQueryResult>;
    private recordQueryResult;
    private getCallPricing;
}
export interface IRequestDetails {
    id: string;
    version: string;
}
