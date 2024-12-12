import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';
type TSchema = IDatastoreManifest['extractorsByName'][0]['schemaAsJson'];
export default interface IDocpageConfig {
    datastoreId: string;
    version: string;
    name: string;
    description: string;
    createdAt: string;
    defaultExample: {
        type: 'table' | 'extractor' | 'crawler';
        name: string;
        formatted: string;
        args: Record<string, any>;
    };
    extractorsByName: {
        [name: string]: {
            name: string;
            description: string;
            schema: TSchema;
            prices: IDatastoreManifest['extractorsByName'][0]['prices'];
        };
    };
    crawlersByName: {
        [name: string]: {
            name: string;
            description: string;
            schema: TSchema;
            prices: IDatastoreManifest['crawlersByName'][0]['prices'];
        };
    };
    tablesByName: {
        [name: string]: {
            name: string;
            description: string;
            schema: IDatastoreManifest['tablesByName'][0]['schemaAsJson'];
            prices: IDatastoreManifest['tablesByName'][0]['prices'];
        };
    };
}
export {};
