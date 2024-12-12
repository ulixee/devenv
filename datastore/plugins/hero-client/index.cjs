const cjsImport = require('./index.js');

for (const key in cjsImport) {
  if (!cjsImport.hasOwnProperty(key)) continue;
  module.exports[key] = cjsImport[key];
}
