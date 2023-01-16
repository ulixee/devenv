# FunctionSchema

> FunctionSchemas provide a way to add Typescript types, validation and documentation for the Input and Output of a datastore Function.

FunctionSchemas are not a runtime class, but an interface of a few properties to define a Datastore Function's Input/Output structure. When you define the input and output of a Function, a few things happen:

- Typescript types will be generated and input/output will emit compilation errors
- Runtime validation is performed when parsing input parameters or returning results
- Realtime validation occurs as you add output properties. If a type is wrong, your script will halt and notify you immediately so you don't waste any extra work.

```js
import { Function, HeroFunctionPlugin } from '@ulixee/datastore-plugins-hero';
import { string } from '@ulixee/schema';

export default new Function({
  async run(datastore) {
    const { input, Output, Hero } = datastore;

    const hero = new Hero();
    await hero.goto(input.url);
    const title = await hero.document.title;

    const output = new Output();
    output.title = title;
    output.resolvedUrl = await hero.url;
    // ERROR: body expects a string, not a Promise<string>!
    output.body = hero.document.body.textContent;
  },
  // FunctionSchema definition
  schema: {
    name: 'TitleAndHtmlPageResolver',
    input: {
      url: string({ format: 'url' }),
    },
    output: {
      title: string(),
      body: string(),
      resolvedUrl: string({ format: 'url' }),
    },
    inputExamples: [
      {
        url: 'https://example.org',
      },
      {
        url: 'https://ulixee.org',
      },
    ],
  },
}, HeroFunctionPlugin);
```

When you package a `Datastore` (or a `Function` auto-wrapped into a `Datastore`) for [deployment](../overview/deployment), a few other type utilities are added:

- Types are automatically created so that you can import Datastore Function types.

  ```bash
  npx @ulixee/datastore deploy ./index.js; // Datastore Version hash is dbx12343
  ```

  ```js
  import ITypes from '@ulixee/datastore/types';

  type IIndexFunctionSchema = ITypes['dbx12343']['default']; // default is the name if auto-packaged
  ```

- Typing of parameters and results are automatically referenced when running a Datastore function.
  ```js
  import DatastoreClient from '@ulixee/datastore/lib/DatastoreApiClient';
  const client = new DatastoreClient('localhost:8080');
  const result = client.exec('dbx12343', 'default', { url: 'https://ulixee.org ' });
  // result has type inferred automatically.
  ```

- Consumers of your `Datastore` can `install` your `DatastoreVersionHash` and the accompanying types using `@ulixee/datastore install <DatastoreVersionHash>`.

## Documentation Generation

TODO: This feature will come in a follow-on release, and will auto-generate a website with documentation for using a Datastore Function. Details come from this FunctionSchema definition.

## Properties

### input `Record<string, Any Schema>` {#input}

Optional input fields definition containing and object of string Keys to [Schema](./schema) values.

### output `Record<string, Any Schema>` | ObjectSchema

Optional definition of Key/[Any Schema](./schema), [Object](./schema#object) to be returned.

### inputExamples: `Record<string, Example Value or DataUtilities Function>[]`

Optional array of example input field combinations. Each record contains an object of [input](#input) keys mapped to a value of the provided Schema type. There are in-built Data functions to generate dynamic data that are included with the `@ulixee/schema` library. Functions importable are:

- `dateAdd(quantity: number, units: IUnits)`: Add to the current date. Units options are `'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years'`.
- `dateSubtract(quantity: number, units: IUnits)`: Subtract from the current date. Units options are `'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years'`.

```js
import { Function, HeroFunctionPlugin } from '@ulixee/datastore-plugins-hero';
import { string, dateAdd } from '@ulixee/schema';

export default new Function({
  async run(ctx) {
    // prints 'YYYY-MM-DD' of tomorrow
    console.log(ctx.input.when);
  },
  schema: {
    input: {
      when: string({ format: 'date' }),
    },
    inputExamples: [{ when: (1, 'days') }],
  },
});
```