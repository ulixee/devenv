"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Resolvable_1 = require("@ulixee/commons/lib/Resolvable");
const utils_1 = require("@ulixee/commons/lib/utils");
// modified from https://github.com/rolftimmermans/event-iterator
class ResultIterable {
    get resultMetadata() {
        return this.resolvable.promise.then(() => this._resultMetadata).catch(() => this._resultMetadata);
    }
    get [Symbol.toStringTag]() {
        const pending = `${this.pullQueue.length + this.pushQueue.length} pending`;
        const completeStatus = this.error ? 'error' : 'done';
        return `ResultIterable(${this.results.length} results, ${this.resolvable.resolved ? completeStatus : pending})`;
    }
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.results = [];
        this.resolvable = new Resolvable_1.default();
        this.pullQueue = [];
        this.pushQueue = [];
        // suppress unhandled rejections
        this.resolvable.promise.catch(() => null);
        (0, utils_1.bindFunctions)(this);
    }
    push(value, index) {
        if (this.resolvable.isResolved)
            return;
        if (index !== undefined && index !== this.results.length - 1) {
            this.results[index] = value;
        }
        else {
            this.results.push(value);
        }
        const resolution = { value, done: false };
        if (this.pullQueue.length) {
            this.pullQueue.shift().resolve(resolution);
        }
        else {
            this.pushQueue.push(Promise.resolve(resolution));
        }
    }
    done(resultMetadata) {
        if (resultMetadata)
            this._resultMetadata ??= resultMetadata;
        if (this.resolvable.isResolved)
            return;
        this.resolvable.resolve(this.results);
        this.onComplete?.();
        for (const placeholder of this.pullQueue) {
            placeholder.resolve({ value: undefined, done: true });
        }
        this.pullQueue.length = 0;
    }
    reject(error, resultMetadata) {
        if (resultMetadata)
            this._resultMetadata = resultMetadata;
        if (this.resolvable.isResolved)
            return;
        this.resolvable.reject(error);
        this.error = error;
        this.onComplete?.();
        if (this.pullQueue.length) {
            for (const placeholder of this.pullQueue) {
                placeholder.reject(error);
            }
            this.pullQueue.length = 0;
        }
        else {
            // eslint-disable-next-line promise/no-promise-in-callback
            const rejection = Promise.reject(error);
            /* Attach error handler to avoid leaking an unhandled promise rejection. */
            // eslint-disable-next-line promise/no-promise-in-callback
            rejection.catch(() => { });
            this.pushQueue.push(rejection);
        }
    }
    then(onfulfilled, onrejected) {
        if (this.resolvable.isResolved) {
            return this.resolvable.then(onfulfilled, onrejected);
        }
        return new Promise(async (resolve, reject) => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                for await (const x of this) {
                    // do nothing
                }
            }
            catch (error) {
                return reject(error);
            }
            return this.resolvable.then(resolve, reject);
        }).then(onfulfilled, onrejected);
    }
    catch(onrejected) {
        return this.resolvable.catch(onrejected);
    }
    finally(onfinally) {
        return this.resolvable.finally(onfinally);
    }
    [Symbol.asyncIterator]() {
        if (this.resolvable.isResolved) {
            const iterator = this.results[Symbol.iterator]();
            return {
                next() {
                    const next = iterator.next();
                    return Promise.resolve(next);
                },
            };
        }
        return {
            next: this.iteratorResultNext,
            return: this.iteratorResultReturn,
            throw: this.iteratorResultThrow,
        };
    }
    iteratorResultReturn() {
        this.done();
        return Promise.resolve({ value: undefined, done: true });
    }
    iteratorResultThrow(e) {
        this.reject(e);
        return Promise.resolve({ value: undefined, done: true });
    }
    iteratorResultNext() {
        if (this.error)
            return Promise.reject(this.error);
        const result = this.pushQueue.shift();
        if (result) {
            return result;
        }
        if (this.resolvable.isResolved) {
            return Promise.resolve({ value: undefined, done: true });
        }
        const pullResolvable = new Resolvable_1.default();
        this.pullQueue.push(pullResolvable);
        return pullResolvable.promise;
    }
}
exports.default = ResultIterable;
//# sourceMappingURL=ResultIterable.js.map