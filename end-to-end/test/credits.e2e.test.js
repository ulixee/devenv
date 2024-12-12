"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_testing_1 = require("@ulixee/datastore-testing");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const DefaultPaymentService_1 = require("@ulixee/datastore/payments/DefaultPaymentService");
const Path = require("node:path");
const TestCloudNode_1 = require("../lib/TestCloudNode");
const utils_1 = require("../lib/utils");
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(datastore_testing_1.Helpers.afterAll);
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'e2eCredits.test');
test('it can create a datastore with credits using cli', async () => {
    const buildDir = (0, utils_1.getPlatformBuild)();
    const identityPath = Path.join(storageDir, 'DatastoreDev.pem');
    (0, utils_1.execAndLog)(`npx @ulixee/datastore admin-identity create --filename="${identityPath}"`);
    const identityBech32 = (0, utils_1.execAndLog)(`npx @ulixee/datastore admin-identity read --filename="${identityPath}"`);
    expect(identityBech32).toContain('id1');
    const cloudNode = new TestCloudNode_1.default(buildDir);
    const cloudAddress = await cloudNode.start({
        ULX_CLOUD_ADMIN_IDENTITIES: identityBech32.trim(),
        ULX_DATASTORE_DIR: storageDir,
        ULX_IDENTITY_PATH: identityPath,
        // ULX_PAYMENT_ADDRESS:
    });
    expect(cloudAddress).toBeTruthy();
    const datastorePath = Path.join('end-to-end', 'test', 'datastore', 'credits.js');
    (0, utils_1.execAndLog)(`npx @ulixee/datastore deploy --skip-docs -u ${cloudAddress} .${Path.sep}${datastorePath}`, {
        cwd: buildDir,
        env: {
            ...process.env,
            ULX_IDENTITY_PATH: identityPath,
        },
    });
    const datastoreId = 'credits';
    const datastoreVersion = '0.0.1';
    const creditResult = (0, utils_1.execAndLog)(`npx @ulixee/datastore credits create --argons=5 ${cloudAddress}/${datastoreId}@v${datastoreVersion}`, {
        env: {
            ...process.env,
            ULX_IDENTITY_PATH: identityPath,
        },
    });
    expect(creditResult).toContain(`${datastoreId}@v${datastoreVersion}`);
    const creditUrl = creditResult.split('\n\n').filter(Boolean).pop().trim();
    expect(creditUrl).toBeTruthy();
    (0, utils_1.execAndLog)(`npx @ulixee/datastore credits install ${creditUrl} -d "${storageDir}"`, {
        cwd: storageDir,
    });
    const datastoreClient = new DatastoreApiClient_1.default(cloudAddress);
    datastore_testing_1.Helpers.onClose(() => datastoreClient.disconnect());
    const paymentService = new DefaultPaymentService_1.default(null, storageDir);
    const result = await datastoreClient.query(datastoreId, datastoreVersion, 'SELECT * FROM default(test => $1)', {
        boundValues: [1],
        paymentService,
    });
    console.log('Result of datastore query is:', result);
    const creditUpdate = (0, utils_1.execAndLog)(`npx @ulixee/datastore credits get ${creditUrl}`);
    expect(creditUpdate.includes('4500000')).toBeTruthy();
}, 60e3);
//# sourceMappingURL=credits.e2e.test.js.map