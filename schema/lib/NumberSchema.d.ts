import BaseSchema, { IBaseConfig } from './BaseSchema';
export interface INumberSchemaConfig<TOptional extends boolean = boolean> extends IBaseConfig<TOptional> {
    min?: number;
    max?: number;
    decimals?: number;
    integer?: boolean;
}
export default class NumberSchema<TOptional extends boolean = boolean> extends BaseSchema<number, TOptional, INumberSchemaConfig<TOptional>> {
    readonly typeName = "number";
    min?: number;
    max?: number;
    decimals?: number;
    integer?: boolean;
    constructor(config?: INumberSchemaConfig<TOptional>);
    protected validationLogic(value: any, path: any, tracker: any): void;
}
