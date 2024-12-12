import { ExtractSchemaType } from '../index';
import BaseSchema, { IBaseConfig } from './BaseSchema';
type ISchemaRecord<O extends Record<string, BaseSchema<any, boolean>>> = {
    [T in keyof O]: O[T];
};
export interface IObjectSchemaConfig<O extends Record<string, S>, S extends BaseSchema<any, boolean> = BaseSchema<any, boolean>, TOptional extends boolean = boolean> extends IBaseConfig<TOptional> {
    fields: ISchemaRecord<O>;
}
export default class ObjectSchema<O extends Record<string, S>, TOptional extends boolean = boolean, S extends BaseSchema<any, boolean> = BaseSchema<any, boolean>> extends BaseSchema<ExtractSchemaType<O>, TOptional, IObjectSchemaConfig<O, S, TOptional>> {
    readonly typeName = "object";
    fields: O;
    constructor(config: IObjectSchemaConfig<O, S, TOptional>);
    protected validationLogic(value: any, path: any, tracker: any): void;
}
export {};
