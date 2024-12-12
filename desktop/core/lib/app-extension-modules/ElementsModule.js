"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const highlightConfig_1 = require("./highlightConfig");
const installSymbol = Symbol.for('@ulixee/generateSelectorMap');
class ElementsModule {
    constructor(chromeAliveWindowController) {
        this.chromeAliveWindowController = chromeAliveWindowController;
    }
    async onNewPage(page) {
        await page.devtoolsSession.send('DOM.enable');
        await page.devtoolsSession.send('Overlay.enable');
    }
    async highlightNode(id) {
        await this.chromeAliveWindowController.activePage?.devtoolsSession.send('Overlay.highlightNode', {
            highlightConfig: highlightConfig_1.default,
            ...id,
        });
    }
    async hideHighlight() {
        await this.chromeAliveWindowController.activePage?.devtoolsSession.send('Overlay.hideHighlight');
    }
    async generateQuerySelector(id) {
        const frame = this.chromeAliveWindowController.activePage.mainFrame;
        const chromeObjectId = id.objectId ?? (await frame.resolveDevtoolsNodeId(id.backendNodeId, false));
        if (!frame[installSymbol]) {
            await frame.evaluate(injectedScript, { isolateFromWebPageEnvironment: false });
            frame[installSymbol] = true;
        }
        return await frame.evaluateOnNode(chromeObjectId, `(() => {
      const context = generateSelectorMap(this)
      return {
        target: {
          heroNodeId: context.target.heroNodeId,
          selectorOptions: context.target.selectorOptions,
        },
        ancestors: context.ancestors.map(x => ({
          heroNodeId: x.heroNodeId,
          selectorOptions: x.selectorOptions,
        })),
        topMatches: context.selectors.slice(0, 5000).map(x => x.selector),
        nodePath: context.nodePath,
      };
    })();`);
    }
}
exports.default = ElementsModule;
const pageScripts = {
    generateSelectorMap: fs.readFileSync(`${__dirname}/../../injected-scripts/generateSelectorMap.js`, 'utf8'),
};
const injectedScript = `(function generateSelectorMap() {
  const exports = {}; // workaround for ts adding an exports variable

  ${pageScripts.generateSelectorMap};
  
  window.generateSelectorMap = generateSelectorMap;
})();`;
//# sourceMappingURL=ElementsModule.js.map