"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncUtils_1 = require("@ulixee/commons/lib/asyncUtils");
const Queue_1 = require("@ulixee/commons/lib/Queue");
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
const Fs = require("fs");
const Readline = require("readline");
const dirUtils_1 = require("@ulixee/commons/lib/dirUtils");
const Path = require("path");
const eventUtils_1 = require("@ulixee/commons/lib/eventUtils");
class QueryLog {
    constructor() {
        this.queriesById = {};
        this.queryLogPath = Path.join((0, dirUtils_1.getDataDirectory)(), 'ulixee', 'user-querylog.jsonl');
        this.queryLogBytesRead = 0;
        this.appendOps = new Set();
        this.events = new eventUtils_1.TypedEventEmitter();
        this.readQueue = new Queue_1.default();
        if (!Fs.existsSync(Path.dirname(this.queryLogPath)))
            Fs.mkdirSync(Path.dirname(this.queryLogPath));
        if (!Fs.existsSync(this.queryLogPath))
            Fs.writeFileSync(this.queryLogPath, '');
        this.watchFileCallback = this.watchFileCallback.bind(this);
        this.publishQueries = (0, asyncUtils_1.debounce)(this.publishQueries.bind(this), 50);
    }
    monitor(onNewQuery) {
        if (process.platform === 'win32' || process.platform === 'darwin') {
            this.fileWatcher = Fs.watch(this.queryLogPath, { persistent: false }, () => {
                this.publishQueries();
            });
        }
        else {
            Fs.watchFile(this.queryLogPath, { persistent: false }, this.watchFileCallback);
        }
        this.events.on('new', onNewQuery);
        this.publishQueries();
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return {
            stop() {
                self.events.off('new', onNewQuery);
                if (!self.events.listenerCount('new')) {
                    self.stopWatching();
                }
            },
        };
    }
    async close() {
        await Promise.all(this.appendOps);
        this.readQueue.stop();
        this.stopWatching();
    }
    log(query, startDate, outputs, metadata, cloudNodeHost, cloudNodeIdentity, error) {
        const { queryId, version, id, affiliateId, payment } = query;
        const streamQuery = query;
        const input = 'boundValues' in query ? query.boundValues : streamQuery.input;
        try {
            const record = {
                queryId,
                version,
                datastoreId: id,
                date: startDate,
                affiliateId,
                creditId: payment?.credits?.id,
                channelHoldId: payment?.channelHold?.id,
                input,
                query: 'sql' in query ? query.sql : `stream(${streamQuery.name})`,
                outputs,
                error,
                cloudNodeHost,
                cloudNodeIdentity,
                ...(metadata ?? {}),
            };
            const op = Fs.promises
                .appendFile(this.queryLogPath, `${TypeSerializer_1.default.stringify(record)}\n`)
                .catch(() => null);
            this.appendOps.add(op);
            void op.finally(() => this.appendOps.delete(op));
        }
        catch { }
    }
    stopWatching() {
        if (this.fileWatcher)
            this.fileWatcher?.close();
        else
            Fs.unwatchFile(this.queryLogPath, this.watchFileCallback);
    }
    watchFileCallback(curr, prev) {
        if (curr.mtimeMs > prev.mtimeMs) {
            void this.publishQueries();
        }
    }
    publishQueries() {
        void this.readQueue.run(async () => {
            try {
                const readable = Fs.createReadStream(this.queryLogPath, { start: this.queryLogBytesRead });
                const reader = Readline.createInterface({ input: readable });
                for await (const line of reader) {
                    const record = TypeSerializer_1.default.parse(line);
                    if (this.queriesById[record.queryId])
                        continue;
                    this.queriesById[record.queryId] = record;
                    this.events.emit('new', record);
                }
                this.queryLogBytesRead += readable.bytesRead;
                readable.close();
            }
            catch (err) {
                console.error('Error emitting new queries from log', err);
            }
        });
    }
}
exports.default = QueryLog;
//# sourceMappingURL=QueryLog.js.map