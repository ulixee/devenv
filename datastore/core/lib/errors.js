"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxSurgePricePerQueryExceededError = exports.InsufficientQueryPriceError = exports.PaymentRequiredError = exports.InvalidPermissionsError = exports.MissingRequiredSettingError = exports.DatastoreNotFoundError = void 0;
// eslint-disable-next-line max-classes-per-file
const errors_1 = require("@ulixee/commons/lib/errors");
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
class DatastoreNotFoundError extends Error {
    constructor(message, data) {
        super(message);
        this.data = data;
        this.code = 'ERR_DATASTORE_NOT_FOUND';
        this.name = 'DatastoreNotFoundError';
    }
}
exports.DatastoreNotFoundError = DatastoreNotFoundError;
class MissingRequiredSettingError extends Error {
    constructor(message, setting, defaultValue) {
        super(message);
        this.setting = setting;
        this.defaultValue = defaultValue;
        this.code = 'ERR_MISSING_SETTING';
        this.name = 'MissingRequiredSettingError';
    }
}
exports.MissingRequiredSettingError = MissingRequiredSettingError;
class InvalidPermissionsError extends Error {
    constructor(message) {
        super(message);
        this.code = 'ERR_INVALID_PERMISSIONS';
        this.name = 'InvalidPermissionsError';
    }
}
exports.InvalidPermissionsError = InvalidPermissionsError;
class PaymentRequiredError extends errors_1.UlixeeError {
    static get code() {
        return 'ERR_NEEDS_PAYMENT';
    }
    constructor(message, minimumMicrogonsRequired) {
        super(message, PaymentRequiredError.code);
        this.minimumMicrogonsRequired = minimumMicrogonsRequired;
    }
}
exports.PaymentRequiredError = PaymentRequiredError;
class InsufficientQueryPriceError extends errors_1.UlixeeError {
    static get code() {
        return 'ERR_PRICE_TOO_LOW';
    }
    constructor(microgonsAllocated, minimumMicrogonsAccepted) {
        super('This channelHold has insufficient funding allocated for this Data query.', InsufficientQueryPriceError.code);
        this.data = {
            microgonsAllocated,
            minimumMicrogonsAccepted,
        };
    }
}
exports.InsufficientQueryPriceError = InsufficientQueryPriceError;
class MaxSurgePricePerQueryExceededError extends errors_1.UlixeeError {
    static get code() {
        return 'ERR_MAX_PRICE_EXCEEDED';
    }
    constructor(clientMaxPricePerQuery, cloudPricePerQuery) {
        super('The maximum surge price per query requested was not accepted by this Cloud.', MaxSurgePricePerQueryExceededError.code);
        this.data = {
            clientMaxPricePerQuery,
            cloudPricePerQuery,
        };
    }
}
exports.MaxSurgePricePerQueryExceededError = MaxSurgePricePerQueryExceededError;
(0, TypeSerializer_1.registerSerializableErrorType)(DatastoreNotFoundError);
(0, TypeSerializer_1.registerSerializableErrorType)(MaxSurgePricePerQueryExceededError);
(0, TypeSerializer_1.registerSerializableErrorType)(InsufficientQueryPriceError);
//# sourceMappingURL=errors.js.map