# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-alpha.31](https://github.com/ulixee/platform/compare/v2.0.0-alpha.30...v2.0.0-alpha.31) (2024-12-07)

### Features

* all argons in microgons now ([3b0e93a](https://github.com/ulixee/platform/commit/3b0e93aa60c92c5f0aaacadb123771b454816047))

# [2.0.0-alpha.30](https://github.com/ulixee/platform/compare/v2.0.0-alpha.29...v2.0.0-alpha.30) (2024-10-11)

### Bug Fixes

* **datastore:** tests broken from argon updates ([827064c](https://github.com/ulixee/platform/commit/827064c9290b75d15920b66634b2902fabb3fcfa))

### Features

* remove payment info from manifest ([b4a9ad5](https://github.com/ulixee/platform/commit/b4a9ad57289c4c94ac0ee0860c2cf0f89aaabab4))

# [2.0.0-alpha.29](https://github.com/ulixee/platform/compare/v2.0.0-alpha.28...v2.0.0-alpha.29) (2024-07-16)

### Features

* **databroker:** new feature to delegate payment ([47900e3](https://github.com/ulixee/platform/commit/47900e314b8d9f59f88598b1d914e211e1ae5bdf))
* **datastore:** integrate escrow payments ([b00fdd5](https://github.com/ulixee/platform/commit/b00fdd52e36bc9480297639a5584a6f71d6890dd))

# [2.0.0-alpha.28](https://github.com/ulixee/platform/compare/v2.0.0-alpha.27...v2.0.0-alpha.28) (2024-03-11)

**Note:** Version bump only for package @ulixee/client

# [2.0.0-alpha.27](https://github.com/ulixee/platform/compare/v2.0.0-alpha.26...v2.0.0-alpha.27) (2024-03-01)

**Note:** Version bump only for package @ulixee/client

# [2.0.0-alpha.26](https://github.com/ulixee/platform/compare/v2.0.0-alpha.25...v2.0.0-alpha.26) (2024-02-02)

**Note:** Version bump only for package @ulixee/client

# [2.0.0-alpha.25](https://github.com/ulixee/platform/compare/v2.0.0-alpha.24...v2.0.0-alpha.25) (2023-09-28)

**Note:** Version bump only for package @ulixee/client

# [2.0.0-alpha.24](https://github.com/ulixee/platform/compare/v2.0.0-alpha.23...v2.0.0-alpha.24) (2023-08-09)

**Note:** Version bump only for package @ulixee/client

# [2.0.0-alpha.23](https://github.com/ulixee/platform/compare/v2.0.0-alpha.22...v2.0.0-alpha.23) (2023-07-07)

### Features

- **datastore:** change urls to be id@version ([903e34b](https://github.com/ulixee/platform/commit/903e34b43d8fb2bca060dc6344453da885fef29a))
- **datastore:** convert to id and semver ([1f5d524](https://github.com/ulixee/platform/commit/1f5d524eed5f7af42e271190994040c2d183f450))

# [2.0.0-alpha.22](https://github.com/ulixee/platform/compare/v2.0.0-alpha.21...v2.0.0-alpha.22) (2023-06-12)

### Features

- **datastore:** add migrations ([04542bd](https://github.com/ulixee/platform/commit/04542bdb05bc4250839fdb7b30eb11a2ab20b290))
- **datastore:** cluster replay store ([c0347aa](https://github.com/ulixee/platform/commit/c0347aa4a81c31ac2f80f507cc7a048a360c3561))
- **datastore:** configure storage endpoint ([0fca691](https://github.com/ulixee/platform/commit/0fca6913eb63335c055e5b4c88760092f9c55694))

# [2.0.0-alpha.21](https://github.com/ulixee/platform/compare/v2.0.0-alpha.20...v2.0.0-alpha.21) (2023-04-24)

**Note:** Version bump only for package @ulixee/client

# [2.0.0-alpha.20](https://github.com/ulixee/platform/compare/v2.0.0-alpha.19...v2.0.0-alpha.20) (2023-04-20)

### Bug Fixes

- **datastore:** failing tests ([8e3f881](https://github.com/ulixee/platform/commit/8e3f881876a59c2b241806c04260d73e03d37617))

### chore

- rename miner to cloud node ([a3c949e](https://github.com/ulixee/platform/commit/a3c949e4af806cc6a4acdd4b4b04305946add19b))

### Features

- **datastore:** simplify query to live in main ([b7dd56a](https://github.com/ulixee/platform/commit/b7dd56a69fdcdbb51170758c06b6d23cbd9e0585))
- **desktop:** getting started guide ([1e3fd87](https://github.com/ulixee/platform/commit/1e3fd87973807e8862a5696421aa768a6cd02bb6))

### BREAKING CHANGES

- @ulixee/miner package is now @ulixee/cloud.
  You must import {CloudNode} from @ulixee/cloud and use in place of Miner.

# [2.0.0-alpha.19](https://github.com/ulixee/platform/compare/v2.0.0-alpha.17...v2.0.0-alpha.19) (2023-02-25)

### Bug Fixes

- **datastore:** windows tests failing moving files ([deea344](https://github.com/ulixee/platform/commit/deea344e697160d8bb4e17802b166e6778a7095d))

### Features

- added @ulixee/client package ([c71cc8b](https://github.com/ulixee/platform/commit/c71cc8bd99ea1777ad096a0fa9d960782dfdeb7d))
- added sub-Clients like ForDatastore, ForTable, etc + several fixes ([e3d2323](https://github.com/ulixee/platform/commit/e3d23237febf7adfc93da68979a55dd50611d104))
- **client:** add connection to core option ([46d35a9](https://github.com/ulixee/platform/commit/46d35a9d13d27f05cbb59ee2686f52f926a71eb8))
- **client:** add type checking to local ctor ([a44549b](https://github.com/ulixee/platform/commit/a44549bce2dafe0575d74b0340896c157a78b02f))
- docpage credits + @ulixee/client package ([21c0175](https://github.com/ulixee/platform/commit/21c0175c41991a4d89e4f625e10df19cc35be8ec))
