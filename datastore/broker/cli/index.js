"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cliCommands;
const envUtils_1 = require("@ulixee/commons/lib/envUtils");
const commander_1 = require("commander");
const Path = require("path");
const env_1 = require("../env");
const index_1 = require("../index");
const pkg = require('../package.json');
function cliCommands() {
    const program = new commander_1.Command().version(pkg.version);
    program
        .command('start', { isDefault: true })
        .description('Start a Ulixee Databroker server')
        .addOption(program
        .createOption('-p, --port <number>', 'The port to use. Defaults to any 1814, or any available port.')
        .env('ULX_DATABROKER_PORT'))
        .addOption(program
        .createOption('-u, --hostname <hostname>', 'The hostname the public facing apis should listen on.')
        .env('ULX_HOSTNAME'))
        .addOption(program
        .createOption('--admin-port <number>', 'The port to start an admin server (datastore registry, node registry). Defaults to 18171, or any available port (0).')
        .env('ULX_DATABROKER_ADMIN_PORT'))
        .addOption(program
        .createOption('--storage-dir <dir>', 'Override the default storage directory where the Databroker databases are located.')
        .env('ULX_DATABROKER_DIR'))
        .addOption(program.createOption('--env <path>', 'Load environment settings from a .env file.'))
        .addOption(program
        .createOption('--localchain-path <path>', 'The path to the localchain data directory. You can also configure this using the .env file')
        .env('ARGON_LOCALCHAIN_PATH'))
        .allowUnknownOption(true)
        .action(async (opts) => {
        console.log('Starting Ulixee Databroker with configuration:', opts);
        const { port, hostname, adminPort, localChainPath, env } = opts;
        if (env) {
            (0, envUtils_1.applyEnvironmentVariables)(Path.resolve(env), process.env);
        }
        if (localChainPath) {
            env_1.default.localchainConfig ??= {};
            env_1.default.localchainConfig.localchainPath ??= localChainPath;
        }
        const server = new index_1.default({
            storageDir: opts.storageDir ?? env_1.default.storageDir,
            localchainConfig: env_1.default.localchainConfig,
        });
        await server.listen(port, hostname);
        await server.listenAdmin(adminPort);
        console.log('Databroker listening at %s. Admin server at: %s', await server.host, await server.adminHost);
    });
    return program;
}
//# sourceMappingURL=index.js.map