"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const datastore_packager_1 = require("@ulixee/datastore-packager");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const Fs = require("fs");
const nanoid_1 = require("nanoid");
const Path = require("path");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'Crawler.test');
let cloudNode;
let client;
let registry;
let statsTracker;
const findCachedSpy = jest.spyOn(datastore_1.Crawler.prototype, 'findCached');
beforeAll(async () => {
    if (Fs.existsSync(`${__dirname}/datastores/crawl.dbx`)) {
        Fs.rmSync(`${__dirname}/datastores/crawl.dbx`, { recursive: true });
    }
    cloudNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: storageDir,
            datastoresTmpDir: Path.join(storageDir, 'tmp'),
        },
    }, true);
    registry = cloudNode.datastoreCore.datastoreRegistry;
    statsTracker = cloudNode.datastoreCore.statsTracker;
    client = new DatastoreApiClient_1.default(await cloudNode.address);
    datastore_testing_1.Helpers.onClose(() => client.disconnect(), true);
});
beforeEach(() => {
    findCachedSpy.mockClear();
});
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(datastore_testing_1.Helpers.afterAll);
test('should be able to run a crawler', async () => {
    const crawler = new datastore_packager_1.default(`${__dirname}/datastores/crawl.js`);
    await crawler.build();
    await client.upload(await crawler.dbx.tarGzip());
    const affiliateId = `aff${(0, nanoid_1.nanoid)(10)}`;
    await expect(client.stream(crawler.manifest.id, crawler.manifest.version, 'crawlCall', {}, { affiliateId })).resolves.toEqual([{ version: '1', crawler: 'none', runCrawlerTime: expect.any(Date) }]);
    const { queryLogDb, statsDb } = statsTracker.diskStore;
    expect(queryLogDb.logTable.all()).toHaveLength(1);
    expect(queryLogDb.logTable.all()[0].query).toBe(`stream(crawlCall)`);
    expect(queryLogDb.logTable.all()[0].affiliateId).toBe(affiliateId);
    const stats = statsDb.datastoreEntities.all();
    expect(stats).toHaveLength(2);
    expect(stats.some(x => x.name === 'crawlCall')).toBeTruthy();
    expect(stats.some(x => x.name === 'crawl')).toBeTruthy();
});
test('should be able to query a crawler', async () => {
    const crawler = new datastore_packager_1.default(`${__dirname}/datastores/crawl.js`);
    await crawler.build();
    try {
        await client.upload(await crawler.dbx.tarGzip());
    }
    catch (error) {
        if (error.code !== 'ERR_DUPLICATE_VERSION')
            throw error;
    }
    const { queryLogDb, statsDb } = statsTracker.diskStore;
    queryLogDb.logTable.db.exec(`delete from ${queryLogDb.logTable.tableName}`);
    statsDb.datastoreEntities.db.exec(`delete from ${statsDb.datastoreEntities.tableName}`);
    const affiliateId = `aff${(0, nanoid_1.nanoid)(10)}`;
    await expect(client.query(crawler.manifest.id, crawler.manifest.version, 'select * from crawlCall()', { affiliateId })).resolves.toEqual(expect.objectContaining({
        outputs: [
            { version: '1', crawler: 'none', sessionId: null, runCrawlerTime: expect.any(Date) },
        ],
    }));
    expect(queryLogDb.logTable.all()).toHaveLength(1);
    expect(queryLogDb.logTable.all()[0].query).toBe(`select * from crawlCall()`);
    expect(queryLogDb.logTable.all()[0].affiliateId).toBe(affiliateId);
    const stats = statsDb.datastoreEntities.all();
    expect(stats).toHaveLength(2);
    expect(stats.some(x => x.name === 'crawlCall')).toBeTruthy();
    expect(stats.some(x => x.name === 'crawl')).toBeTruthy();
});
test('should be able to ask a crawler for a cached result', async () => {
    const crawler = new datastore_packager_1.default(`${__dirname}/datastores/crawl.js`);
    await crawler.build();
    try {
        await client.upload(await crawler.dbx.tarGzip());
    }
    catch (error) {
        if (error.code !== 'ERR_DUPLICATE_VERSION')
            throw error;
    }
    const result1 = await client.stream(crawler.manifest.id, crawler.manifest.version, 'crawlCall', {
        sessionId: '1',
    });
    expect(result1).toEqual([
        { version: '1', crawler: 'none', sessionId: '1', runCrawlerTime: expect.any(Date) },
    ]);
    // crawl is setup to pass in the run time from the first result
    await expect(client.stream(crawler.manifest.id, crawler.manifest.version, 'crawlCall', {
        sessionId: '2',
        maxTimeInCache: Date.now() - result1[0].runCrawlerTime.getTime() / 1e3,
    })).resolves.toEqual([{ version: '1', crawler: 'none', sessionId: '1' }]);
});
test('should get cached result by serialized input if no schema', async () => {
    const crawler = new datastore_packager_1.default(`${__dirname}/datastores/crawl.js`);
    await crawler.build();
    try {
        await client.upload(await crawler.dbx.tarGzip());
    }
    catch (error) {
        if (error.code !== 'ERR_DUPLICATE_VERSION')
            throw error;
    }
    const result1 = await client.stream(crawler.manifest.id, crawler.manifest.version, 'crawlCall', {
        sessionId: '1',
        test1: true,
        test2: 'abc',
    });
    expect(result1).toEqual([
        { version: '1', crawler: 'none', sessionId: '1', runCrawlerTime: expect.any(Date) },
    ]);
    expect(findCachedSpy).toHaveBeenCalledTimes(1);
    await expect(findCachedSpy.mock.results[0].value).resolves.toBeNull();
    // crawl is setup to pass in the run time from the first result
    findCachedSpy.mockClear();
    await expect(client.stream(crawler.manifest.id, crawler.manifest.version, 'crawlCall', {
        sessionId: '2', // should not call the crawler
        maxTimeInCache: Date.now() - result1[0].runCrawlerTime.getTime() / 1e3,
        // change field order to test
        test2: 'abc',
        test1: true,
    })).resolves.toEqual([{ version: '1', crawler: 'none', sessionId: '1' }]);
    expect(findCachedSpy).toHaveBeenCalledTimes(1);
    await expect(findCachedSpy.mock.results[0].value).resolves.toEqual({
        version: '1',
        crawler: 'none',
        sessionId: '1',
    });
    findCachedSpy.mockClear();
    await expect(client.stream(crawler.manifest.id, crawler.manifest.version, 'crawlCall', {
        sessionId: '3',
        maxTimeInCache: Date.now() - result1[0].runCrawlerTime.getTime() / 1e3,
        test2: 'somethingElse',
        test1: false,
    })).resolves.toEqual([
        {
            version: '1',
            crawler: 'none',
            sessionId: '3',
            runCrawlerTime: expect.any(Date),
        },
    ]);
    expect(findCachedSpy).toHaveBeenCalledTimes(1);
    await expect(findCachedSpy.mock.results[0].value).resolves.toBeNull();
});
test('should get cached result individual input columns', async () => {
    const crawler = new datastore_packager_1.default(`${__dirname}/datastores/crawl.js`);
    await crawler.build();
    try {
        await client.upload(await crawler.dbx.tarGzip());
    }
    catch (error) {
        if (error.code !== 'ERR_DUPLICATE_VERSION')
            throw error;
    }
    const result1 = await client.stream(crawler.manifest.id, crawler.manifest.version, 'crawlWithSchemaCall', {
        sessionId: '1',
        colBool: true,
        colNum: 1,
    });
    expect(result1).toEqual([{ sessionId: '1', runCrawlerTime: expect.any(Date) }]);
    expect(findCachedSpy).toHaveBeenCalledTimes(1);
    await expect(findCachedSpy.mock.results[0].value).resolves.toBeNull();
    // crawl is setup to pass in the run time from the first result
    findCachedSpy.mockClear();
    await expect(client.stream(crawler.manifest.id, crawler.manifest.version, 'crawlWithSchemaCall', {
        sessionId: '2', // should not call the crawler
        maxTimeInCache: Date.now() - result1[0].runCrawlerTime.getTime() / 1e3,
        colBool: true,
        colNum: 1,
    })).resolves.toEqual([{ sessionId: '1' }]);
    expect(findCachedSpy).toHaveBeenCalledTimes(1);
    await expect(findCachedSpy.mock.results[0].value).resolves.toEqual({
        version: '1',
        crawler: 'none',
        sessionId: '1',
    });
    findCachedSpy.mockClear();
    await expect(client.stream(crawler.manifest.id, crawler.manifest.version, 'crawlWithSchemaCall', {
        sessionId: '3',
        maxTimeInCache: Date.now() - result1[0].runCrawlerTime.getTime() / 1e3,
        colBool: false,
        colNum: 1,
    })).resolves.toEqual([
        {
            sessionId: '3',
            runCrawlerTime: expect.any(Date),
        },
    ]);
    expect(findCachedSpy).toHaveBeenCalledTimes(1);
    await expect(findCachedSpy.mock.results[0].value).resolves.toBeNull();
});
//# sourceMappingURL=Crawler.test.js.map