"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerOutputSchema = void 0;
const schema_1 = require("@ulixee/schema");
exports.CrawlerOutputSchema = {
    crawler: (0, schema_1.string)({ description: 'The type of crawler output that has been produced.' }),
    version: (0, schema_1.string)({ description: 'The semantic version of the crawler output.' }),
    sessionId: (0, schema_1.string)({
        description: 'A session id providing context for how to look up the assets',
    }),
};
//# sourceMappingURL=ICrawlerOutputSchema.js.map