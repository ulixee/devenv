import BaseSchema, { IBaseConfig } from './BaseSchema';
import StringSchema from './StringSchema';
import { ExtractSchemaType } from '../index';
export interface IRecordSchemaConfig<Value extends BaseSchema<any, boolean>, TOptional extends boolean = false> extends IBaseConfig<TOptional> {
    values: Value;
    keys?: StringSchema;
}
export default class RecordSchema<Value extends BaseSchema<any, boolean>, TOptional extends boolean = boolean> extends BaseSchema<Record<string, ExtractSchemaType<Value>>, TOptional, IRecordSchemaConfig<Value, TOptional>> {
    readonly typeName = "record";
    values: BaseSchema<any>;
    keys?: StringSchema;
    constructor(config: IRecordSchemaConfig<Value, TOptional>);
    protected validationLogic(value: any, path: any, tracker: any): void;
}
