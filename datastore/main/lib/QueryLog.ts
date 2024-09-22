import { debounce } from '@ulixee/commons/lib/asyncUtils';
import Queue from '@ulixee/commons/lib/Queue';
import TypeSerializer from '@ulixee/commons/lib/TypeSerializer';
import * as Fs from 'fs';
import * as Readline from 'readline';
import { getDataDirectory } from '@ulixee/commons/lib/dirUtils';
import { IDatastoreApiTypes } from '@ulixee/platform-specification/datastore';
import * as Path from 'path';
import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import IQueryLogEntry from '../interfaces/IQueryLogEntry';

export default class QueryLog {
  public queriesById: { [id: string]: IQueryLogEntry } = {};
  public queryLogPath = Path.join(getDataDirectory(), 'ulixee', 'user-querylog.jsonl');

  private fileWatcher: Fs.FSWatcher;
  private queryLogBytesRead = 0;
  private appendOps = new Set<Promise<any>>();
  private events = new TypedEventEmitter<{
    new: IQueryLogEntry;
  }>();

  private readQueue = new Queue();

  constructor() {
    if (!Fs.existsSync(Path.dirname(this.queryLogPath)))
      Fs.mkdirSync(Path.dirname(this.queryLogPath));
    if (!Fs.existsSync(this.queryLogPath)) Fs.writeFileSync(this.queryLogPath, '');
    this.watchFileCallback = this.watchFileCallback.bind(this);
    this.publishQueries = debounce(this.publishQueries.bind(this), 50);
  }

  public monitor(onNewQuery: (query: IQueryLogEntry) => any): { stop: () => void } {
    if (process.platform === 'win32' || process.platform === 'darwin') {
      this.fileWatcher = Fs.watch(this.queryLogPath, { persistent: false }, () => {
        this.publishQueries();
      });
    } else {
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

  public async close(): Promise<void> {
    await Promise.all(this.appendOps);
    this.readQueue.stop();
    this.stopWatching();
  }

  public log(
    query:
      | IDatastoreApiTypes['Datastore.query']['args']
      | IDatastoreApiTypes['Datastore.stream']['args'],
    startDate: Date,
    outputs: any[],
    metadata: IDatastoreApiTypes['Datastore.query']['result']['metadata'],
    cloudNodeHost: string,
    cloudNodeIdentity?: string,
    error?: Error,
  ): void {
    const { queryId, version, id, affiliateId, payment } = query;
    const streamQuery = query as IDatastoreApiTypes['Datastore.stream']['args'];

    const input = 'boundValues' in query ? query.boundValues : streamQuery.input;

    try {
      const record = <IQueryLogEntry>{
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
        .appendFile(this.queryLogPath, `${TypeSerializer.stringify(record)}\n`)
        .catch(() => null);
      this.appendOps.add(op);
      void op.finally(() => this.appendOps.delete(op));
    } catch {}
  }

  private stopWatching(): void {
    if (this.fileWatcher) this.fileWatcher?.close();
    else Fs.unwatchFile(this.queryLogPath, this.watchFileCallback);
  }

  private watchFileCallback(curr: Fs.Stats, prev: Fs.Stats): void {
    if (curr.mtimeMs > prev.mtimeMs) {
      void this.publishQueries();
    }
  }

  private publishQueries(): void {
    void this.readQueue.run(async () => {
      try {
        const readable = Fs.createReadStream(this.queryLogPath, { start: this.queryLogBytesRead });
        const reader = Readline.createInterface({ input: readable });
        for await (const line of reader) {
          const record: IQueryLogEntry = TypeSerializer.parse(line);
          if (this.queriesById[record.queryId]) continue;

          this.queriesById[record.queryId] = record;
          this.events.emit('new', record);
        }
        this.queryLogBytesRead += readable.bytesRead;
        readable.close();
      } catch (err) {
        console.error('Error emitting new queries from log', err);
      }
    });
  }
}
