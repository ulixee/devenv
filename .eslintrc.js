const { monorepo } = require('@ulixee/repo-tools/eslint');
module.exports = monorepo(__dirname);
module.exports.overrides.push({
    files: ['playgrounds/**/*.ts', 'end-to-end/**/*.ts', '**/cli.ts', '**/cli/*'],
    rules: {
        'no-console': 'off',
    },
}, {
    files: ['datastore/packager/**'],
    rules: {
        'no-console': 'off',
        'import/no-dynamic-require': 'off',
    },
}, {
    files: ['**/DatastoreWrapper.ts'],
    rules: {
        'import/no-import-module-exports': 'off',
    },
});
//# sourceMappingURL=.eslintrc.js.map