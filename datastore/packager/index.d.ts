import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import { IFetchMetaResponseData } from '@ulixee/datastore-core/interfaces/ILocalDatastoreProcess';
import DatastoreManifest from '@ulixee/datastore-core/lib/DatastoreManifest';
import { IDatastoreApiTypes } from '@ulixee/platform-specification/datastore';
import Dbx from './lib/Dbx';
export default class DatastorePackager extends TypedEventEmitter<{
    build: void;
}> {
    private readonly outDir?;
    private logToConsole;
    script: string;
    sourceMap: string;
    dbx: Dbx;
    meta: IFetchMetaResponseData;
    get manifest(): DatastoreManifest;
    get dbxPath(): string;
    private readonly entrypoint;
    private readonly filename;
    private onClose;
    constructor(entrypoint: string, outDir?: string, logToConsole?: boolean);
    close(): Promise<void>;
    build(options?: {
        tsconfig?: string;
        compiledSourcePath?: string;
        createTemporaryVersion?: boolean;
        watch?: boolean;
    }): Promise<Dbx>;
    createOrUpdateManifest(sourceCode: string, sourceMap: string, createTemporaryVersion?: boolean): Promise<DatastoreManifest>;
    protected generateDetails(code: string, sourceMap: string, createTemporaryVersion: boolean): Promise<void>;
    protected lookupRemoteDatastoreExtractorPricing(meta: IFetchMetaResponseData, extractor: IFetchMetaResponseData['extractorsByName'][0]): Promise<IDatastoreApiTypes['Datastore.meta']['result']['extractorsByName'][0]>;
    protected lookupRemoteDatastoreCrawlerPricing(meta: IFetchMetaResponseData, crawler: IFetchMetaResponseData['crawlersByName'][0]): Promise<IDatastoreApiTypes['Datastore.meta']['result']['crawlersByName'][0]>;
    protected lookupRemoteDatastoreTablePricing(meta: IFetchMetaResponseData, table: IFetchMetaResponseData['tablesByName'][0]): Promise<IDatastoreApiTypes['Datastore.meta']['result']['tablesByName'][0]>;
    private getDatastoreMeta;
    private getRemoteSourceAndVersion;
    private findDatastoreMeta;
}
