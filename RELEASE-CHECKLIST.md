This is a release guide for deploying all the parts of Ulixee and Unblocked.

We should eventually automate this to test using the "published" versions of packages. Currently, we install latest main tip in all CI, which only tests tip of repo, not the published packages.

### Bump version process

- create a branch? (only do this if you're smart)
- `npx ulx-repo-version-bump prerelease` (patch prerelease version - replace with bump if not in a prerelease)
- `git push origin main --tags` (make sure to push any tags. tags trigger some release Assets to be built)
- github.com - ** during CI setup, create a DRAFT release for the tag with release notes. Publish once assets are created.
- `yarn build:dist` (build a distro)
- `cd build-dist && lerna publish from-package` (publish built files - you might test in here)
- from @ulixee/ulixee: `npx ulx-repo-version-check fix` (update dependencies)

## Bump versions in this order
1. @ulixee/hero
2. @ulixee/ulixee
   - Release Assets: Requires a draft release pre-created (ChromeAlive!, Desktop)
   - Publish website updates
