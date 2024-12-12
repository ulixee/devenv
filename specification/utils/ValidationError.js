"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
    constructor(message, errors) {
        super(message ?? 'Invalid request');
        this.errors = errors;
        this.code = 'ERR_VALIDATION';
        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            errors: this.errors,
            message: this.message,
            code: this.code,
            stack: this.stack,
        };
    }
    toString() {
        const errors = this.errors ? `\n${this.errors.join('\n - ')}` : '';
        return `${this.message}${errors}`;
    }
    static fromZodValidation(message, error) {
        const errorList = error.issues.map(x => `"${x.path.join('.')}": ${x.message}`);
        throw new ValidationError(message, errorList);
    }
}
exports.default = ValidationError;
//# sourceMappingURL=ValidationError.js.map