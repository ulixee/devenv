import Log from '@ulixee/commons/lib/Logger';
import ShutdownHandler from '@ulixee/commons/lib/ShutdownHandler';
import UlixeeConfig from '@ulixee/commons/config';
import UlixeeHostsConfig from '@ulixee/commons/config/hosts';
import { WsTransportToCore } from '@ulixee/net';
import ConnectionToDataboxCore from './ConnectionToDataboxCore';

const { version } = require('../package.json');

const { log } = Log(module);

export default class ConnectionFactory {
  public static hasLocalMinerPackage = false;

  public static createConnection(): ConnectionToDataboxCore {
    let connection: ConnectionToDataboxCore;
    const host =
      UlixeeConfig.load()?.defaultMinerHost ??
      UlixeeConfig.global.defaultMinerHost ??
      UlixeeHostsConfig.global.getVersionHost(version);

    if (host) {
      const transport = new WsTransportToCore(`${host}/databox`);
      connection = new ConnectionToDataboxCore(transport, { version });
    } else if (UlixeeHostsConfig.global.hasHosts()) {
      if (this.hasLocalMinerPackage) {
        // If Miners are launched, but none compatible, propose installing Miner locally
        throw new Error(
          `Your Ulixee Miner is not started. From your project, run:\n\nnpx @ulixee/miner start`,
        );
      }

      // If Miners are launched, but none compatible, propose installing miner locally
      throw new Error(`Your script is using version ${version} of Hero. A compatible Hero Core was not found on localhost. You can fix this by installing and running a Ulixee Miner in your project:

npm install --save-dev @ulixee/miner @ulixee/apps-chromealive-core

npx @ulixee/miner start
      `);
    }

    if (!connection) {
      throw new Error(
        'Hero Core could not be found locally' +
          '\n' +
          'If you meant to connect to a remote host, include the "host" parameter for your connection',
      );
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const onError = (error: Error) => {
      if (error) {
        log.error('Error connecting to core', {
          error,
          sessionId: null,
        });
      }
    };

    connection.connect(true).then(onError).catch(onError);
    ShutdownHandler.register(() => connection.disconnect());

    return connection;
  }
}
try {
  require.resolve('@ulixee/miner');
  ConnectionFactory.hasLocalMinerPackage = true;
} catch (error) {
  /* no-op */
}
