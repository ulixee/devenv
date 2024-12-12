"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
class OutputRebuilder {
    constructor() {
        this.snapshotsByCommandId = new Map();
        this.latestCommandId = -1;
    }
    getLatestSnapshot(commandId) {
        commandId ??= this.latestCommandId;
        for (let id = commandId; id >= 0; id -= 1) {
            if (this.snapshotsByCommandId.has(id)) {
                return this.snapshotsByCommandId.get(id);
            }
        }
    }
    applyChanges(changes) {
        for (const output of changes) {
            const path = parseIfNeeded(output.path);
            if (output.lastCommandId > this.latestCommandId)
                this.latestCommandId = output.lastCommandId;
            const snapshot = this.getSnapshotAtPoint(output.lastCommandId, path);
            let propertyOwner = snapshot.output;
            const property = path.pop();
            // re-build objects up to the last entry so we don't modify previous entries
            for (const entry of path) {
                const existing = propertyOwner[entry];
                if (existing && typeof existing === 'object') {
                    if (Array.isArray(existing))
                        propertyOwner[entry] = [...existing];
                    else
                        propertyOwner[entry] = { ...existing };
                }
                propertyOwner = propertyOwner[entry];
            }
            if (output.type === 'delete') {
                if (Array.isArray(propertyOwner)) {
                    propertyOwner.splice(property, 1);
                }
                else {
                    delete propertyOwner[property];
                }
            }
            else if (output.type === 'reorder') {
                const order = output.value;
                if (property) {
                    const startArray = propertyOwner[property];
                    propertyOwner[property] = order.map(x => startArray[x]);
                }
                else {
                    snapshot.output = order.map(x => snapshot.output[x]);
                }
            }
            else {
                propertyOwner[property] = output.value;
            }
            let flatPath = '';
            for (const part of path.concat([property])) {
                if (typeof part === 'number') {
                    flatPath += `[${part}]`;
                }
                else if (typeof part === 'string' && part.includes('.')) {
                    flatPath += `["${part}"]`;
                }
                else {
                    flatPath += `.${part}`;
                }
            }
            snapshot.changes.push({ path: flatPath, type: output.type });
            snapshot.bytes = Buffer.byteLength(JSON.stringify(snapshot.output));
        }
    }
    getSnapshotAtPoint(lastCommandId, firstPathEntry) {
        let prevCommandId = lastCommandId;
        while (prevCommandId >= 0) {
            if (this.snapshotsByCommandId.has(prevCommandId)) {
                break;
            }
            prevCommandId -= 1;
        }
        let startOutput = this.snapshotsByCommandId.get(prevCommandId)?.output;
        if (!startOutput) {
            if (typeof firstPathEntry[0] === 'number')
                startOutput = [];
            else
                startOutput = {};
        }
        else if (Array.isArray(startOutput)) {
            startOutput = [...startOutput];
        }
        else {
            startOutput = { ...startOutput };
        }
        if (!this.snapshotsByCommandId.has(lastCommandId)) {
            this.snapshotsByCommandId.set(lastCommandId, {
                output: null,
                changes: [],
                bytes: 0,
            });
        }
        const changeEntry = this.snapshotsByCommandId.get(lastCommandId);
        changeEntry.output = startOutput;
        return changeEntry;
    }
}
exports.default = OutputRebuilder;
function parseIfNeeded(json) {
    if (typeof json === 'string') {
        return TypeSerializer_1.default.parse(json);
    }
    return json;
}
//# sourceMappingURL=OutputRebuilder.js.map