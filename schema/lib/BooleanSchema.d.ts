import BaseSchema, { IBaseConfig } from './BaseSchema';
export interface IBooleanSchemaConfig<TOptional extends boolean = boolean> extends IBaseConfig<TOptional> {
}
export default class BooleanSchema<TOptional extends boolean = boolean> extends BaseSchema<boolean, TOptional, IBooleanSchemaConfig<TOptional>> {
    readonly typeName = "boolean";
    protected validationLogic(value: any, path: any, tracker: any): void;
}
