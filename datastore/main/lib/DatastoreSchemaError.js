"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
class DatastoreSchemaError extends Error {
    constructor(message, errors, providedValue) {
        super(message);
        this.errors = errors;
        this.providedValue = providedValue;
        this.name = 'DatastoreSchemaError';
        this.stack = message;
    }
}
exports.default = DatastoreSchemaError;
(0, TypeSerializer_1.registerSerializableErrorType)(DatastoreSchemaError);
//# sourceMappingURL=DatastoreSchemaError.js.map