"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_testing_1 = require("@ulixee/datastore-testing");
const fs_1 = require("fs");
const Fs = require("fs/promises");
const Path = require("path");
const index_1 = require("../index");
beforeEach(async () => {
    if ((0, fs_1.existsSync)(`${__dirname}/assets/historyTest.dbx`)) {
        await Fs.rm(`${__dirname}/assets/historyTest.dbx`, { recursive: true });
    }
    if ((0, fs_1.existsSync)(`${__dirname}/assets/historyTest.dbx`))
        await Fs.unlink(`${__dirname}/assets/historyTest.dbx`);
    if ((0, fs_1.existsSync)(`${__dirname}/build`))
        await Fs.rm(`${__dirname}/build`, { recursive: true });
});
let path;
afterEach(async () => {
    if (path && (0, fs_1.existsSync)(path))
        await Fs.rm(path, { recursive: true }).catch(() => null);
    path = null;
});
afterAll(async () => {
    if (path && (0, fs_1.existsSync)(path))
        await Fs.rm(path, { recursive: true }).catch(() => null);
});
test('it should generate a relative script entrypoint', async () => {
    const packager = new index_1.default(`${__dirname}/assets/historyTest.js`);
    await packager.build({ createTemporaryVersion: true });
    const dbx = packager.dbx;
    path = dbx.path;
    expect(dbx.path).toBe(Path.resolve(`${__dirname}/assets/historyTest.dbx`));
    expect(packager.script).toBe(await Fs.readFile(`${dbx.path}/datastore.js`, 'utf8'));
    expect(packager.sourceMap).toBe(await Fs.readFile(`${dbx.path}/datastore.js.map`, 'utf8'));
    await expect(Fs.readFile(`${dbx.path}/datastore-manifest.json`, 'utf8')).resolves.toBeTruthy();
    expect(packager.manifest.toJSON()).toEqual({
        adminIdentities: [],
        crawlersByName: {},
        scriptEntrypoint: Path.join(`packager`, `test`, `assets`, `historyTest.js`),
        scriptHash: expect.any(String),
        coreVersion: require('../package.json').version,
        schemaInterface: `{
  tables: {};
  extractors: {};
  crawlers: {};
}`,
        tablesByName: {},
        extractorsByName: expect.objectContaining({
            default: {
                prices: [{ basePrice: 0n }],
                corePlugins: {
                    '@ulixee/datastore-plugins-hero': require('../package.json').version,
                },
            },
        }),
        id: packager.manifest.id,
        version: '0.0.1',
        versionTimestamp: expect.any(Number),
    });
    expect((await Fs.stat(`${__dirname}/assets/historyTest.dbx`)).isDirectory()).toBeTruthy();
    await Fs.rm(dbx.path, { recursive: true });
}, 45e3);
test('should be able to modify the local built files for uploading', async () => {
    const packager = new index_1.default(`${__dirname}/assets/historyTest.js`);
    path = packager.dbxPath;
    await packager.build({ createTemporaryVersion: true });
    packager.manifest.version = '0.0.2';
    await packager.manifest.save();
    const packager2 = new index_1.default(`${__dirname}/assets/historyTest.js`);
    await packager2.build();
    expect(packager2.manifest.version).toBe('0.0.2');
});
test('should be able to read a datastore manifest next to an entrypoint', async () => {
    const packager = new index_1.default(`${__dirname}/assets/customManifest.js`);
    path = packager.dbx.path;
    await packager.build({ createTemporaryVersion: true });
    expect(packager.manifest.coreVersion).toBe('1.1.1');
});
test('should merge custom manifests', async () => {
    const packager = new index_1.default(`${__dirname}/assets/customManifest.js`);
    path = packager.dbx.path;
    const projectConfig = Path.resolve(__dirname, '..', '.ulixee');
    await Fs.mkdir(projectConfig, { recursive: true }).catch(() => null);
    await Fs.writeFile(`${projectConfig}/datastores.json`, JSON.stringify({
        [Path.join('..', 'test', 'assets', 'customManifest-manifest.json')]: {
            coreVersion: '1.1.2',
        },
    }));
    await packager.build({ createTemporaryVersion: true });
    await Fs.unlink(`${projectConfig}/datastores.json`);
    // should take the closest (entrypoint override) over the project config
    expect(packager.manifest.coreVersion).toBe('1.1.1');
});
test('should be able to change the output directory', async () => {
    const packager = new index_1.default(`${__dirname}/assets/historyTest.js`, `${__dirname}/build`);
    path = packager.dbx.path;
    const dbx = await packager.build({ createTemporaryVersion: true });
    expect(dbx.path).toBe(Path.resolve(`${__dirname}/build/historyTest.dbx`));
    expect((0, fs_1.existsSync)(dbx.path)).toBe(true);
});
test('should be able to package a multi-function Datastore', async () => {
    const packager = new index_1.default(`${__dirname}/assets/multiExtractorTest.js`);
    await packager.build({ createTemporaryVersion: true });
    path = packager.dbx.path;
    expect(packager.manifest.toJSON()).toEqual({
        scriptEntrypoint: Path.join(`packager`, `test`, `assets`, `multiExtractorTest.js`),
        scriptHash: expect.any(String),
        coreVersion: require('../package.json').version,
        tablesByName: {},
        crawlersByName: {},
        adminIdentities: [],
        schemaInterface: `{
  tables: {};
  extractors: {
    extractorWithInput: {
      input: {
        /**
         * @format url
         */
        url: string;
      };
    };
    extractorWithOutput: {
      output: {
        title: string;
        html: string;
      };
    };
  };
  crawlers: {};
}`,
        extractorsByName: expect.objectContaining({
            extractorWithInput: {
                prices: [{ basePrice: 0n }],
                corePlugins: {
                    '@ulixee/datastore-plugins-hero': require('../package.json').version,
                },
                schemaAsJson: { input: { url: { format: 'url', typeName: 'string' } } },
            },
            extractorWithOutput: {
                prices: [{ basePrice: 0n }],
                corePlugins: {},
                schemaAsJson: { output: { title: { typeName: 'string' }, html: { typeName: 'string' } } },
            },
        }),
        id: packager.manifest.id,
        version: packager.manifest.version,
        versionTimestamp: expect.any(Number),
    });
    expect((await Fs.stat(`${__dirname}/assets/multiExtractorTest.dbx`)).isDirectory()).toBeTruthy();
    await Fs.rm(`${__dirname}/assets/multiExtractorTest.dbx`, { recursive: true });
});
test('should be able to package an exported Extractor without a Datastore', async () => {
    const packager = new index_1.default(`${__dirname}/assets/rawExtractorTest.js`);
    await packager.build({ createTemporaryVersion: true });
    path = packager.dbx.path;
    expect(packager.manifest.toJSON()).toEqual({
        name: undefined,
        description: undefined,
        scriptEntrypoint: Path.join(`packager`, `test`, `assets`, `rawExtractorTest.js`),
        scriptHash: expect.any(String),
        coreVersion: require('../package.json').version,
        schemaInterface: `{
  tables: {};
  extractors: {};
  crawlers: {};
}`,
        extractorsByName: expect.objectContaining({
            default: {
                prices: [{ basePrice: 0n }],
                corePlugins: {
                    '@ulixee/datastore-plugins-hero': require('../package.json').version,
                },
                schemaAsJson: undefined,
            },
        }),
        tablesByName: {},
        crawlersByName: {},
        id: packager.manifest.id,
        version: packager.manifest.version,
        versionTimestamp: expect.any(Number),
        adminIdentities: [],
    });
    expect((await Fs.stat(`${__dirname}/assets/rawExtractorTest.dbx`)).isDirectory()).toBeTruthy();
    await Fs.rm(`${__dirname}/assets/rawExtractorTest.dbx`, { recursive: true });
});
// NOTE: I can't get watch to play with jest (BAB)
// eslint-disable-next-line jest/no-disabled-tests
test.skip('should be able to watch a Datastore for changes', async () => {
    function writeScript(schema) {
        return Fs.writeFile(`${__dirname}/assets/watch.js`, `const Datastore = require('@ulixee/datastore');
const { boolean, string } = require('@ulixee/schema');

export default new Datastore({
  tables: {
    people: new Table({
      schema: ${schema},
    })
  },
});`);
    }
    await writeScript(`{
    firstName: string(),
    lastName: string(),
    isTester: boolean(),
  }`);
    const packager = new index_1.default(`${__dirname}/assets/watch.js`);
    await packager.build({ watch: true, createTemporaryVersion: true });
    datastore_testing_1.Helpers.needsClosing.push(packager);
    path = packager.dbx.path;
    expect((await Fs.stat(`${__dirname}/assets/watch.dbx`)).isDirectory()).toBeTruthy();
    await writeScript(`{
    firstName: string(),
    lastName: string(),
    isTester: boolean({ optional: true }),
  }`);
    await new Promise(resolve => packager.once('build', resolve));
    const manifest = packager.manifest.toJSON();
    expect(manifest.schemaInterface).toBe(`{
  tables: {
    people: {
      firstName: string;
      lastName: string;
      isTester?: boolean;
    }
  };
  extractors: {};
  crawlers: {};
}`);
    await Fs.rm(`${__dirname}/assets/watch.dbx`, { recursive: true });
});
//# sourceMappingURL=Packager.test.js.map