"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_1 = require("@ulixee/cloud");
(async function main() {
    const cloudNode = new cloud_1.CloudNode({ port: 1818 });
    await cloudNode.listen();
    console.log(`Cloud started on port ${await cloudNode.port}`);
    return cloudNode;
})().catch(error => {
    console.log('ERROR starting core', error);
    process.exit(1);
});
//# sourceMappingURL=basic-node.js.map