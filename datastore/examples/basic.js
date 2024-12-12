"use strict";
// NOTE: you must start your own Ulixee Cloud to run this example.
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_plugins_hero_1 = require("@ulixee/datastore-plugins-hero");
exports.default = new datastore_plugins_hero_1.Extractor(datastore => {
    console.log('INPUT: ', datastore.input);
}, datastore_plugins_hero_1.HeroExtractorPlugin);
//# sourceMappingURL=basic.js.map