export default interface IHeroSessionsApi {
    list(withError?: boolean): Promise<IHeroSessionsListResult[]>;
    search(keyword: string): Promise<IHeroSessionsSearchResult[]>;
}
export interface IHeroSessionsListResult {
    heroSessionId: string;
    scriptEntrypoint: string;
    dbPath?: string;
    state: 'running' | 'kept-alive' | 'error' | 'complete';
    datastore?: {
        datastoreId: string;
        version: string;
        functionName: string;
        queryId?: string;
    };
    startTime: Date;
    endTime?: Date;
    input?: Record<string, any>;
    outputs?: Record<string, any>[];
    error?: string;
    errorCommand?: string;
}
export interface IHeroSessionsSearchResult {
    heroSessionId: string;
    matches?: {
        type: 'command' | 'devtools' | 'logs';
        preview: string;
        id?: number;
    }[];
}
