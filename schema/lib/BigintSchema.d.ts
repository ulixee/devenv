import BaseSchema, { IBaseConfig } from './BaseSchema';
export interface IBigintSchemaConfig<TOptional extends boolean = false> extends IBaseConfig<TOptional> {
    min?: bigint;
    max?: bigint;
}
export default class BigintSchema<TOptional extends boolean = false> extends BaseSchema<bigint, TOptional, IBigintSchemaConfig<TOptional>> {
    readonly typeName = "bigint";
    min?: bigint;
    max?: bigint;
    constructor(config?: IBigintSchemaConfig<TOptional>);
    protected validationLogic(value: any, path: any, tracker: any): void;
}
