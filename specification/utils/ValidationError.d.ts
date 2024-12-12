import { ZodError } from 'zod';
export default class ValidationError extends Error {
    readonly errors: string[];
    readonly code = "ERR_VALIDATION";
    constructor(message: string, errors: string[]);
    toJSON(): unknown;
    toString(): string;
    static fromZodValidation(message: string, error: ZodError): ValidationError;
}
