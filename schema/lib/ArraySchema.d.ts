import BaseSchema, { IBaseConfig } from './BaseSchema';
export interface IArraySchemaConfig<E extends BaseSchema<any>, TOptional extends boolean = boolean> extends IBaseConfig<TOptional> {
    element: E;
}
export default class ArraySchema<E extends BaseSchema<any>, TOptional extends boolean = boolean> extends BaseSchema<Array<E['$type']>, TOptional, IArraySchemaConfig<E, TOptional>> {
    readonly typeName = "array";
    element: E;
    constructor(config: IArraySchemaConfig<E, TOptional>);
    protected validationLogic(value: any, path: any, tracker: any): void;
}
