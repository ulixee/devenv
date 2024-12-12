"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidIdentityError = exports.UnreadableIdentityError = exports.InvalidSignatureError = void 0;
// eslint-disable-next-line max-classes-per-file
const errors_1 = require("@ulixee/commons/lib/errors");
class InvalidSignatureError extends errors_1.UlixeeError {
    constructor(message, details = {}) {
        super(message, 'ERR_SIGNATURE_INVALID', { details });
        this.details = details;
    }
}
exports.InvalidSignatureError = InvalidSignatureError;
class UnreadableIdentityError extends errors_1.UlixeeError {
    constructor(message) {
        super(message, 'ERR_IDENTITY_UNREADABLE');
    }
}
exports.UnreadableIdentityError = UnreadableIdentityError;
class InvalidIdentityError extends errors_1.UlixeeError {
    constructor(message) {
        super(message, 'ERR_IDENTITY_INVALID');
    }
}
exports.InvalidIdentityError = InvalidIdentityError;
//# sourceMappingURL=errors.js.map