"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@ulixee/commons/config");
const envUtils_1 = require("@ulixee/commons/lib/envUtils");
(0, envUtils_1.loadEnv)(process.cwd());
(0, envUtils_1.loadEnv)(config_1.default.global.directoryPath);
(0, envUtils_1.loadEnv)(__dirname);
const env = process.env;
exports.default = {
    argonMainchainUrl: env.ARGON_MAINCHAIN_URL,
    tickDurationMillis: (0, envUtils_1.parseEnvInt)(env.ARGON_TICK_DURATION_MILLIS),
    channelHoldExpirationTicks: (0, envUtils_1.parseEnvInt)(env.ARGON_CHANNEL_HOLD_EXPIRATION_TICKS),
    ntpPoolUrl: env.ARGON_NTP_SERVER,
    allowMinimumAffordableChannelHold: (0, envUtils_1.parseEnvBool)(env.ALLOW_MIN_AFFORDABLE_CHANNEL_HOLD),
};
//# sourceMappingURL=env.js.map