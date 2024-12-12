"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cliCommands;
exports.startCloudViaCli = startCloudViaCli;
const envUtils_1 = require("@ulixee/commons/lib/envUtils");
const objectUtils_1 = require("@ulixee/commons/lib/objectUtils");
const env_1 = require("@ulixee/datastore-core/env");
const commander_1 = require("commander");
const os = require("node:os");
const Path = require("path");
const index_1 = require("../index");
const pkg = require('../package.json');
function cliCommands(options) {
    const program = new commander_1.Command().version(pkg.version);
    program
        .command('start', { isDefault: true })
        .description('start a Ulixee CloudNode')
        .addOption(program
        .createOption('-p, --port <number>', 'The port to use. Defaults to any 1818, or any available port.')
        .env('PORT'))
        .addOption(program
        .createOption('-u, --hostname <hostname>', 'The hostname the Cloud node should listen on.')
        .env('ULX_HOSTNAME'))
        .addOption(program
        .createOption('--public-host <address>', 'The public dns name or ip the Cloud node can be addressed with (default: localhost)')
        .env('ULX_PUBLIC_HOST'))
        .addOption(program
        .createOption('--hosted-services-port <number>', 'Activate hosted services on this node at this port (datastore registry, node registry). Defaults to any 18181, or any available port (0).')
        .env('ULX_HOSTED_SERVICES_PORT'))
        .addOption(program
        .createOption('--hosted-services-hostname <hostname>', 'The ip or host that Cluster Services should listed on. You should make this a private-to-your-cloud ip if possible.')
        .env('ULX_HOSTED_SERVICES_HOSTNAME'))
        .addOption(program
        .createOption('--setup-host <host>', 'Setup services for this node with another node in your cluster. NOTE: this should be the hosted services address of your cluster node.')
        .env('ULX_SERVICES_SETUP_HOST'))
        .addOption(program.createOption('--env <path>', 'Load environment settings from a .env file.'))
        .addOption(program
        .createOption('--network-identity-path <path>', 'Filesystem path to your network identity keypair')
        .env('ULX_NETWORK_IDENTITY_PATH'))
        .addOption(program
        .createOption('--admin-identities <ids...>', 'Your admin identity public ids (starting with id1)')
        .env('ULX_CLOUD_ADMIN_IDENTITIES'))
        .addOption(program
        .createOption('--disable-session-persistence', 'Disable persisting session databases long-term. NOTE: will still persist for the duration of the session.')
        .argParser(envUtils_1.parseEnvBool)
        .env('ULX_DISABLE_SESSION_PERSISTENCE'))
        .addOption(program
        .createOption('--disable-desktop-apis', 'Do not enable Ulixee Desktop apis.')
        .argParser(envUtils_1.parseEnvBool)
        .env('ULX_DISABLE_DESKTOP_APIS'))
        .addOption(program
        .createOption('--max-concurrent-heroes <count>', 'Max number of concurrent Datastores/Heroes to run at a time.')
        .argParser(parseInt)
        .default(10))
        .addOption(program
        .createOption('--max-concurrent-heroes-per-browser <count>', 'Max number of concurrent Heroes to run per Chrome instance.')
        .argParser(parseInt)
        .default(10))
        .addOption(program
        .createOption('--max-datastore-runtime-ms <millis>', 'Max runtime allowed for a Datastore to complete. (default: 10 mins)')
        .argParser(parseInt))
        .addOption(program.createOption('--unblocked-plugins <plugins...>', 'Register default Unblocked Plugin npm module names for all Hero instances to load.'))
        .addOption(program
        .createOption('--hero-data-dir <dir>', 'Override the default data directory for Hero sessions and dbs.')
        .env('ULX_DATA_DIR'))
        .addOption(program
        .createOption('--datastore-storage-dir <dir>', 'Override the default storage directory where Datastores are located.')
        .env('ULX_DATASTORE_DIR'))
        .addOption(program.createOption('--datastore-tmp-dir <dir>', 'Override the default temp directory where uploaded Datastores are processed.'))
        .addOption(program
        .createOption('--datastore-wait-for-completion', 'Wait for all in-process Datastores to complete before shutting down the Cloud node.')
        .argParser(envUtils_1.parseEnvBool)
        .default(false))
        .addOption(program
        .createOption('--argon-notary-id <id>', 'The preferred Argon notary to notarize payments with.')
        .argParser(parseInt)
        .env('ARGON_NOTARY_ID'))
        .addOption(program
        .createOption('--argon-localchain-path <path>', 'Activate payment receipt with the given Argon Localchain.')
        .env('ARGON_LOCALCHAIN_PATH'))
        .addOption(program
        .createOption('--argon-localchain-create-if-missing', 'Create a new Localchain on this machine if missing.')
        .env('ARGON_LOCALCHAIN_CREATE_IF_MISSING'))
        .addOption(program
        .createOption('--argon-mainchain-url <url>', 'Connect to the given Argon Mainchain rpc url.')
        .env('ARGON_MAINCHAIN_URL'))
        .addOption(program
        .createOption('--argon-localchain-password <password>', 'Localchain password provided inline (unsafe).')
        .env('ARGON_LOCALCHAIN_PASSWORD'))
        .addOption(program
        .createOption('--argon-localchain-password-interactive', 'Localchain password prompted on command line.')
        .argParser(envUtils_1.parseEnvBool)
        .env('ARGON_LOCALCHAIN_PASSWORD_INTERACTIVE_CLI'))
        .addOption(program
        .createOption('--argon-localchain-password-file <path>', 'Localchain password from a file path.')
        .env('ARGON_LOCALCHAIN_PASSWORD_FILE'))
        .addOption(program
        .createOption('--argon-block-rewards-address <address>', 'Activate block rewards capture with the given Argon Localchain address.')
        .argParser(x => (0, env_1.parseAddress)(x, 'Block Rewards Address'))
        .env('ARGON_BLOCK_REWARDS_ADDRESS'))
        .allowUnknownOption(true)
        .action(async (opts) => {
        if (!options?.suppressLogs)
            console.log('Starting Ulixee Cloud with configuration:', opts);
        const cloudNode = await startCloudViaCli(opts);
        if (options?.onStart)
            await options.onStart(cloudNode);
        if (!options?.suppressLogs)
            console.log('Ulixee Cloud listening at %s', await cloudNode.address);
    });
    return program;
}
async function startCloudViaCli(opts) {
    const { port, disableDesktopApis, disableSessionPersistence, hostname, setupHost, publicHost, hostedServicesPort, hostedServicesHostname, argonNotaryId, argonLocalchainPath, argonLocalchainCreateIfMissing, argonMainchainUrl, argonLocalchainPassword, argonLocalchainPasswordInteractive, argonLocalchainPasswordFile, argonBlockRewardsAddress, } = opts;
    let env = opts.env;
    if (env) {
        if (env.startsWith('~'))
            env = Path.resolve(os.homedir(), env.slice(1));
        (0, envUtils_1.applyEnvironmentVariables)(Path.resolve(env), process.env);
    }
    const { unblockedPlugins, heroDataDir, maxConcurrentHeroes, maxConcurrentHeroesPerBrowser } = opts;
    let localchainConfig;
    if (argonLocalchainPath || argonLocalchainCreateIfMissing) {
        localchainConfig = {
            localchainPath: argonLocalchainPath,
            localchainCreateIfMissing: argonLocalchainCreateIfMissing,
            mainchainUrl: argonMainchainUrl,
            notaryId: argonNotaryId,
            keystorePassword: {
                password: argonLocalchainPassword ? Buffer.from(argonLocalchainPassword) : undefined,
                interactiveCli: argonLocalchainPasswordInteractive,
                passwordFile: argonLocalchainPasswordFile,
            },
            blockRewardsAddress: argonBlockRewardsAddress,
        };
    }
    const cloudNode = new index_1.CloudNode((0, objectUtils_1.filterUndefined)({
        port,
        host: hostname,
        publicHost,
        disableDesktopCore: disableDesktopApis,
        hostedServicesServerOptions: !!hostedServicesHostname || hostedServicesPort !== undefined
            ? { port: hostedServicesPort, host: hostedServicesHostname }
            : undefined,
        servicesSetupHost: setupHost,
        heroConfiguration: (0, objectUtils_1.filterUndefined)({
            maxConcurrentClientCount: maxConcurrentHeroes,
            maxConcurrentClientsPerBrowser: maxConcurrentHeroesPerBrowser,
            disableSessionPersistence,
            dataDir: heroDataDir,
            defaultUnblockedPlugins: unblockedPlugins?.map(x => {
                // eslint-disable-next-line import/no-dynamic-require
                const mod = require(x);
                if (mod.default)
                    return mod.default;
                return mod;
            }),
        }),
        datastoreConfiguration: (0, objectUtils_1.filterUndefined)({
            datastoresDir: opts.datastoreStorageDir,
            datastoresTmpDir: opts.datastoreTmpDir,
            maxRuntimeMs: opts.maxDatastoreRuntimeMs,
            waitForDatastoreCompletionOnShutdown: opts.datastoreWaitForCompletion,
            adminIdentities: (0, env_1.parseIdentities)(opts.adminIdentities, 'Admin Identities'),
            localchainConfig,
        }),
    }));
    await cloudNode.listen();
    return cloudNode;
}
//# sourceMappingURL=index.js.map