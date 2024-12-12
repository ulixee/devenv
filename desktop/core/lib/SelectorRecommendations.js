"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@ulixee/commons/config");
const Fs = require("fs");
const Path = require("path");
const fileUtils_1 = require("@ulixee/commons/lib/fileUtils");
class SelectorRecommendations {
    constructor(scriptMetadata) {
        this.scriptMetadata = scriptMetadata;
        this.config = config_1.default.load({ workingDirectory: process.cwd(), ...scriptMetadata });
        this.projectPath = this.findProjectPath();
        this.relativeScriptPath = Path.relative(`${this.projectPath}/..`, Path.resolve(scriptMetadata.entrypoint));
    }
    async save(map, url) {
        const configDirectory = this.config.directoryPath;
        const filename = this.getFilename();
        const selectorMapsPath = `${configDirectory}/selectors/${filename}.json`;
        let selectorMaps = {};
        if (!(await (0, fileUtils_1.existsAsync)(Path.dirname(selectorMapsPath)))) {
            Fs.mkdirSync(Path.dirname(selectorMapsPath));
        }
        else {
            selectorMaps =
                (await (0, fileUtils_1.readFileAsJson)(selectorMapsPath).catch(() => null)) ?? {};
        }
        selectorMaps[url] ??= {};
        selectorMaps[url][map.nodePath] = map;
        await (0, fileUtils_1.safeOverwriteFile)(selectorMapsPath, JSON.stringify(selectorMaps));
    }
    getFilename() {
        const entrypoint = this.scriptMetadata.entrypoint;
        return Path.basename(entrypoint)
            .replace(Path.extname(entrypoint), '')
            .replace(/[.]/g, '-')
            .toLowerCase();
    }
    findProjectPath() {
        let last;
        let path = Path.resolve(this.scriptMetadata.workingDirectory);
        do {
            last = path;
            if (Fs.existsSync(Path.join(path, 'package.json'))) {
                return path;
            }
            path = Path.dirname(path);
        } while (path && path !== last);
    }
}
exports.default = SelectorRecommendations;
//# sourceMappingURL=SelectorRecommendations.js.map