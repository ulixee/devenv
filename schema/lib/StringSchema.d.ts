import * as moment from 'moment';
import BaseSchema, { IBaseConfig } from './BaseSchema';
export interface IStringSchemaConfig<TOptional extends boolean = boolean> extends IBaseConfig<TOptional> {
    format?: 'email' | 'url' | 'date' | 'time';
    regexp?: RegExp;
    enum?: string[];
    minLength?: number;
    maxLength?: number;
    length?: number;
}
export default class StringSchema<TOptional extends boolean = boolean> extends BaseSchema<string, TOptional, IStringSchemaConfig<TOptional>> {
    static DateFormat: string;
    static TimeFormat: string;
    readonly typeName = "string";
    format?: 'email' | 'url' | 'date' | 'time';
    regexp?: RegExp;
    enum?: string[];
    minLength?: number;
    maxLength?: number;
    length?: number;
    constructor(config?: IStringSchemaConfig<TOptional>);
    toMoment(value: string): moment.Moment;
    toDate(value: string): Date;
    toFormat(date: Date | moment.Moment): string;
    protected validationLogic(value: any, path: any, tracker: any): void;
}
