import IResourceSearchResult from '@ulixee/desktop-interfaces/IResourceSearchResult';
import EventSubscriber from '@ulixee/commons/lib/EventSubscriber';
import { ISearchContext } from '@ulixee/desktop-interfaces/ISessionDomSearchResult';
import IResourceMeta from '@ulixee/unblocked-specification/agent/net/IResourceMeta';
import IResourceType from '@ulixee/unblocked-specification/agent/net/IResourceType';
import SessionDb from '@ulixee/hero-core/dbs/SessionDb';
import IHttpHeaders from '@ulixee/unblocked-specification/agent/net/IHttpHeaders';
import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import IResourceOverview from '@ulixee/desktop-interfaces/IResourceOverview';
export default class SessionResourcesWatch extends TypedEventEmitter<{
    resource: {
        resource: IResourceOverview;
    };
}> {
    private db;
    private events;
    private static searchResourceTypes;
    resourcesById: {
        [id: number]: IResourceOverview;
    };
    private searchIndexByTabId;
    constructor(db: SessionDb, events: EventSubscriber);
    close(): void;
    search(query: string, context?: ISearchContext): IResourceSearchResult[];
    onTabResource(tabId: number, resource: IResourceMeta): Promise<void>;
    matchesSearchFilter(resourceType: IResourceType, responseHeaders?: IHttpHeaders): boolean;
}
