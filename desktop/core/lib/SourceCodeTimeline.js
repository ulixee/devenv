"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventSubscriber_1 = require("@ulixee/commons/lib/EventSubscriber");
const SourceLoader_1 = require("@ulixee/commons/lib/SourceLoader");
const SourceMapSupport_1 = require("@ulixee/commons/lib/SourceMapSupport");
const eventUtils_1 = require("@ulixee/commons/lib/eventUtils");
const utils_1 = require("@ulixee/commons/lib/utils");
const CommandFormatter_1 = require("@ulixee/hero-core/lib/CommandFormatter");
const CallsiteLocator_1 = require("@ulixee/hero/lib/CallsiteLocator");
const Path = require("path");
const bundledPath = Path.join('build', 'desktop', 'main', 'app', 'packages');
class SourceCodeTimeline extends eventUtils_1.TypedEventEmitter {
    constructor(entrypoint, datastoresDir) {
        super();
        this.entrypoint = entrypoint;
        this.sourceFileLines = {};
        this.events = new EventSubscriber_1.default();
        this.commandsById = {};
        (0, utils_1.bindFunctions)(this);
        CallsiteLocator_1.default.ignoreModulePathFragments.push(bundledPath);
        if (this.entrypoint.includes(datastoresDir)) {
            SourceMapSupport_1.SourceMapSupport.retrieveSourceMap(this.entrypoint, Path.dirname(this.entrypoint));
        }
        const sourceLookup = SourceMapSupport_1.SourceMapSupport.getSourceFile(this.entrypoint);
        this.entrypoint = sourceLookup.path;
        if (sourceLookup.content) {
            this.sourceFileLines[this.entrypoint] = sourceLookup.content.split(/\r?\n/);
        }
    }
    listen(heroSession) {
        this.events.on(heroSession.commands, 'start', this.onCommandStart);
        this.events.on(heroSession.commands, 'finish', this.onCommandFinished);
    }
    loadCommands(commands) {
        for (const command of commands) {
            this.onCommandFinished(command, true);
        }
    }
    getCurrentState() {
        return {
            commandsById: this.commandsById,
            sourceFileLines: this.sourceFileLines,
        };
    }
    close() {
        this.events.close();
        this.commandsById = {};
    }
    clearCache() {
        for (const filename of Object.keys(this.sourceFileLines)) {
            this.sourceFileLines[filename] = undefined;
            SourceMapSupport_1.SourceMapSupport.clearCache(filename);
        }
        this.commandsById = {};
    }
    onCommandStart(command) {
        if (!command.callsite)
            return;
        const originalSourcePosition = command.callsite
            .map(x => SourceMapSupport_1.SourceMapSupport.getOriginalSourcePosition(x))
            .filter(this.filterDesktopPaths.bind(this));
        this.checkForSourceUpdates(originalSourcePosition);
        this.commandsById[command.id] = {
            command: CommandFormatter_1.default.parseResult(command),
            isComplete: false,
            originalSourcePosition,
        };
        this.emit('command', this.commandsById[command.id]);
    }
    onCommandFinished(command, skipEmit = false) {
        if (!command.callsite)
            return;
        const originalSourcePosition = command.callsite
            .map(x => SourceMapSupport_1.SourceMapSupport.getOriginalSourcePosition(x))
            .filter(this.filterDesktopPaths.bind(this));
        this.checkForSourceUpdates(originalSourcePosition);
        this.commandsById[command.id] = {
            command: CommandFormatter_1.default.parseResult(command),
            isComplete: true,
            originalSourcePosition,
        };
        if (!skipEmit)
            this.emit('command', this.commandsById[command.id]);
    }
    checkForSourceUpdates(sourceLocations) {
        for (const sourcePosition of sourceLocations) {
            const source = sourcePosition.source ?? sourcePosition.filename;
            this.sourceFileLines[source] ??= SourceLoader_1.default.getSourceLines(sourcePosition);
            this.emit('source', {
                source,
                lines: this.sourceFileLines[source],
            });
        }
    }
    filterDesktopPaths(sourceLocation) {
        if (sourceLocation.filename.includes(bundledPath))
            return false;
        return true;
    }
}
exports.default = SourceCodeTimeline;
//# sourceMappingURL=SourceCodeTimeline.js.map