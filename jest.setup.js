const fs = require('fs');
const { Localchain } = require('@argonprotocol/localchain');
const rmSync = 'rmSync' in fs ? 'rmSync' : 'rmdirSync';
// eslint-disable-next-line import/no-extraneous-dependencies
const CertificateManager = require('@ulixee/unblocked-agent-mitm-socket/lib/CertificateGenerator').default;
module.exports = async () => {
    try {
        fs[rmSync](`${__dirname}/.data-test`, { recursive: true });
        fs.mkdirSync(`${__dirname}/.data-test`);
        // generate base certs
        const certManager = new CertificateManager({
            storageDir: `${__dirname}/.data-test`,
        });
        await certManager.waitForConnected;
        certManager.close();
        if (process.env.ULX_DATA_DIR) {
            Localchain.setDefaultDir(Path.join(process.env.ULX_DATA_DIR, 'argon', 'localchain'));
        }
    }
    catch (err) {
        // ignore
    }
};
//# sourceMappingURL=jest.setup.js.map