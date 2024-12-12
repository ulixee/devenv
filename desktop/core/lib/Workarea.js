"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Viewports_1 = require("@ulixee/default-browser-emulator/lib/Viewports");
class Workarea {
    static getMaxChromeBounds() {
        if (!this.workarea)
            return null;
        return {
            top: this.workarea.top,
            left: this.workarea.left,
            width: this.workarea.width,
            height: this.workarea.height,
            scale: this.workarea.scale,
        };
    }
    static setHeroDefaultScreen(workarea) {
        this.workarea = workarea;
        const maxbounds = this.getMaxChromeBounds();
        Viewports_1.defaultScreen.width = maxbounds.width;
        Viewports_1.defaultScreen.height = maxbounds.height;
        Viewports_1.defaultScreen.scale = maxbounds.scale;
    }
}
exports.default = Workarea;
//# sourceMappingURL=Workarea.js.map