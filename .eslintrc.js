const Fs = require('fs');
const Path = require('path');
const pkg = require('./package.json');

const workspaces = [];
const workspacesWithModules = ['node_modules'];
for (const workspaceDir of pkg.workspaces.packages) {
  if (workspaceDir.includes('/build') || workspaceDir.includes('boss/packages')) continue;

  const workspace = workspaceDir.replace('/*', '');
  workspaces.push(workspace);
  workspacesWithModules.push(workspace);
  workspacesWithModules.push(`${workspace}/node_modules`);
  if (workspaceDir.endsWith('/*')) {
    const baseDir = `${__dirname}/${workspace}`;
    for (const sub of Fs.readdirSync(baseDir)) {
      if (Fs.lstatSync(`${baseDir}/${sub}`).isDirectory()) {
        workspaces.push(`${workspace}/${sub}`);
        workspacesWithModules.push(`${workspace}/${sub}`);
        workspacesWithModules.push(`${workspace}/${sub}/node_modules`);
      }
    }
  }
}

module.exports = {
  root: true,
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'prettier',
    'plugin:monorepo-cop/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  plugins: ['monorepo-cop'],
  parserOptions: {
    project: Path.join(__dirname, 'tsconfig.json'),
    extraFileExtensions: ['.mjs'],
  },
  settings: {
    'import/core-modules': ['electron'],
    'import/external-module-folders': workspacesWithModules,
    'import/resolver': {
      typescript: {
        project: ['tsconfig.json'],
      },
    },
  },
  env: {
    node: true,
    es6: true,
    browser: true,
    jest: true,
  },
  overrides: [
    {
      files: ['global.d.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
  ignorePatterns: [
    '**/node_modules',
    '**/databox',
    '**/hero',
    'runner/**',
    'website',
    'node_modules',
    '**/test/assets/**',
    'build',
    'build-dist',
    '**/babel.config.js',
    '**/vue.config.js',
    '**/prepare-*.js',
    '**/copyfiles.js',
    'versionCheck.ts',
    './*.js',
    '**/examples',
    '**/build/**',
    '**/dist/**',
    '**/*.md',
  ],
  rules: {
    'import/no-named-as-default-member': 'off',
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'off', // TODO:we need to work through this!!
    'import/extensions': 'off',
    // 'import/no-default-export': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/**/test/**',
          '**/examples/**',
          '**/scripts/**',
          '**/data-scripts/**',
          '**/*.test.ts',
        ],
      },
    ],
    'no-use-before-define': 'off', // use typescript one
    'no-prototype-builtins': 'off',
    'no-case-declarations': 'off',
    'no-parameter-reassignment': 'off',
    'array-type': 'off',
    'import-name': 'off',
    'default-case': 'off',
    'no-continue': 'off',
    'no-bitwise': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-async-promise-executor': 'off',
    'no-return-await': 'off',
    'no-return-assign': 'off',
    'prefer-destructuring': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'consistent-return': ['off', { treatUndefinedAsUnspecified: true }],
    'spaced-comment': ['error', 'always', { markers: ['/////'] }],
    'require-await': 'error',
    'arrow-body-style': 'off',
    'jest/no-conditional-expect': 'off',
    '@typescript-eslint/no-implied-eval': 'off', // false positives for setTimeout with bind fn
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/object-literal-sort-keys': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/ordered-imports': 'off',
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/no-shadow': [
      'error',
      { ignoreTypeValueShadow: true, ignoreFunctionTypeParameterNameValueShadow: true },
    ],
    '@typescript-eslint/object-literal-shorthand': 'off',
    '@typescript-eslint/object-shorthand-properties-first': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          'public-static-field',
          'protected-static-field',
          'private-static-field',
          'public-instance-field',
          'protected-instance-field',
          'private-instance-field',
          'constructor',
          'public-instance-method',
          'protected-instance-method',
          'private-instance-method',
          'public-static-method',
          'protected-static-method',
          'private-static-method',
        ],
      },
    ],
  },
};
