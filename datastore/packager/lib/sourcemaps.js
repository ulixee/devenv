"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sourcemaps;
const SourceMapSupport_1 = require("@ulixee/commons/lib/SourceMapSupport");
const SourceLoader_1 = require("@ulixee/commons/lib/SourceLoader");
// Pre-process any existing source maps so they get flattened into the result
function sourcemaps() {
    return {
        name: 'sourcemaps',
        load(id) {
            const result = { code: null, map: null };
            try {
                result.code = SourceLoader_1.default.getFileContents(id, false);
                if (result.code === null)
                    return null;
            }
            catch (_a) {
                return null;
            }
            try {
                const { map, rawMap } = SourceMapSupport_1.SourceMapSupport.retrieveSourceMap(id);
                if (map) {
                    if (rawMap.sourcesContent === undefined) {
                        rawMap.sourcesContent = [...map.sourcesContent];
                    }
                    result.map = rawMap;
                }
            }
            catch (_b) {
                /* no-op */
            }
            return Promise.resolve(result);
        },
        watchChange() {
            SourceLoader_1.default.resetCache();
        },
    };
}
//# sourceMappingURL=sourcemaps.js.map