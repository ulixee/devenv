# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-alpha.31](https://github.com/ulixee/platform/compare/v2.0.0-alpha.30...v2.0.0-alpha.31) (2024-12-07)

### Bug Fixes

* **datastore:** broker not updating settlement ([efbf866](https://github.com/ulixee/platform/commit/efbf86622a074e6fd20d9c930aed7c532e2bf975))

### Features

* all argons in microgons now ([3b0e93a](https://github.com/ulixee/platform/commit/3b0e93aa60c92c5f0aaacadb123771b454816047))

# [2.0.0-alpha.30](https://github.com/ulixee/platform/compare/v2.0.0-alpha.29...v2.0.0-alpha.30) (2024-10-11)

### Bug Fixes

* **datastore:** tests broken from argon updates ([827064c](https://github.com/ulixee/platform/commit/827064c9290b75d15920b66634b2902fabb3fcfa))

### Features

* **cloud:** add a public host option ([e748965](https://github.com/ulixee/platform/commit/e748965b5f14cc74016fb59ac24cd76995f6131a))
* remove payment info from manifest ([b4a9ad5](https://github.com/ulixee/platform/commit/b4a9ad57289c4c94ac0ee0860c2cf0f89aaabab4))
* **website:** watch mode ([4741798](https://github.com/ulixee/platform/commit/4741798fdfd47a4fcdfc22f79836796efcb5b9f6))

# [2.0.0-alpha.29](https://github.com/ulixee/platform/compare/v2.0.0-alpha.28...v2.0.0-alpha.29) (2024-07-16)

### Bug Fixes

* **end-to-end:** use docker for e2e tests ([3f243de](https://github.com/ulixee/platform/commit/3f243deb40d2b1cc86048d171d574b3690a29395))
* **github:** databroker tests broken ([801f62c](https://github.com/ulixee/platform/commit/801f62cad9e16e441cbea7fe3660098ade31ef34))

### Features

* **databroker:** new feature to delegate payment ([47900e3](https://github.com/ulixee/platform/commit/47900e314b8d9f59f88598b1d914e211e1ae5bdf))
* **datastore:** integrate escrow payments ([b00fdd5](https://github.com/ulixee/platform/commit/b00fdd52e36bc9480297639a5584a6f71d6890dd))
* **desktop:** accounts vs localchains ([2c63e7e](https://github.com/ulixee/platform/commit/2c63e7eb1d0d7261dc00a74b80fa9a30a48ebb42))
* **desktop:** update wallet ux ([3b9fbfb](https://github.com/ulixee/platform/commit/3b9fbfba9c91bec72b3dbc4b88b83eb39992d617))

# [2.0.0-alpha.28](https://github.com/ulixee/platform/compare/v2.0.0-alpha.27...v2.0.0-alpha.28) (2024-03-11)

**Note:** Version bump only for package @ulixee/end-to-end

# [2.0.0-alpha.27](https://github.com/ulixee/platform/compare/v2.0.0-alpha.26...v2.0.0-alpha.27) (2024-03-01)

**Note:** Version bump only for package @ulixee/end-to-end

# [2.0.0-alpha.26](https://github.com/ulixee/platform/compare/v2.0.0-alpha.25...v2.0.0-alpha.26) (2024-02-02)

**Note:** Version bump only for package @ulixee/end-to-end

# [2.0.0-alpha.25](https://github.com/ulixee/platform/compare/v2.0.0-alpha.24...v2.0.0-alpha.25) (2023-09-28)

**Note:** Version bump only for package @ulixee/end-to-end

# [2.0.0-alpha.24](https://github.com/ulixee/platform/compare/v2.0.0-alpha.23...v2.0.0-alpha.24) (2023-08-09)

**Note:** Version bump only for package @ulixee/end-to-end

# [2.0.0-alpha.23](https://github.com/ulixee/platform/compare/v2.0.0-alpha.22...v2.0.0-alpha.23) (2023-07-07)

### Features

- **datastore:** change urls to be id@version ([903e34b](https://github.com/ulixee/platform/commit/903e34b43d8fb2bca060dc6344453da885fef29a))
- **datastore:** convert to id and semver ([1f5d524](https://github.com/ulixee/platform/commit/1f5d524eed5f7af42e271190994040c2d183f450))

# [2.0.0-alpha.22](https://github.com/ulixee/platform/compare/v2.0.0-alpha.21...v2.0.0-alpha.22) (2023-06-12)

### Features

- **datastore:** add migrations ([04542bd](https://github.com/ulixee/platform/commit/04542bdb05bc4250839fdb7b30eb11a2ab20b290))

# [2.0.0-alpha.21](https://github.com/ulixee/platform/compare/v2.0.0-alpha.20...v2.0.0-alpha.21) (2023-04-24)

**Note:** Version bump only for package @ulixee/end-to-end

# [2.0.0-alpha.20](https://github.com/ulixee/platform/compare/v2.0.0-alpha.19...v2.0.0-alpha.20) (2023-04-20)

### chore

- rename miner to cloud node ([a3c949e](https://github.com/ulixee/platform/commit/a3c949e4af806cc6a4acdd4b4b04305946add19b))

### Features

- **desktop:** getting started guide ([1e3fd87](https://github.com/ulixee/platform/commit/1e3fd87973807e8862a5696421aa768a6cd02bb6))

### BREAKING CHANGES

- @ulixee/miner package is now @ulixee/cloud.
  You must import {CloudNode} from @ulixee/cloud and use in place of Miner.

# [2.0.0-alpha.19](https://github.com/ulixee/platform/compare/v2.0.0-alpha.17...v2.0.0-alpha.19) (2023-02-25)

### Bug Fixes

- **datastore:** tweak cli to fix end-to-end test ([4355cd1](https://github.com/ulixee/platform/commit/4355cd1f428806e10cbd23d62c4d2c0b970ce30e))

### Features

- convert outputs to an array of records ([a6f6ab4](https://github.com/ulixee/platform/commit/a6f6ab41acdaa947790636e008427f39978bb28e))
- **datastore:** ability to route domains ([8d123d3](https://github.com/ulixee/platform/commit/8d123d37c121aa52f22696b15e47fec4278464d0))
- **datastore:** enable credits ([972029e](https://github.com/ulixee/platform/commit/972029e93451e4dddd79f313527f5799aaf11260))

# [2.0.0-alpha.18](https://github.com/ulixee/platform/compare/v2.0.0-alpha.17...v2.0.0-alpha.18) (2023-01-17)

### Bug Fixes

- **datastore:** tweak cli to fix end-to-end test ([4355cd1](https://github.com/ulixee/platform/commit/4355cd1f428806e10cbd23d62c4d2c0b970ce30e))

### Features

- convert outputs to an array of records ([a6f6ab4](https://github.com/ulixee/platform/commit/a6f6ab41acdaa947790636e008427f39978bb28e))
- **datastore:** enable credits ([972029e](https://github.com/ulixee/platform/commit/972029e93451e4dddd79f313527f5799aaf11260))

# [2.0.0-alpha.17](https://github.com/ulixee/platform/compare/v2.0.0-alpha.16...v2.0.0-alpha.17) (2022-12-15)

### Features

- **datastore:** passthrough functions ([c84ba16](https://github.com/ulixee/platform/commit/c84ba168265ebdb167e6ceeb5e3f6bd116760710))
- finished converting Datastore to SQL ([3765917](https://github.com/ulixee/platform/commit/37659171fe2c5c1488c4ab0209939421894c4e1b))

# [2.0.0-alpha.16](https://github.com/ulixee/platform/compare/v2.0.0-alpha.15...v2.0.0-alpha.16) (2022-12-05)

### Features

- datastore functions ([b14352d](https://github.com/ulixee/platform/commit/b14352d8160de6667e05bdbf86b6b6df32d056e4))

# [2.0.0-alpha.15](https://github.com/ulixee/platform/compare/v2.0.0-alpha.14...v2.0.0-alpha.15) (2022-11-17)

### Features

- simplified gift cards ([a9ccca7](https://github.com/ulixee/platform/commit/a9ccca76dfaffd789602f3bb3cacac5d5d75c82c))

# [2.0.0-alpha.14](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.13...v2.0.0-alpha.14) (2022-11-02)

**Note:** Version bump only for package @ulixee/e2e

# [2.0.0-alpha.13](https://github.com/ulixee/platform/compare/v2.0.0-alpha.12...v2.0.0-alpha.13) (2022-10-31)

### Features

- allow installing a datastore schema ([b73da83](https://github.com/ulixee/platform/commit/b73da83fc04728d9b575aea541126758e76556ee))
- publish docker images ([d10ee25](https://github.com/ulixee/platform/commit/d10ee257406633805d15d21d7ebd4b043246b6c4))

# [2.0.0-alpha.12](https://github.com/ulixee/platform/compare/v2.0.0-alpha.11...v2.0.0-alpha.12) (2022-10-03)

**Note:** Version bump only for package @ulixee/e2e

# [2.0.0-alpha.11](https://github.com/ulixee/platform/compare/v2.0.0-alpha.10...v2.0.0-alpha.11) (2022-08-31)

**Note:** Version bump only for package @ulixee/e2e

# [2.0.0-alpha.10](https://github.com/ulixee/platform/compare/v2.0.0-alpha.9...v2.0.0-alpha.10) (2022-08-16)

### Features

- end to end scripts (first one is gift cards) ([d737c6b](https://github.com/ulixee/platform/commit/d737c6b847ebb017ec1a766ab5d025153b17f331))
