#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@ulixee/commons/lib/SourceMapSupport");
const cli_1 = require("../cli");
(0, cli_1.default)().name('@ulixee/cloud').parseAsync().catch(console.error);
//# sourceMappingURL=cli.js.map