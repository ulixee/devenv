"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cliCommands;
const index_1 = require("@ulixee/commons/config/index");
const Ed25519_1 = require("@ulixee/platform-utils/lib/Ed25519");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const commander_1 = require("commander");
const Fs = require("fs");
const Path = require("path");
function cliCommands() {
    const cli = new commander_1.Command('admin-identity');
    cli
        .command('create')
        .description('Create an Identity (ed25519 key). It will be used to anonymously secure your network requests.')
        .option('-p, --passphrase <phrase>', 'Save the private key with a passphrase (pkcs8 format).')
        .option('-c, --passphrase-cipher <cipher>', 'Encrypt the internal key with a cipher (pkcs8 format).', Identity_1.default.defaultPkcsCipher)
        .option('-f, --filename <path>', 'Save this Identity to a filepath. If not specified, will be console logged.')
        .enablePositionalOptions(true)
        .action(async ({ filename, passphraseCipher, passphrase }) => {
        const identity = await Identity_1.default.create();
        console.log('Created Identity...', { filename, identity: identity.bech32 }); // eslint-disable-line no-console
        if (filename) {
            await identity.save(filename, { passphrase, cipher: passphraseCipher });
            console.log('Saved to %s', filename); // eslint-disable-line no-console
        }
        else {
            console.log(identity.export(passphrase, passphraseCipher)); // eslint-disable-line no-console
        }
    });
    cli
        .command('save')
        .description('Save an Identity PEM to a local file.')
        .option('-k, --privateKey <key>', 'The private key bytes')
        .option('-f, --filename <path>', 'Save this Identity to a filepath. If not specified, will be placed in <DATA>/identities.')
        .option('-p, --passphrase <phrase>', 'Save identity to a file with a passphrase.')
        .option('-c, --passphrase-cipher <cipher>', 'Encrypt the internal key with a cipher (pkcs8 format).', Identity_1.default.defaultPkcsCipher)
        .action(async ({ privateKey, filename, passphraseCipher, passphrase }) => {
        const ed25519 = Ed25519_1.default.createPrivateKeyFromBytes(Buffer.from(privateKey, 'base64'));
        const identity = new Identity_1.default(ed25519);
        identity.verifyKeys();
        filename ||= Path.join(index_1.default.global.directoryPath, 'identities', `${identity.bech32}.pem`);
        if (!Fs.existsSync(index_1.default.global.directoryPath)) {
            Fs.mkdirSync(index_1.default.global.directoryPath, { recursive: true });
        }
        await identity.save(filename, { passphrase, cipher: passphraseCipher });
        console.log('Saved %s to %s', identity.bech32, filename); // eslint-disable-line no-console
    });
    cli
        .command('read')
        .description('Output the bech32 value of an identity.')
        .option('--pem <pem>', 'The raw bytes of the PEM.')
        .option('-f, --filename <path>', 'Save this Identity to a filepath. If not specified, will be console logged.')
        .option('-p, --passphrase <phrase>', 'Save identity to a file with a passphrase.')
        .enablePositionalOptions(true)
        .action(({ pem, filename, passphrase }) => {
        if (filename) {
            const identity = Identity_1.default.loadFromFile(Path.resolve(process.cwd(), filename), {
                keyPassphrase: passphrase,
            });
            console.log(identity.bech32); // eslint-disable-line no-console
        }
        else {
            pem = pem?.replaceAll('\\n', '\n');
            const identity = Identity_1.default.loadFromPem(pem, { keyPassphrase: passphrase });
            console.log(identity.bech32); // eslint-disable-line no-console
        }
    });
    return cli;
}
//# sourceMappingURL=adminIdentityCli.js.map