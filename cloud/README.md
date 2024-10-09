# Ulixee Cloud

# Introduction

> Ulixee Cloud makes it easy to quickly spin up ready-to-go production servers.

## How It Works

Each Ulixee tool creates connection details to handle its internal connections.

Cloud currently uses Websockets and allows each tool's Core to handle details of what is transported. Connections can optionally be shared by many operations. For instance, Hero allows a single connection to host multiple [Sessions](/docs/hero/advanced/session) if the [`ConnectionToCore`](/docs/hero/advanced/connection-to-core) is reused by many Hero instances.

## Installation

To use Cloud in your project, install it with npm (or your package manager of choice):

```bash
npm i --save @ulixee/cloud
```

When you install Cloud, it installs [`Hero`](//ulixee.org/docs/hero), [`Datastore`](//ulixee.org/docs/datastore) and [`Desktop`](https://github.com/ulixee/desktop) Core (a tool to enhance the Hero Development process).

## Command Line Interface (CLI)

You can launch a Cloud instance from an npm script or the command line using the CLI. The following command is added to your local bin when you add `@ulixee/cloud` as a dependency (or devDependency):

```json
{
  "scripts": {
    "ulixee-start": "@ulixee/cloud start"
  }
}
```

You can run the start command from the command line as `npx @ulixee/cloud start`.

### Command Options:

- `-p, --port` The port to use. Defaults to any available port.
- `-x, --disable-chrome-alive` Do not enable ChromeAlive! even if installed locally.

### Global CLI

The Ulixee CLI allows you to start a Ulixee Cloud. To use it, first install the cli globally.
`npm -i -g @ulixee/cli`

Now you can run the following command from your project directory with any of the options described above:
`ulixee cloud start`

## Usage Example

Starting a Ulixee Cloud is very similar to starting a NodeJs Http Server, except it is promise-based.

```js
import { Cloud } from '@ulixee/cloud';

(async () => {
  const cloud = new Cloud();
  await cloud.listen();
})();
```

To refer to this Cloud in a Hero client, you can supply the host string to the constructor.

NOTE: connection details on a local machine are optional. If you don't supply any connection detail, Hero and Datastore will connect to the local host.

```js
import Hero from '@ulixee/hero';

(async () => {
  const hero = new Hero({ connectionToCore: 'ws://localhost:1818' });
  await hero.goto('https://example.org');
  await hero.close();
})();
```
