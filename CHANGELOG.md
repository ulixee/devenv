# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-alpha.31](https://github.com/ulixee/platform/compare/v2.0.0-alpha.30...v2.0.0-alpha.31) (2024-12-07)

### Bug Fixes

* **datastore:** admin-identity docs ([a1eacdd](https://github.com/ulixee/platform/commit/a1eacdd5778a8e347a03f4652667bf3eaaf7b9ef))
* **datastore:** broker not updating settlement ([efbf866](https://github.com/ulixee/platform/commit/efbf86622a074e6fd20d9c930aed7c532e2bf975))
* **datastore:** close localchain on exit ([60d7f33](https://github.com/ulixee/platform/commit/60d7f3331f4edc583ed5cc4000b8e5343353f3f4))
* **datastore:** only store cached replays ([56a00b0](https://github.com/ulixee/platform/commit/56a00b029d261f2d41d22b3edbd4bc6c28f1333c))
* **desktop:** add id to all connections ([afed957](https://github.com/ulixee/platform/commit/afed9571c43e0b6fa1b80777a00a9c93c2e21a03))
* **desktop:** allow cleanup of session dbs ([42f3264](https://github.com/ulixee/platform/commit/42f32641c6891e582f8fa588a3731b259bdfca69))
* **tests:** run in band for linux platform ([19b8dcd](https://github.com/ulixee/platform/commit/19b8dcddb67957be7c0c5786dfa313770be9b4f2))
* website publishing ([aea9d99](https://github.com/ulixee/platform/commit/aea9d9950b4f8e3d15977b683a37c0bdee1c0820))

### Features

* add disable desktop apis to cli ([56772f4](https://github.com/ulixee/platform/commit/56772f4ad55f329d9b63022a497e13113dde47ce))
* all argons in microgons now ([3b0e93a](https://github.com/ulixee/platform/commit/3b0e93aa60c92c5f0aaacadb123771b454816047))

# [2.0.0-alpha.30](https://github.com/ulixee/platform/compare/v2.0.0-alpha.29...v2.0.0-alpha.30) (2024-10-11)

### Bug Fixes

* **datastore:** local address not properly recognized ([b3f04fd](https://github.com/ulixee/platform/commit/b3f04fd2a6cc6b97a068efb416e4c70d71f1ec8d))
* **datastore:** tests broken from argon updates ([827064c](https://github.com/ulixee/platform/commit/827064c9290b75d15920b66634b2902fabb3fcfa))
* **packager:** allow full cloud cli commands ([4fdbcbf](https://github.com/ulixee/platform/commit/4fdbcbfb6e9150641021bec34e7b8fab124c0218))
* update to support hero monorepo ([9fc427e](https://github.com/ulixee/platform/commit/9fc427e6d1bfb3d7950a53f15712f8c4479a50ad))

### Features

* **cloud:** add a public host option ([e748965](https://github.com/ulixee/platform/commit/e748965b5f14cc74016fb59ac24cd76995f6131a))
* **cloud:** generate localchain if needed ([965be3f](https://github.com/ulixee/platform/commit/965be3f2e313bff7da0f2d32c8d3fc6d28528011))
* **datastore:** allow funding smaller channels ([8186657](https://github.com/ulixee/platform/commit/818665771b700535f648aa3be8d6885847d247e1))
* **datastore:** allow importing an argon account ([e9d5d54](https://github.com/ulixee/platform/commit/e9d5d542ca479345f683a3569ba6e73255d0aab4))
* **datastore:** fix reboot recovery of channels ([891fc0d](https://github.com/ulixee/platform/commit/891fc0d4b18b6cf3b896647dceb427876aeaaad2))
* **datastore:** track query/cloud localchain ([b2f12d0](https://github.com/ulixee/platform/commit/b2f12d00e91f90d58d6c5adbbf10ca140afe06de))
* remove payment info from manifest ([b4a9ad5](https://github.com/ulixee/platform/commit/b4a9ad57289c4c94ac0ee0860c2cf0f89aaabab4))
* **website:** watch mode ([4741798](https://github.com/ulixee/platform/commit/4741798fdfd47a4fcdfc22f79836796efcb5b9f6))

# [2.0.0-alpha.29](https://github.com/ulixee/platform/compare/v2.0.0-alpha.28...v2.0.0-alpha.29) (2024-07-16)

### Bug Fixes

* **datastores:** include rollup json ([9797762](https://github.com/ulixee/platform/commit/97977625ad2d2158131a1e43ea7a42009e0e5c5e)), closes [#201](https://github.com/ulixee/platform/issues/201)
* **end-to-end:** use docker for e2e tests ([3f243de](https://github.com/ulixee/platform/commit/3f243deb40d2b1cc86048d171d574b3690a29395))
* **github:** databroker tests broken ([801f62c](https://github.com/ulixee/platform/commit/801f62cad9e16e441cbea7fe3660098ade31ef34))

### Features

* **databroker:** new feature to delegate payment ([47900e3](https://github.com/ulixee/platform/commit/47900e314b8d9f59f88598b1d914e211e1ae5bdf))
* **datastore:** integrate escrow payments ([b00fdd5](https://github.com/ulixee/platform/commit/b00fdd52e36bc9480297639a5584a6f71d6890dd))
* **desktop:** accounts vs localchains ([2c63e7e](https://github.com/ulixee/platform/commit/2c63e7eb1d0d7261dc00a74b80fa9a30a48ebb42))
* **desktop:** add qr code to wallet ([ca432da](https://github.com/ulixee/platform/commit/ca432da2847ba95fccfc25cf7c51f93638c12964))
* **desktop:** update wallet ux ([3b9fbfb](https://github.com/ulixee/platform/commit/3b9fbfba9c91bec72b3dbc4b88b83eb39992d617))
* integrate argon payments to desktop ([b8a7ffd](https://github.com/ulixee/platform/commit/b8a7ffd651d88160afbfe7906c09e2eac06a345d))

# [2.0.0-alpha.28](https://github.com/ulixee/platform/compare/v2.0.0-alpha.27...v2.0.0-alpha.28) (2024-03-11)

**Note:** Version bump only for package @ulixee/platform

# [2.0.0-alpha.27](https://github.com/ulixee/platform/compare/v2.0.0-alpha.26...v2.0.0-alpha.27) (2024-03-01)

**Note:** Version bump only for package @ulixee/platform

# [2.0.0-alpha.26](https://github.com/ulixee/platform/compare/v2.0.0-alpha.25...v2.0.0-alpha.26) (2024-02-02)

### Bug Fixes

- attemp to fix docker ([9578287](https://github.com/ulixee/platform/commit/9578287d69f71295327bf06ec4a19eda5eb4cdef))

### Features

- max concurrent clients per browser config ([8ffbe0a](https://github.com/ulixee/platform/commit/8ffbe0a36f41d8688a0d90d64a6481f00fe3a70a))
- migrate ms-build ([fd82e40](https://github.com/ulixee/platform/commit/fd82e40585b6bfbfa50f6849fbc52e43d1332093))

# [2.0.0-alpha.25](https://github.com/ulixee/platform/compare/v2.0.0-alpha.24...v2.0.0-alpha.25) (2023-09-28)

### Features

- **datastore:** remove vm2 dependency ([fdf923c](https://github.com/ulixee/platform/commit/fdf923c183f9eb87f6367e7973210f9fb2ca09cc))

# [2.0.0-alpha.24](https://github.com/ulixee/platform/compare/v2.0.0-alpha.23...v2.0.0-alpha.24) (2023-08-09)

**Note:** Version bump only for package @ulixee/platform

# [2.0.0-alpha.23](https://github.com/ulixee/platform/compare/v2.0.0-alpha.22...v2.0.0-alpha.23) (2023-07-07)

### Features

- **datastore:** change urls to be id@version ([903e34b](https://github.com/ulixee/platform/commit/903e34b43d8fb2bca060dc6344453da885fef29a))
- **datastore:** convert to id and semver ([1f5d524](https://github.com/ulixee/platform/commit/1f5d524eed5f7af42e271190994040c2d183f450))
- **kad:** add get/put capabilities to the kad ([418bd5c](https://github.com/ulixee/platform/commit/418bd5cee145e8ff7e552547c9bc6ab2811e1575))

# [2.0.0-alpha.22](https://github.com/ulixee/platform/compare/v2.0.0-alpha.21...v2.0.0-alpha.22) (2023-06-12)

### Bug Fixes

- **cloud:** shutdown stats tracker ([9bbba78](https://github.com/ulixee/platform/commit/9bbba78a2f19881c5d0ed6a67439e4b68a41ca1d))
- **cloud:** use sha256 of nodeId in kad routing ([9f12963](https://github.com/ulixee/platform/commit/9f12963f5b5f6333669706e91b6c77f41a00a6d6))
- **datastore:** troubleshoot docpage test ([8808f28](https://github.com/ulixee/platform/commit/8808f285c924c5d8fcf6df3d5f2f269c3284c651))
- docker builds ([a2a6b02](https://github.com/ulixee/platform/commit/a2a6b028c3b9fdb74feea070a57aa5f2f37b1a7f))

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

### Bug Fixes

- **datastore:** failing tests ([8e3f881](https://github.com/ulixee/platform/commit/8e3f881876a59c2b241806c04260d73e03d37617))
- **datastore:** output rebuilding ([8d10cc7](https://github.com/ulixee/platform/commit/8d10cc7e24cfd1ad65725a3e14dc4a3a2a3d5954))
- **desktop:** binary not loading properly ([3b0b641](https://github.com/ulixee/platform/commit/3b0b6414dbec9a798fba0e802ef06fd8ff790c6e))
- **desktop:** event handling fixes ([841c031](https://github.com/ulixee/platform/commit/841c031a2ec5061ce201b21aeb58ea53c4ac64a8))

### chore

- rename miner to cloud node ([a3c949e](https://github.com/ulixee/platform/commit/a3c949e4af806cc6a4acdd4b4b04305946add19b))

### Features

- **datastore:** add ability to “start” and watch ([e9c92bc](https://github.com/ulixee/platform/commit/e9c92bcc684331752e3e11a6b72bba83b91e0736))
- **datastore:** add docs ([da39923](https://github.com/ulixee/platform/commit/da39923c0ba5f21359e58a55fc205e82af708e65))
- **datastore:** simplify query to live in main ([b7dd56a](https://github.com/ulixee/platform/commit/b7dd56a69fdcdbb51170758c06b6d23cbd9e0585))
- **desktop:** add datastore details page ([a6bce0b](https://github.com/ulixee/platform/commit/a6bce0b9f5ac1121d37c3029bd8fd20f147e9324))
- **desktop:** getting started guide ([1e3fd87](https://github.com/ulixee/platform/commit/1e3fd87973807e8862a5696421aa768a6cd02bb6))
- **desktop:** log user queries locally ([33fb721](https://github.com/ulixee/platform/commit/33fb7215afca7bde722217a827a82e4b89082a8c))
- **desktop:** query ability on queries tab ([3960c7b](https://github.com/ulixee/platform/commit/3960c7b9fda1f9bea3a81850bb4fdadf9f54b2d4))

### BREAKING CHANGES

- @ulixee/miner package is now @ulixee/cloud.
  You must import {CloudNode} from @ulixee/cloud and use in place of Miner.

# [2.0.0-alpha.19](https://github.com/ulixee/platform/compare/v2.0.0-alpha.17...v2.0.0-alpha.19) (2023-02-25)

### Bug Fixes

- **apps:** do not improperly activate chromealive ([bfe328f](https://github.com/ulixee/platform/commit/bfe328f3f8b72547d21f5b976cea02bc458368cc))
- **databox:** docs links ([f9d8c91](https://github.com/ulixee/platform/commit/f9d8c91e4577fda70e8e1328888fd7215ae9d70c))
- **datastore:** broken argon conversions ([eb5d6d5](https://github.com/ulixee/platform/commit/eb5d6d5d6dcbf8f42cc3df1c2f3402fa6dcb44f0))
- **datastore:** ensure output is stored to db ([ae54593](https://github.com/ulixee/platform/commit/ae54593cb883f9d2f7cba5ea36f823c4bf4f1666))
- **datastore:** error logging ([7ee3d02](https://github.com/ulixee/platform/commit/7ee3d02076c0ced0dda05c884b25a33236f73d12))
- **datastore:** failing private table tests ([e844ebe](https://github.com/ulixee/platform/commit/e844ebeac9d9720a54795066d1f3abf319bafbe7))
- **datastore:** fix unit tests for domains ([8f00a37](https://github.com/ulixee/platform/commit/8f00a37c67818c7421836715e73e90e3a6cf1276))
- **datastore:** handle rolling up momentjs ([01e29eb](https://github.com/ulixee/platform/commit/01e29eb77f1e0f7c8cb68b47858901f6e239ed08))
- **datastore:** output tests ([1b0055d](https://github.com/ulixee/platform/commit/1b0055dcadee8b18e1869ebec7c093bc9b3605bc))
- **datastore:** testing stack trace windows slash ([f7042b8](https://github.com/ulixee/platform/commit/f7042b811093e30cbc19a9d1e2a84b22b9009163))
- **datastore:** tweak cli to fix end-to-end test ([4355cd1](https://github.com/ulixee/platform/commit/4355cd1f428806e10cbd23d62c4d2c0b970ce30e))
- **datastore:** vm not loading connection to core ([5862db8](https://github.com/ulixee/platform/commit/5862db8dd6da8cc7fb62fb78d8616720dcc401ae))
- **datastore:** windows tests failing moving files ([deea344](https://github.com/ulixee/platform/commit/deea344e697160d8bb4e17802b166e6778a7095d))
- **desktop:** allow opening external sesison ([5f5e229](https://github.com/ulixee/platform/commit/5f5e229a45f2373f1c3f236aadd7e21b17dbda87))
- **desktop:** multi-window popovers not workign ([9e60773](https://github.com/ulixee/platform/commit/9e60773215d6a3bfd2c5205c3ec35035fa7a0ad3))
- **desktop:** rebuild output tests ([d9a19c6](https://github.com/ulixee/platform/commit/d9a19c68d527ab9de2751d28b82f3f4edaf62656))
- docpage now works inside datastores ([0af2695](https://github.com/ulixee/platform/commit/0af26957e83fbc115b9641390d799b4f1a59f80c))
- docs pricing should include remote ([ca7bd07](https://github.com/ulixee/platform/commit/ca7bd07e0719a8a171ff53f5382d99f8a77ace50))
- docs still referencing afterRun ([875d295](https://github.com/ulixee/platform/commit/875d295d038009bf88976235310f2cf45b4a0eb0))
- download chrome in release tests ([27d8720](https://github.com/ulixee/platform/commit/27d8720c001d3c367418d0a7f38efd4bea905408))
- incorrect syntax for crawler output in docs ([fb672f9](https://github.com/ulixee/platform/commit/fb672f90a43963e6bc0e68baea139bbf23d7929b))
- lint issue and schema change ([b0fe5eb](https://github.com/ulixee/platform/commit/b0fe5ebb0b0ca187c19b1cae0f4766d2dce3313d))
- merge issues ([de1f3b4](https://github.com/ulixee/platform/commit/de1f3b4da65979b1ef5e2a145b36175e852ba845))
- **cloudNode:** startup waits for router to start ([0e158ec](https://github.com/ulixee/platform/commit/0e158ec8aebeab1cc7abfc4a524c0d2b7f40d0a6))
- slashes in windows file paths were breaking things ([9e40001](https://github.com/ulixee/platform/commit/9e40001dbad08203ab3414e345a62ff375cb6f61))
- stop sql injection in Datastore.stream ([b3c4c4b](https://github.com/ulixee/platform/commit/b3c4c4b1f1d134e9f38cdc37411fa407642bb69d))
- updated doc links to point to runner ([f3e14c6](https://github.com/ulixee/platform/commit/f3e14c60a9c528a0861cb126fd191fb306acf88e))

### Features

- added @ulixee/client package ([c71cc8b](https://github.com/ulixee/platform/commit/c71cc8bd99ea1777ad096a0fa9d960782dfdeb7d))
- added databox docpage ([57d0790](https://github.com/ulixee/platform/commit/57d07906dd711fa30997d1946cc3bbab1aeb3902))
- added sub-Clients like ForDatastore, ForTable, etc + several fixes ([e3d2323](https://github.com/ulixee/platform/commit/e3d23237febf7adfc93da68979a55dd50611d104))
- **chromealive:** move replay window to electron ([a0eef50](https://github.com/ulixee/platform/commit/a0eef509242d10250a079d0766991e8c2c1f7028))
- **client:** add connection to core option ([46d35a9](https://github.com/ulixee/platform/commit/46d35a9d13d27f05cbb59ee2686f52f926a71eb8))
- **client:** add type checking to local ctor ([a44549b](https://github.com/ulixee/platform/commit/a44549bce2dafe0575d74b0340896c157a78b02f))
- convert outputs to an array of records ([a6f6ab4](https://github.com/ulixee/platform/commit/a6f6ab41acdaa947790636e008427f39978bb28e))
- crawler documentation ([0615cd8](https://github.com/ulixee/platform/commit/0615cd86410163570b730c11db2fd67dc5f85091))
- **databox:** stream output records as available ([a92da44](https://github.com/ulixee/platform/commit/a92da44710aabaf0c6be33cdb02cd99060a3d47c))
- **datastore:** ability to route domains ([8d123d3](https://github.com/ulixee/platform/commit/8d123d37c121aa52f22696b15e47fec4278464d0))
- **datastore:** add context crawl, run, query ([e8e722c](https://github.com/ulixee/platform/commit/e8e722c048499c557f9b030ad97089677922d330))
- **datastore:** affiliateId and embedded credits ([e56a24d](https://github.com/ulixee/platform/commit/e56a24dbd33211f26d120e1c7fd5fc20e6e698a8))
- **datastore:** change cloning to create project ([6263ecb](https://github.com/ulixee/platform/commit/6263ecb3829d1f1569f0ca5a5a82278adf0c1b64))
- **datastore:** cli to clone datastores ([cd9fd16](https://github.com/ulixee/platform/commit/cd9fd1641a0299365da4b4c1d6d8a24e2b58b4f5))
- **datastore:** default max time in cache to 10m ([dff7895](https://github.com/ulixee/platform/commit/dff7895ed640d8e7aca3068ff8483c7589c5083f))
- **datastore:** documentation ([6c607fe](https://github.com/ulixee/platform/commit/6c607fef9b032dd4593444d5379b96c126ffb61c))
- **datastore:** enable credits ([972029e](https://github.com/ulixee/platform/commit/972029e93451e4dddd79f313527f5799aaf11260))
- **datastore:** http api for credits balance ([0270a04](https://github.com/ulixee/platform/commit/0270a04c4a4b381e0e1564a3efb79c06fb72aac5))
- **datastore:** multi-function autorun ([eaf0a2f](https://github.com/ulixee/platform/commit/eaf0a2fac8f187c8a0a4ea933a4cfdd324257358))
- **datastore:** passthrough tables ([36f4cb6](https://github.com/ulixee/platform/commit/36f4cb6a7122ec0ab517ad051e61b5262d5c99d9))
- **datastore:** shorten version hash length ([0e36ead](https://github.com/ulixee/platform/commit/0e36ead760356addb93340313458b92093e51c1b))
- **desktop:** add desktop home page ([d8f5611](https://github.com/ulixee/platform/commit/d8f56110c66a1d290bf28c9e227721716fbe1f7a))
- **desktop:** add pages to home ([76ff239](https://github.com/ulixee/platform/commit/76ff239eeacdd3c03d44ed91781b900e352479a6))
- **desktop:** playback of script ([521d21f](https://github.com/ulixee/platform/commit/521d21faaa769651ad485afee876f09a73dde18e))
- docpage credits + @ulixee/client package ([21c0175](https://github.com/ulixee/platform/commit/21c0175c41991a4d89e4f625e10df19cc35be8ec))

# [2.0.0-alpha.18](https://github.com/ulixee/platform/compare/v2.0.0-alpha.17...v2.0.0-alpha.18) (2023-01-17)

### Bug Fixes

- **databox:** docs links ([f9d8c91](https://github.com/ulixee/platform/commit/f9d8c91e4577fda70e8e1328888fd7215ae9d70c))
- **datastore:** failing private table tests ([e844ebe](https://github.com/ulixee/platform/commit/e844ebeac9d9720a54795066d1f3abf319bafbe7))
- **datastore:** tweak cli to fix end-to-end test ([4355cd1](https://github.com/ulixee/platform/commit/4355cd1f428806e10cbd23d62c4d2c0b970ce30e))
- docs pricing should include remote ([ca7bd07](https://github.com/ulixee/platform/commit/ca7bd07e0719a8a171ff53f5382d99f8a77ace50))
- docs still referencing afterRun ([875d295](https://github.com/ulixee/platform/commit/875d295d038009bf88976235310f2cf45b4a0eb0))
- download chrome in release tests ([27d8720](https://github.com/ulixee/platform/commit/27d8720c001d3c367418d0a7f38efd4bea905408))
- incorrect syntax for crawler output in docs ([fb672f9](https://github.com/ulixee/platform/commit/fb672f90a43963e6bc0e68baea139bbf23d7929b))
- lint issue and schema change ([b0fe5eb](https://github.com/ulixee/platform/commit/b0fe5ebb0b0ca187c19b1cae0f4766d2dce3313d))
- merge issues ([de1f3b4](https://github.com/ulixee/platform/commit/de1f3b4da65979b1ef5e2a145b36175e852ba845))
- slashes in windows file paths were breaking things ([9e40001](https://github.com/ulixee/platform/commit/9e40001dbad08203ab3414e345a62ff375cb6f61))

### Features

- added databox docpage ([57d0790](https://github.com/ulixee/platform/commit/57d07906dd711fa30997d1946cc3bbab1aeb3902))
- convert outputs to an array of records ([a6f6ab4](https://github.com/ulixee/platform/commit/a6f6ab41acdaa947790636e008427f39978bb28e))
- crawler documentation ([0615cd8](https://github.com/ulixee/platform/commit/0615cd86410163570b730c11db2fd67dc5f85091))
- **databox:** stream output records as available ([a92da44](https://github.com/ulixee/platform/commit/a92da44710aabaf0c6be33cdb02cd99060a3d47c))
- **datastore:** affiliateId and embedded credits ([e56a24d](https://github.com/ulixee/platform/commit/e56a24dbd33211f26d120e1c7fd5fc20e6e698a8))
- **datastore:** cli to clone datastores ([cd9fd16](https://github.com/ulixee/platform/commit/cd9fd1641a0299365da4b4c1d6d8a24e2b58b4f5))
- **datastore:** documentation ([6c607fe](https://github.com/ulixee/platform/commit/6c607fef9b032dd4593444d5379b96c126ffb61c))
- **datastore:** enable credits ([972029e](https://github.com/ulixee/platform/commit/972029e93451e4dddd79f313527f5799aaf11260))
- **datastore:** passthrough tables ([36f4cb6](https://github.com/ulixee/platform/commit/36f4cb6a7122ec0ab517ad051e61b5262d5c99d9))
- **datastore:** shorten version hash length ([0e36ead](https://github.com/ulixee/platform/commit/0e36ead760356addb93340313458b92093e51c1b))

# [2.0.0-alpha.17](https://github.com/ulixee/platform/compare/v2.0.0-alpha.16...v2.0.0-alpha.17) (2022-12-15)

### Bug Fixes

- a number of fixes based on Blake's PR comments ([75b7ecf](https://github.com/ulixee/platform/commit/75b7ecf79f66c5e09a221a86da73a6c2db7380bf))
- added some jest mocks ([c915472](https://github.com/ulixee/platform/commit/c915472bccd85bb8385ccbe5419f29a9990d4f9f))
- fixed some tests by ensuring the dir exits before removing ([54c0e4d](https://github.com/ulixee/platform/commit/54c0e4dba27e207507b88be70d485c9dd73b9058))
- resolved some file issues in tests ([a707427](https://github.com/ulixee/platform/commit/a707427db410b03e82240cda516d16a87a2e40e5))

### Features

- added tables + sql ([8be5f7e](https://github.com/ulixee/platform/commit/8be5f7e31ca4c63cbb02f81eb7ca29dbb8e5b2aa))
- added ULX_SERVER_ENVIRONMENT env ([a3b28a6](https://github.com/ulixee/platform/commit/a3b28a68a21378cdccbea1d49b851201cda8db10))
- **databox:** passthrough functions ([c84ba16](https://github.com/ulixee/platform/commit/c84ba168265ebdb167e6ceeb5e3f6bd116760710))
- finished converting Databox to SQL ([3765917](https://github.com/ulixee/platform/commit/37659171fe2c5c1488c4ab0209939421894c4e1b))

# [2.0.0-alpha.16](https://github.com/ulixee/platform/compare/v2.0.0-alpha.15...v2.0.0-alpha.16) (2022-12-05)

### Bug Fixes

- node 18 fixes ([cba4510](https://github.com/ulixee/platform/commit/cba45107b038f0538429fa18bf87448140ace5c5))
- tests ([547e189](https://github.com/ulixee/platform/commit/547e189235e022cedbd8be365d742f684341ef2d))

### Features

- allow a databox function to be auto-wrapped ([57a54ca](https://github.com/ulixee/platform/commit/57a54ca70903751414e49d5bc8fd4d933af788ea))
- convert databox plugins to new structure ([1705030](https://github.com/ulixee/platform/commit/1705030ec91461b166c9bfafbcc9b1e3c12f0854))
- databox functions ([b14352d](https://github.com/ulixee/platform/commit/b14352d8160de6667e05bdbf86b6b6df32d056e4))
- **databox:** updated structure documentation ([4dbfe0b](https://github.com/ulixee/platform/commit/4dbfe0b5379417fc86de3c5b5885a1592d2c81fe))

# [2.0.0-alpha.15](https://github.com/ulixee/platform/compare/v2.0.0-alpha.14...v2.0.0-alpha.15) (2022-11-17)

### Features

- simplified gift cards ([a9ccca7](https://github.com/ulixee/platform/commit/a9ccca76dfaffd789602f3bb3cacac5d5d75c82c))

# [2.0.0-alpha.14](https://github.com/ulixee/platform/compare/v2.0.0-alpha.13...v2.0.0-alpha.14) (2022-11-02)

**Note:** Version bump only for package @ulixee/platform

# [2.0.0-alpha.13](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.12...v2.0.0-alpha.13) (2022-10-31)

### Bug Fixes

- add development mode for desktop app ([603b35e](https://github.com/ulixee/ulixee/commit/603b35e27a1e6b1ea3b14a7b0d29af8cd2c5612a))
- **databox:** fix databox replay w/o chromealive ([80fe511](https://github.com/ulixee/ulixee/commit/80fe511b00be92d074f872904fc72108267139be))
- github action ([5c8d31c](https://github.com/ulixee/ulixee/commit/5c8d31c0ac4ab0a7089c4b25cfd4d713c080e670))
- github action errors ([9122fcb](https://github.com/ulixee/ulixee/commit/9122fcb572cbdeb7884c0ad7ff2385c55ed8b0c9))
- lint issue ([ae94176](https://github.com/ulixee/ulixee/commit/ae94176c237c8c729b426c783e3918ed460c6c0e))
- **server:** fix docker permissions ([435dc45](https://github.com/ulixee/ulixee/commit/435dc45cd415d99a85ba00a5771f1d38d8c5a2ba))

### Features

- add schemas to databoxes ([6f49377](https://github.com/ulixee/ulixee/commit/6f493774ebd760e52c7986b2ad3e0b45abab90e8))
- allow installing a databox schema ([b73da83](https://github.com/ulixee/ulixee/commit/b73da83fc04728d9b575aea541126758e76556ee))
- **databox:** add docs for Databox Schema ([e72fdfd](https://github.com/ulixee/ulixee/commit/e72fdfd0740905dd06084fee66ad318acde9aad3))
- finished barebones documentation for new simplified Databox ([02342f9](https://github.com/ulixee/ulixee/commit/02342f93557624ffab5f13c0f114853a0d20e86e))
- major simplification of Databox into a basic version with plugin capabilities ([22ad672](https://github.com/ulixee/ulixee/commit/22ad672e06135049ab82fc8b3af274d9e72c278a))
- publish docker images ([d10ee25](https://github.com/ulixee/ulixee/commit/d10ee257406633805d15d21d7ebd4b043246b6c4))
- updated to reflect hero change from dataSnippets to just snippets ([a5fcd64](https://github.com/ulixee/ulixee/commit/a5fcd64b0e2fbd4fec77a539b65e4382bc259001))
- updated to work with latest changes to Hero ([0152be1](https://github.com/ulixee/ulixee/commit/0152be1267af472767b7c31d98739f950ffc99e9))

# [2.0.0-alpha.12](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.11...v2.0.0-alpha.12) (2022-10-03)

### Features

- tweak website search ([1ccca18](https://github.com/ulixee/ulixee/commit/1ccca1887062f6b392a081924eb5ada4460100fb))

# [2.0.0-alpha.11](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.10...v2.0.0-alpha.11) (2022-08-31)

### Bug Fixes

- **website:** update algolia search ([992e35a](https://github.com/ulixee/ulixee/commit/992e35aeb4c9a01924820e70010f223cc8c31142))

# [2.0.0-alpha.10](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.9...v2.0.0-alpha.10) (2022-08-16)

### Bug Fixes

- **chromealive:** turn off plugin if not installed ([a013cbd](https://github.com/ulixee/ulixee/commit/a013cbd3eed77262f82c95b86d5081c14bef56a0))
- **databox:** autorun not working in playground ([2d67279](https://github.com/ulixee/ulixee/commit/2d67279f7f7f5150926eea4b4f1ed70efe0f679d))

### Features

- **databox:** invert databox settings ([e69edf6](https://github.com/ulixee/ulixee/commit/e69edf63453fe2a670b542a7691f4b1cf4c1028c))
- **databox:** payments ([93af88c](https://github.com/ulixee/ulixee/commit/93af88c9a86115ee13cd6156a50405a26af8de7e))
- end to end scripts (first one is gift cards) ([d737c6b](https://github.com/ulixee/ulixee/commit/d737c6b847ebb017ec1a766ab5d025153b17f331))

# [2.0.0-alpha.9](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.8...v2.0.0-alpha.9) (2022-07-26)

### Bug Fixes

- server should wait to start until everything is ready ([008a39d](https://github.com/ulixee/ulixee/commit/008a39d5eeb4eb0db62544d8ff911dea0a66a54a))

# [2.0.0-alpha.8](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.7...v2.0.0-alpha.8) (2022-07-13)

### Bug Fixes

- **databox:** autorun playgrounds ([61e1585](https://github.com/ulixee/ulixee/commit/61e15850d70fed4c640be12def2f4a579968692a))
- **databox:** update hero and hashUtils ([b8432fc](https://github.com/ulixee/ulixee/commit/b8432fcb8343c5483aaa0c5a33d06d7f5abfa58a))
- **website:** hero awaited dom links broken ([1710b84](https://github.com/ulixee/ulixee/commit/1710b84628f5c544452ed310487b27baded9d730))

### Features

- allow server configuration of hero/databox ([ac305d9](https://github.com/ulixee/ulixee/commit/ac305d967f414ab4b1f70f9adbfbd5f8b0c9f029))
- **databox:** dbx package files ([57a067e](https://github.com/ulixee/ulixee/commit/57a067ea3be57516ea58c278dff07e1158c97848))
- **databox:** deploy command ([2929b43](https://github.com/ulixee/ulixee/commit/2929b43ee34f41fc853623ace966501e5895e879))
- **databox:** manifest setting overrides ([098126d](https://github.com/ulixee/ulixee/commit/098126d1e075e4378bc6f562739369d52ed5b4a0))
- **databox:** store dbx files on server ([b331ede](https://github.com/ulixee/ulixee/commit/b331ede711f8539e91cbade5087c6e573aa3f407))

# [2.0.0-alpha.7](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.6...v2.0.0-alpha.7) (2022-06-28)

### Bug Fixes

- allow showChromeInterations to be disabled + more accurate error msg if extension isn't found ([b452a71](https://github.com/ulixee/ulixee/commit/b452a71927a81a7cb4b95d1fd16e9228585cbbf0))
- **apps:** page performance tweaks ([f1bc076](https://github.com/ulixee/ulixee/commit/f1bc076f8a31523521d46c49db9fdaf549276474))
- **apps:** remove headers from output page ([a1ebe9a](https://github.com/ulixee/ulixee/commit/a1ebe9ae20df4032e341b49fc85dd258112c6389))
- **apps:** reset source map cache ([0b880d1](https://github.com/ulixee/ulixee/commit/0b880d166021771f74953276ae876fc206b95e5d))
- autorun was not setup correctly after previous databox changes ([1fe0c02](https://github.com/ulixee/ulixee/commit/1fe0c027c5ef6f1cbd8f8a11f48d23e0edc97182))
- change ULX_DATABOX_DISABLE_AUTORUN values to be boolean ([3dd2d0a](https://github.com/ulixee/ulixee/commit/3dd2d0adc8ade84c80193ebdadbe8e850f13c712))
- **chromealive:** pipe output ([e49113c](https://github.com/ulixee/ulixee/commit/e49113c25a92bcb274fcead17682d64ef67b9da9))
- **cli:** arg parsing wrong when values needed ([b79d9c6](https://github.com/ulixee/ulixee/commit/b79d9c6869b0b3a17b2bdf3d4b1b5b0140f62309))
- **databox:** chromealive properly resumes databox ([34b7dcf](https://github.com/ulixee/ulixee/commit/34b7dcfdbef91fdbd245679e1dec86d7cb76c024))
- **databox:** convert run later to boolean ([8a79290](https://github.com/ulixee/ulixee/commit/8a79290e2b67fde0e10e80be44e8745755f2344b))
- **databox:** log errors connecting to core ([e9093d0](https://github.com/ulixee/ulixee/commit/e9093d07b7f888c591ff3d9a9e4af66650548d93))
- fixed some issues that the previous databox changes broke ([000f106](https://github.com/ulixee/ulixee/commit/000f106a2052c53a963c6cd706195a9508dc6f63))
- moved ULX_DATABOX_DISABLE_AUTORUN check into databox constructors ([49b2935](https://github.com/ulixee/ulixee/commit/49b29359767bf40ab7d83f1547fd03f0e603f706))
- **playground:** server not shutting down ([e35606c](https://github.com/ulixee/ulixee/commit/e35606c2de1b7bf8605c06233a9fee0bcfa61074))

### Features

- added @ulixee/databox as a standalone tool + databox-for-puppeteer ([94ddf8d](https://github.com/ulixee/ulixee/commit/94ddf8d24c93b12a5b81596a6db12e60016a110e))
- added cores to databox and for-puppeteer + ability to run local databox files ([237f1e9](https://github.com/ulixee/ulixee/commit/237f1e941843d8ca71bfc6c74d3bbc7b048f5d6b))
- added package.dist.json to databox-core ([cc947b4](https://github.com/ulixee/ulixee/commit/cc947b4fc8ac7deca9f294c674a6be560ce95fa1))
- **apps:** save selectors ([dd7bcfd](https://github.com/ulixee/ulixee/commit/dd7bcfd55281088f14e5e8e5f7649f5845379ba2))
- **chromealive:** restarting session mode ([34dee09](https://github.com/ulixee/ulixee/commit/34dee095b0e7e32b2988d604be7cef341332bd79))
- **databox:** better error stacks (no library) ([ab27163](https://github.com/ulixee/ulixee/commit/ab2716373d0d9379d8d9a6fcd0f307c7647346eb))
- databoxes now have core-runtimes ([9a63bd9](https://github.com/ulixee/ulixee/commit/9a63bd9cae3427c71c47cc46d7009b07ae3fed9f))
- every databox core-runtime should check whether databox version is satisfied ([053032f](https://github.com/ulixee/ulixee/commit/053032f1a78d2b9af674baf86f69ebce459c1f46))

# [2.0.0-alpha.6](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.5...v2.0.0-alpha.6) (2022-06-10)

### Bug Fixes

- abort attemptAutorun of databox if no default databox was found ([ce16e75](https://github.com/ulixee/ulixee/commit/ce16e753b98251e3e47b4d05d6651130c61d7de4))
- hero-playground ts not including index.js ([89360b0](https://github.com/ulixee/ulixee/commit/89360b000435ec957ce36dde6aff7e33fd00198a))

# [2.0.0-alpha.5](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.3...v2.0.0-alpha.5) (2022-06-10)

### Bug Fixes

- allow docs to build + styled contribution pages + fixed hero example code ([aa9b578](https://github.com/ulixee/ulixee/commit/aa9b578cf81d3bfd1eaad4169fa09fa2302bf187))
- broken databox test ([81fa421](https://github.com/ulixee/ulixee/commit/81fa42177e335c61c1f35fe645eb4f3bd15701fd))
- corrected doc links ([51b7f18](https://github.com/ulixee/ulixee/commit/51b7f1835287c7456d9f2d3217f24dfbbe1db8b9))
- events for chromealive not working ([88ca517](https://github.com/ulixee/ulixee/commit/88ca517875062ef2975eb441e5f3aa9e6bf6b2e6))
- lint ([496b8dc](https://github.com/ulixee/ulixee/commit/496b8dcb3a84c36279fce6e50ee14a710e1e2198))
- packager tests ([a75162a](https://github.com/ulixee/ulixee/commit/a75162ac5cae234487e96bea1ff5b52f27a931f7))
- updated website data generator to get ready for stream ([41c95fd](https://github.com/ulixee/ulixee/commit/41c95fd31483229b73739ad17c16505112e377b8))

### Features

- added new website ([1b749d1](https://github.com/ulixee/ulixee/commit/1b749d1aa93c47032b7133678916648b6d8d7a43))
- **databox:** add databox cores ([36e4fd8](https://github.com/ulixee/ulixee/commit/36e4fd802175985755394751dd09a8ceabc5bfa4))
- **databox:** packaging ([4303a87](https://github.com/ulixee/ulixee/commit/4303a8731ab3aaa6d3f5f859e760948c54305e69))
- playgrounds for hero and databox-plugins-hero ([34eca22](https://github.com/ulixee/ulixee/commit/34eca2237aa92e73794a3b5ea6bcc6eef41a1572))
- removed old docs website ([00a95d1](https://github.com/ulixee/ulixee/commit/00a95d19f80622c0b6fb246ed5bc4c97a2767e1f))
- renamed DataboxPackage.ts in databox/for-hero to DataboxWrapper.ts ([cfc625e](https://github.com/ulixee/ulixee/commit/cfc625ef8adffc9967429a24cabe8d0872d29263))
- ulixee cli ([767f0a9](https://github.com/ulixee/ulixee/commit/767f0a955587755df2f6a2e7042092023e68f7c6))

# [2.0.0-alpha.4](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2022-06-09)

### Bug Fixes

- allow docs to build + styled contribution pages + fixed hero example code ([aa9b578](https://github.com/ulixee/ulixee/commit/aa9b578cf81d3bfd1eaad4169fa09fa2302bf187))
- broken databox test ([81fa421](https://github.com/ulixee/ulixee/commit/81fa42177e335c61c1f35fe645eb4f3bd15701fd))
- corrected doc links ([51b7f18](https://github.com/ulixee/ulixee/commit/51b7f1835287c7456d9f2d3217f24dfbbe1db8b9))
- lint ([496b8dc](https://github.com/ulixee/ulixee/commit/496b8dcb3a84c36279fce6e50ee14a710e1e2198))
- packager tests ([a75162a](https://github.com/ulixee/ulixee/commit/a75162ac5cae234487e96bea1ff5b52f27a931f7))
- updated website data generator to get ready for stream ([41c95fd](https://github.com/ulixee/ulixee/commit/41c95fd31483229b73739ad17c16505112e377b8))

### Features

- added new website ([1b749d1](https://github.com/ulixee/ulixee/commit/1b749d1aa93c47032b7133678916648b6d8d7a43))
- **databox:** add databox cores ([36e4fd8](https://github.com/ulixee/ulixee/commit/36e4fd802175985755394751dd09a8ceabc5bfa4))
- **databox:** packaging ([4303a87](https://github.com/ulixee/ulixee/commit/4303a8731ab3aaa6d3f5f859e760948c54305e69))
- playgrounds for hero and databox-plugins-hero ([34eca22](https://github.com/ulixee/ulixee/commit/34eca2237aa92e73794a3b5ea6bcc6eef41a1572))
- removed old docs website ([00a95d1](https://github.com/ulixee/ulixee/commit/00a95d19f80622c0b6fb246ed5bc4c97a2767e1f))
- renamed DataboxPackage.ts in databox/for-hero to DataboxWrapper.ts ([cfc625e](https://github.com/ulixee/ulixee/commit/cfc625ef8adffc9967429a24cabe8d0872d29263))
- ulixee cli ([767f0a9](https://github.com/ulixee/ulixee/commit/767f0a955587755df2f6a2e7042092023e68f7c6))

# [2.0.0-alpha.3](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.2...v2.0.0-alpha.3) (2022-05-19)

**Note:** Version bump only for package @ulixee/ulixee-monorepo

# [2.0.0-alpha.2](https://github.com/ulixee/ulixee/compare/v2.0.0-alpha.1...v2.0.0-alpha.2) (2022-05-17)

### Bug Fixes

- databox tsconfig for distro ([98886e9](https://github.com/ulixee/ulixee/commit/98886e918d3ef8a6b04d44b864411fc0bcf8e0fc))

# 2.0.0-alpha.1 (2022-05-16)

### Bug Fixes

- a few very tiny but important changes ([370e29a](https://github.com/ulixee/ulixee/commit/370e29af468cbbe13a6c5ddfb16111e187b08e5d))
- **apps:** configuration order ([6483735](https://github.com/ulixee/ulixee/commit/64837359e2f86b96b529558f05c9a28eb8981b6b))
- await databoxInternal.execExtractor so any errors inside extract are caught ([a381010](https://github.com/ulixee/ulixee/commit/a3810103f902ad839a0e0e017dc9076b9db088fd))
- boss package including compiled chromealive ([e70ebc5](https://github.com/ulixee/ulixee/commit/e70ebc5d4d51e4aa4d725b624c6ac661ed3d5fcb))
- **chromealive:** allow selecting a range on bar ([3daa0a1](https://github.com/ulixee/ulixee/commit/3daa0a1bb60ec06c996a7cc14f52cd7e93753aee))
- **chromealive:** change output location for pkg ([e3b509a](https://github.com/ulixee/ulixee/commit/e3b509a86e61210a15279f2ee035ea942be4fcd7))
- **chromealive:** change top position on hide ([c4d88fc](https://github.com/ulixee/ulixee/commit/c4d88fce534cbc21b1e4de0e2ec4f1df651b8531))
- **chromealive:** child windows messing up hide ([1840ccc](https://github.com/ulixee/ulixee/commit/1840cccfbd9a27ac801949d222962ce36ee83695))
- **chromealive:** date parsing broken ([59a6462](https://github.com/ulixee/ulixee/commit/59a646227e9e297af7ece96534ccb65d7dea0c07))
- **chromealive:** finder focus and tabgroup ([cba583d](https://github.com/ulixee/ulixee/commit/cba583d875b713d3be22a856791c643988a46360))
- **chromealive:** fix bar positioning and focus ([d47d805](https://github.com/ulixee/ulixee/commit/d47d80514f78f1f92c3bcdcdde6094c1eab28a50))
- **chromealive:** handle screen scale ([c104c21](https://github.com/ulixee/ulixee/commit/c104c21cdfcb8f048e3cdec8f1e89b06f05eaac4))
- **chromealive:** hide toolbar when not in use ([7c961cf](https://github.com/ulixee/ulixee/commit/7c961cf0fde441d1871f1e0cb45df5e8408a781d))
- **chromealive:** improve playbar dragging ([32def57](https://github.com/ulixee/ulixee/commit/32def57948b69dc28206070b2e49cb5f3499458b))
- **chromealive:** launch from boss ([dc7ad0d](https://github.com/ulixee/ulixee/commit/dc7ad0d4247052d937cbfbb5e6f85c6f1dcd0424))
- **chromealive:** output window not wiring up ([f29b486](https://github.com/ulixee/ulixee/commit/f29b4869d7d77b78c7413eb70706e25b3d04a57f))
- **chromealive:** page state generate ticks "snap" ([d3dfdb6](https://github.com/ulixee/ulixee/commit/d3dfdb62e9a1e20bb3910d9779c980147a51694a))
- **chromealive:** playbar jerkiness ([4e2817d](https://github.com/ulixee/ulixee/commit/4e2817d4187ac7adbb37b6ad7e7031c91b68849f))
- **chromealive:** player infinite loops ([788d4bd](https://github.com/ulixee/ulixee/commit/788d4bd1d7a93c6eff442f01eb6574c50386d29e))
- **chromealive:** support multiple page states ([2e98ef6](https://github.com/ulixee/ulixee/commit/2e98ef6f1bbc4de3962aec4022435d9e7e1e8500))
- **chromealive:** tab switching/closing bugs ([fb937e9](https://github.com/ulixee/ulixee/commit/fb937e9879ba1ed20fe7d6edb440f8ae571bd184))
- **chromealive:** timeout clicking active tabs ([6ed6359](https://github.com/ulixee/ulixee/commit/6ed63592cba9a3d153c1f307e493a2b8e3a2668c))
- **chromealive:** various playbar bug fixes ([e521009](https://github.com/ulixee/ulixee/commit/e5210099fd98a2a0cd242c04324ee5d117f24c72))
- **chromealive:** websocket bypass for extension ([09d3886](https://github.com/ulixee/ulixee/commit/09d3886dfbf412c1474ff944c60cd273b9f3137b))
- **commons:** move typeserializer test ([a5aa1b8](https://github.com/ulixee/ulixee/commit/a5aa1b8173a897338896e2bf48bae73397d62d76))
- **commons:** tweak small commons features ([14c7c5f](https://github.com/ulixee/ulixee/commit/14c7c5fcf30f3357298c313a6259e2e3bf87437a))
- **commons:** windows logger package formatting ([8590b08](https://github.com/ulixee/ulixee/commit/8590b08d1fcdf735d37cf92ae60636cf43f9c6bf))
- **databox:** server config ([94e241f](https://github.com/ulixee/ulixee/commit/94e241f015ec9caa4cd3e19fd6a514d2b2e93ada))
- disable selector menu + timeline snapshot recorder ([e29cc4f](https://github.com/ulixee/ulixee/commit/e29cc4f7e527543a471a0cf145dae1453b656127))
- **docs:** remove w3c for docs ([4234da1](https://github.com/ulixee/ulixee/commit/4234da1940c33a330c5d156a4c0caa78b666abb2))
- fixed linting issues + a test bug ([efc875e](https://github.com/ulixee/ulixee/commit/efc875e27404832a567ad7f4055455359f6ec1f0))
- fixed several lint issues ([e283577](https://github.com/ulixee/ulixee/commit/e283577f5aafef2e4253dce75d83dad1543d9d82))
- fixes related to messaging between core and extension ([9010624](https://github.com/ulixee/ulixee/commit/90106247e48b86f0818f4512a7c57f7da13e4993))
- focus lost for non-active tab ([78cf07c](https://github.com/ulixee/ulixee/commit/78cf07ccb677c2aa298a4582e77d3b07c3b68547))
- hero pointer ([13a3b0e](https://github.com/ulixee/ulixee/commit/13a3b0ede11d6ceac925b7e7d492900e61375f49))
- **hero:** cert manager fix ([bf18345](https://github.com/ulixee/ulixee/commit/bf183452e98ad3a2d59b4d6368cf3fc8740314f0))
- **hero:** update submodule pointer ([f174bd7](https://github.com/ulixee/ulixee/commit/f174bd7ce218d4128c27765b3a51ba89978aa7c5))
- input and output tabs now handle empty Session.active commands ([94e5a82](https://github.com/ulixee/ulixee/commit/94e5a82b1a35bf08c8dd1315fa669fbfc6a3c579))
- lint ([d4bcbe1](https://github.com/ulixee/ulixee/commit/d4bcbe13033cbd79727e3f103284f9d3612b1f44))
- lint ([506e9ca](https://github.com/ulixee/ulixee/commit/506e9cadb36f2d289f1431b671be344a7581541c))
- lint ([f7407ac](https://github.com/ulixee/ulixee/commit/f7407ac4e9ea5f5b95643a9e76fd25a26cba0ddf))
- lint not running ([c189a5d](https://github.com/ulixee/ulixee/commit/c189a5d82d7f728808f7e037938e70ddac38d332))
- lint require return types ([a829f3f](https://github.com/ulixee/ulixee/commit/a829f3f150e788618f273c7ccfea0a3088ee41d5))
- **misc:** remove rmdirSync warning ([d3c12dc](https://github.com/ulixee/ulixee/commit/d3c12dca351773b91a8f657d6f62d178466e8d01))
- more lint fixes ([5ab4ce6](https://github.com/ulixee/ulixee/commit/5ab4ce61d4331931b57078c282c5b90482b80aa3))
- no need for a console.log in DataboxInternal ([566a7fd](https://github.com/ulixee/ulixee/commit/566a7fdf565c3ca3e9519517e091171e5807191d))
- **pagestate:** adjust dom changes to be aggregate ([4b1b3a6](https://github.com/ulixee/ulixee/commit/4b1b3a61eb6752a15d231db10bcddcd977c0f21f))
- **pagestate:** allow importing state name ([51166f5](https://github.com/ulixee/ulixee/commit/51166f5105dccf07134a357c694b8babf74add5c))
- **pagestate:** convert to panel view ([743d524](https://github.com/ulixee/ulixee/commit/743d524e0d3fb3cc3a20203b26c47ff57c93a844))
- **pagestate:** extend timeline 5s after now ([4b277d6](https://github.com/ulixee/ulixee/commit/4b277d6125b800eeffd2b6220dc94cf521f98dfb))
- **pagestate:** fix select boxes ([d470d0f](https://github.com/ulixee/ulixee/commit/d470d0fdf8d1c9a762ecc116d6130e29f2bd4db2))
- **pagestate:** service worker dying ([9611927](https://github.com/ulixee/ulixee/commit/9611927eedc6e70321ab0f02c083504a47d203bb))
- removed console.log, added back Statics decorators + capitalized TODOs ([98298f5](https://github.com/ulixee/ulixee/commit/98298f5ddb01bf334b3efa5f01b2a5e3fb1615d6))
- removed imports that weren't being used ([7b2f9f2](https://github.com/ulixee/ulixee/commit/7b2f9f2883445470a40731cb8e44290d32e45d29))
- removed input from UI + removed old databox repo from boss/copySources ([7705e14](https://github.com/ulixee/ulixee/commit/7705e149d16fc485680b9dbcd9a68a44f6921325))
- removed some unneeded comments ([0cc6e03](https://github.com/ulixee/ulixee/commit/0cc6e0388b21788d54b35318ff79f00d315820ca))
- removed usage of commons util createPromise from chromealive extension ([6f4155a](https://github.com/ulixee/ulixee/commit/6f4155aa5745fdde82e1b0c069282bbb676e6fa2))
- renamed chromealive-extension Index.vue to index.vue ([ba85973](https://github.com/ulixee/ulixee/commit/ba8597330ca74bf9ba6d0d496dc26038b0fb04c0))
- renamed getMetaObjects to getRawDetails ([4a7e025](https://github.com/ulixee/ulixee/commit/4a7e02532965cadf6bbe8676a5167e39d3df52cb))
- second arg for browserEmitter event should be string ([a075571](https://github.com/ulixee/ulixee/commit/a0755711cdf53ff1a912f0bab051d6c0ba19edfd))
- sourceLoader test broken ([f68fba8](https://github.com/ulixee/ulixee/commit/f68fba842321b675454fb28300c618b0d394e788))
- **stacks:** don't undo stack traces ([5e72271](https://github.com/ulixee/ulixee/commit/5e7227102d6fe3f58807db1b04de3531d891bead))
- tests ([b2cc8a7](https://github.com/ulixee/ulixee/commit/b2cc8a726b05ff6e5886b03edd150060145ee05d))
- **timeline:** differentiate nav start vs receive ([dc3fd12](https://github.com/ulixee/ulixee/commit/dc3fd12b5cef8e06ed1f234585fe17c2f1718def))
- **timetravel:** catch canceled queued loads ([95d27ea](https://github.com/ulixee/ulixee/commit/95d27ea13c8735096726df21433fd2ac02826b49))
- update dependencies, hero/databox pointer ([b1e0e65](https://github.com/ulixee/ulixee/commit/b1e0e65ef7ec0e3d79195884c64af22ac3bab1a8))
- update timeline recorder ([623d6c9](https://github.com/ulixee/ulixee/commit/623d6c9f3bdcafb52754acc10a368680f7c1ac1c))
- updated packages to get latest electron working + small ui fixes to toolbar ([4ab5857](https://github.com/ulixee/ulixee/commit/4ab5857ee0e7ac498249665be4cbbea97f34cd91))
- upgraded sass-loader ([e8be904](https://github.com/ulixee/ulixee/commit/e8be9046fd836eede5c85f4d56e78ceaf242f2ed))
- workspaces wildcards need two asterisks instead of one ([cd7e2a9](https://github.com/ulixee/ulixee/commit/cd7e2a946c757738a19a9c72f5b938185834f939))

### Features

- add logs to boss ([af1905f](https://github.com/ulixee/ulixee/commit/af1905f408df9e1d071ec3cd9e360f1867e413a5))
- added to databox + renamed interact fn to run ([687317e](https://github.com/ulixee/ulixee/commit/687317e2dfb662be1c52c28c7efa7d3d074c992e))
- added a working databox ([53628c5](https://github.com/ulixee/ulixee/commit/53628c56103c59c962d9d3a76eb51c682e06244b))
- added basic UI structure and messaging architecture for selector-generator ([00bfab0](https://github.com/ulixee/ulixee/commit/00bfab0574086be3b090ddc20266ba9bcf7460f4))
- added chromealive-ui structures for screens and menus ([19ee561](https://github.com/ulixee/ulixee/commit/19ee561092689628831a49ac583c3c40e9e57076))
- added elem. support in databox ([3950434](https://github.com/ulixee/ulixee/commit/39504349d1c80d9b90ebce3dad36a9b581cd1948))
- added files ([f2b5509](https://github.com/ulixee/ulixee/commit/f2b55099ab3388d58be9741350b75955d4125d3a))
- added plugins option on Databox ([58bbcb2](https://github.com/ulixee/ulixee/commit/58bbcb23a2feddb818b4c426e30cb83600d94d05))
- added submodules ([6f97e86](https://github.com/ulixee/ulixee/commit/6f97e86bd876bddc9fe8cab0a3ebdf08913c8dae))
- added typed input/output to databox + other improvements ([1cbbe50](https://github.com/ulixee/ulixee/commit/1cbbe507348e9fec33d86429b3e1f3d9a16502a0))
- added versionCheck.ts to keep @ulixee/\* version in sync ([83a5022](https://github.com/ulixee/ulixee/commit/83a50221006d24bd10d5c20d47c48a30cc8d2258))
- **apps:** add version to boot ([43cc0db](https://github.com/ulixee/ulixee/commit/43cc0db17fe1ba955ef51cdda5dcc30d0bcfc9de))
- **apps:** automatic server address ([6d60f5e](https://github.com/ulixee/ulixee/commit/6d60f5e4806384cc5255c42439d3946cc1910d6d))
- **apps:** make chromealive “opt-in” ([0419c2b](https://github.com/ulixee/ulixee/commit/0419c2bc2db50856e727bab08b86d33eea5d692f))
- bring submodules in line ([387f342](https://github.com/ulixee/ulixee/commit/387f342bd990609033989143b8dde58ccfa30f25))
- changed chromealive ui bar to yello ([a3ed3cb](https://github.com/ulixee/ulixee/commit/a3ed3cbbdd839e9b10dc4e1c77467ae52a4c0232))
- chromealive always has a gray dot and toolbar tabs open their screens ([03c5c33](https://github.com/ulixee/ulixee/commit/03c5c33215e7675ae08dc6f3c02cb5dc06129a76))
- **chromealive:** about page for circuit ([1a96d37](https://github.com/ulixee/ulixee/commit/1a96d37df8a5a3cfdf15375e381b4b7616dd96d7))
- **chromealive:** add a mode ([52b70f7](https://github.com/ulixee/ulixee/commit/52b70f7bbd94f1045a89a13d8933af15dcbbeaf2))
- **chromealive:** add databox panel + loading ([d7c7813](https://github.com/ulixee/ulixee/commit/d7c7813ca1a22eef6d7b4b336174693b9fa15f13))
- **chromealive:** add pagestate to ui ([d3b428d](https://github.com/ulixee/ulixee/commit/d3b428d5d1cf1711e396d9e9a1b34ffa537292dc))
- **chromealive:** add step + runs to replay ([3f3247a](https://github.com/ulixee/ulixee/commit/3f3247aab78ed8a8a97f32c21f8debe3dc661841))
- **chromealive:** autoupdate ([b95f86d](https://github.com/ulixee/ulixee/commit/b95f86d1592dac0d73f38cd9032e9c845d79b255))
- **chromealive:** collapse hidden nodes ([8b9112c](https://github.com/ulixee/ulixee/commit/8b9112c428481bfccebc7c986ff6e9cd94fe972a))
- **chromealive:** connect to databox ([83555ec](https://github.com/ulixee/ulixee/commit/83555ece9a57f53630ca244f6e323486241fdd4e))
- **chromealive:** custom message for kept-alive ([fcec203](https://github.com/ulixee/ulixee/commit/fcec203663287245a12c9caf94be1e907b5804fa))
- **chromealive:** elements panel ([503e4d3](https://github.com/ulixee/ulixee/commit/503e4d3e4047cea5a07feda5c56e545719d101ad))
- **chromealive:** finder mode ([d0b1416](https://github.com/ulixee/ulixee/commit/d0b14160c2f38805d290064717c825cdc4c51a18))
- **chromealive:** finder styling, resource search ([6b7f252](https://github.com/ulixee/ulixee/commit/6b7f252e939f53e049a2812cb3bfe050122f652a))
- **chromealive:** fix focus of databox panel ([e67ddcf](https://github.com/ulixee/ulixee/commit/e67ddcf1fa2ad041fcd03cf4206d4c1660f1fdb3))
- **chromealive:** fix mouse events (mac only) ([d09df54](https://github.com/ulixee/ulixee/commit/d09df54a9d7c667ee2901dbb93cc0526ac2a10eb))
- **chromealive:** fix mouse events (mac only) ([26c1029](https://github.com/ulixee/ulixee/commit/26c102965cb1e4f029914ea178ac49f33f46d031))
- **chromealive:** hero script ([c3d093c](https://github.com/ulixee/ulixee/commit/c3d093cd6cb50919f4fe4a882e37b0784b418cf1))
- **chromealive:** input and output screens ([27eabf8](https://github.com/ulixee/ulixee/commit/27eabf82cfe7690be1d4ec73aa6a03c04913e164))
- **chromealive:** menubar styling ([c9db80f](https://github.com/ulixee/ulixee/commit/c9db80f82d6f08bd1bd3e902ef99b98f6954db6a))
- **chromealive:** move timeline over chrome ([f7992ad](https://github.com/ulixee/ulixee/commit/f7992ade9004afc6a36af914d7851154869152b7))
- **chromealive:** nav using hero script lines ([82f9f1b](https://github.com/ulixee/ulixee/commit/82f9f1bde103192b945d116790579d0ecf59b198))
- **chromealive:** new menubar + features ([0131927](https://github.com/ulixee/ulixee/commit/01319278c4a1adf2cc022c6c86b05712fa0f55bc))
- **chromealive:** page state apis ([7f73b0a](https://github.com/ulixee/ulixee/commit/7f73b0ad7bf888241437569051d3f7dbb2f53762))
- **chromealive:** pause/resume script ([2d99aa1](https://github.com/ulixee/ulixee/commit/2d99aa12bb68d7cfd5e1949f696afc5805fb9b4b))
- **chromealive:** separate unassigned worlds ([cfec823](https://github.com/ulixee/ulixee/commit/cfec823a8a5292009ccfe9009ad108905f59dec7))
- **chromealive:** subscribe to commands pause ([38591da](https://github.com/ulixee/ulixee/commit/38591dac69815ee91ee556a79de089ac269811e4))
- **chromealive:** url navigation bar ([0748a4c](https://github.com/ulixee/ulixee/commit/0748a4cc640937863acb00522eadd146bc220095))
- collected snippets ([7ecd540](https://github.com/ulixee/ulixee/commit/7ecd5405b7aec12815d0efc4258a0aa3efdac48a))
- **commons:** source map + code loading support ([ec0bb70](https://github.com/ulixee/ulixee/commit/ec0bb70ff0656535cf4be37db9615d2987909e69))
- **commons:** ulixee config ([b02d3ce](https://github.com/ulixee/ulixee/commit/b02d3ce4dfd04f12f7686711a9ab95c08f02e96b))
- convert pagestate to domstate ([8c7facd](https://github.com/ulixee/ulixee/commit/8c7facdd87fc8f294ac6c16256df32ed3602c736))
- convert secret-agent to browser only ([968208f](https://github.com/ulixee/ulixee/commit/968208f0690900dfc641ad4c8fd47b51eef6fa11))
- coreServerAddress is injected into extension by way of json file ([eed89f4](https://github.com/ulixee/ulixee/commit/eed89f479374072309af396cc44e916729bf6bbb))
- databox and herobox and merged... working with errors ([2d72035](https://github.com/ulixee/ulixee/commit/2d720353f4c442ac03a41b290c1e25bb501cf94a))
- **databox:** update collected resource structure ([54ee183](https://github.com/ulixee/ulixee/commit/54ee183ed8053b486a5a046a7452847985b3c151))
- **docs:** databox + server docs ([c81c62f](https://github.com/ulixee/ulixee/commit/c81c62f0eac976dbfe293ff13156370c59c9731f))
- download chrome on first run ([e083347](https://github.com/ulixee/ulixee/commit/e0833476911440d4bb4f0bedbde79ceb67e7ac49))
- **finder:** added infrastructure needed for the chromealive finder window ([068fae6](https://github.com/ulixee/ulixee/commit/068fae6f7eda4ebc936cd95caa28e33a29a46e39))
- first stage of the new toolbar/timeline ([e69f133](https://github.com/ulixee/ulixee/commit/e69f13360349a06daa825ba97671911b98eb2cb0))
- get collected asset names ([559c4cb](https://github.com/ulixee/ulixee/commit/559c4cb5fb7ae7c349da0c95ba005b8fb551558e))
- good looking but non-working toolbar ([e1c0050](https://github.com/ulixee/ulixee/commit/e1c0050c2d227db62db271d462640783e225dd9d))
- **herobox:** add herobox ([785f801](https://github.com/ulixee/ulixee/commit/785f80128370c7dd40711ab58c1366919af3efb6))
- **herobox:** collected resources ([f2d5bdd](https://github.com/ulixee/ulixee/commit/f2d5bddbaa8f9cb0a374483ba4f8034d0ad30aa6))
- **herobox:** convert collect to by async get ([8e52752](https://github.com/ulixee/ulixee/commit/8e52752c07156de91bf0fd9c676da55b135c9c88))
- **herobox:** synchronous fragments ([2e46083](https://github.com/ulixee/ulixee/commit/2e46083432fd60dfef5f3c5b93e1ff1380329f39))
- **hero:** update hero version ([0bd429a](https://github.com/ulixee/ulixee/commit/0bd429af703611c09c1c3648f6340169446b7006))
- make nseventmonitor optional ([9512870](https://github.com/ulixee/ulixee/commit/95128702719117b57e7c8ec59a6aec0d5b3d8c27))
- merge devtools submodules ([a27ea33](https://github.com/ulixee/ulixee/commit/a27ea339784f0a5a969517571f0d6e21d5dfb52f))
- move chrome into browsers dir ([b43fe8f](https://github.com/ulixee/ulixee/commit/b43fe8ff8e6e615e17cd71ae1da860085363fca7))
- output panel ([3530228](https://github.com/ulixee/ulixee/commit/3530228385db555affb340ebab04145124e450ee))
- **pagestate:** align timeline hovers to ticks ([b340db5](https://github.com/ulixee/ulixee/commit/b340db56bdd2db66525ae026310083b2b8dfa5a4))
- **pagestate:** align timeline hovers to ticks ([a87ae68](https://github.com/ulixee/ulixee/commit/a87ae68e77b0a733a000d7b04c5d592572fbe828))
- **pagestate:** force restart session on updated ([fd74e8f](https://github.com/ulixee/ulixee/commit/fd74e8fe23d488c827870a847b0a8bfc9c8ebe8d))
- **pagestate:** give a name to pagestates ([27fd67d](https://github.com/ulixee/ulixee/commit/27fd67da8b30d712873940824f2c955c3c552099))
- **pagestate:** storage tracking ([1abaf29](https://github.com/ulixee/ulixee/commit/1abaf29e8d88fe37dd956b2c0b1b2b858bb97368))
- remove replay from hero ([196be30](https://github.com/ulixee/ulixee/commit/196be30e4d816e3255450b1e8524fe649cbe6363))
- removed databox-core/connections + added new interact/extract structure ([8c18a76](https://github.com/ulixee/ulixee/commit/8c18a76b45284a57b7c80560fcc781317359e38b))
- removed submodule databox ([4b7e768](https://github.com/ulixee/ulixee/commit/4b7e768011a0e0481b67e13d3f11dd9db5d94e2a))
- rename boss to apps and added admin submodules ([3296ab9](https://github.com/ulixee/ulixee/commit/3296ab9f1ac22d7a14abc403516feb8a466bd1af))
- **replay:** add replay dragging to ca! ([ed6023c](https://github.com/ulixee/ulixee/commit/ed6023c0c860fc7082ae69b1577f528fa6da606c))
- rough working version of selector generator ([b257617](https://github.com/ulixee/ulixee/commit/b2576177b4fb2a1ee8e4b18219487978ff201b9f))
- **screen-output:** allow re-running extract ([06ed565](https://github.com/ulixee/ulixee/commit/06ed565e7ff8b01b150a48305b566251c66e7e7b))
- **server:** automatically track server host ([aa42f4d](https://github.com/ulixee/ulixee/commit/aa42f4df27414928f04c4bd6d074bb17fd23213c))
- skip ChromeAlive if production mode is on ([876d10f](https://github.com/ulixee/ulixee/commit/876d10fc9391a0c0d9bd42f75c04558593c5102b))
- **toolbar:** fixed styling of input tab ([f14b046](https://github.com/ulixee/ulixee/commit/f14b046214b0ddc0807dc3fc5148daa2f401dce8))
- **toolbar:** removed AddressField in favor of a more robust Player ([b6d3ea1](https://github.com/ulixee/ulixee/commit/b6d3ea191dac92895c72acd98228f90e42599d85))
- **toolbar:** timetravel icon now toggles when user enters timetravel mode ([8f5b6ea](https://github.com/ulixee/ulixee/commit/8f5b6ea4d95db611c271adc504d012ef146327d9))
- unify plugin structure ([ac6c30a](https://github.com/ulixee/ulixee/commit/ac6c30afd518c67b3230ff2109c90d381e21aaec))
- unify typescript for ulixee project ([697dc2f](https://github.com/ulixee/ulixee/commit/697dc2fa5e4cc9a3064f7bb17253d7ec88f1793c))
- update deps to chromealive ([dcf9aaa](https://github.com/ulixee/ulixee/commit/dcf9aaa653fec6aadc5878dd7a8d3565e151dc26))
- update testing ([aaf339c](https://github.com/ulixee/ulixee/commit/aaf339c2aa810c8303c948c872a03486e8f76396))
- updated examples to use new State syntax + renamed Fragments to Elements ([69ac1ed](https://github.com/ulixee/ulixee/commit/69ac1eded0d40525c2d21603ae39807ac1ed6908))
- updated hero submodule to use new @ulixee/hero ([32edb90](https://github.com/ulixee/ulixee/commit/32edb90f0abeef99170817aa676f141a26f986ee))
- **website:** move docs into hero ([864281a](https://github.com/ulixee/ulixee/commit/864281ab7025d3c5ab287daf84eb5954129f9b72))
