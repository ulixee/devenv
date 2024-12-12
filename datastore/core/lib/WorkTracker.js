"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Resolvable_1 = require("@ulixee/commons/lib/Resolvable");
const IPendingWaitEvent_1 = require("@ulixee/commons/interfaces/IPendingWaitEvent");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const { log } = (0, Logger_1.default)(module);
class WorkTracker {
    constructor(maxRuntimeMs) {
        this.maxRuntimeMs = maxRuntimeMs;
        this.runPromises = new Set();
        this.uploadPromises = new Set();
    }
    async stop(waitForDatastoreCompletionOnShutdown) {
        if (!waitForDatastoreCompletionOnShutdown) {
            for (const promise of this.runPromises) {
                promise.reject(new IPendingWaitEvent_1.CanceledPromiseError('Shutting down Cloud'), true);
                this.runPromises.delete(promise);
            }
        }
        else {
            log.info('Waiting for completing of remaining Datastore.query calls', {
                count: this.runPromises.size,
            });
            await Promise.all([...this.runPromises].map(x => x.promise.catch(err => err)));
            this.runPromises.clear();
        }
        await Promise.all([...this.uploadPromises].map(x => x.promise.catch(err => err)));
        this.uploadPromises.clear();
    }
    trackUpload(uploadPromise) {
        const resolvable = new Resolvable_1.default(30e3);
        this.uploadPromises.add(resolvable);
        void uploadPromise
            .then(resolvable.resolve)
            .catch(resolvable.reject)
            .finally(() => this.uploadPromises.delete(resolvable));
        return resolvable.promise;
    }
    trackRun(outputPromise) {
        const resolvable = new Resolvable_1.default(this.maxRuntimeMs);
        this.runPromises.add(resolvable);
        void outputPromise
            .then(resolvable.resolve)
            .catch(resolvable.reject)
            .finally(() => this.runPromises.delete(resolvable));
        return resolvable.promise;
    }
}
exports.default = WorkTracker;
//# sourceMappingURL=WorkTracker.js.map