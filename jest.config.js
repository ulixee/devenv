const Fs = require('fs');
const Path = require('path');
const pkg = require('./package.json');
const workspaces = [];
const packages = Array.isArray(pkg.workspaces) ? pkg.workspaces : pkg.workspaces.packages ?? [];
for (const packageGlob of packages) {
    if (packageGlob.startsWith('../') || packageGlob.includes('packages/'))
        continue;
    let workspacePath = packageGlob;
    // if we're not in build already, need to add build
    if (!__dirname.includes('build') && !workspacePath.includes('build')) {
        workspacePath = `build/${workspacePath}`;
    }
    if (workspacePath.endsWith('/*')) {
        workspacePath = workspacePath.replace('/*', '');
        for (const subdir of Fs.readdirSync(Path.resolve(__dirname, workspacePath))) {
            if (subdir === 'node_modules')
                continue;
            if (!Fs.statSync(Path.resolve(__dirname, workspacePath, subdir)).isDirectory())
                continue;
            if (!Fs.existsSync(Path.resolve(__dirname, workspacePath, subdir, 'package.json')))
                continue;
            workspaces.push(`${workspacePath}/${subdir}`);
        }
    }
    else {
        workspaces.push(workspacePath);
    }
}
module.exports = {
    verbose: false,
    testMatch: ['**/test/*.test.js'],
    testEnvironment: 'node',
    collectCoverage: false,
    transform: {},
    globalSetup: './jest.setup.js',
    setupFilesAfterEnv: ['./jest.setupPerTest.js'],
    globalTeardown: './jest.teardown.js',
    testTimeout: 20e3,
    reporters: ['default', ['github-actions', { silent: true }], 'summary'],
    roots: workspaces.map(x => `${x}/`),
    moduleDirectories: ['node_modules', ...workspaces.map(x => `${x}/node_modules`)],
    modulePathIgnorePatterns: ['build/desktop/main/app/packages', 'build/datastore/core/test/datastores'],
};
//# sourceMappingURL=jest.config.js.map