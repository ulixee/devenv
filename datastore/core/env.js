"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAddress = parseAddress;
exports.parseIdentities = parseIdentities;
const envUtils_1 = require("@ulixee/commons/lib/envUtils");
const types_1 = require("@ulixee/platform-specification/types");
const Os = require("os");
const Path = require("path");
(0, envUtils_1.loadEnv)(process.cwd());
(0, envUtils_1.loadEnv)(__dirname);
const env = process.env;
if (env.ULX_DATASTORE_DIR)
    env.ULX_DATASTORE_DIR = (0, envUtils_1.parseEnvPath)(env.ULX_DATASTORE_DIR);
if (env.ULX_DATASTORE_TMP_DIR)
    env.ULX_DATASTORE_TMP_DIR = (0, envUtils_1.parseEnvPath)(env.ULX_DATASTORE_TMP_DIR);
if (env.ULX_QUERY_HERO_SESSIONS_DIR)
    env.ULX_QUERY_HERO_SESSIONS_DIR = (0, envUtils_1.parseEnvPath)(env.ULX_QUERY_HERO_SESSIONS_DIR);
exports.default = {
    serverEnvironment: env.ULX_SERVER_ENVIRONMENT,
    datastoresDir: env.ULX_DATASTORE_DIR,
    datastoresTmpDir: env.ULX_DATASTORE_TMP_DIR ?? Path.join(Os.tmpdir(), '.ulixee', 'datastore'),
    queryHeroSessionsDir: env.ULX_QUERY_HERO_SESSIONS_DIR,
    replayRegistryHost: env.ULX_REPLAY_REGISTRY_HOST,
    argonPaymentProcessorHost: env.ULX_PAYMENT_PROCESSOR_HOST,
    upstreamPaymentsServiceHost: env.ULX_UPSTREAM_PAYMENTS_SERVICE_HOST,
    datastoreLookupHost: env.ULX_DATASTORE_LOOKUP_SERVICE_HOST,
    enableSqliteWalMode: env.ULX_ENABLE_SQLITE_WAL,
    // list of identities who can upload to this Cloud [@ulixee/platform-utils/lib/Identity.bech32]
    cloudAdminIdentities: parseIdentities(env.ULX_CLOUD_ADMIN_IDENTITIES, 'Admin Identities'),
    datastoresMustHaveOwnAdminIdentity: (0, envUtils_1.parseEnvBool)(env.ULX_DATASTORES_MUST_HAVE_OWN_ADMIN) ?? false,
    localchainConfig: getLocalchainConfig(),
    argonMainchainUrl: env.ARGON_MAINCHAIN_URL,
    enableGlobalConfigs: (0, envUtils_1.parseEnvBool)(env.ULX_ENABLE_GLOBAL_CONFIG) ?? true,
    statsTrackerHost: env.ULX_DATASTORE_STATS_HOST,
    datastoreRegistryHost: env.ULX_DATASTORE_REGISTRY_HOST,
    storageEngineHost: env.ULX_STORAGE_ENGINE_HOST,
};
function getLocalchainConfig() {
    if (!env.ARGON_LOCALCHAIN_PATH && !env.ARGON_MAINCHAIN_URL)
        return;
    let keystorePassword;
    if (env.ARGON_LOCALCHAIN_PASSWORD) {
        keystorePassword = Buffer.from(env.ARGON_LOCALCHAIN_PASSWORD, 'utf8');
        delete process.env.ARGON_LOCALCHAIN_PASSWORD;
    }
    if (env.ARGON_LOCALCHAIN_PASSWORD_FILE)
        env.ARGON_LOCALCHAIN_PASSWORD_FILE = (0, envUtils_1.parseEnvPath)(env.ARGON_LOCALCHAIN_PASSWORD_FILE);
    if (env.ARGON_LOCALCHAIN_PATH)
        env.ARGON_LOCALCHAIN_PATH = (0, envUtils_1.parseEnvPath)(env.ARGON_LOCALCHAIN_PATH);
    return {
        localchainPath: env.ARGON_LOCALCHAIN_PATH,
        mainchainUrl: env.ARGON_MAINCHAIN_URL,
        blockRewardsAddress: parseAddress(env.ARGON_BLOCK_REWARDS_ADDRESS, 'Block Rewards Address'),
        notaryId: (0, envUtils_1.parseEnvInt)(env.ARGON_NOTARY_ID),
        keystorePassword: {
            interactiveCli: (0, envUtils_1.parseEnvBool)(env.ARGON_LOCALCHAIN_PASSWORD_INTERACTIVE_CLI),
            password: keystorePassword,
            passwordFile: env.ARGON_LOCALCHAIN_PASSWORD_FILE,
        },
    };
}
function parseAddress(address, type) {
    if (!address)
        return address;
    try {
        types_1.addressValidation.parse(address);
        return address;
    }
    catch (error) {
        throw new Error(`Invalid Address "${address}" provided to the ${type} environment variable. (Addresses are ss58 encoded and start with "5").`);
    }
}
function parseIdentity(identity, type) {
    if (!identity)
        return identity;
    try {
        types_1.identityValidation.parse(identity);
        return identity;
    }
    catch (error) {
        throw new Error(`Invalid Identity "${identity}" provided to the ${type} environment variable. (Identities are Bech32m encoded and start with "id1").`);
    }
}
function parseIdentities(identities, type) {
    if (Array.isArray(identities))
        return identities.map(x => parseIdentity(x, type));
    if (!identities)
        return [];
    const identityList = identities
        .split(',')
        .map(x => x.trim())
        .filter(Boolean);
    for (const identity of identityList) {
        parseIdentity(identity, type);
    }
    return identityList;
}
//# sourceMappingURL=env.js.map