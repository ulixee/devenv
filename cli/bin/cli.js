#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@ulixee/commons/lib/SourceMapSupport");
const index_1 = require("../index");
(0, index_1.default)().parseAsync().catch(console.error);
//# sourceMappingURL=cli.js.map