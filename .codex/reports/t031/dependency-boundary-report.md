# T031 dependency and boundary report

Date: 2026-07-24

- `rqb-v1` resolved to the published `@vojtechportes/react-query-builder` package at exactly version 1.33.1.
- `rqb-v2` resolved by real path to the local repository package.
- Package-binding typechecks, recipe snippet checks, client and SSR smoke builds, and 13 tests per target passed.
- The v1 client graph contained 28 owned package modules and zero opposite-version modules.
- The v2 client graph contained 450 owned package modules and zero opposite-version modules.
- Package surface verification covered the root export, parsers, formatters, locales, adapters, and Monaco entry in client, SSR, and runtime smoke paths.
- Versioned import-boundary tests passed as part of both full suites. No v1-to-v2, v2-to-v1, shared-to-version-owned, shared-to-package, or transitional cross-package violations remained.
- Pages, navigation, search, routes, and SEO remain independently owned under `src/v1` and `src/v2`. Shared code remains limited to content-agnostic mechanics and shell primitives.
