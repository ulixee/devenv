import * as Fs from 'fs';
import * as Path from 'path';
import { CloudNode } from '@ulixee/cloud';
import { ConnectionToDatastoreCore } from '@ulixee/datastore';
import Client from '..';
import localExtractor from './datastores/localExtractor';

const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'Client.localExtractor.test');
let cloudNode: CloudNode;
let connectionToCore: ConnectionToDatastoreCore;

beforeAll(async () => {
  cloudNode = new CloudNode();
  cloudNode.router.datastoreConfiguration = {
    datastoresDir: storageDir,
    datastoresTmpDir: Path.join(storageDir, 'tmp'),
  };
  await cloudNode.listen();
  connectionToCore = ConnectionToDatastoreCore.remote(await cloudNode.address);
});

afterAll(async () => {
  await cloudNode.close();
  await connectionToCore.disconnect();
  if (Fs.existsSync(storageDir)) Fs.rmSync(storageDir, { recursive: true });
});

test('should be able to query a datastore using sql', async () => {
  const client = Client.forExtractor(localExtractor, { connectionToCore });
  const results = await client.query('SELECT * FROM test(shouldTest => $1)', [true]);

  expect(results).toEqual([
    {
      testerEcho: true,
      lastName: 'Clark',
      greeting: 'Hello world',
    },
  ]);
});

test('should be able to run a datastore function', async () => {
  const client = Client.forExtractor(localExtractor, { connectionToCore });

  const testTypes = () => {
    // @ts-expect-error
    void client.run({ notValid: 1 });
  };

  const results = await client.run({ shouldTest: true });

  expect(results).toEqual([
    {
      testerEcho: true,
      lastName: 'Clark',
      greeting: 'Hello world',
    },
  ]);

  // @ts-expect-error - Test typing works
  const test: number = results[0].testerEcho;
  expect(test).not.toBe(expect.any(Number));

  // @ts-expect-error
  const first = results[0].firstName;
  expect(first).toBeUndefined();
});