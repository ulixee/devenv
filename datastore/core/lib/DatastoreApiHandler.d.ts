import ValidatingApiHandler from '@ulixee/platform-specification/utils/ValidatingApiHandler';
import IDatastoreApis, { DatastoreApiSchemas } from '@ulixee/platform-specification/datastore/DatastoreApis';
import IDatastoreApiContext from '../interfaces/IDatastoreApiContext';
export default class DatastoreApiHandler<Command extends keyof IDatastoreApis & string> extends ValidatingApiHandler<typeof DatastoreApiSchemas, Command, IDatastoreApis, IDatastoreApiContext> {
    constructor(command: Command, args: {
        handler: (this: DatastoreApiHandler<Command>, request: IDatastoreApis[Command]['args'], context?: IDatastoreApiContext) => Promise<IDatastoreApis[Command]['result']>;
    });
}
