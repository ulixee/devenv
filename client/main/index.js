"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientForCrawler = exports.ClientForExtractor = exports.ClientForTable = exports.ClientForDatastore = exports.DefaultPaymentService = exports.Client = void 0;
const datastore_1 = require("@ulixee/datastore");
Object.defineProperty(exports, "DefaultPaymentService", { enumerable: true, get: function () { return datastore_1.DefaultPaymentService; } });
const Client_1 = require("./lib/Client");
exports.Client = Client_1.default;
const ClientForDatastore_1 = require("./lib/ClientForDatastore");
exports.ClientForDatastore = ClientForDatastore_1.default;
const ClientForTable_1 = require("./lib/ClientForTable");
exports.ClientForTable = ClientForTable_1.default;
const ClientForExtractor_1 = require("./lib/ClientForExtractor");
exports.ClientForExtractor = ClientForExtractor_1.default;
const ClientForCrawler_1 = require("./lib/ClientForCrawler");
exports.ClientForCrawler = ClientForCrawler_1.default;
exports.default = Client_1.default;
//# sourceMappingURL=index.js.map