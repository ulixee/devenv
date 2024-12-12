"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeInterval = exports.intervalToString = exports.toSql = exports.astMapper = exports.astVisitor = exports.parseWithComments = exports.parseIntervalLiteral = exports.parseGeometricLiteral = exports.parseArrayLiteral = exports.parseFirst = exports.parse = exports.assignChanged = exports.arrayNilMap = void 0;
var utils_1 = require("./lib/utils");
Object.defineProperty(exports, "arrayNilMap", { enumerable: true, get: function () { return utils_1.arrayNilMap; } });
Object.defineProperty(exports, "assignChanged", { enumerable: true, get: function () { return utils_1.assignChanged; } });
var parser_1 = require("./lib/parser");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return parser_1.parse; } });
Object.defineProperty(exports, "parseFirst", { enumerable: true, get: function () { return parser_1.parseFirst; } });
Object.defineProperty(exports, "parseArrayLiteral", { enumerable: true, get: function () { return parser_1.parseArrayLiteral; } });
Object.defineProperty(exports, "parseGeometricLiteral", { enumerable: true, get: function () { return parser_1.parseGeometricLiteral; } });
Object.defineProperty(exports, "parseIntervalLiteral", { enumerable: true, get: function () { return parser_1.parseIntervalLiteral; } });
Object.defineProperty(exports, "parseWithComments", { enumerable: true, get: function () { return parser_1.parseWithComments; } });
var astVisitor_1 = require("./lib/astVisitor");
Object.defineProperty(exports, "astVisitor", { enumerable: true, get: function () { return astVisitor_1.astVisitor; } });
var astMapper_1 = require("./lib/astMapper");
Object.defineProperty(exports, "astMapper", { enumerable: true, get: function () { return astMapper_1.astMapper; } });
var toSql_1 = require("./lib/toSql");
Object.defineProperty(exports, "toSql", { enumerable: true, get: function () { return toSql_1.toSql; } });
__exportStar(require("./interfaces/ISqlNode"), exports);
var IntervalUtils_1 = require("./lib/helpers/IntervalUtils");
Object.defineProperty(exports, "intervalToString", { enumerable: true, get: function () { return IntervalUtils_1.intervalToString; } });
Object.defineProperty(exports, "normalizeInterval", { enumerable: true, get: function () { return IntervalUtils_1.normalizeInterval; } });
//# sourceMappingURL=index.js.map