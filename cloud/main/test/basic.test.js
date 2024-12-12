"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
const CloudNode_1 = require("../lib/CloudNode");
const pkg = require('../package.json');
describe('basic CloudNode tests', () => {
    it('starts, responds to request and shuts down', async () => {
        const cloudNode = new CloudNode_1.default();
        await cloudNode.listen();
        const url = `http://${await cloudNode.address}/`;
        const response = await new Promise(resolve => {
            Http.get(url, res => {
                let data = '';
                res.on('data', x => (data += x));
                res.on('end', () => resolve(data));
            });
        });
        expect(response).toEqual(`Ulixee Cloud v${pkg.version}`);
        await cloudNode.close();
    });
});
//# sourceMappingURL=basic.test.js.map