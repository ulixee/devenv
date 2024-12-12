# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-alpha.31](https://github.com/ulixee/platform/compare/v2.0.0-alpha.30...v2.0.0-alpha.31) (2024-12-07)

### Features

* all argons in microgons now ([3b0e93a](https://github.com/ulixee/platform/commit/3b0e93aa60c92c5f0aaacadb123771b454816047))

# [2.0.0-alpha.30](https://github.com/ulixee/platform/compare/v2.0.0-alpha.29...v2.0.0-alpha.30) (2024-10-11)

### Bug Fixes

* **packager:** allow full cloud cli commands ([4fdbcbf](https://github.com/ulixee/platform/commit/4fdbcbfb6e9150641021bec34e7b8fab124c0218))

### Features

* **datastore:** track query/cloud localchain ([b2f12d0](https://github.com/ulixee/platform/commit/b2f12d00e91f90d58d6c5adbbf10ca140afe06de))
* remove payment info from manifest ([b4a9ad5](https://github.com/ulixee/platform/commit/b4a9ad57289c4c94ac0ee0860c2cf0f89aaabab4))

# [2.0.0-alpha.29](https://github.com/ulixee/platform/compare/v2.0.0-alpha.28...v2.0.0-alpha.29) (2024-07-16)

### Bug Fixes

* **datastores:** include rollup json ([9797762](https://github.com/ulixee/platform/commit/97977625ad2d2158131a1e43ea7a42009e0e5c5e)), closes [#201](https://github.com/ulixee/platform/issues/201)
* **github:** databroker tests broken ([801f62c](https://github.com/ulixee/platform/commit/801f62cad9e16e441cbea7fe3660098ade31ef34))

### Features

* **databroker:** new feature to delegate payment ([47900e3](https://github.com/ulixee/platform/commit/47900e314b8d9f59f88598b1d914e211e1ae5bdf))
* **datastore:** integrate escrow payments ([b00fdd5](https://github.com/ulixee/platform/commit/b00fdd52e36bc9480297639a5584a6f71d6890dd))

# [2.0.0-alpha.28](https://github.com/ulixee/platform/compare/v2.0.0-alpha.27...v2.0.0-alpha.28) (2024-03-11)

**Note:** Version bump only for package @ulixee/datastore-packager

# [2.0.0-alpha.27](https://github.com/ulixee/platform/compare/v2.0.0-alpha.26...v2.0.0-alpha.27) (2024-03-01)

**Note:** Version bump only for package @ulixee/datastore-packager

# [2.0.0-alpha.26](https://github.com/ulixee/platform/compare/v2.0.0-alpha.25...v2.0.0-alpha.26) (2024-02-02)

**Note:** Version bump only for package @ulixee/datastore-packager

# [2.0.0-alpha.25](https://github.com/ulixee/platform/compare/v2.0.0-alpha.24...v2.0.0-alpha.25) (2023-09-28)

### Features

- **datastore:** remove vm2 dependency ([fdf923c](https://github.com/ulixee/platform/commit/fdf923c183f9eb87f6367e7973210f9fb2ca09cc))

# [2.0.0-alpha.24](https://github.com/ulixee/platform/compare/v2.0.0-alpha.23...v2.0.0-alpha.24) (2023-08-09)

**Note:** Version bump only for package @ulixee/datastore-packager

# [2.0.0-alpha.23](https://github.com/ulixee/platform/compare/v2.0.0-alpha.22...v2.0.0-alpha.23) (2023-07-07)

### Features

- **datastore:** change urls to be id@version ([903e34b](https://github.com/ulixee/platform/commit/903e34b43d8fb2bca060dc6344453da885fef29a))
- **datastore:** convert to id and semver ([1f5d524](https://github.com/ulixee/platform/commit/1f5d524eed5f7af42e271190994040c2d183f450))

# [2.0.0-alpha.22](https://github.com/ulixee/platform/compare/v2.0.0-alpha.21...v2.0.0-alpha.22) (2023-06-12)

### Features

- **cloud:** add peer network ([9b214de](https://github.com/ulixee/platform/commit/9b214de012f765df3a42aa45b6b92d95d7d68a22))
- **cloud:** registry service configuration ([08e9f71](https://github.com/ulixee/platform/commit/08e9f719f0c242ffbbcc3f09aca334563c9b87b9))
- **datastore:** add duplex connections to kad ([ada47bd](https://github.com/ulixee/platform/commit/ada47bd01e2c894d370011b7eb1296f269fb3e47))
- **datastore:** add migrations ([04542bd](https://github.com/ulixee/platform/commit/04542bdb05bc4250839fdb7b30eb11a2ab20b290))
- **datastore:** cluster replay store ([c0347aa](https://github.com/ulixee/platform/commit/c0347aa4a81c31ac2f80f507cc7a048a360c3561))
- **datastore:** upload to storage eng to create ([1453654](https://github.com/ulixee/platform/commit/1453654cc2300fa2735f901545da5cf7e218b3cc))

# [2.0.0-alpha.21](https://github.com/ulixee/platform/compare/v2.0.0-alpha.20...v2.0.0-alpha.21) (2023-04-24)

### Bug Fixes

- **desktop:** vm breaks in packaged electron app ([a5c9f4e](https://github.com/ulixee/platform/commit/a5c9f4ef62120a2807f7b5aa6e829460502ac72c))

# [2.0.0-alpha.20](https://github.com/ulixee/platform/compare/v2.0.0-alpha.19...v2.0.0-alpha.20) (2023-04-20)

### chore

- rename miner to cloud node ([a3c949e](https://github.com/ulixee/platform/commit/a3c949e4af806cc6a4acdd4b4b04305946add19b))

### Features

- **datastore:** add ability to “start” and watch ([e9c92bc](https://github.com/ulixee/platform/commit/e9c92bcc684331752e3e11a6b72bba83b91e0736))
- **datastore:** add docs ([da39923](https://github.com/ulixee/platform/commit/da39923c0ba5f21359e58a55fc205e82af708e65))
- **datastore:** simplify query to live in main ([b7dd56a](https://github.com/ulixee/platform/commit/b7dd56a69fdcdbb51170758c06b6d23cbd9e0585))
- **desktop:** getting started guide ([1e3fd87](https://github.com/ulixee/platform/commit/1e3fd87973807e8862a5696421aa768a6cd02bb6))
- **desktop:** log user queries locally ([33fb721](https://github.com/ulixee/platform/commit/33fb7215afca7bde722217a827a82e4b89082a8c))
- **desktop:** query ability on queries tab ([3960c7b](https://github.com/ulixee/platform/commit/3960c7b9fda1f9bea3a81850bb4fdadf9f54b2d4))

### BREAKING CHANGES

- @ulixee/miner package is now @ulixee/cloud.
  You must import {CloudNode} from @ulixee/cloud and use in place of Miner.

# [2.0.0-alpha.19](https://github.com/ulixee/platform/compare/v2.0.0-alpha.17...v2.0.0-alpha.19) (2023-02-25)

### Bug Fixes

- **datastore:** failing private table tests ([e844ebe](https://github.com/ulixee/platform/commit/e844ebeac9d9720a54795066d1f3abf319bafbe7))
- **datastore:** handle rolling up momentjs ([01e29eb](https://github.com/ulixee/platform/commit/01e29eb77f1e0f7c8cb68b47858901f6e239ed08))
- **datastore:** tweak cli to fix end-to-end test ([4355cd1](https://github.com/ulixee/platform/commit/4355cd1f428806e10cbd23d62c4d2c0b970ce30e))
- docpage now works inside datastores ([0af2695](https://github.com/ulixee/platform/commit/0af26957e83fbc115b9641390d799b4f1a59f80c))

### Features

- **datastore:** ability to route domains ([8d123d3](https://github.com/ulixee/platform/commit/8d123d37c121aa52f22696b15e47fec4278464d0))
- **datastore:** add context crawl, run, query ([e8e722c](https://github.com/ulixee/platform/commit/e8e722c048499c557f9b030ad97089677922d330))
- **datastore:** affiliateId and embedded credits ([e56a24d](https://github.com/ulixee/platform/commit/e56a24dbd33211f26d120e1c7fd5fc20e6e698a8))
- **datastore:** change cloning to create project ([6263ecb](https://github.com/ulixee/platform/commit/6263ecb3829d1f1569f0ca5a5a82278adf0c1b64))
- **datastore:** cli to clone datastores ([cd9fd16](https://github.com/ulixee/platform/commit/cd9fd1641a0299365da4b4c1d6d8a24e2b58b4f5))
- **datastore:** enable credits ([972029e](https://github.com/ulixee/platform/commit/972029e93451e4dddd79f313527f5799aaf11260))
- **datastore:** passthrough tables ([36f4cb6](https://github.com/ulixee/platform/commit/36f4cb6a7122ec0ab517ad051e61b5262d5c99d9))
- **datastore:** shorten version hash length ([0e36ead](https://github.com/ulixee/platform/commit/0e36ead760356addb93340313458b92093e51c1b))

# [2.0.0-alpha.18](https://github.com/ulixee/platform/compare/v2.0.0-alpha.17...v2.0.0-alpha.18) (2023-01-17)

### Bug Fixes

- **datastore:** failing private table tests ([e844ebe](https://github.com/ulixee/platform/commit/e844ebeac9d9720a54795066d1f3abf319bafbe7))
- **datastore:** tweak cli to fix end-to-end test ([4355cd1](https://github.com/ulixee/platform/commit/4355cd1f428806e10cbd23d62c4d2c0b970ce30e))

### Features

- **datastore:** affiliateId and embedded credits ([e56a24d](https://github.com/ulixee/platform/commit/e56a24dbd33211f26d120e1c7fd5fc20e6e698a8))
- **datastore:** cli to clone datastores ([cd9fd16](https://github.com/ulixee/platform/commit/cd9fd1641a0299365da4b4c1d6d8a24e2b58b4f5))
- **datastore:** enable credits ([972029e](https://github.com/ulixee/platform/commit/972029e93451e4dddd79f313527f5799aaf11260))
- **datastore:** passthrough tables ([36f4cb6](https://github.com/ulixee/platform/commit/36f4cb6a7122ec0ab517ad051e61b5262d5c99d9))
- **datastore:** shorten version hash length ([0e36ead](https://github.com/ulixee/platform/commit/0e36ead760356addb93340313458b92093e51c1b))

# [2.0.0-alpha.17](https://github.com/ulixee/platform/compare/v2.0.0-alpha.16...v2.0.0-alpha.17) (2022-12-15)

### Features

- added tables + sql ([8be5f7e](https://github.com/ulixee/platform/commit/8be5f7e31ca4c63cbb02f81eb7ca29dbb8e5b2aa))
- **datastore:** passthrough functions ([c84ba16](https://github.com/ulixee/platform/commit/c84ba168265ebdb167e6ceeb5e3f6bd116760710))
- finished converting Datastore to SQL ([3765917](https://github.com/ulixee/platform/commit/37659171fe2c5c1488c4ab0209939421894c4e1b))

# [2.0.0-alpha.16](https://github.com/ulixee/platform/compare/v2.0.0-alpha.15...v2.0.0-alpha.16) (2022-12-05)

### Bug Fixes

- node 18 fixes ([cba4510](https://github.com/ulixee/platform/commit/cba45107b038f0538429fa18bf87448140ace5c5))

### Features

- allow a datastore function to be auto-wrapped ([57a54ca](https://github.com/ulixee/platform/commit/57a54ca70903751414e49d5bc8fd4d933af788ea))
- convert datastore plugins to new structure ([1705030](https://github.com/ulixee/platform/commit/1705030ec91461b166c9bfafbcc9b1e3c12f0854))
- datastore functions ([b14352d](https://github.com/ulixee/platform/commit/b14352d8160de6667e05bdbf86b6b6df32d056e4))

# [2.0.0-alpha.15](https://github.com/ulixee/platform/compare/v2.0.0-alpha.14...v2.0.0-alpha.15) (2022-11-17)

**Note:** Version bump only for package @ulixee/datastore-packager

# [2.0.0-alpha.14](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.13...v2.0.0-alpha.14) (2022-11-02)

**Note:** Version bump only for package @ulixee/datastore-packager

# [2.0.0-alpha.13](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.12...v2.0.0-alpha.13) (2022-10-31)

### Features

- add schemas to datastores ([6f49377](https://github.com/ulixee/ulixee/commit/6f493774ebd760e52c7986b2ad3e0b45abab90e8))
- allow installing a datastore schema ([b73da83](https://github.com/ulixee/ulixee/commit/b73da83fc04728d9b575aea541126758e76556ee))
- major simplification of Datastore into a basic version with plugin capabilities ([22ad672](https://github.com/ulixee/ulixee/commit/22ad672e06135049ab82fc8b3af274d9e72c278a))

# [2.0.0-alpha.12](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.11...v2.0.0-alpha.12) (2022-10-03)

**Note:** Version bump only for package @ulixee/datastore-packager

# [2.0.0-alpha.11](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.10...v2.0.0-alpha.11) (2022-08-31)

**Note:** Version bump only for package @ulixee/datastore-packager

# [2.0.0-alpha.10](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.9...v2.0.0-alpha.10) (2022-08-16)

### Bug Fixes

- **datastore:** autorun not working in playground ([2d67279](https://github.com/ulixee/ulixee/commit/2d67279f7f7f5150926eea4b4f1ed70efe0f679d))

### Features

- **datastore:** payments ([93af88c](https://github.com/ulixee/ulixee/commit/93af88c9a86115ee13cd6156a50405a26af8de7e))
- end to end scripts (first one is gift cards) ([d737c6b](https://github.com/ulixee/ulixee/commit/d737c6b847ebb017ec1a766ab5d025153b17f331))

# [2.0.0-alpha.9](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.8...v2.0.0-alpha.9) (2022-07-26)

**Note:** Version bump only for package @ulixee/datastore-packager

# [2.0.0-alpha.8](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.7...v2.0.0-alpha.8) (2022-07-13)

### Bug Fixes

- **datastore:** update hero and hashUtils ([7796d42](https://github.com/ulixee/ulixee/commit/7796d425e99abf93c2b19f5bacee1553d7e0aae7))

### Features

- **datastore:** dbx package files ([57a067e](https://github.com/ulixee/ulixee/commit/57a067ea3be57516ea58c278dff07e1158c97848))
- **datastore:** manifest setting overrides ([098126d](https://github.com/ulixee/ulixee/commit/098126d1e075e4378bc6f562739369d52ed5b4a0))

# [2.0.0-alpha.7](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.6...v2.0.0-alpha.7) (2022-06-28)

### Bug Fixes

- fixed some issues that the previous datastore changes broke ([000f106](https://github.com/ulixee/ulixee/commit/000f106a2052c53a963c6cd706195a9508dc6f63))

### Features

- added cores to datastore and for-puppeteer + ability to run local datastore files ([237f1e9](https://github.com/ulixee/ulixee/commit/237f1e941843d8ca71bfc6c74d3bbc7b048f5d6b))
- datastores now have core-runtimes ([9a63bd9](https://github.com/ulixee/ulixee/commit/9a63bd9cae3427c71c47cc46d7009b07ae3fed9f))

# [2.0.0-alpha.6](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.5...v2.0.0-alpha.6) (2022-06-10)

**Note:** Version bump only for package @ulixee/datastore-packager

# [2.0.0-alpha.5](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.3...v2.0.0-alpha.5) (2022-06-10)

### Bug Fixes

- broken datastore test ([81fa421](https://github.com/ulixee/ulixee/commit/81fa42177e335c61c1f35fe645eb4f3bd15701fd))
- events for chromealive not working ([88ca517](https://github.com/ulixee/ulixee/commit/88ca517875062ef2975eb441e5f3aa9e6bf6b2e6))
- packager tests ([a75162a](https://github.com/ulixee/ulixee/commit/a75162ac5cae234487e96bea1ff5b52f27a931f7))

### Features

- **datastore:** add datastore cores ([36e4fd8](https://github.com/ulixee/ulixee/commit/36e4fd802175985755394751dd09a8ceabc5bfa4))
- **datastore:** packaging ([4303a87](https://github.com/ulixee/ulixee/commit/4303a8731ab3aaa6d3f5f859e760948c54305e69))
- playgrounds for hero and datastore-plugins-hero ([34eca22](https://github.com/ulixee/ulixee/commit/34eca2237aa92e73794a3b5ea6bcc6eef41a1572))
- ulixee cli ([767f0a9](https://github.com/ulixee/ulixee/commit/767f0a955587755df2f6a2e7042092023e68f7c6))

# [2.0.0-alpha.4](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2022-06-09)

### Bug Fixes

- broken datastore test ([81fa421](https://github.com/ulixee/ulixee/commit/81fa42177e335c61c1f35fe645eb4f3bd15701fd))
- packager tests ([a75162a](https://github.com/ulixee/ulixee/commit/a75162ac5cae234487e96bea1ff5b52f27a931f7))

### Features

- **datastore:** add datastore cores ([36e4fd8](https://github.com/ulixee/ulixee/commit/36e4fd802175985755394751dd09a8ceabc5bfa4))
- **datastore:** packaging ([4303a87](https://github.com/ulixee/ulixee/commit/4303a8731ab3aaa6d3f5f859e760948c54305e69))
- playgrounds for hero and datastore-plugins-hero ([34eca22](https://github.com/ulixee/ulixee/commit/34eca2237aa92e73794a3b5ea6bcc6eef41a1572))
- ulixee cli ([767f0a9](https://github.com/ulixee/ulixee/commit/767f0a955587755df2f6a2e7042092023e68f7c6))
