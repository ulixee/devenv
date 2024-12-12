"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = build;
exports.deploy = deploy;
exports.startDatastore = startDatastore;
const cli_1 = require("@ulixee/cloud/cli");
const config_1 = require("@ulixee/commons/config");
const hosts_1 = require("@ulixee/commons/config/hosts");
const fileUtils_1 = require("@ulixee/commons/lib/fileUtils");
const Resolvable_1 = require("@ulixee/commons/lib/Resolvable");
const ShutdownHandler_1 = require("@ulixee/commons/lib/ShutdownHandler");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const LocalUserProfile_1 = require("@ulixee/datastore/lib/LocalUserProfile");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const child_process_1 = require("child_process");
const Fs = require("fs");
const Path = require("path");
const util_1 = require("util");
const index_1 = require("../index");
const package_json_1 = require("../package.json");
util_1.inspect.defaultOptions.depth = 10;
async function build(path, options) {
    const packager = new index_1.default(path, options?.outDir, true);
    console.log('Building Datastore ...');
    const dbx = await packager.build({
        tsconfig: options.tsconfig,
        compiledSourcePath: options.compiledSourcePath,
    });
    const compressed = await dbx.tarGzip();
    Fs.writeFileSync(`${dbx.path}.tgz`, compressed);
    Fs.rmSync(dbx.path, { recursive: true });
}
async function deploy(entrypoint, options) {
    const packager = new index_1.default(entrypoint, null, true);
    const dbxExists = await (0, fileUtils_1.existsAsync)(packager.dbxPath);
    console.log('Building Datastore ...');
    const dbx = await packager.build({
        tsconfig: options.tsconfig,
        compiledSourcePath: options.compiledSourcePath,
    });
    console.log('Uploading...');
    const result = await upload(dbx, packager.manifest, options.cloudHost, options.identityPath, options.identityPassphrase);
    if (!options.dontAutoshowDocs) {
        openDocsPage(packager.manifest, result.cloudHost);
    }
    if (!dbxExists) {
        await Fs.promises.rm(packager.dbxPath, { recursive: true });
    }
}
async function upload(dbx, manifest, cloudHost, identityPath, identityPassphrase) {
    cloudHost ??= hosts_1.default.global.getVersionHost(package_json_1.version);
    if (cloudHost?.startsWith('localhost')) {
        cloudHost = await hosts_1.default.global.checkLocalVersionHost(package_json_1.version, cloudHost);
        if (!identityPath) {
            const localProfile = new LocalUserProfile_1.default();
            identityPath = localProfile.defaultAdminIdentityPath;
        }
    }
    if (!cloudHost) {
        throw new Error('Could not determine a Cloud host from Ulixee config files. Please provide one with the `--cloud-host` option.');
    }
    let identity;
    if (identityPath) {
        identity = Identity_1.default.loadFromFile(identityPath, {
            keyPassphrase: identityPassphrase,
        });
    }
    console.log('Uploading Datastore to %s', cloudHost, {
        manifest: manifest.toJSON(),
    });
    try {
        await dbx.upload(cloudHost, {
            identity,
        });
        console.log('Your Datastore has been uploaded!');
    }
    catch (error) {
        console.error(error.message, error.stack);
        process.exit(1);
    }
    try {
        if (!Fs.existsSync(config_1.default.global.directoryPath)) {
            Fs.mkdirSync(config_1.default.global.directoryPath, { recursive: true });
        }
        const path = Path.join(config_1.default.global.directoryPath, 'datastore-deployments.jsonl');
        await Fs.promises.appendFile(path, `${JSON.stringify({
            scriptEntrypoint: manifest.scriptEntrypoint,
            cloudHost,
            datastoreId: manifest.id,
            version: manifest.version,
            adminIdentity: identity?.bech32,
            timestamp: manifest.versionTimestamp,
        })}\n`);
    }
    catch { }
    return { cloudHost };
}
async function startDatastore(path, options) {
    const packager = new index_1.default(path, options?.outDir, true);
    console.log('Starting Datastore ...');
    const dbx = await packager.build({
        tsconfig: options.tsconfig,
        compiledSourcePath: options.compiledSourcePath,
        watch: options.watch,
        createTemporaryVersion: true,
    });
    let host = hosts_1.default.global.getVersionHost(package_json_1.version);
    if (host?.startsWith('localhost')) {
        host = await hosts_1.default.global.checkLocalVersionHost(package_json_1.version, host);
    }
    if (!host) {
        const resolvable = new Resolvable_1.default();
        (0, cli_1.default)({
            suppressLogs: true,
            async onStart() {
                resolvable.resolve();
            },
        }).parse(['start', ...options.extraArgs]);
        await resolvable.promise;
        host = hosts_1.default.global.getVersionHost(package_json_1.version);
    }
    if (!host.includes('://'))
        host = `ulx://${host}`;
    const client = new DatastoreApiClient_1.default(host);
    await client.startDatastore(dbx.manifest.id, dbx.path, options.watch);
    const dbxPath = dbx.path;
    ShutdownHandler_1.default.register(() => {
        Fs.rmSync(dbxPath, { recursive: true });
        return client.disconnect();
    });
    if (packager.manifest.id.startsWith('tmp')) {
        console.log("Assigning a temporary id & version to your Datastore. You'll want to update your Datastore with a permanent id before deploying", { temporaryId: packager.manifest.id, version: '0.0.1' });
    }
    console.log('%s Datastore', options.watch ? 'Started + watching' : 'Started', {
        connectionString: `${host}/${packager.manifest.id}@v${packager.manifest.version}`,
    });
    if (options.showDocs) {
        openDocsPage(packager.manifest, host);
    }
}
function openDocsPage(manifest, cloudHost) {
    let openCommand = 'xdg-open';
    if (process.platform === 'darwin')
        openCommand = 'open';
    if (process.platform === 'win32')
        openCommand = 'start';
    (0, child_process_1.execSync)(`${openCommand} "http://${cloudHost}/${manifest.id}@v${manifest.version}"`);
}
//# sourceMappingURL=cliCommands.js.map