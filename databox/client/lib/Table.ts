import ITableSchema from '../interfaces/ITableSchema';
import ITableComponents from '../interfaces/ITableComponents';
import DataboxInternal from './DataboxInternal';
import Databox from './Databox';

export default class Table<
  TSchema extends ITableSchema = ITableSchema,
> {
  #seedlings: any[];
  #databox: Databox<any, any>;
  #databoxInternal: DataboxInternal;

  private readonly components: ITableComponents<TSchema>;

  constructor(components: ITableComponents<TSchema>) {
    this.#seedlings = components.seedlings;
    this.components = { ...components };
  }

  public get schema(): TSchema {
    return this.components.schema;
  }

  public get name(): string {
    return this.components.name;
  }

  public get databox(): Databox<any, any> {
    if (!this.#databox) {
      this.#databox = new Databox({}, this.databoxInternal);
    }
    return this.#databox;
  }

  public get databoxInternal(): DataboxInternal {
    if (!this.#databoxInternal) {
      this.#databoxInternal = new DataboxInternal();
      this.#databoxInternal.onCreateInMemoryDatabase(this.createInMemoryTable.bind(this));
    }
    return this.#databoxInternal;
  }

  public async query(sql: string | any, boundValues: any[] = []): Promise<any> {
    await this.databoxInternal.ensureDatabaseExists();
    const name = this.components.name;
    const databoxInstanceId = this.databoxInternal.instanceId;
    const databoxVersionHash = this.databoxInternal.manifest?.versionHash;
    const args = {
      name,
      sql,
      boundValues,
      databoxInstanceId,
      databoxVersionHash,
    };
    return await this.databoxInternal.sendRequest({ command: 'Databox.queryInternalTable', args: [args] });
  }

  public attachToDatabox(
    databoxInternal: DataboxInternal, 
    tableName: string,
  ): void {
    this.components.name = tableName;
    if (this.#databoxInternal && this.#databoxInternal === databoxInternal) return;
    if (this.#databoxInternal) {
      throw new Error(`${tableName} Table is already attached to a Databox`);
    }

    this.#databoxInternal = databoxInternal;
    if (!databoxInternal.manifest?.versionHash) {
      this.#databoxInternal.onCreateInMemoryDatabase(this.createInMemoryTable.bind(this));
    }
  }

  private async createInMemoryTable(): Promise<void> {
    const databoxInstanceId = this.databoxInternal.instanceId;
    const name = this.components.name ?? 'this';
    const args = {
      name,
      databoxInstanceId,
      schema: this.components.schema,
      seedlings: this.#seedlings,
    };
    await this.databoxInternal.sendRequest({ command: 'Databox.createInMemoryTable', args: [args] });
  }
}

