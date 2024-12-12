import { Table } from '@ulixee/datastore';
import { IDatastoreBinding } from '@ulixee/datastore/lib/DatastoreInternal';
import { IOutputSchema } from '../interfaces/IInputOutput';
export default class ClientForTable<TTable extends Table> {
    private table;
    private readonly readyPromise;
    constructor(table: TTable, options?: IDatastoreBinding);
    fetch(inputFilter: Partial<TTable['schemaType']>): Promise<TTable['schemaType'][]>;
    run(inputFilter?: Partial<TTable['schemaType']>): Promise<TTable['schemaType'][]>;
    query<TOutputSchema extends IOutputSchema = IOutputSchema>(sql: string, boundValues?: any[]): Promise<TOutputSchema[]>;
}
