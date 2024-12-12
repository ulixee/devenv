// eslint-disable-next-line import/no-extraneous-dependencies
const SetupAwaitedHandler = require('@ulixee/hero/lib/SetupAwaitedHandler');
// eslint-disable-next-line import/no-extraneous-dependencies
const DatastoreManifest = require('@ulixee/datastore-core/lib/DatastoreManifest').default;
// Jest tries to deeply recursively extract properties from objects when a test breaks - this does not play nice with AwaitedDom
const originGetProperty = SetupAwaitedHandler.delegate.getProperty;
SetupAwaitedHandler.delegate.getProperty = function getProperty(...args) {
    const parentPath = new Error().stack;
    if (parentPath.includes('deepCyclicCopy')) {
        return null;
    }
    // eslint-disable-next-line prefer-rest-params
    return originGetProperty(...args);
};
DatastoreManifest.prototype._save = DatastoreManifest.prototype.save;
jest.spyOn(DatastoreManifest.prototype, 'save').mockImplementation(async function save() {
    if (this.source === 'global')
        return;
    return await this._save();
});
//# sourceMappingURL=jest.setupPerTest.js.map