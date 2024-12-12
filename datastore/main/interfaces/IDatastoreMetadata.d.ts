import IDatastoreComponents from './IDatastoreComponents';
import IExtractorComponents from './IExtractorComponents';
import ITableComponents from './ITableComponents';
export default interface IDatastoreMetadata extends Omit<IDatastoreComponents<any, any, any>, 'authenticateIdentity' | 'crawlers' | 'extractors' | 'tables' | 'onCreated' | 'onVersionMigrated'> {
    coreVersion: string;
    extractorsByName: {
        [name: string]: {
            corePlugins: {
                [name: string]: string;
            };
            remoteExtractor?: string;
            remoteSource?: string;
            remoteDatastoreId?: string;
            remoteDatastoreVersion?: string;
        } & Omit<IExtractorComponents<any, any>, 'run'>;
    };
    crawlersByName: {
        [name: string]: {
            corePlugins: {
                [name: string]: string;
            };
            remoteCrawler?: string;
            remoteSource?: string;
            remoteDatastoreId?: string;
            remoteDatastoreVersion?: string;
        } & Omit<IExtractorComponents<any, any>, 'run'>;
    };
    tablesByName: {
        [name: string]: {
            remoteTable?: string;
            remoteSource?: string;
            remoteDatastoreId?: string;
            remoteDatastoreVersion?: string;
        } & Omit<ITableComponents<any>, 'onCreated' | 'onVersionMigrated'>;
    };
}
