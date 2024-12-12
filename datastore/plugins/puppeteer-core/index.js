"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pkg = require('@ulixee/datastore-plugins-puppeteer/package.json');
class DatastoreForPuppeteerCore {
    constructor() {
        this.name = pkg.name;
        this.version = pkg.version;
        this.nodeVmRequireWhitelist = ['@ulixee/*', 'puppeteer'];
    }
}
exports.default = DatastoreForPuppeteerCore;
//# sourceMappingURL=index.js.map