"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationError_1 = require("./ValidationError");
class ValidatingApiHandler {
    constructor(command, apiSchema, args) {
        this.command = command;
        this.apiSchema = apiSchema;
        this.apiHandler = args.handler.bind(this);
        this.validationSchema = apiSchema[command];
    }
    async handler(rawArgs, options) {
        const args = this.validatePayload(rawArgs);
        return await this.apiHandler(args, options);
    }
    validatePayload(data) {
        if (!this.validationSchema)
            return data;
        // NOTE: mutates `errors`
        const result = this.validationSchema.args.safeParse(data);
        if (result.success)
            return result.data;
        throw ValidationError_1.default.fromZodValidation(`The parameters for this command (${this.command}) are invalid.`, result.error);
    }
}
exports.default = ValidatingApiHandler;
//# sourceMappingURL=ValidatingApiHandler.js.map