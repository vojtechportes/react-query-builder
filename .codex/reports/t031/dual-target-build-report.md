# T031 dual-target build report

Date: 2026-07-24

## Production-domain target

- Environment: `VITE_SITE_URL=https://www.react-query-builder.com/`, root deployment base.
- `npm run build:deploy --workspace example` passed after the T031 portability fixes.
- V1 recipe validation, typecheck, 51 test files with 303 tests, client build, DOM-free SSR build, SEO generation, 55-route SEO validation, and stage verification passed.
- V2 recipe validation, typecheck, 51 test files with 303 tests, client build, DOM-free SSR build, SEO generation, 55-route SEO validation, and stage verification passed.
- Assembly and final verification passed for 110 canonical documents and 79 redirect mappings.

## GitHub Pages target

- Environment: `VITE_BASE_PATH=/react-query-builder/` and `VITE_SITE_URL=https://vojtechportes.github.io/react-query-builder/`.
- `npm run build:deploy --workspace example` passed after the T031 environment-isolation fix.
- Both 303-test version suites, typechecks, client builds, DOM-free SSR builds, 55-route SEO validators, stage checks, assembly, and final verification passed.
- Final verification confirmed the `/react-query-builder` base and 79 redirect mappings.

## Supporting checks

- The root library build passed.
- Versioned deployment utility tests passed.
- Package-binding verification passed 13 v1 and 13 v2 smoke tests.
