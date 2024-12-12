#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@ulixee/commons/lib/SourceMapSupport");
const ShutdownHandler_1 = require("@ulixee/commons/lib/ShutdownHandler");
const cli_1 = require("../cli");
// Required to capture signals. Something is trapping them if not registered before the cli runs
ShutdownHandler_1.default.registerSignals();
(0, cli_1.default)().name('@ulixee/datastore').parseAsync().catch(console.error);
//# sourceMappingURL=cli.js.map