"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ICorePlugin_1 = require("@ulixee/hero-interfaces/ICorePlugin");
const CorePlugin_1 = require("@ulixee/hero-plugin-utils/lib/CorePlugin");
const Workarea_1 = require("./Workarea");
let FullscreenHeroCorePlugin = class FullscreenHeroCorePlugin extends CorePlugin_1.default {
    configure(options) {
        if (options.viewport?.isDefault) {
            Object.assign(options.viewport, this.getMaxChromeViewport());
        }
    }
    async onNewPage(page) {
        const { windowId, bounds } = await page.devtoolsSession.send('Browser.getWindowForTarget');
        const maxBounds = Workarea_1.default.getMaxChromeBounds();
        if (!maxBounds)
            return;
        if (maxBounds.height === bounds.height && maxBounds.width === bounds.width)
            return;
        await page.devtoolsSession.send('Browser.setWindowBounds', {
            windowId,
            bounds: {
                ...maxBounds,
                windowState: 'normal',
            },
        });
    }
    getMaxChromeViewport() {
        const maxChromeBounds = Workarea_1.default.getMaxChromeBounds();
        return {
            width: 0,
            height: 0,
            deviceScaleFactor: 0,
            positionX: maxChromeBounds?.left,
            positionY: maxChromeBounds?.top,
            screenWidth: maxChromeBounds?.width,
            screenHeight: maxChromeBounds?.height,
            mobile: undefined,
        };
    }
    static shouldActivate(profile, session) {
        return session.options.showChromeAlive === true;
    }
};
FullscreenHeroCorePlugin.id = '@ulixee/fullscreen-hero-core-plugin';
FullscreenHeroCorePlugin = __decorate([
    ICorePlugin_1.CorePluginClassDecorator
], FullscreenHeroCorePlugin);
exports.default = FullscreenHeroCorePlugin;
//# sourceMappingURL=FullscreenHeroCorePlugin.js.map