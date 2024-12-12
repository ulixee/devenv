"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatastoreLookup_1 = require("@ulixee/datastore/lib/DatastoreLookup");
const localchain_1 = require("@argonprotocol/localchain");
test('can properly encode a domain', async () => {
    expect(localchain_1.DomainStore.parse('Somewhere.analytics')).toEqual({
        name: 'somewhere',
        topLevel: localchain_1.DomainTopLevel.Analytics,
    });
    expect(localchain_1.DomainStore.getHash('somewhere.analytics')).toEqual(localchain_1.DomainStore.getHash('Somewhere.Analytics'));
});
test('throws an error for invalid domains', async () => {
    expect(DatastoreLookup_1.default.parseTld('not-a-real-tld')).toBe(undefined);
    expect(() => localchain_1.DomainStore.parse('somewhere.not-a-real-tld')).toThrow('Invalid top_level');
});
//# sourceMappingURL=DatastoreLookup.test.js.map