import BaseSchema, { IBaseConfig } from './lib/BaseSchema';
import NumberSchema, { INumberSchemaConfig } from './lib/NumberSchema';
import StringSchema, { IStringSchemaConfig } from './lib/StringSchema';
import BigintSchema, { IBigintSchemaConfig } from './lib/BigintSchema';
import ObjectSchema, { IObjectSchemaConfig } from './lib/ObjectSchema';
import ArraySchema, { IArraySchemaConfig } from './lib/ArraySchema';
import BooleanSchema, { IBooleanSchemaConfig } from './lib/BooleanSchema';
import BufferSchema, { IBufferSchemaConfig } from './lib/BufferSchema';
import DateSchema, { IDateSchemaConfig } from './lib/DateSchema';
import RecordSchema, { IRecordSchemaConfig } from './lib/RecordSchema';
import { DateUtilities, IUnits } from './lib/DateUtilities';
type ISchemaAny = StringSchema<boolean> | BooleanSchema<boolean> | NumberSchema<boolean> | BigintSchema<boolean> | BufferSchema<boolean> | DateSchema<boolean> | RecordSchema<any, boolean> | ObjectSchema<any, boolean> | ArraySchema<any, boolean>;
export { ArraySchema, ObjectSchema, ISchemaAny, DateUtilities };
export type FilterOptionalKeys<T> = {
    [K in keyof T]: T[K] extends {
        optional: true;
    } ? K : never;
}[keyof T];
export type FilterRequiredKeys<T> = {
    [K in keyof T]: T[K] extends {
        optional: true;
    } ? never : K;
}[keyof T];
export type IRecordSchemaType<T extends Record<string, BaseSchema<any, boolean>>> = {
    [K in FilterRequiredKeys<T>]: T[K]['$type'];
} & {
    [K in FilterOptionalKeys<T>]?: T[K]['$type'];
} extends infer P ? {
    [K in keyof P]: P[K];
} : never;
export type ExtractSchemaType<T> = T extends BaseSchema<infer U, boolean> ? U : T extends Record<string, BaseSchema<any, boolean>> ? IRecordSchemaType<T> : unknown;
export declare function boolean<TOptional extends boolean = false>(config?: IBooleanSchemaConfig<TOptional>): BooleanSchema<TOptional>;
export declare function number<TOptional extends boolean = false>(config?: INumberSchemaConfig<TOptional>): NumberSchema<TOptional>;
export declare function string<TOptional extends boolean = false>(config?: IStringSchemaConfig<TOptional>): StringSchema<TOptional>;
export declare function bigint<TOptional extends boolean = false>(config?: IBigintSchemaConfig<TOptional>): BigintSchema<TOptional>;
export declare function buffer<TOptional extends boolean = false>(config?: IBufferSchemaConfig<TOptional>): BufferSchema<TOptional>;
export declare function date<TOptional extends boolean = false>(config?: IDateSchemaConfig<TOptional>): DateSchema<TOptional>;
export declare function dateAdd(quantity: number, units: IUnits): DateUtilities;
export declare function dateSubtract(quantity: number, units: IUnits): DateUtilities;
export declare function record<Values extends BaseSchema<any, boolean>, TOptional extends boolean = false>(config: IRecordSchemaConfig<Values, TOptional>): RecordSchema<Values, TOptional>;
export declare function object<TOptional extends boolean = boolean, S extends BaseSchema<any, boolean> & IBaseConfig<TOptional> = BaseSchema<any, boolean> & IBaseConfig<TOptional>, O extends Record<string, S> = Record<string, S>>(fields: O): ObjectSchema<O, false, S>;
export declare function object<S extends BaseSchema<any, boolean> = BaseSchema<any, boolean>, O extends Record<string, S> = Record<string, S>, TOptional extends boolean = false>(config: IObjectSchemaConfig<O, S, TOptional>): ObjectSchema<O, TOptional, S>;
export declare function array<E extends BaseSchema<any>>(element: E): ArraySchema<E>;
export declare function array<E extends BaseSchema<any>, TOptional extends boolean = false>(config: IArraySchemaConfig<E, TOptional>): ArraySchema<E, TOptional>;
