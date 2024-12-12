"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@ulixee/client");
async function query() {
    const client = new client_1.default(`ulx://localhost:1818/tmp-ulixee-org@v0.0.1`);
    const results = await client.query(`SELECT title, href from docPages(tool => $1)
    order by title desc`, ['hero']);
    console.log(results);
    await client.disconnect();
}
query().catch(console.error);
//# sourceMappingURL=ulixee.org-client.js.map