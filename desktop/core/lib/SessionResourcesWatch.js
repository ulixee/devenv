"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventUtils_1 = require("@ulixee/commons/lib/eventUtils");
const Fuse = require('fuse.js/dist/fuse.common.js');
class SessionResourcesWatch extends eventUtils_1.TypedEventEmitter {
    constructor(db, events) {
        super();
        this.db = db;
        this.events = events;
        this.resourcesById = {};
        this.searchIndexByTabId = {};
    }
    close() {
        this.events.close();
    }
    search(query, context) {
        const { tabId, documentUrl, startTime, endTime } = context;
        const results = [];
        const finalQuery = query
            .split(/\s+/)
            .map(x => {
            if (!x)
                return null;
            if (x.match(/['^!.]+/))
                return `'"${x}"`;
            return `'${x.trim()}`;
        })
            .filter(Boolean)
            .join(' | ');
        const searchResults = this.searchIndexByTabId[tabId].search(finalQuery, { limit: 10 });
        for (const result of searchResults) {
            const resource = this.db.resources.get(result.item.id);
            // must match document url
            if (documentUrl && resource.documentUrl !== documentUrl)
                continue;
            // allow an exception for the actual document
            const isPageLoad = resource.requestUrl === documentUrl;
            const timestamp = resource.browserLoadedTimestamp ?? resource.responseTimestamp;
            if (!isPageLoad && (timestamp < startTime || timestamp > endTime))
                continue;
            const matchIndices = [];
            for (const match of result.matches) {
                if (match.key !== 'body')
                    continue;
                for (const [start, end] of match.indices) {
                    matchIndices.push([start, end]);
                    if (matchIndices.length > 10)
                        break;
                }
            }
            results.push({
                id: resource.id,
                documentUrl: resource.documentUrl,
                statusCode: resource.statusCode,
                url: resource.requestUrl,
                body: result.item.body,
                type: resource.type,
                matchIndices,
            });
        }
        return results;
    }
    async onTabResource(tabId, resource) {
        this.searchIndexByTabId[tabId] ??= new Fuse([], {
            isCaseSensitive: false,
            findAllMatches: true,
            useExtendedSearch: true,
            minMatchCharLength: 3,
            keys: ['body', 'url'],
            ignoreLocation: true,
            ignoreFieldNorm: true,
            includeMatches: true,
        });
        const resourcesRecord = this.db.resources.get(resource.id);
        this.resourcesById[resource.id] = {
            id: resource.id,
            frameId: resource.frameId,
            tabId: resource.tabId,
            type: resource.type,
            method: resource.request.method,
            url: resource.request.url,
            receivedAtCommandId: resource.receivedAtCommandId,
            documentUrl: resource.documentUrl,
            postDataBytes: resourcesRecord.requestPostData?.length,
            requestHeaders: resource.request.headers,
            didMitmModifyHeaders: resourcesRecord.requestHeaders !== resourcesRecord.requestOriginalHeaders,
            originalRequestHeaders: resourcesRecord.requestOriginalHeaders,
            responseHeaders: resource.response?.headers,
            responseBodyBytes: resourcesRecord.responseDataBytes,
            statusCode: resource.response?.statusCode,
            browserServedFromCache: resource.response?.browserServedFromCache,
            browserLoadFailure: resource.response?.browserLoadFailure,
        };
        this.emit('resource', { resource: this.resourcesById[resource.id] });
        if (!resource.response?.statusCode)
            return;
        if (!this.matchesSearchFilter(resource.type, resource.response?.headers))
            return;
        const headers = resource.response?.headers ?? {};
        const contentType = headers['content-type'] ?? headers['Content-Type'] ?? '';
        // search for terms
        const body = await this.db.resources.getResourceBodyById(resource.id, true);
        let formattedBody = body.toString();
        try {
            if (contentType.includes('json')) {
                formattedBody = JSON.stringify(JSON.parse(formattedBody), null, 2);
            }
        }
        catch { }
        this.searchIndexByTabId[tabId].add({
            id: resource.id,
            body: formattedBody,
            url: resource.url,
        });
    }
    matchesSearchFilter(resourceType, responseHeaders = {}) {
        if (!SessionResourcesWatch.searchResourceTypes.has(resourceType))
            return false;
        if (resourceType === 'Other') {
            const contentType = responseHeaders['content-type'] ?? responseHeaders['Content-Type'] ?? '';
            if (!contentType.includes('text') && !contentType.includes('json')) {
                return false;
            }
        }
        return true;
    }
}
SessionResourcesWatch.searchResourceTypes = new Set([
    'Document',
    'XHR',
    'Fetch',
    'Script',
    'Websocket',
    'Other',
]);
exports.default = SessionResourcesWatch;
//# sourceMappingURL=SessionResourcesWatch.js.map