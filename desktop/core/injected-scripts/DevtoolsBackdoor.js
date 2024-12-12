"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/naming-convention
const ___emitFromDevtoolsToCore = '___emitFromDevtoolsToCore';
const extensionId = 'nhchohpofcdodgoddejmfcebjkmdafmk';
const EventType = {
    ElementWasSelected: 'ElementWasSelected',
    ToggleInspectElementMode: 'ToggleInspectElementMode',
};
document.addEventListener('DOMContentLoaded', () => {
    DevtoolsBackdoor.showHeroScriptPanel();
});
class DevtoolsBackdoor {
    static async getInspectedTabId(timeoutMs = 10e3) {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            const tabId = DevToolsAPI.getInspectedTabId();
            if (tabId !== undefined) {
                return tabId;
            }
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
    static showConsolePanel() {
        DevToolsAPI.showPanel(`console`);
    }
    static showElementsPanel() {
        DevToolsAPI.showPanel(`elements`);
    }
    static showHeroScriptPanel() {
        // We can get list from UI.panels
        DevToolsAPI.showPanel(`chrome-extension://${extensionId}HeroScript`);
    }
    static showStateGeneratorPanel() {
        DevToolsAPI.showPanel(`chrome-extension://${extensionId}StateGenerator`);
    }
    static closeDevtools() {
        InspectorFrontendHost.closeWindow();
    }
    // @ts-expect-error
    static toggleInspectElementMode(InspectorFrontendAPI = window.InspectorFrontendAPI) {
        const isActive = this.inspectElementModeIsActive;
        InspectorFrontendAPI.enterInspectElementMode();
        return !isActive;
    }
    static async searchDom(query) {
        const SDK = await eval("import('devtools://devtools/bundled/core/sdk/sdk.js')");
        const domModels = SDK.TargetManager.TargetManager.instance().models(SDK.DOMModel.DOMModel);
        const domModel = domModels[0];
        const searchOptions = { query, includeUserAgentShadowDOM: true };
        const { searchId, resultCount } = await domModel.agent.invoke_performSearch(searchOptions);
        if (!resultCount)
            return [];
        const resultOptions = { searchId, fromIndex: 0, toIndex: resultCount };
        const results = await domModel.agent.invoke_getSearchResults(resultOptions);
        if (!results.nodeIds)
            throw new Error(results.getError());
        return results.nodeIds.map((x) => convertToElementSummary(x, domModel));
    }
    static async revealNodeInElementsPanel(backendNodeId) {
        const Common = await eval("import('devtools://devtools/bundled/core/common/common.js')");
        const SDK = await eval("import('devtools://devtools/bundled/core/sdk/sdk.js')");
        const domModels = SDK.TargetManager.TargetManager.instance().models(SDK.DOMModel.DOMModel);
        const domModel = domModels[0];
        const nodeMap = await domModel.pushNodesByBackendIdsToFrontend(new Set([backendNodeId]));
        const node = nodeMap.get(backendNodeId);
        void Common.Revealer.reveal(node);
    }
}
DevtoolsBackdoor.inspectElementModeIsActive = false;
function convertToElementSummary(nodeId, domModel) {
    let node = domModel.nodeForId(nodeId);
    const nodeValueInternal = node.nodeValueInternal;
    while ([2, 3, 4, 7, 8].includes(node.nodeType())) {
        node = node.parentNode;
    }
    const nodeType = node.nodeType();
    const backendNodeId = node.backendNodeId();
    const nodeName = node.nodeName();
    const localName = node.localName();
    const attributes = node.attributes().map(x => ({ name: x.name, value: x.value }));
    const hasChildren = !!node.childNodeCount();
    return {
        nodeType,
        backendNodeId,
        nodeName,
        localName,
        attributes,
        hasChildren,
        nodeValueInternal,
    };
}
// BIND LISTENERS ////////////////////////////////////////////////////////////////////////////////////////
async function emitElementWasSelected() {
    const Elements = await eval("import('devtools://devtools/bundled/panels/elements/elements.js')");
    const ElementsTreeOutline = Elements.ElementsTreeOutline.ElementsTreeOutline;
    const orignalFn = ElementsTreeOutline.prototype.selectDOMNode;
    function selectDOMNode(node, focus) {
        if (node) {
            const payload = JSON.stringify({
                event: EventType.ElementWasSelected,
                backendNodeId: node.backendNodeId(),
            });
            window[___emitFromDevtoolsToCore]?.(payload);
        }
        orignalFn.call(this, node, focus);
    }
    ElementsTreeOutline.prototype.selectDOMNode = selectDOMNode;
}
emitElementWasSelected().catch(console.error);
async function emitToggledInspectElementMode() {
    const Elements = await eval("import('devtools://devtools/bundled/panels/elements/elements.js')");
    const InspectElementModeController = Elements.InspectElementModeController.InspectElementModeController;
    const orignalFn = InspectElementModeController.prototype.setMode;
    function setMode(mode) {
        const isActive = mode === 'searchForNode' || mode === 'searchForUAShadowDOM';
        const payload = JSON.stringify({ event: EventType.ToggleInspectElementMode, isActive, mode });
        DevtoolsBackdoor.inspectElementModeIsActive = isActive;
        window[___emitFromDevtoolsToCore](payload);
        orignalFn.call(this, mode);
    }
    InspectElementModeController.prototype.setMode = setMode;
}
emitToggledInspectElementMode().catch(console.error);
// ATTACH TO WINDOW ///////////////////////////////////////////////////////////////////////////////////
window.DevtoolsBackdoor = DevtoolsBackdoor;
// const SDK = await eval("import('devtools://devtools/bundled/core/sdk/sdk.js')");
// const OverlayModel = SDK.OverlayModel.OverlayModel;
// // THIS CREATES CONTEXT MENU
// const injectContextMenu = `
// async function injectContextMenu(sendToCoreFnName, eventType) {
//   const elements = await import('./devtools-frontend/front_end/panels/elements/elements.js');
//   const ElementsTreeElement = elements.ElementsTreeElement.ElementsTreeElement;
//   const populateNodeContextMenu = ElementsTreeElement.prototype.populateNodeContextMenu;
//   ElementsTreeElement.prototype.populateNodeContextMenu = function(contextMenu) {
//     populateNodeContextMenu.call(this, contextMenu);
//     const backendNodeId = this._node._backendNodeId;
//     const sgMenu = contextMenu.clipboardSection().appendSubMenuItem('Selector Generator');
//     const section = sgMenu.section();
//     const isIncluded = window.___includedBackendNodeIds.has(backendNodeId);
//     const mustIncludeItem = section.appendCheckboxItem('Must Include', () => {
//       const payload = { event: eventType, backendNodeId, isIncluded: !isIncluded };
//       const packedMessage = ':ContentScript       :N:{"origLocation":"DevtoolsPrivate","payload":'+ JSON.stringify(payload) + '}';
//       window[sendToCoreFnName](packedMessage);
//     }, isIncluded);
//     const isExcluded = window.___excludedBackendNodeIds.has(backendNodeId);
//     const mustExcludeItem = section.appendCheckboxItem('Must Exclude', () => {
//       const payload = { event: eventType, backendNodeId, isExcluded: !isExcluded };
//       const packedMessage = ':ContentScript       :N:{"origLocation":"DevtoolsPrivate","payload":'+ JSON.stringify(payload) + '}';
//       window[sendToCoreFnName](packedMessage);
//     }, isExcluded);
//   }
// }
// `;
//# sourceMappingURL=DevtoolsBackdoor.js.map