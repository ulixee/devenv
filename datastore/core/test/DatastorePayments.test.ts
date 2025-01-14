import { Chain, ChainIdentity } from '@argonprotocol/localchain';
import { Keyring } from '@argonprotocol/mainchain';
import { CloudNode } from '@ulixee/cloud';
import UlixeeHostsConfig from '@ulixee/commons/config/hosts';
import DatastorePackager from '@ulixee/datastore-packager';
import { Helpers } from '@ulixee/datastore-testing';
import DatastoreApiClient from '@ulixee/datastore/lib/DatastoreApiClient';
import ArgonReserver from '@ulixee/datastore/payments/ArgonReserver';
import CreditReserver from '@ulixee/datastore/payments/CreditReserver';
import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';
import * as Fs from 'fs';
import * as Path from 'path';
import IArgonPaymentProcessor from '../interfaces/IArgonPaymentProcessor';
import MockArgonPaymentProcessor from './_MockArgonPaymentProcessor';
import MockPaymentService from './_MockPaymentService';
import TypeSerializer from '@ulixee/commons/lib/TypeSerializer';

const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'DatastorePayments.test');

let cloudNode: CloudNode;
let client: DatastoreApiClient;

jest.spyOn<any, any>(UlixeeHostsConfig.global, 'save').mockImplementation(() => null);
let storageCounter = 0;
const keyring = new Keyring({ ss58Format: 18 });
const datastoreKeyring = keyring.createFromUri('Datastore');
const argonPaymentProcessorMock = new MockArgonPaymentProcessor();
let argonPaymentProcessor: IArgonPaymentProcessor;
let manifest: IDatastoreManifest;
const mainchainIdentity = {
  chain: Chain.Devnet,
  genesisHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
} as ChainIdentity;

beforeAll(async () => {
  if (Fs.existsSync(`${__dirname}/datastores/payments-manifest.json`)) {
    Fs.unlinkSync(`${__dirname}/datastores/payments-manifest.json`);
  }

  if (Fs.existsSync(`${__dirname}/datastores/payments.dbx`)) {
    Fs.rmSync(`${__dirname}/datastores/payments.dbx`, { recursive: true });
  }

  Fs.writeFileSync(
    `${__dirname}/datastores/payments-manifest.json`,
    TypeSerializer.stringify({
      version: '0.0.1',
      extractorsByName: {
        testPayments: {
          prices: [
            {
              basePrice: 1250n,
            },
          ],
        },
      },
      tablesByName: {
        titleNames: {
          prices: [
            {
              basePrice: 100n,
            },
          ],
        },
        successTitles: {
          prices: [
            {
              basePrice: 150n,
            },
          ],
        },
      },
    } as Partial<IDatastoreManifest>),
  );
  const packager = new DatastorePackager(`${__dirname}/datastores/payments.js`);
  const dbx = await packager.build();

  manifest = packager.manifest;
  cloudNode = await Helpers.createLocalNode(
    {
      datastoreConfiguration: {
        datastoresDir: storageDir,
        datastoresTmpDir: Path.join(storageDir, 'tmp'),
      },
    },
    true,
    {
      address: datastoreKeyring.address,
      notaryId: 1,
      ...mainchainIdentity,
    },
  );
  argonPaymentProcessor = cloudNode.datastoreCore.argonPaymentProcessor;
  client = new DatastoreApiClient(await cloudNode.address, { consoleLogErrors: true });
  await client.upload(await dbx.tarGzip());
  Helpers.onClose(() => client.disconnect(), true);
});

beforeEach(() => {
  storageCounter += 1;
  ArgonReserver.baseStorePath = Path.join(storageDir, `payments-${storageCounter}`);
  CreditReserver.defaultBasePath = Path.join(storageDir, `credits-${storageCounter}`);

  argonPaymentProcessorMock.clear();
});

afterEach(Helpers.afterEach);
afterAll(Helpers.afterAll);

test('should be able to run a datastore function with payments', async () => {
  expect(manifest.extractorsByName.testPayments.prices[0].basePrice).toBe(1250n);

  const price = await client.pricing.getEntityPrice(manifest.id, manifest.version, 'testPayments');
  expect(price).toBe(1250n);

  await expect(
    client.query(manifest.id, manifest.version, 'SELECT * FROM testPayments()'),
  ).rejects.toThrow('requires payment');
  await expect(client.stream(manifest.id, manifest.version, 'testPayments', {})).rejects.toThrow(
    'requires payment',
  );

  const clientAddress = keyring.createFromUri('client');

  const paymentService = new MockPaymentService(clientAddress, client);

  argonPaymentProcessorMock.mock(datastoreId => {
    const channelHoldId = paymentService.paymentsByDatastoreId[datastoreId].channelHoldId;
    const channelHold = paymentService.channelHoldsById[channelHoldId];
    return {
      id: channelHoldId,
      expirationTick: channelHold.tick + 100,
      holdAmount: channelHold.channelHoldAmount,
    };
  });

  await expect(
    client.query(manifest.id, manifest.version, 'SELECT success FROM testPayments()', {
      paymentService,
    }),
  ).resolves.toEqual({
    outputs: [{ success: true }],
    metadata: {
      microgons: 1250n,
      bytes: expect.any(Number),
      milliseconds: expect.any(Number),
    },
    latestVersion: expect.any(String),
    queryId: expect.any(String),
  });
  // @ts-ignore
  const statsTracker = cloudNode.datastoreCore.statsTracker;
  const entry = await statsTracker.getForDatastoreVersion(manifest);
  expect(entry.stats.queries).toBe(3);
  expect(entry.stats.errors).toBe(2);
  expect(entry.stats.maxPricePerQuery).toBe(1250n);
  expect(entry.statsByEntityName.testPayments.stats.queries).toBe(1);
  expect(entry.statsByEntityName.testPayments.stats.maxPricePerQuery).toBe(1250n);

  const streamed = client.stream(
    manifest.id,
    manifest.version,
    'testPayments',
    {},
    { paymentService },
  );
  await expect(streamed.resultMetadata).resolves.toEqual({
    outputs: [{ success: true }],
    metadata: {
      microgons: 1250n,
      bytes: expect.any(Number),
      milliseconds: expect.any(Number),
    },
    latestVersion: expect.any(String),
    queryId: expect.any(String),
  });
  // @ts-expect-error
  const dbs = argonPaymentProcessor.channelHoldDbsByDatastore;
  expect(dbs.size).toBe(1);
  expect(dbs.get(manifest.id).paymentIdByChannelHoldId.size).toBe(1);
  expect(dbs.get(manifest.id).list()).toEqual([
    expect.objectContaining({
      expirationDate: expect.any(Date),
      id: paymentService.paymentsByDatastoreId[manifest.id].channelHoldId,
      allocated: 1250n * 100n,
      remaining: 1250n * 100n - 1250n - 1250n,
    }),
  ]);
});

test('can collect payments from multiple tables and functions', async () => {
  const sql = `select name from titleNames t 
        join successTitles s on s.title = t.title 
        where s.success = (select success from testPayments())`;
  const price = await client.pricing.getQueryPrice(manifest.id, manifest.version, sql);
  expect(price).toBe(1250n + 150n + 100n);

  const clientAddress = keyring.createFromUri('client');

  const paymentService = new MockPaymentService(clientAddress, client);

  argonPaymentProcessorMock.mock(datastoreId => {
    const channelHoldId = paymentService.paymentsByDatastoreId[datastoreId].channelHoldId;
    const channelHold = paymentService.channelHoldsById[channelHoldId];
    return {
      id: channelHoldId,
      expirationTick: channelHold.tick + 100,
      holdAmount: channelHold.channelHoldAmount,
    };
  });

  await expect(
    client.query(manifest.id, manifest.version, sql, {
      paymentService,
    }),
  ).resolves.toEqual({
    outputs: [{ name: 'Blake' }],
    metadata: {
      microgons: 1250n + 150n + 100n,
      bytes: expect.any(Number),
      milliseconds: expect.any(Number),
    },
    latestVersion: expect.any(String),
    queryId: expect.any(String),
  });

  // @ts-expect-error
  const dbs = argonPaymentProcessor.channelHoldDbsByDatastore;
  expect(dbs.size).toBe(1);
  expect(dbs.get(manifest.id).paymentIdByChannelHoldId.size).toBe(2);
  expect(dbs.get(manifest.id).list()[1]).toEqual(
    expect.objectContaining({
      allocated: (1250n + 150n + 100n) * 100n,
      remaining: (1250n + 150n + 100n) * 100n - (1250n + 150n + 100n),
    }),
  );
});

test('records a changed payment correctly', async () => {
  const clientAddress = keyring.createFromUri('client');

  const paymentService = new MockPaymentService(clientAddress, client);

  argonPaymentProcessorMock.mock(datastoreId => {
    const channelHoldId = paymentService.paymentsByDatastoreId[datastoreId].channelHoldId;
    const channelHold = paymentService.channelHoldsById[channelHoldId];
    return {
      id: channelHoldId,
      expirationTick: channelHold.tick + 100,
      holdAmount: channelHold.channelHoldAmount,
    };
  });

  const streamed = client.stream(
    manifest.id,
    manifest.version,
    'testPayments',
    { explode: true },
    { paymentService },
  );
  await expect(streamed.resultMetadata).resolves.toEqual({
    outputs: undefined,
    runError: expect.any(Error),
    metadata: {
      microgons: 0n,
      bytes: expect.any(Number),
      milliseconds: expect.any(Number),
    },
    latestVersion: expect.any(String),
    queryId: expect.any(String),
  });
  // @ts-expect-error
  const dbs = argonPaymentProcessor.channelHoldDbsByDatastore;
  expect(dbs.size).toBe(1);
  expect(dbs.get(manifest.id).paymentIdByChannelHoldId.size).toBe(3);
  expect(dbs.get(manifest.id).list()[2]).toEqual(
    expect.objectContaining({
      expirationDate: expect.any(Date),
      id: paymentService.paymentsByDatastoreId[manifest.id].channelHoldId,
      allocated: 1250n * 100n,
      remaining: 1250n * 100n,
    }),
  );
});

test.todo('should not double charge for storage and tables');
test.todo('queries a domain for payment if set');
