import BaseSchema, { IBaseConfig } from './BaseSchema';
export interface IDateSchemaConfig<TOptional extends boolean = boolean> extends IBaseConfig<TOptional> {
    future?: boolean;
    past?: boolean;
}
export default class DateSchema<TOptional extends boolean = boolean> extends BaseSchema<Date, TOptional, IDateSchemaConfig<TOptional>> {
    readonly typeName = "date";
    future?: boolean;
    past?: boolean;
    constructor(config?: IDateSchemaConfig<TOptional>);
    protected validationLogic(value: any, path: any, tracker: any): void;
}
