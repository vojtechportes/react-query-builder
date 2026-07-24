# T031 route and deployment report

Date: 2026-07-24

- V1 owns 55 canonical routes and 8 version-local legacy redirects.
- V2 owns 55 canonical routes and 8 version-local legacy redirects.
- The assembled artifact contains 55 canonical documents and 8 version-local redirect documents under each version prefix.
- Final artifact verification passed all 110 canonical documents and 79 combined root, unversioned-to-v2, and version-local redirect mappings.
- Root-base output uses `/v1/*` and `/v2/*` asset and route prefixes.
- Repository-base output uses `/react-query-builder/v1/*` and `/react-query-builder/v2/*` prefixes.
- Known unversioned routes resolve to the same logical v2 path. Version-local legacy routes remain within their selected version.
- FTP output includes generated 308 rewrite rules. GitHub Pages output uses noindex redirect documents whose JavaScript path preserves query strings and hashes.
- GitHub Pages cannot preserve a query string or hash in the no-JavaScript meta-refresh fallback. This accepted host limitation is unchanged from T030.
- Route-manifest, application-route, navigation, search-navigation, version-switcher, fallback, hydration, and semantic interaction tests passed in both 303-test suites.
