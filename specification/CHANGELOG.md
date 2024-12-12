# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-alpha.31](https://github.com/ulixee/platform/compare/v2.0.0-alpha.30...v2.0.0-alpha.31) (2024-12-07)

### Bug Fixes

* **datastore:** admin-identity docs ([a1eacdd](https://github.com/ulixee/platform/commit/a1eacdd5778a8e347a03f4652667bf3eaaf7b9ef))
* **datastore:** only store cached replays ([56a00b0](https://github.com/ulixee/platform/commit/56a00b029d261f2d41d22b3edbd4bc6c28f1333c))

### Features

* all argons in microgons now ([3b0e93a](https://github.com/ulixee/platform/commit/3b0e93aa60c92c5f0aaacadb123771b454816047))

# [2.0.0-alpha.30](https://github.com/ulixee/platform/compare/v2.0.0-alpha.29...v2.0.0-alpha.30) (2024-10-11)

### Bug Fixes

* **datastore:** tests broken from argon updates ([827064c](https://github.com/ulixee/platform/commit/827064c9290b75d15920b66634b2902fabb3fcfa))

### Features

* remove payment info from manifest ([b4a9ad5](https://github.com/ulixee/platform/commit/b4a9ad57289c4c94ac0ee0860c2cf0f89aaabab4))
* **website:** watch mode ([4741798](https://github.com/ulixee/platform/commit/4741798fdfd47a4fcdfc22f79836796efcb5b9f6))

# [2.0.0-alpha.29](https://github.com/ulixee/platform/compare/v2.0.0-alpha.28...v2.0.0-alpha.29) (2024-07-16)

### Bug Fixes

* **end-to-end:** use docker for e2e tests ([3f243de](https://github.com/ulixee/platform/commit/3f243deb40d2b1cc86048d171d574b3690a29395))

### Features

* **databroker:** new feature to delegate payment ([47900e3](https://github.com/ulixee/platform/commit/47900e314b8d9f59f88598b1d914e211e1ae5bdf))
* **datastore:** integrate escrow payments ([b00fdd5](https://github.com/ulixee/platform/commit/b00fdd52e36bc9480297639a5584a6f71d6890dd))
* **desktop:** update wallet ux ([3b9fbfb](https://github.com/ulixee/platform/commit/3b9fbfba9c91bec72b3dbc4b88b83eb39992d617))
* integrate argon payments to desktop ([b8a7ffd](https://github.com/ulixee/platform/commit/b8a7ffd651d88160afbfe7906c09e2eac06a345d))

# [2.0.0-alpha.28](https://github.com/ulixee/platform/compare/v2.0.0-alpha.27...v2.0.0-alpha.28) (2024-03-11)

**Note:** Version bump only for package @ulixee/platform-specification

# [2.0.0-alpha.27](https://github.com/ulixee/platform/compare/v2.0.0-alpha.26...v2.0.0-alpha.27) (2024-03-01)

**Note:** Version bump only for package @ulixee/platform-specification

# [2.0.0-alpha.26](https://github.com/ulixee/platform/compare/v2.0.0-alpha.25...v2.0.0-alpha.26) (2024-02-02)

**Note:** Version bump only for package @ulixee/platform-specification

# [2.0.0-alpha.25](https://github.com/ulixee/platform/compare/v2.0.0-alpha.24...v2.0.0-alpha.25) (2023-09-28)

**Note:** Version bump only for package @ulixee/platform-specification

# [2.0.0-alpha.24](https://github.com/ulixee/platform/compare/v2.0.0-alpha.23...v2.0.0-alpha.24) (2023-08-09)

**Note:** Version bump only for package @ulixee/platform-specification

# [2.0.0-alpha.24](https://github.com/ulixee/platform/compare/v2.0.0-alpha.23...v2.0.0-alpha.24) (2023-08-09)

**Note:** Version bump only for package @ulixee/platform-specification

# [2.0.0-alpha.23](https://github.com/ulixee/platform/compare/v2.0.0-alpha.22...v2.0.0-alpha.23) (2023-07-07)

### Features

- **datastore:** convert to id and semver ([1f5d524](https://github.com/ulixee/platform/commit/1f5d524eed5f7af42e271190994040c2d183f450))
- **kad:** add get/put capabilities to the kad ([418bd5c](https://github.com/ulixee/platform/commit/418bd5cee145e8ff7e552547c9bc6ab2811e1575))

# [2.0.0-alpha.22](https://github.com/ulixee/platform/compare/v2.0.0-alpha.21...v2.0.0-alpha.22) (2023-06-12)

### Features

- **cloud:** add peer network ([9b214de](https://github.com/ulixee/platform/commit/9b214de012f765df3a42aa45b6b92d95d7d68a22))
- **cloud:** delete datastores on expiration ([90a436d](https://github.com/ulixee/platform/commit/90a436d1132167d6a6173ebd53822cb860961215))
- **cloud:** import kad to use ulixee transports ([1786bcf](https://github.com/ulixee/platform/commit/1786bcfd66ff8731aea50102947a9bacb126074b))
- **cloud:** node registry tracker ([9175d41](https://github.com/ulixee/platform/commit/9175d415cd227e21f9bd3cb341cfcf0e838468d0))
- **cloud:** registry service configuration ([08e9f71](https://github.com/ulixee/platform/commit/08e9f719f0c242ffbbcc3f09aca334563c9b87b9))
- **datastore:** add duplex connections to kad ([ada47bd](https://github.com/ulixee/platform/commit/ada47bd01e2c894d370011b7eb1296f269fb3e47))
- **datastore:** add migrations ([04542bd](https://github.com/ulixee/platform/commit/04542bdb05bc4250839fdb7b30eb11a2ab20b290))
- **datastore:** cluster replay store ([c0347aa](https://github.com/ulixee/platform/commit/c0347aa4a81c31ac2f80f507cc7a048a360c3561))
- **datastore:** configure storage endpoint ([0fca691](https://github.com/ulixee/platform/commit/0fca6913eb63335c055e5b4c88760092f9c55694))
- **datastore:** upload to storage eng to create ([1453654](https://github.com/ulixee/platform/commit/1453654cc2300fa2735f901545da5cf7e218b3cc))

# [2.0.0-alpha.21](https://github.com/ulixee/platform/compare/v2.0.0-alpha.20...v2.0.0-alpha.21) (2023-04-24)

### Bug Fixes

- **desktop:** vm breaks in packaged electron app ([a5c9f4e](https://github.com/ulixee/platform/commit/a5c9f4ef62120a2807f7b5aa6e829460502ac72c))

# [2.0.0-alpha.20](https://github.com/ulixee/platform/compare/v2.0.0-alpha.19...v2.0.0-alpha.20) (2023-04-20)

### chore

- rename miner to cloud node ([a3c949e](https://github.com/ulixee/platform/commit/a3c949e4af806cc6a4acdd4b4b04305946add19b))

### Features

- **datastore:** add ability to “start” and watch ([e9c92bc](https://github.com/ulixee/platform/commit/e9c92bcc684331752e3e11a6b72bba83b91e0736))
- **datastore:** simplify query to live in main ([b7dd56a](https://github.com/ulixee/platform/commit/b7dd56a69fdcdbb51170758c06b6d23cbd9e0585))
- **desktop:** add datastore details page ([a6bce0b](https://github.com/ulixee/platform/commit/a6bce0b9f5ac1121d37c3029bd8fd20f147e9324))
- **desktop:** getting started guide ([1e3fd87](https://github.com/ulixee/platform/commit/1e3fd87973807e8862a5696421aa768a6cd02bb6))
- **desktop:** log user queries locally ([33fb721](https://github.com/ulixee/platform/commit/33fb7215afca7bde722217a827a82e4b89082a8c))

### BREAKING CHANGES

- @ulixee/miner package is now @ulixee/cloud.
  You must import {CloudNode} from @ulixee/cloud and use in place of Miner.

# [2.0.0-alpha.19](https://github.com/ulixee/platform/compare/v2.0.0-alpha.17...v2.0.0-alpha.19) (2023-02-25)

**Note:** Version bump only for package @ulixee/platform-specification
