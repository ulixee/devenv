"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const allowedId = 'id1TOFILLIN';
exports.default = new datastore_1.default({
    id: 'auth',
    version: '0.0.1',
    authenticateIdentity(identity) {
        return identity === allowedId;
    },
    extractors: {
        authme: new datastore_1.Extractor({
            run(ctx) {
                ctx.Output.emit({ youreIn: true });
            },
        }),
    },
});
//# sourceMappingURL=auth.js.map