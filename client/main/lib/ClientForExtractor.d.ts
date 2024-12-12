import { Extractor } from '@ulixee/datastore';
import { IDatastoreBinding } from '@ulixee/datastore/lib/DatastoreInternal';
import ResultIterable from '@ulixee/datastore/lib/ResultIterable';
import { IOutputSchema } from '../interfaces/IInputOutput';
export default class ClientForExtractor<TExtractor extends Extractor> {
    private extractor;
    private readonly readyPromise;
    constructor(extractor: TExtractor, options?: IDatastoreBinding);
    fetch(inputFilter: TExtractor['schemaType']['input']): ResultIterable<TExtractor['schema']['output']>;
    run(inputFilter?: TExtractor['schemaType']['input']): ResultIterable<TExtractor['schemaType']['output']>;
    query<TSchema extends IOutputSchema = IOutputSchema>(sql: string, boundValues?: any[]): Promise<TSchema[]>;
}
