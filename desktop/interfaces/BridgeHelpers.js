"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseCode = exports.eventEmitterNameInBrowser = exports.sendMessageFromBrowserToCoreFnName = exports.___receiveFromCore = exports.___sendToCore = exports.MessageLocation = exports.MessageEventType = void 0;
exports.createResponseId = createResponseId;
exports.packMessage = packMessage;
exports.messageExpectsResponse = messageExpectsResponse;
exports.isResponseMessage = isResponseMessage;
exports.extractStringifiedComponentsFromMessage = extractStringifiedComponentsFromMessage;
exports.extractResponseIdFromMessage = extractResponseIdFromMessage;
const nanoid_1 = require("nanoid");
/* Packed messages start with a colon and have two fixed length fields followed by one variable field:
  - colon (length: 1)
  - destLocation (length: 20)
  - colon (length: 1)
  - responseCode (length: 1)
  - colon (length: 1)
  - stringifiedMessage (length: ?)
 */
const fieldDivider = ':';
const lengthOfDestLocationField = 20;
const lengthOfFieldDivider = fieldDivider.length;
const lengthOfResponseCodeField = 1;
const startOfDestLocationField = 1;
const startOfResponseCodeField = startOfDestLocationField + lengthOfDestLocationField + lengthOfFieldDivider;
const startOfStringifiedMessageField = startOfResponseCodeField + lengthOfResponseCodeField + lengthOfFieldDivider;
var MessageEventType;
(function (MessageEventType) {
    MessageEventType["OpenSelectorGeneratorPanel"] = "OpenSelectorGeneratorPanel";
    MessageEventType["CloseElementOptionsOverlay"] = "CloseElementOptionsOverlay";
    MessageEventType["InspectElementModeChanged"] = "InspectElementModeChanged";
    MessageEventType["OpenElementOptionsOverlay"] = "OpenElementOptionsOverlay";
    MessageEventType["HideElementOptionsOverlay"] = "HideElementOptionsOverlay";
    MessageEventType["RemoveHideFromElementOptionsOverlay"] = "RemoveHideFromElementOptionsOverlay";
    MessageEventType["ContentScriptNeedsElement"] = "ContentScriptNeedsElement";
    MessageEventType["RunSelectorGenerator"] = "RunSelectorGenerator";
    MessageEventType["ResetSelectorGenerator"] = "ResetSelectorGenerator";
    MessageEventType["AddIncludedElement"] = "AddIncludedElement";
    MessageEventType["RemoveIncludedElement"] = "RemoveIncludedElement";
    MessageEventType["AddExcludedElement"] = "AddExcludedElement";
    MessageEventType["RemoveExcludedElement"] = "RemoveExcludedElement";
    MessageEventType["FinishedSelectorGeneration"] = "FinishedSelectorGeneration";
    MessageEventType["UpdateElementOptions"] = "UpdateElementOptions";
    MessageEventType["CloseDevtoolsPanel"] = "CloseDevtoolsPanel";
    MessageEventType["ToggleInspectElementMode"] = "ToggleInspectElementMode";
    MessageEventType["UndockedFocusChange"] = "UndockedFocusChange";
})(MessageEventType || (exports.MessageEventType = MessageEventType = {}));
var MessageLocation;
(function (MessageLocation) {
    MessageLocation["DevtoolsPrivate"] = "DevtoolsPrivate";
    MessageLocation["DevtoolsScript"] = "DevtoolsScript";
    MessageLocation["ContentScript"] = "ContentScript";
    MessageLocation["Core"] = "Core";
})(MessageLocation || (exports.MessageLocation = MessageLocation = {}));
// eslint-disable-next-line @typescript-eslint/naming-convention
exports.___sendToCore = '___sendToCore';
// eslint-disable-next-line @typescript-eslint/naming-convention
exports.___receiveFromCore = '___receiveFromCore';
exports.sendMessageFromBrowserToCoreFnName = 'sendMessageFromBrowserToUlixeeCore';
exports.eventEmitterNameInBrowser = 'eventEmitterFromUlixeeCore';
var ResponseCode;
(function (ResponseCode) {
    ResponseCode["Y"] = "Y";
    ResponseCode["N"] = "N";
    ResponseCode["R"] = "R";
})(ResponseCode || (exports.ResponseCode = ResponseCode = {}));
function createResponseId() {
    return (0, nanoid_1.nanoid)();
}
function packMessage(message) {
    if (typeof message === 'string') {
        if (isPackedMessage(message))
            return message;
        throw new Error('Unknown message format');
    }
    const { destLocation } = message;
    const responseCode = message.responseCode || ResponseCode.N;
    const messageToStringify = { ...message };
    delete messageToStringify.destLocation;
    delete messageToStringify.responseCode;
    const stringifiedMessage = JSON.stringify(messageToStringify);
    return `:${destLocation.padEnd(lengthOfDestLocationField)}:${responseCode}:${stringifiedMessage}`;
}
function isPackedMessage(message) {
    return message.substr(0, 1) === fieldDivider;
}
function messageExpectsResponse(message) {
    if (typeof message === 'string') {
        if (isPackedMessage(message)) {
            const responseCode = message.substr(startOfResponseCodeField, lengthOfResponseCodeField);
            return responseCode === ResponseCode.Y;
        }
        throw new Error('Unknown message format');
    }
    return message.responseCode === ResponseCode.Y;
}
function isResponseMessage(message) {
    if (typeof message === 'string') {
        if (isPackedMessage(message)) {
            const responseCode = message.substr(startOfResponseCodeField, lengthOfResponseCodeField);
            return responseCode === ResponseCode.R;
        }
        throw new Error('Unknown message format');
    }
    return message.responseCode === ResponseCode.R;
}
function extractStringifiedComponentsFromMessage(message) {
    if (typeof message === 'string' && isPackedMessage(message)) {
        const destLocation = message.substr(startOfDestLocationField, lengthOfDestLocationField);
        const responseCode = message.substr(startOfResponseCodeField, lengthOfResponseCodeField);
        const stringifiedMessage = message.substr(startOfStringifiedMessageField);
        return [destLocation.trim(), responseCode, stringifiedMessage];
    }
    if (typeof message === 'string')
        throw new Error('Unknown message format');
    const { destLocation, responseCode, ...messageToStringify } = message;
    const stringifiedMessage = JSON.stringify(messageToStringify);
    return [destLocation, responseCode || ResponseCode.N, stringifiedMessage];
}
function extractResponseIdFromMessage(message) {
    if (typeof message === 'string' && isPackedMessage(message)) {
        const stringifiedMessage = message.substr(startOfStringifiedMessageField);
        return JSON.parse(stringifiedMessage).responseId;
    }
    if (typeof message === 'string') {
        // must be stringifiedMessage
        return JSON.parse(message).responseId;
    }
    return message.responseId;
}
//# sourceMappingURL=BridgeHelpers.js.map