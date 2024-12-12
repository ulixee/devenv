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
exports.HeroExtractorPlugin = void 0;
// eslint-disable-next-line max-classes-per-file
require("@ulixee/commons/lib/SourceMapSupport");
const hero_1 = require("@ulixee/hero");
const internal_1 = require("@ulixee/hero/lib/internal");
const datastore_1 = require("@ulixee/datastore");
__exportStar(require("@ulixee/datastore"), exports);
const pkg = require('./package.json');
let HeroExtractorPlugin = class HeroExtractorPlugin {
    constructor(components) {
        this.name = pkg.name;
        this.version = pkg.version;
        this.heroReplays = new Set();
        this.pendingOutputs = [];
        this.pendingUploadPromises = new Set();
        this.components = components;
        this.uploadOutputs = this.uploadOutputs.bind(this);
    }
    async run(extractorInternal, context, next) {
        this.runOptions = extractorInternal.options;
        this.extractorInternal = extractorInternal;
        this.extractorInternal.onOutputChanges = this.onOutputChanged.bind(this);
        const needsClose = [];
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const container = this;
        try {
            const HeroReplayBase = hero_1.HeroReplay;
            /* eslint-disable @typescript-eslint/no-unused-vars */
            const { input, affiliateId, payment, authentication, trackMetadata, id, version, ...heroApplicableOptions } = extractorInternal.options;
            /* eslint-enable @typescript-eslint/no-unused-vars */
            const heroOptions = {
                ...heroApplicableOptions,
                input: this.extractorInternal.input,
            };
            const HeroBase = hero_1.default;
            // eslint-disable-next-line @typescript-eslint/no-shadow
            context.Hero = class Hero extends HeroBase {
                constructor(options = {}) {
                    if (container.hero) {
                        throw new Error('Multiple Hero instances are not supported in a Datastore Extractor.');
                    }
                    super({ ...heroOptions, ...options });
                    container.hero = this;
                    this.toCrawlerOutput = async () => {
                        return {
                            sessionId: await this.sessionId,
                            crawler: 'Hero',
                            version: this.version,
                        };
                    };
                    void this.once('connected', container.onConnected.bind(container, this));
                    needsClose.push(super.close.bind(this));
                }
                // don't close until the end
                close() {
                    return Promise.resolve();
                }
            };
            // eslint-disable-next-line @typescript-eslint/no-shadow
            context.HeroReplay = class HeroReplay extends HeroReplayBase {
                constructor(options) {
                    const replaySessionId = options.replaySessionId || process.env.ULX_REPLAY_SESSION_ID;
                    super({
                        ...heroOptions,
                        ...options,
                        replaySessionId,
                    });
                    container.heroReplays.add(this);
                    this.once('connected', container.onConnected.bind(container, this));
                    needsClose.push(super.close.bind(this));
                }
                // don't close until the end
                close() {
                    return Promise.resolve();
                }
                static async fromCrawler(crawler, options = {}) {
                    if (!heroOptions.replaySessionId) {
                        const crawl = await context.crawl(crawler, options);
                        heroOptions.replaySessionId = crawl.sessionId;
                        heroOptions.input = options.input;
                    }
                    return new context.HeroReplay(heroOptions);
                }
            };
            await next();
            // need to allow an immediate for directly emitted outputs to register
            await new Promise(setImmediate);
            await Promise.all(this.pendingUploadPromises);
        }
        finally {
            await Promise.allSettled(needsClose.map(x => x()));
        }
    }
    // INTERNALS ///////////////////////
    onConnected(source) {
        const coreSessionPromise = source[internal_1.InternalPropertiesSymbol].coreSessionPromise;
        this.coreSessionPromise = coreSessionPromise;
        this.registerSessionClose(coreSessionPromise).catch(() => null);
        this.uploadOutputs();
    }
    async registerSessionClose(coreSessionPromise) {
        try {
            const coreSession = await coreSessionPromise;
            if (!coreSession)
                return;
            if (this.runOptions.trackMetadata) {
                this.runOptions.trackMetadata('heroSessionId', coreSession.sessionId, this.name);
            }
            coreSession.once('close', () => {
                if (this.coreSessionPromise === coreSessionPromise)
                    this.coreSessionPromise = null;
            });
        }
        catch (err) {
            console.error(err);
            if (this.coreSessionPromise === coreSessionPromise)
                this.coreSessionPromise = null;
        }
    }
    uploadOutputs() {
        if (!this.pendingOutputs.length || !this.coreSessionPromise)
            return;
        const records = [...this.pendingOutputs];
        this.pendingOutputs.length = 0;
        const promise = this.coreSessionPromise.then(x => x.recordOutput(records)).catch(() => null);
        this.pendingUploadPromises.add(promise);
        void promise.then(() => this.pendingUploadPromises.delete(promise));
    }
    onOutputChanged(index, changes) {
        const changesToRecord = changes.map(change => ({
            type: change.type,
            value: change.value,
            path: JSON.stringify([index, ...change.path]),
            timestamp: Date.now(),
        }));
        for (const change of changesToRecord) {
            this.pendingOutputs.push(change);
        }
        this.uploadOutputs();
    }
};
exports.HeroExtractorPlugin = HeroExtractorPlugin;
exports.HeroExtractorPlugin = HeroExtractorPlugin = __decorate([
    datastore_1.ExtractorPluginStatics
], HeroExtractorPlugin);
//# sourceMappingURL=index.js.map