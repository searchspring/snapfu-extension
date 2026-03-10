# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.7.0](https://github.com/searchspring/snapfu-extension/compare/v1.6.0...v1.7.0) (2026-03-10)


### Features

* **data:** adding support for displaying the orgainization - searchspring or athos ([30cb908](https://github.com/searchspring/snapfu-extension/commit/30cb9081d2f8a180d5023c52d5776f724ad69ad7))
* **settings:** adding "auto-enable" setting and adjusting some styling - format of all files ([2daabe6](https://github.com/searchspring/snapfu-extension/commit/2daabe6d9048e5234a42d8b3e6cae45f431d7fc6))


### Bug Fixes

* adding guard around checking hostname to ensure only real sites are stored ([b986a67](https://github.com/searchspring/snapfu-extension/commit/b986a6700d229b5053699c8fb32a6fd9a0b9d9e9))
* **context:** restoring script ID for getContext ([09f4b7b](https://github.com/searchspring/snapfu-extension/commit/09f4b7b41608d8fee87eb9b220e24f86680e0378))
* **hostname:** fixing a bug that occurred when switching hostnames on the same tab ([6c81ed1](https://github.com/searchspring/snapfu-extension/commit/6c81ed19f4ac3339aa55f94fc8c0b34b6dd31892))

## [1.6.0](https://github.com/searchspring/snapfu-extension/compare/v1.5.0...v1.6.0) (2026-01-21)


### Features

* **extension:** athos rebuild with improved capabilities (per tab and hostname configuration) ([f482d59](https://github.com/searchspring/snapfu-extension/commit/f482d593d0c6fbf7e15f6300af3e230dd46c6752))
* **extension:** athosified further and made minor improvements to look and feel ([adde295](https://github.com/searchspring/snapfu-extension/commit/adde295ea651c7439fb23a9c577f297f032b4c66))
* **extension:** switching to using individual tab iterception and enabled state ([bb34db9](https://github.com/searchspring/snapfu-extension/commit/bb34db9028087c38fe0c1b11873f56655c3231f1))


### Bug Fixes

* **extension:** added meta tag CSP support and did some small styling adjustments ([e631338](https://github.com/searchspring/snapfu-extension/commit/e6313386ce2a6f9b487b8b5ee8721713192278e1))
* **extension:** ensure that we are grabbing the root bundle script not a chunk file ([758c564](https://github.com/searchspring/snapfu-extension/commit/758c56485e03c73215b34cead43e73228e273fce))
* **extension:** prevent errors regarding attempts to access tabs that no longer exist ([3fcfb43](https://github.com/searchspring/snapfu-extension/commit/3fcfb43b04d4a65a9772b945b806ea76bda53244))

## [1.5.0](https://github.com/searchspring/snapfu-extension/compare/v1.4.10...v1.5.0) (2025-11-06)


### Features

* **csp:** adding ability to bypass CSP when using extension ([1216837](https://github.com/searchspring/snapfu-extension/commit/1216837f1d8c87270ea48ce45d420d19da040092))


### Bug Fixes

* **extension:** adding some error supression by catching errors caused by context invalidation ([ddac4c8](https://github.com/searchspring/snapfu-extension/commit/ddac4c8d2caa4b09a6e1fc36948a4ec5ed35f71b))
* **extension:** changing logic so that on toggle the loading state changes and clears details ([a6cc93b](https://github.com/searchspring/snapfu-extension/commit/a6cc93b0178bf38a9504c9bd7162566b05095993))
* **extension:** fixing initial loading issue that prevented intercept from being added ([6ad9812](https://github.com/searchspring/snapfu-extension/commit/6ad98122506ffc80c1df998283b2b3b62548ce6a))
* **extension:** improving loading by adding animation ([7e75841](https://github.com/searchspring/snapfu-extension/commit/7e75841a4c58ca84bf52ff3d7f913536f0cb5112))


### Reverts

* Revert "build(build): updating the lock file" ([b1fb7f1](https://github.com/searchspring/snapfu-extension/commit/b1fb7f175db7197ba1a81aa19ca31775aa400993))

### [1.4.10](https://github.com/searchspring/snapfu-extension/compare/v1.4.9...v1.4.10) (2025-08-18)

### [1.4.9](https://github.com/searchspring/snapfu-extension/compare/v1.4.8...v1.4.9) (2025-08-18)

### [1.4.8](https://github.com/searchspring/snapfu-extension/compare/v1.4.7...v1.4.8) (2025-08-18)

### [1.4.7](https://github.com/searchspring/snapfu-extension/compare/v1.4.6...v1.4.7) (2025-08-18)

### [1.4.6](https://github.com/searchspring/snapfu-extension/compare/v1.4.5...v1.4.6) (2025-08-18)

### [1.4.5](https://github.com/searchspring/snapfu-extension/compare/v1.4.4...v1.4.5) (2025-08-18)

### [1.4.4](https://github.com/searchspring/snapfu-extension/compare/v1.4.3...v1.4.4) (2025-08-18)

### [1.4.3](https://github.com/searchspring/snapfu-extension/compare/v1.4.2...v1.4.3) (2025-08-18)

### [1.4.2](https://github.com/searchspring/snapfu-extension/compare/v1.4.1...v1.4.2) (2025-08-18)

### [1.4.1](https://github.com/searchspring/snapfu-extension/compare/v1.4.0...v1.4.1) (2025-08-18)

## [1.4.0](https://github.com/searchspring/snapfu-extension/compare/v1.3.4...v1.4.0) (2025-08-18)


### Features

* **context/siteid:** adding siteId context when injecting script to ensure siteId carries over ([84643d7](https://github.com/searchspring/snapfu-extension/commit/84643d71149dd36af26053d76bd71818dda4e3ef))
* **settings/forceinject:** adding new setting to allow for "force inject" functionality ([abcc1ea](https://github.com/searchspring/snapfu-extension/commit/abcc1ea998609454e5958e8c37e6f929f6fedc4d))


### Bug Fixes

* **context/siteid:** removing line from co-development ([b50aaae](https://github.com/searchspring/snapfu-extension/commit/b50aaae762981b5edfb94fd4cc3eb0654ce87cdd))

### [1.3.4](https://github.com/searchspring/snapfu-extension/compare/v1.3.3...v1.3.4) (2025-02-04)

### [1.3.3](https://github.com/searchspring/snapfu-extension/compare/v1.3.2...v1.3.3) (2023-03-01)

### [1.3.2](https://github.com/searchspring/snapfu-extension/compare/v1.3.1...v1.3.2) (2023-01-20)

### [1.3.1](https://github.com/searchspring/snapfu-extension/compare/v1.3.0...v1.3.1) (2022-11-14)


### Bug Fixes

* add bundle upon iframe page navigation ([2ef4904](https://github.com/searchspring/snapfu-extension/commit/2ef4904c96d50cf1ba6ee82b0fc303097372cb93))
* **scraper.ts:** fix for google docs ([379a300](https://github.com/searchspring/snapfu-extension/commit/379a30027f00d5623b7c3b25efa81e6b6706560c))

## [1.3.0](https://github.com/searchspring/snapfu-extension/compare/v1.2.3...v1.3.0) (2022-10-31)


### Features

* add script attributes ([f465556](https://github.com/searchspring/snapfu-extension/commit/f4655563f098b481905d0a3c4ae81f8b64fd5595))


### Bug Fixes

* content-security-policy header on document to allow bundle to load ([2c3616d](https://github.com/searchspring/snapfu-extension/commit/2c3616df689a48239c7e23b858c0942e02a4a83a))
* **inject:** adding support for injecting and scraping iframes (for Bigcommerce) ([7edfa30](https://github.com/searchspring/snapfu-extension/commit/7edfa306989a019513993a363750b7df58b31b17))

### [1.2.3](https://github.com/searchspring/snapfu-extension/compare/v1.2.2...v1.2.3) (2022-08-30)

### [1.2.2](https://github.com/searchspring/snapfu-extension/compare/v1.2.1...v1.2.2) (2022-08-30)


### Bug Fixes

* adding http support; manifest version->package.json; readme adjustments ([aaef13a](https://github.com/searchspring/snapfu-extension/commit/aaef13a0796e3a9429ed244a8c25b56387e1618a))
* **readme:** fixing URL for image in readme ([738928c](https://github.com/searchspring/snapfu-extension/commit/738928cf46e9d458a99263a601778da57b41b286))

### 1.2.1 (2022-08-29)
