# Datastore

Datastore is a simple wrapper for your scraper script that converts it into a discrete, composable, and deployable unit.

- [x] **Production Proof Your Script** - Production proof your script a thousand different ways.
- [x] **Breaking Notifications** - Get notified when your scripts break.
- [x] **Runs Anywhere** - Containerize your scripts to run everywhere.
- [x] **Works with Chrome Alive!** - Progressively build your scripts with Chrome Alive!
- [x] **Easy Management** - Manage your datastores like a boss.

## Installation

```shell script
npm install @ulixee/datastore-plugins-hero
```

or

```shell script
yarn add @ulixee/datastore-plugins-hero
```

## Usage

Wrapping your script in a Datastore gives it instant access to the input and output objects, along with a Hero instance:

script.ts

```js
const { Function, HeroFunctionPlugin } = require('@ulixee/datastore-plugins-hero');

new Function(async context => {
  const { input, Output, Hero } = context;
  const hero = new Hero();
  await hero.goto('https://example.org');
  Output.emit({ text: `I went to example.org. Your input was: ${input.name}` });
}, HeroFunctionPlugin);
```

You can call your script in several ways.

1. Directly from the command line:

```shell script
% node script.js --input.name=Alfonso
```

2. Through Stream:

**COMING SOON**

```js
import Stream from '@ulixee/stream';

const stream = new Stream('');

const output = await stream.query({ input: { name: 'Alfonso' } });
```

Browse the [full API docs](https://docs.ulixee.org/datastore).

## Contributing

We'd love your help making `Datastore for Hero` a better tool. Please don't hesitate to send a pull request.

## License

[MIT](LICENSE.md)