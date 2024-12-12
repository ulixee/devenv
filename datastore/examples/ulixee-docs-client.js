"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@ulixee/client");
const util_1 = require("util");
util_1.inspect.defaultOptions.depth = 10;
async function main() {
    const client = new client_1.default('ulx://localhost:1818/ulixee-docs@v1.0.0');
    try {
        const results = await client.query(`SELECT * from getDocumentation(url => $1)`, [
            'https://ulixee.org/docs/hero/basic-client/hero-replay',
        ]);
        console.log(results);
    }
    finally {
        await client.disconnect();
    }
}
main().catch(console.error);
//# sourceMappingURL=ulixee-docs-client.js.map