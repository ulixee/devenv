"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectObserver_1 = require("@ulixee/datastore/lib/ObjectObserver");
const OutputRebuilder_1 = require("../lib/OutputRebuilder");
describe('basic OutputRebuilder tests', () => {
    it('should be able to rebuild an output with snapshots at every external id', async () => {
        const observable = new ObjectObserver_1.default({});
        const clientOutput = observable.proxy;
        const replayOutput = new OutputRebuilder_1.default();
        let id = 0;
        observable.onChanges = changes => {
            const changesToRecord = changes.map(change => ({
                type: change.type,
                value: change.value,
                path: JSON.stringify(change.path),
                lastCommandId: id,
                timestamp: Date.now(),
            }));
            replayOutput.applyChanges(changesToRecord);
        };
        clientOutput.test = 1;
        expect(replayOutput.getLatestSnapshot(id).output).toEqual(clientOutput);
        id += 1;
        clientOutput.sub = { nested: true, str: 'test', num: 1 };
        expect(replayOutput.getLatestSnapshot(id).output).toEqual(clientOutput);
        id += 1;
        delete clientOutput.sub.num;
        expect(replayOutput.getLatestSnapshot(id).output).toEqual(clientOutput);
        id += 1;
        delete clientOutput.sub;
        delete clientOutput.test;
        expect(replayOutput.getLatestSnapshot(id).output).toEqual(clientOutput);
        id += 1;
        clientOutput.array = [{ test: 1 }, { test: 2 }, { test: 3 }];
        expect(replayOutput.getLatestSnapshot(id).output).toEqual(clientOutput);
        id += 1;
        clientOutput.array.splice(1, 1);
        expect(replayOutput.getLatestSnapshot(id).output).toEqual(clientOutput);
        id += 1;
        clientOutput.array.push({ test: 0 });
        clientOutput.array.sort((a, b) => {
            return a.test - b.test;
        });
        expect(replayOutput.getLatestSnapshot(id).output).toEqual(clientOutput);
    });
    it('should be able to get the latest state of an output snapshot', async () => {
        const observable = new ObjectObserver_1.default({});
        const clientOutput = observable.proxy;
        const replayOutput = new OutputRebuilder_1.default();
        let id = 1;
        observable.onChanges = changes => {
            const changesToRecord = changes.map(change => ({
                type: change.type,
                value: change.value,
                path: JSON.stringify(change.path),
                lastCommandId: id,
                timestamp: Date.now(),
            }));
            replayOutput.applyChanges(changesToRecord);
        };
        clientOutput.test = 1;
        id += 1;
        clientOutput.sub = { nested: true, str: 'test', num: 1 };
        id += 1;
        delete clientOutput.sub.num;
        id += 1;
        clientOutput.array = [{ test: 1 }, { test: 2 }, { test: 3 }];
        const latest = replayOutput.getLatestSnapshot();
        expect(latest.output).toEqual(clientOutput);
        expect(latest.changes).toHaveLength(1);
    });
});
//# sourceMappingURL=rebuildOutput.test.js.map