export declare enum MessageEventType {
    OpenSelectorGeneratorPanel = "OpenSelectorGeneratorPanel",
    CloseElementOptionsOverlay = "CloseElementOptionsOverlay",
    InspectElementModeChanged = "InspectElementModeChanged",
    OpenElementOptionsOverlay = "OpenElementOptionsOverlay",
    HideElementOptionsOverlay = "HideElementOptionsOverlay",
    RemoveHideFromElementOptionsOverlay = "RemoveHideFromElementOptionsOverlay",
    ContentScriptNeedsElement = "ContentScriptNeedsElement",
    RunSelectorGenerator = "RunSelectorGenerator",
    ResetSelectorGenerator = "ResetSelectorGenerator",
    AddIncludedElement = "AddIncludedElement",
    RemoveIncludedElement = "RemoveIncludedElement",
    AddExcludedElement = "AddExcludedElement",
    RemoveExcludedElement = "RemoveExcludedElement",
    FinishedSelectorGeneration = "FinishedSelectorGeneration",
    UpdateElementOptions = "UpdateElementOptions",
    CloseDevtoolsPanel = "CloseDevtoolsPanel",
    ToggleInspectElementMode = "ToggleInspectElementMode",
    UndockedFocusChange = "UndockedFocusChange"
}
export type IMessageEventType = keyof typeof MessageEventType;
export declare enum MessageLocation {
    DevtoolsPrivate = "DevtoolsPrivate",
    DevtoolsScript = "DevtoolsScript",
    ContentScript = "ContentScript",
    Core = "Core"
}
export type IMessageLocation = keyof typeof MessageLocation;
export declare const ___sendToCore = "___sendToCore";
export declare const ___receiveFromCore = "___receiveFromCore";
export declare const sendMessageFromBrowserToCoreFnName = "sendMessageFromBrowserToUlixeeCore";
export declare const eventEmitterNameInBrowser = "eventEmitterFromUlixeeCore";
export declare enum ResponseCode {
    Y = "Y",
    N = "N",
    R = "R"
}
export type IResponseCode = keyof typeof ResponseCode;
export interface IMessageObject {
    destLocation: IMessageLocation;
    origLocation: IMessageLocation;
    origTabId?: number;
    responseCode: IResponseCode;
    responseId?: string;
    payload: any;
}
export type IRestOfMessageObject = Omit<IMessageObject, 'destLocation' | 'responseCode'>;
export declare function createResponseId(): string;
export declare function packMessage(message: IMessageObject | string): string;
export declare function messageExpectsResponse(message: IMessageObject | string): boolean;
export declare function isResponseMessage(message: IMessageObject | string): boolean;
export declare function extractStringifiedComponentsFromMessage(message: IMessageObject | string): [destLocation: string, responseCode: keyof typeof ResponseCode, stringifiedMessage: string];
export declare function extractResponseIdFromMessage(message: IMessageObject | string): string;
