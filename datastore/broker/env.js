"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envUtils_1 = require("@ulixee/commons/lib/envUtils");
(0, envUtils_1.loadEnv)(process.cwd());
(0, envUtils_1.loadEnv)(__dirname);
const env = process.env;
if (env.ULX_DATABROKER_DIR)
    env.ULX_DATABROKER_DIR = (0, envUtils_1.parseEnvPath)(env.ULX_DATABROKER_DIR);
exports.default = {
    port: (0, envUtils_1.parseEnvInt)(env.ULX_DATABROKER_PORT) ?? 0,
    storageDir: env.ULX_DATABROKER_DIR,
    isTestEnv: env.NODE_ENV === 'test',
    localchainConfig: getLocalchainConfig(),
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
        notaryId: (0, envUtils_1.parseEnvInt)(env.ARGON_NOTARY_ID),
        keystorePassword: {
            interactiveCli: (0, envUtils_1.parseEnvBool)(env.ARGON_LOCALCHAIN_PASSWORD_INTERACTIVE_CLI),
            password: keystorePassword,
            passwordFile: env.ARGON_LOCALCHAIN_PASSWORD_FILE,
        },
    };
}
//# sourceMappingURL=env.js.map