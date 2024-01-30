import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';

type TPrices = { perQuery: number; minimum: number };
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
      prices: TPrices[];
    };
  };
  crawlersByName: {
    [name: string]: {
      name: string;
      description: string;
      schema: TSchema;
      prices: TPrices[];
    };
  };
  tablesByName: {
    [name: string]: {
      name: string;
      description: string;
      schema: TSchema;
      prices: TPrices[];
    };
  };
}