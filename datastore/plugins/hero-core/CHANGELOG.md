# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-alpha.31](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.30...v2.0.0-alpha.31) (2024-12-07)

### Bug Fixes

* **datastore:** only store cached replays ([56a00b0](https://github.com/ulixee/ulixee/commit/56a00b029d261f2d41d22b3edbd4bc6c28f1333c))
* **desktop:** allow cleanup of session dbs ([42f3264](https://github.com/ulixee/ulixee/commit/42f32641c6891e582f8fa588a3731b259bdfca69))

### Features

* add disable desktop apis to cli ([56772f4](https://github.com/ulixee/ulixee/commit/56772f4ad55f329d9b63022a497e13113dde47ce))
* all argons in microgons now ([3b0e93a](https://github.com/ulixee/ulixee/commit/3b0e93aa60c92c5f0aaacadb123771b454816047))

# [2.0.0-alpha.30](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.29...v2.0.0-alpha.30) (2024-10-11)

**Note:** Version bump only for package @ulixee/datastore-plugins-hero-core

# [2.0.0-alpha.29](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.28...v2.0.0-alpha.29) (2024-07-16)

**Note:** Version bump only for package @ulixee/datastore-plugins-hero-core

# [2.0.0-alpha.28](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.27...v2.0.0-alpha.28) (2024-03-11)

**Note:** Version bump only for package @ulixee/datastore-plugins-hero-core

# [2.0.0-alpha.27](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.26...v2.0.0-alpha.27) (2024-03-01)

**Note:** Version bump only for package @ulixee/datastore-plugins-hero-core

# [2.0.0-alpha.26](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.25...v2.0.0-alpha.26) (2024-02-02)

**Note:** Version bump only for package @ulixee/datastore-plugins-hero-core

# [2.0.0-alpha.25](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.24...v2.0.0-alpha.25) (2023-09-28)

### Features

- **datastore:** remove vm2 dependency ([fdf923c](https://github.com/ulixee/ulixee/commit/fdf923c183f9eb87f6367e7973210f9fb2ca09cc))

# [2.0.0-alpha.24](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.23...v2.0.0-alpha.24) (2023-08-09)

**Note:** Version bump only for package @ulixee/datastore-plugins-hero-core

# [2.0.0-alpha.23](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.22...v2.0.0-alpha.23) (2023-07-07)

### Features

- **datastore:** convert to id and semver ([1f5d524](https://github.com/ulixee/ulixee/commit/1f5d524eed5f7af42e271190994040c2d183f450))

# [2.0.0-alpha.22](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.21...v2.0.0-alpha.22) (2023-06-12)

### Features

- **cloud:** add peer network ([9b214de](https://github.com/ulixee/ulixee/commit/9b214de012f765df3a42aa45b6b92d95d7d68a22))
- **cloud:** import kad to use ulixee transports ([1786bcf](https://github.com/ulixee/ulixee/commit/1786bcfd66ff8731aea50102947a9bacb126074b))
- **datastore:** add duplex connections to kad ([ada47bd](https://github.com/ulixee/ulixee/commit/ada47bd01e2c894d370011b7eb1296f269fb3e47))
- **datastore:** add migrations ([04542bd](https://github.com/ulixee/ulixee/commit/04542bdb05bc4250839fdb7b30eb11a2ab20b290))
- **datastore:** cluster replay store ([c0347aa](https://github.com/ulixee/ulixee/commit/c0347aa4a81c31ac2f80f507cc7a048a360c3561))
- **datastore:** configure storage endpoint ([0fca691](https://github.com/ulixee/ulixee/commit/0fca6913eb63335c055e5b4c88760092f9c55694))
- **datastore:** upload to storage eng to create ([1453654](https://github.com/ulixee/ulixee/commit/1453654cc2300fa2735f901545da5cf7e218b3cc))

# [2.0.0-alpha.21](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.20...v2.0.0-alpha.21) (2023-04-24)

### Bug Fixes

- **desktop:** vm breaks in packaged electron app ([a5c9f4e](https://github.com/ulixee/ulixee/commit/a5c9f4ef62120a2807f7b5aa6e829460502ac72c))

# [2.0.0-alpha.20](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.19...v2.0.0-alpha.20) (2023-04-20)

### Bug Fixes

- **datastore:** failing tests ([8e3f881](https://github.com/ulixee/ulixee/commit/8e3f881876a59c2b241806c04260d73e03d37617))

### chore

- rename miner to cloud node ([a3c949e](https://github.com/ulixee/ulixee/commit/a3c949e4af806cc6a4acdd4b4b04305946add19b))

### Features

- **datastore:** simplify query to live in main ([b7dd56a](https://github.com/ulixee/ulixee/commit/b7dd56a69fdcdbb51170758c06b6d23cbd9e0585))
- **desktop:** getting started guide ([1e3fd87](https://github.com/ulixee/ulixee/commit/1e3fd87973807e8862a5696421aa768a6cd02bb6))
- **desktop:** query ability on queries tab ([3960c7b](https://github.com/ulixee/ulixee/commit/3960c7b9fda1f9bea3a81850bb4fdadf9f54b2d4))

### BREAKING CHANGES

- @ulixee/miner package is now @ulixee/cloud.
  You must import {CloudNode} from @ulixee/cloud and use in place of Miner.

# [2.0.0-alpha.19](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.17...v2.0.0-alpha.19) (2023-02-25)

### Bug Fixes

- **datastore:** windows tests failing moving files ([deea344](https://github.com/ulixee/ulixee/commit/deea344e697160d8bb4e17802b166e6778a7095d))

# [2.0.0-alpha.18](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.17...v2.0.0-alpha.18) (2023-01-17)

**Note:** Version bump only for package @ulixee/datastore-plugins-hero-core

# [2.0.0-alpha.17](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.16...v2.0.0-alpha.17) (2022-12-15)

### Features

- added tables + sql ([8be5f7e](https://github.com/ulixee/ulixee/commit/8be5f7e31ca4c63cbb02f81eb7ca29dbb8e5b2aa))
- finished converting Datastore to SQL ([3765917](https://github.com/ulixee/ulixee/commit/37659171fe2c5c1488c4ab0209939421894c4e1b))

# [2.0.0-alpha.16](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.15...v2.0.0-alpha.16) (2022-12-05)

### Features

- **datastore:** updated structure documentation ([4dbfe0b](https://github.com/ulixee/ulixee/commit/4dbfe0b5379417fc86de3c5b5885a1592d2c81fe))

# [2.0.0-alpha.15](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.14...v2.0.0-alpha.15) (2022-11-17)

**Note:** Version bump only for package @ulixee/datastore-plugins-hero-plugin-core

# [2.0.0-alpha.14](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.13...v2.0.0-alpha.14) (2022-11-02)

**Note:** Version bump only for package @ulixee/datastore-plugins-hero-plugin-core

# [2.0.0-alpha.13](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.12...v2.0.0-alpha.13) (2022-10-31)

### Features

- add schemas to datastores ([6f49377](https://github.com/ulixee/ulixee/commit/6f493774ebd760e52c7986b2ad3e0b45abab90e8))
- major simplification of Datastore into a basic version with plugin capabilities ([22ad672](https://github.com/ulixee/ulixee/commit/22ad672e06135049ab82fc8b3af274d9e72c278a))

# [2.0.0-alpha.12](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.11...v2.0.0-alpha.12) (2022-10-03)

**Note:** Version bump only for package @ulixee/datastore-plugins-hero-core-runtime

# [2.0.0-alpha.11](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.10...v2.0.0-alpha.11) (2022-08-31)

**Note:** Version bump only for package @ulixee/datastore-plugins-hero-core-runtime

# [2.0.0-alpha.10](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.9...v2.0.0-alpha.10) (2022-08-16)

### Features

- **datastore:** payments ([93af88c](https://github.com/ulixee/ulixee/commit/93af88c9a86115ee13cd6156a50405a26af8de7e))

# [2.0.0-alpha.9](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.8...v2.0.0-alpha.9) (2022-07-26)

**Note:** Version bump only for package @ulixee/datastore-plugins-hero-core-runtime

# [2.0.0-alpha.8](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.7...v2.0.0-alpha.8) (2022-07-13)

### Features

- **datastore:** dbx package files ([57a067e](https://github.com/ulixee/ulixee/commit/57a067ea3be57516ea58c278dff07e1158c97848))
- **datastore:** manifest setting overrides ([098126d](https://github.com/ulixee/ulixee/commit/098126d1e075e4378bc6f562739369d52ed5b4a0))

# [2.0.0-alpha.7](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.6...v2.0.0-alpha.7) (2022-06-28)

### Features

- datastores now have core-runtimes ([9a63bd9](https://github.com/ulixee/ulixee/commit/9a63bd9cae3427c71c47cc46d7009b07ae3fed9f))
- every datastore core-runtime should check whether datastore version is satisfied ([053032f](https://github.com/ulixee/ulixee/commit/053032f1a78d2b9af674baf86f69ebce459c1f46))

# [2.0.0-alpha.6](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.5...v2.0.0-alpha.6) (2022-06-10)

**Note:** Version bump only for package @ulixee/datastore-plugins-hero-core

# [2.0.0-alpha.5](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.3...v2.0.0-alpha.5) (2022-06-10)

### Bug Fixes

- broken datastore test ([81fa421](https://github.com/ulixee/ulixee/commit/81fa42177e335c61c1f35fe645eb4f3bd15701fd))
- events for chromealive not working ([88ca517](https://github.com/ulixee/ulixee/commit/88ca517875062ef2975eb441e5f3aa9e6bf6b2e6))
- packager tests ([a75162a](https://github.com/ulixee/ulixee/commit/a75162ac5cae234487e96bea1ff5b52f27a931f7))

### Features

- **datastore:** add datastore cores ([36e4fd8](https://github.com/ulixee/ulixee/commit/36e4fd802175985755394751dd09a8ceabc5bfa4))
- playgrounds for hero and datastore-plugins-hero ([34eca22](https://github.com/ulixee/ulixee/commit/34eca2237aa92e73794a3b5ea6bcc6eef41a1572))
- renamed DatastorePackage.ts in datastore/for-hero to DatastoreExecutable.ts ([cfc625e](https://github.com/ulixee/ulixee/commit/cfc625ef8adffc9967429a24cabe8d0872d29263))
- ulixee cli ([767f0a9](https://github.com/ulixee/ulixee/commit/767f0a955587755df2f6a2e7042092023e68f7c6))

# [2.0.0-alpha.4](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2022-06-09)

### Bug Fixes

- broken datastore test ([81fa421](https://github.com/ulixee/ulixee/commit/81fa42177e335c61c1f35fe645eb4f3bd15701fd))
- packager tests ([a75162a](https://github.com/ulixee/ulixee/commit/a75162ac5cae234487e96bea1ff5b52f27a931f7))

### Features

- **datastore:** add datastore cores ([36e4fd8](https://github.com/ulixee/ulixee/commit/36e4fd802175985755394751dd09a8ceabc5bfa4))
- playgrounds for hero and datastore-plugins-hero ([34eca22](https://github.com/ulixee/ulixee/commit/34eca2237aa92e73794a3b5ea6bcc6eef41a1572))
- renamed DatastorePackage.ts in datastore/for-hero to DatastoreWrapper.ts ([cfc625e](https://github.com/ulixee/ulixee/commit/cfc625ef8adffc9967429a24cabe8d0872d29263))
- ulixee cli ([767f0a9](https://github.com/ulixee/ulixee/commit/767f0a955587755df2f6a2e7042092023e68f7c6))
