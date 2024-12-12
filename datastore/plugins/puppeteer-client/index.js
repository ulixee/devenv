"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppeteerExtractorPlugin = void 0;
require("@ulixee/commons/lib/SourceMapSupport");
const datastore_1 = require("@ulixee/datastore");
const Puppeteer = require("puppeteer");
const pkg = require('./package.json');
__exportStar(require("@ulixee/datastore"), exports);
let PuppeteerExtractorPlugin = class PuppeteerExtractorPlugin {
    constructor() {
        this.name = pkg.name;
        this.version = pkg.version;
    }
    async run(extractorInternal, context, next) {
        this.runOptions = extractorInternal.options;
        try {
            context.launchBrowser = this.initializePuppeteer.bind(this);
            await next();
        }
        finally {
            if (this.puppeteerBrowserPromise) {
                const browser = await this.puppeteerBrowserPromise;
                await browser.close();
            }
        }
    }
    initializePuppeteer() {
        const options = {
            headless: true,
            ...this.runOptions,
            handleSIGTERM: true,
            handleSIGHUP: true,
            handleSIGINT: true,
            pipe: true,
        };
        this.puppeteerBrowserPromise = Puppeteer.launch(options);
        return this.puppeteerBrowserPromise;
    }
};
exports.PuppeteerExtractorPlugin = PuppeteerExtractorPlugin;
exports.PuppeteerExtractorPlugin = PuppeteerExtractorPlugin = __decorate([
    datastore_1.ExtractorPluginStatics
], PuppeteerExtractorPlugin);
//# sourceMappingURL=index.js.map