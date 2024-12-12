import TypedEventEmitter from '@ulixee/commons/lib/TypedEventEmitter';
import { IHeroSessionsListResult, IHeroSessionsSearchResult } from '@ulixee/desktop-interfaces/apis/IHeroSessionsApi';
import HeroCore, { Session as HeroSession } from '@ulixee/hero-core';
export default class HeroSessionsSearch extends TypedEventEmitter<{
    update: IHeroSessionsListResult[];
}> {
    private heroCore;
    private sessions;
    private commandsBySessionId;
    private searchIndex;
    private hasLoaded;
    private events;
    constructor(heroCore: HeroCore);
    close(): Promise<void>;
    onNewSession(heroSession: HeroSession): void;
    list(): Promise<IHeroSessionsListResult[]>;
    search(query: string): Promise<IHeroSessionsSearchResult[]>;
    withErrors(): Promise<IHeroSessionsListResult[]>;
    private processSession;
    private processEntrypoint;
    private onHeroSessionResumed;
    private onHeroSessionClosed;
    private onHeroSessionKeptAlive;
}
