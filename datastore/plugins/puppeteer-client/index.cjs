const cjsImport = require('./index.js');

for (const key in cjsImport) {
  if (!cjsImport.hasOwnProperty(key) || key in module.exports) continue;
  module.exports[key] = cjsImport[key];
}
