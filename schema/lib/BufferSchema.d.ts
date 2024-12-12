import BaseSchema, { IBaseConfig } from './BaseSchema';
declare const IBufferEncodingTypes: readonly ["ascii", "utf8", "utf16le", "ucs2", "base64", "latin1", "binary", "hex"];
export interface IBufferSchemaConfig<TOptional extends boolean = boolean> extends IBaseConfig<TOptional> {
    encoding?: keyof typeof IBufferEncodingTypes;
}
export default class BufferSchema<TOptional extends boolean = boolean> extends BaseSchema<Buffer, TOptional, IBufferSchemaConfig<TOptional>> {
    readonly typeName = "buffer";
    encoding?: keyof typeof IBufferEncodingTypes;
    constructor(config?: IBufferSchemaConfig<TOptional>);
    protected validationLogic(value: any, path: any, tracker: any): void;
}
export {};
