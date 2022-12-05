export default interface IFunctionComponents<
  ISchema,
  IContext,
  IBeforeRunContext = IContext,
  IAfterRunContext = IContext,
> {
  name?: string;
  schema?: ISchema;
  beforeRun?(context: IBeforeRunContext): void | Promise<void>;
  run(context: IContext): void | Promise<void>;
  afterRun?(context: IAfterRunContext): void | Promise<void>;
}
