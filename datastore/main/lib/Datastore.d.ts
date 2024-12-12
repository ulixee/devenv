import IDatastoreComponents, { TCrawlers, TExtractors, TTables } from '../interfaces/IDatastoreComponents';
import IDatastoreMetadata from '../interfaces/IDatastoreMetadata';
import IQueryOptions from '../interfaces/IQueryOptions';
import DatastoreInternal, { IDatastoreBinding, IQueryInternalCallbacks } from './DatastoreInternal';
export default class Datastore<TTable extends TTables = TTables, TExtractor extends TExtractors = TExtractors, TCrawler extends TCrawlers = TCrawlers, TComponents extends IDatastoreComponents<TTable, TExtractor, TCrawler> = IDatastoreComponents<TTable, TExtractor, TCrawler>> {
    #private;
    get affiliateId(): string;
    get metadata(): IDatastoreMetadata;
    get extractors(): TComponents['extractors'];
    get tables(): TComponents['tables'];
    get crawlers(): TComponents['crawlers'];
    get authenticateIdentity(): TComponents['authenticateIdentity'];
    get onCreated(): TComponents['onCreated'];
    get onVersionMigrated(): TComponents['onVersionMigrated'];
    constructor(components: TComponents, datastoreInternal?: DatastoreInternal<TTable, TExtractor, TCrawler, TComponents>);
    queryInternal<T>(sql: string, boundValues?: any[], options?: IQueryOptions, callbacks?: IQueryInternalCallbacks): Promise<T>;
    bind(config: IDatastoreBinding): Promise<DatastoreInternal>;
}
