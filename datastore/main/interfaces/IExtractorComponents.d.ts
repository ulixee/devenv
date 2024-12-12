export default interface IExtractorComponents<ISchema, IContext> {
    name?: string;
    description?: string;
    basePrice?: bigint | number;
    schema?: ISchema;
    run(context: IContext): void | Promise<void>;
}
