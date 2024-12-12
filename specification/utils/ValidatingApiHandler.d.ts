import { IZodApiSpec, IZodApiTypes, IZodSchemaToApiTypes } from './IZodApi';
export default class ValidatingApiHandler<APIs extends IZodApiSpec, Command extends keyof APIs & string, APISpec extends IZodSchemaToApiTypes<APIs>, IHandlerOptions = any> {
    readonly command: Command;
    protected apiSchema: APIs;
    protected apiHandler: (this: ValidatingApiHandler<APIs, Command, APISpec, IHandlerOptions>, args: APISpec[Command]['args'], options?: IHandlerOptions) => Promise<APISpec[Command]['result']>;
    protected validationSchema: IZodApiTypes | undefined;
    constructor(command: Command, apiSchema: APIs, args: {
        handler: ValidatingApiHandler<APIs, Command, APISpec, IHandlerOptions>['apiHandler'];
    });
    handler(rawArgs: unknown, options?: IHandlerOptions): Promise<APISpec[Command]['result']>;
    validatePayload(data: unknown): APISpec[Command]['args'];
}
