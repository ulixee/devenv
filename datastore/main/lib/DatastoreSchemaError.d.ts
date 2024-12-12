import { IValidationError } from '@ulixee/schema/interfaces/IValidationResult';
export default class DatastoreSchemaError extends Error {
    readonly errors: IValidationError[];
    readonly providedValue: any;
    constructor(message: string, errors: IValidationError[], providedValue: any);
}
