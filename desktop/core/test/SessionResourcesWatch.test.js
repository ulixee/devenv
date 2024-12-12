"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_testing_1 = require("@ulixee/datastore-testing");
const EventSubscriber_1 = require("@ulixee/commons/lib/EventSubscriber");
const hero_core_1 = require("@ulixee/hero-core");
const SessionResourcesWatch_1 = require("../lib/SessionResourcesWatch");
let koaServer;
beforeAll(async () => {
    koaServer = await datastore_testing_1.Helpers.runKoaServer();
    koaServer.get('/resources-search', ctx => {
        ctx.body = `<html>
<head>
<link rel="preload" href="/data.json" as="script">
</head>
<body>
<h1>Here</h1>
<script src="/script"></script>
</html>`;
    });
    koaServer.get('/script', ctx => {
        ctx.set('Content-Type', 'text/javascript');
        ctx.body = `
    const data = {
      "Wikipedia":true,
    };`;
    });
    koaServer.get('/data.json', ctx => {
        ctx.body = {
            hi: 'there',
            wiki: true,
        };
    });
});
afterAll(datastore_testing_1.Helpers.afterAll);
afterEach(datastore_testing_1.Helpers.afterEach);
describe('basic SessionResourcesWatch tests', () => {
    it('can find a resource', async () => {
        const exampleUrl = `${koaServer.baseUrl}/resources-search`;
        const { session, tab } = await hero_core_1.Session.create({}, new hero_core_1.default());
        const resourceSearch = new SessionResourcesWatch_1.default(session.db, new EventSubscriber_1.default());
        tab.on('resource', resourceSearch.onTabResource.bind(resourceSearch, tab.id));
        await tab.goto(exampleUrl);
        await tab.waitForResources({ url: `data.json` });
        await tab.waitForLoad('AllContentLoaded');
        await new Promise(resolve => setTimeout(resolve, 50));
        const context = {
            documentUrl: exampleUrl,
            tabId: tab.id,
            baseTime: session.createdTime,
            startTime: session.createdTime,
            endTime: Date.now(),
        };
        {
            const results = resourceSearch.search('wikipedia', context);
            expect(results).toHaveLength(1);
        }
        {
            const results = resourceSearch.search('Wiki', context);
            expect(results).toHaveLength(2);
        }
        {
            const results = resourceSearch.search('data.json', context);
            expect(results).toHaveLength(2); // one from body, one from url
        }
    });
});
//# sourceMappingURL=SessionResourcesWatch.test.js.map