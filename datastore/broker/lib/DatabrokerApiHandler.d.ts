import ValidatingApiHandler from '@ulixee/platform-specification/utils/ValidatingApiHandler';
import IDatabrokerApis, { DatabrokerApisSchema } from '@ulixee/platform-specification/datastore/DatabrokerApis';
import IDatabrokerApiContext from '../interfaces/IDatabrokerApiContext';
export default class DatabrokerApiHandler<Command extends keyof IDatabrokerApis & string> extends ValidatingApiHandler<typeof DatabrokerApisSchema, Command, IDatabrokerApis, IDatabrokerApiContext> {
    constructor(command: Command, args: {
        handler: (this: DatabrokerApiHandler<Command>, request: IDatabrokerApis[Command]['args'], context?: IDatabrokerApiContext) => Promise<IDatabrokerApis[Command]['result']>;
    });
}
