"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = creditsCli;
const ArgonUtils_1 = require("@ulixee/platform-utils/lib/ArgonUtils");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const commander_1 = require("commander");
const DatastoreApiClient_1 = require("../lib/DatastoreApiClient");
const CreditReserver_1 = require("../payments/CreditReserver");
function creditsCli() {
    const cli = new commander_1.Command('credits');
    const identityPrivateKeyPassphraseOption = cli
        .createOption('-p, --identity-passphrase <path>', 'A decryption passphrase to the Ulixee Admin Identity (only necessary if specified during Identity creation).')
        .env('ULX_IDENTITY_PASSPHRASE');
    cli
        .command('create')
        .description('Create Argon Credits for a User to try out your Datastore.')
        .argument('<url>', 'The url to the Datastore.')
        .addOption((() => {
        const option = cli.createOption('-a, --argons <value>', 'The number of Argon Credits to give out.');
        option.mandatory = true;
        return option;
    })())
        .addOption(requiredOptionWithEnv('-i, --identity-path <path>', 'A path to an Admin Identity approved for the given Datastore or Cloud.', 'ULX_IDENTITY_PATH'))
        .option('-m, --argon-mainchain-url <url>', 'The mainchain url to use.')
        .addOption(identityPrivateKeyPassphraseOption)
        .action(async (url, { identityPath, identityPassphrase, argons, argonMainchainUrl }) => {
        const microgons = BigInt(parseFloat(argons)) * ArgonUtils_1.default.MicrogonsPerArgon;
        const identity = Identity_1.default.loadFromFile(identityPath, { keyPassphrase: identityPassphrase });
        const { datastoreId, version, host } = await DatastoreApiClient_1.default.lookupDatastoreHost(url, argonMainchainUrl);
        const client = new DatastoreApiClient_1.default(host);
        try {
            const result = await client.createCredits(datastoreId, version, microgons, identity);
            if (!url.includes('://'))
                url = `http://${url}`;
            if (url.endsWith('/'))
                url = url.substring(0, -1);
            const creditUrl = `${url}/free-credit?${result.id}:${result.secret}`;
            console.log(`Credit URL:\n\n${creditUrl}\n`);
        }
        finally {
            await client.disconnect();
        }
    });
    cli
        .command('install')
        .description('Save to a local wallet.')
        .argument('<url>', 'The url of the Credit.')
        .option('-m, --argon-mainchain-url [url]', 'The mainchain url to use.')
        .option('-d, --credit-dir [path]', 'The directory to store credits in.', CreditReserver_1.default.defaultBasePath)
        .action(async (url, { creditDir, argonMainchainUrl }) => {
        const { datastoreId, version, host } = await DatastoreApiClient_1.default.lookupDatastoreHost(url, argonMainchainUrl);
        const client = new DatastoreApiClient_1.default(host);
        try {
            const creditIdAndSecret = url.split('/free-credit?').pop();
            const [id, secret] = creditIdAndSecret.split(':');
            const { balance } = await client.getCreditsBalance(datastoreId, version, id);
            const service = await CreditReserver_1.default.storeCredit(datastoreId, version, client.connectionToCore.transport.host, {
                id,
                secret,
                remainingCredits: balance,
            }, creditDir);
            console.log('Saved %s credit to local payment service at "%s".', ArgonUtils_1.default.format(balance, 'microgons', 'argons'), service.storePath);
        }
        finally {
            await client.disconnect();
        }
    });
    cli
        .command('get')
        .description('Get the current balance.')
        .argument('<url>', 'The url of the Datastore Credit.')
        .option('-m, --argon-mainchain-url <url>', 'The mainchain url to use.')
        .action(async (url, { argonMainchainUrl }) => {
        const { datastoreId, version, host } = await DatastoreApiClient_1.default.lookupDatastoreHost(url, argonMainchainUrl);
        const client = new DatastoreApiClient_1.default(host);
        try {
            const creditIdAndSecret = url.split('/free-credit?').pop();
            const [id] = creditIdAndSecret.split(':');
            const { balance } = await client.getCreditsBalance(datastoreId, version, id);
            console.log(`Your current balance is ~${ArgonUtils_1.default.format(balance, 'microgons', 'argons')} (argons).`, {
                microgons: balance,
            });
        }
        finally {
            await client.disconnect();
        }
    });
    return cli;
}
function requiredOptionWithEnv(flags, description, envVar) {
    const option = new commander_1.Option(flags, description);
    option.required = true;
    option.mandatory = true;
    option.env(envVar);
    return option;
}
//# sourceMappingURL=creditsCli.js.map