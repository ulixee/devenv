"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cloneDatastore;
// eslint-disable-next-line import/no-extraneous-dependencies
const ts = require("typescript");
const fs_1 = require("fs");
const Path = require("path");
const jsonToSchemaCode_1 = require("@ulixee/schema/lib/jsonToSchemaCode");
const nanoid_1 = require("nanoid");
const DatastoreApiClient_1 = require("../lib/DatastoreApiClient");
const { version } = require('../package.json');
const clonedPackageJson = require('./cloned-package.json');
clonedPackageJson.dependencies['@ulixee/datastore'] = version;
clonedPackageJson.devDependencies['@ulixee/datastore-packager'] = version;
async function cloneDatastore(url, directoryPath, options = {}) {
    const { datastoreId, version: datastoreVersion, host, } = await DatastoreApiClient_1.default.lookupDatastoreHost(url, options.argonMainchainUrl);
    if (url.includes('/free-credit')) {
        const credit = new URL(url).search.split(':');
        options.embedCredits = { id: credit[0], secret: credit[1] };
        url = url.split('/free-credit')[0];
    }
    const datastoreApiClient = new DatastoreApiClient_1.default(host);
    const meta = await datastoreApiClient.getMetaAndSchema(datastoreId, datastoreVersion);
    await datastoreApiClient.disconnect();
    const schemasByName = {};
    const imports = new Set();
    const passthroughExtractors = Object.entries(meta.extractorsByName).map(([x, extractor]) => {
        let schemaLine = '';
        imports.add('PassthroughExtractor');
        if (extractor.schemaAsJson) {
            schemasByName[`${x}`] = { isTable: false, schemaJson: extractor.schemaAsJson };
            schemaLine = `\n  schema: ${x}(),\n`;
        }
        let descriptionLine = '';
        if (extractor.description) {
            descriptionLine = `\n  description: ${JSON.stringify(extractor.description)},\n`;
        }
        return `${x}: new PassthroughExtractor({
  remoteExtractor: 'source.${x}',${schemaLine}${descriptionLine}
})`;
    });
    const passthroughTables = Object.entries(meta.tablesByName).map(([x, table]) => {
        let schemaLine = '';
        imports.add('PassthroughTable');
        if (table.schemaAsJson) {
            schemasByName[`${x}`] = { isTable: true, schemaJson: table.schemaAsJson };
            schemaLine = `\n  schema: ${x}(),\n`;
        }
        let descriptionLine = '';
        if (table.description) {
            descriptionLine = `\n  description: ${JSON.stringify(table.description)},\n`;
        }
        return `${x}: new PassthroughTable({
  remoteTable: 'source.${x}',${schemaLine}${descriptionLine}
})`;
    });
    const schemaImports = new Set();
    const schemaVars = Object.entries(schemasByName).map(([name, record]) => {
        const schema = record.schemaJson;
        if (record.isTable) {
            return `function ${name}() {\n  return ${(0, jsonToSchemaCode_1.default)(schema, schemaImports)};\n}\n`;
        }
        let js = `function ${name}() {\n return {\n`;
        if (schema.input) {
            js += `  input: ${(0, jsonToSchemaCode_1.default)(schema.input, schemaImports)}\n,`;
        }
        if (schema.output) {
            js += `  output: ${(0, jsonToSchemaCode_1.default)(schema.output, schemaImports)}`;
        }
        return `${js}};\n}\n`;
    });
    let remoteCredits = '';
    if (options.embedCredits) {
        const { id, secret } = options.embedCredits;
        remoteCredits = `
    remoteDatastoreEmbeddedCredits: {
      source: ${JSON.stringify({ id, secret })},
    },`;
    }
    const description = meta.description
        ? `\n    description: ${JSON.stringify(meta.description)},\n`
        : '';
    const script = `
  import { Datastore, ${[...imports].join(',')} } from '@ulixee/datastore';
  import schemaFromJson from '@ulixee/schema/lib/schemaFromJson';
  import { ${[...schemaImports].join(', ')} } from '@ulixee/schema';
  
  const datastore = new Datastore({
    id: ${JSON.stringify(meta.id + 2)},
    version: "0.0.1",
    name: ${JSON.stringify(meta.name)},${description}
    affiliateId: "aff${(0, nanoid_1.nanoid)(10)}",
    remoteDatastores: {
      source: "${url}",
    },${remoteCredits}
    extractors: {
      ${passthroughExtractors}
    },
    tables: {
      ${passthroughTables}
    }
  });

  //////////// SCHEMA DEFINITIONS //////////////////
  ${schemaVars.join('\n')}

  export default datastore;`;
    let folder = Path.resolve(directoryPath || `./${meta.name ?? 'datastore'}`);
    if (!directoryPath) {
        let counter = 1;
        const baseFolder = folder;
        while ((0, fs_1.existsSync)(folder))
            folder += `${baseFolder}${counter++}`;
    }
    if (!(0, fs_1.existsSync)(folder)) {
        (0, fs_1.mkdirSync)(folder, { recursive: true });
    }
    if (!(0, fs_1.existsSync)(Path.join(folder, 'package.json'))) {
        (0, fs_1.writeFileSync)(Path.join(folder, 'package.json'), JSON.stringify(clonedPackageJson, null, 2), 'utf8');
    }
    if (!(0, fs_1.existsSync)(Path.join(folder, 'tsconfig.json'))) {
        (0, fs_1.copyFileSync)(`${__dirname}/cloned-tsconfig.json`, Path.join(folder, 'tsconfig.json'));
    }
    const datastoreFilepath = Path.join(folder, `datastore.ts`);
    const sourceFile = ts.createSourceFile(datastoreFilepath, script, ts.ScriptTarget.ES2020, false, ts.ScriptKind.TS);
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, noEmitHelpers: true });
    const tsFile = printer.printFile(sourceFile);
    (0, fs_1.writeFileSync)(datastoreFilepath, tsFile);
    return { datastoreFilePath: datastoreFilepath };
}
//# sourceMappingURL=cloneDatastore.js.map