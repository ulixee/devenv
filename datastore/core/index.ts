import * as Os from 'os';
import * as Path from 'path';
import { promises as Fs } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import * as Finalhandler from 'finalhandler';
import * as ServeStatic from 'serve-static';
import IFunctionPluginCore from '@ulixee/datastore/interfaces/IFunctionPluginCore';
import ITransportToClient from '@ulixee/net/interfaces/ITransportToClient';
import Logger from '@ulixee/commons/lib/Logger';
import Resolvable from '@ulixee/commons/lib/Resolvable';
import { existsAsync } from '@ulixee/commons/lib/fileUtils';
import ApiRegistry from '@ulixee/net/lib/ApiRegistry';
import { IDatastoreApis } from '@ulixee/specification/datastore';
import ShutdownHandler from '@ulixee/commons/lib/ShutdownHandler';
import IDatastoreEvents from '@ulixee/datastore/interfaces/IDatastoreEvents';
import IDatastoreCoreConfigureOptions from './interfaces/IDatastoreCoreConfigureOptions';
import env from './env';
import DatastoreRegistry from './lib/DatastoreRegistry';
import { unpackDbxFile } from './lib/dbxUtils';
import WorkTracker from './lib/WorkTracker';
import IDatastoreApiContext from './interfaces/IDatastoreApiContext';
import SidechainClientManager from './lib/SidechainClientManager';
import DatastoreUpload from './endpoints/Datastore.upload';
import DatastoreQuery from './endpoints/Datastore.query';
import DatastoreQueryLocalScript from './endpoints/Datastore.queryLocalScript';
import DatastoreMeta from './endpoints/Datastore.meta';
import DatastoreQueryInternal from './endpoints/Datastore.queryInternal';
import DatastoreQueryInternalTable from './endpoints/Datastore.queryInternalTable';
import DatastoreQueryInternalFunctionResult from './endpoints/Datastore.queryInternalFunctionResult';
import DatastoreInitializeInMemoryTable from './endpoints/Datastore.createInMemoryTable';
import DatastoreInitializeInMemoryFunction from './endpoints/Datastore.createInMemoryFunction';
import IDatastoreConnectionToClient from './interfaces/IDatastoreConnectionToClient';
import DatastoreStorage from './lib/DatastoreStorage';
import DatastoreStream from './endpoints/Datastore.stream';
import DatastoreAdmin from './endpoints/Datastore.admin';
import DatastoreCreditsBalance from './endpoints/Datastore.creditsBalance';

const { log } = Logger(module);

export default class DatastoreCore {
  public static connections = new Set<IDatastoreConnectionToClient>();
  public static get datastoresDir(): string {
    return this.options.datastoresDir;
  }

  // SETTINGS
  public static options: IDatastoreCoreConfigureOptions = {
    serverEnvironment: env.serverEnvironment as any,
    datastoresDir: env.datastoresDir,
    datastoresTmpDir: Path.join(Os.tmpdir(), '.ulixee', 'datastore'),
    maxRuntimeMs: 10 * 60e3,
    waitForDatastoreCompletionOnShutdown: false,
    enableRunWithLocalPath: env.serverEnvironment === 'development',
    paymentAddress: env.paymentAddress,
    serverAdminIdentities: env.serverAdminIdentities,
    computePricePerQuery: env.computePricePerQuery,
    defaultBytesForPaymentEstimates: 256,
    approvedSidechains: env.approvedSidechains,
    defaultSidechainHost: env.defaultSidechainHost,
    defaultSidechainRootIdentity: env.defaultSidechainRootIdentity,
    identityWithSidechain: env.identityWithSidechain,
    approvedSidechainsRefreshInterval: 60e3 * 60, // 1 hour
  };

  public static pluginCoresByName: { [name: string]: IFunctionPluginCore } = {};
  public static isClosing: Promise<void>;
  public static workTracker: WorkTracker;
  public static apiRegistry = new ApiRegistry<IDatastoreApiContext>([
    DatastoreUpload,
    DatastoreQuery,
    DatastoreStream,
    DatastoreAdmin,
    DatastoreCreditsBalance,
    DatastoreMeta,
    DatastoreQueryInternal,
    DatastoreQueryInternalTable,
    DatastoreQueryInternalFunctionResult,
    DatastoreInitializeInMemoryTable,
    DatastoreInitializeInMemoryFunction,
  ]);

  private static datastoreRegistry: DatastoreRegistry;
  private static sidechainClientManager: SidechainClientManager;
  private static isStarted = new Resolvable<void>();

  public static addConnection(
    transport: ITransportToClient<IDatastoreApis, IDatastoreEvents>,
  ): IDatastoreConnectionToClient {
    const context = this.getApiContext(transport.remoteId);
    const connection: IDatastoreConnectionToClient = this.apiRegistry.createConnection(
      transport,
      context,
    );
    context.connectionToClient = connection;
    connection.once('disconnected', () => {
      connection.datastoreStorage?.db.close();
      this.connections.delete(connection);
    });
    connection.isInternal = this.options.serverEnvironment === 'development';
    this.connections.add(connection);
    return connection;
  }

  public static async routeHttp(
    req: IncomingMessage,
    res: ServerResponse,
    params: string[],
  ): Promise<void> {
    const pathParts = params[0].match(/([^/]+)(\/(.+)?)?/);
    const versionHash = pathParts[1];
    const reqPath = pathParts[3] ? pathParts[2] : '/index.html';
    const { path } = await this.datastoreRegistry.getByVersionHash(versionHash);
    const docpagePath = path.replace(/datastore.js$/, 'docpage');
    req.url = reqPath;
    const done = Finalhandler(req, res);
    ServeStatic(docpagePath)(req, res, done);
  }

  public static registerPlugin(pluginCore: IFunctionPluginCore): void {
    this.pluginCoresByName[pluginCore.name] = pluginCore;
  }

  public static async start(): Promise<void> {
    if (this.isStarted.isResolved) return this.isStarted.promise;

    try {
      this.close = this.close.bind(this);

      if (this.options.enableRunWithLocalPath) {
        this.apiRegistry.register(DatastoreQueryLocalScript);
      }

      if (!(await existsAsync(this.options.datastoresTmpDir))) {
        await Fs.mkdir(this.options.datastoresTmpDir, { recursive: true });
      }
      this.datastoreRegistry = new DatastoreRegistry(
        this.options.datastoresDir,
        this.options.datastoresTmpDir,
      );
      await this.installManuallyUploadedDbxFiles();

      process.env.ULX_DATASTORE_DISABLE_AUTORUN = 'true';
      await new Promise(resolve => process.nextTick(resolve));

      for (const plugin of Object.values(this.pluginCoresByName)) {
        if (plugin.onCoreStart) await plugin.onCoreStart();
      }

      this.workTracker = new WorkTracker(this.options.maxRuntimeMs);

      this.sidechainClientManager = new SidechainClientManager(this.options);
      this.isStarted.resolve();
    } catch (error) {
      this.isStarted.reject(error, true);
    }
  }

  public static async close(): Promise<void> {
    if (this.isClosing) return this.isClosing;
    const closingPromise = new Resolvable<void>();
    this.isClosing = closingPromise.promise;

    ShutdownHandler.unregister(this.close);

    try {
      await this.workTracker?.stop(this.options.waitForDatastoreCompletionOnShutdown);

      for (const plugin of Object.values(this.pluginCoresByName)) {
        if (plugin.onCoreStart) await plugin.onCoreClose();
      }
      this.pluginCoresByName = {};

      for (const connection of this.connections) {
        await connection.disconnect();
      }
      this.connections.clear();
      this.datastoreRegistry?.close();
      DatastoreStorage.closeAll();
    } finally {
      closingPromise.resolve();
    }
  }

  public static async installManuallyUploadedDbxFiles(): Promise<void> {
    if (!(await existsAsync(this.datastoresDir))) return;

    for (const file of await Fs.readdir(this.datastoresDir)) {
      if (!file.endsWith('.dbx')) continue;
      const path = Path.join(this.datastoresDir, file);

      if (file.includes('@')) {
        const hash = file.replace('.dbx', '').split('@').pop();
        if (this.datastoreRegistry.hasVersionHash(hash)) continue;
      }

      log.info('Found unknown .dbx file in datastores directory. Checking for import.', {
        file,
        sessionId: null,
      });

      const tmpDir = await Fs.mkdtemp(`${this.options.datastoresTmpDir}/`);
      await unpackDbxFile(path, tmpDir);
      const buffer = await Fs.readFile(path);
      const { dbxPath } = await this.datastoreRegistry.save(tmpDir, buffer, null, true, true);
      if (dbxPath !== path) await Fs.unlink(path);
      if (await existsAsync(tmpDir)) await Fs.rm(tmpDir, { recursive: true });
    }
  }

  private static getApiContext(remoteId?: string): IDatastoreApiContext {
    if (!this.workTracker) {
      throw new Error('DatastoreCore has not started');
    }
    return {
      logger: log.createChild(module, { remoteId }),
      datastoreRegistry: this.datastoreRegistry,
      workTracker: this.workTracker,
      configuration: this.options,
      pluginCoresByName: this.pluginCoresByName,
      sidechainClientManager: this.sidechainClientManager,
    };
  }
}