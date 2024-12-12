const cjsImport = require('./index.js');

module.exports = cjsImport.default;

for (const key in cjsImport) {
  if (!cjsImport.hasOwnProperty(key)) continue;
  module.exports[key] = cjsImport[key];
}
