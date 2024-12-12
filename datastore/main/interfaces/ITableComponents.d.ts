import Table from '../lib/Table';
export default interface ITableComponents<TSchema> {
    name?: string;
    description?: string;
    basePrice?: bigint | number;
    schema: TSchema;
    isPublic?: boolean;
    onCreated?(this: Table<TSchema>): Promise<void>;
    onVersionMigrated?(this: Table<TSchema>, previousVersion: Table<unknown>): Promise<void>;
}
