# T028 - Create the independent v1 SEO/SSG pipeline

- [x] Define v1 SEO types, config, indexing policy, and canonical registry.
- [x] Derive v1 public canonicals and breadcrumbs from the v1 route manifest.
- [x] Remove legacy SEO imports from v1 pages.
- [x] Add granular v1 metadata and structured-data utilities.
- [x] Add the v1-owned SSG build and sitemap/robots generation pipeline.
- [x] Add the v1-owned SEO/SSG validator and ownership checks.
- [x] Add registry, DOM-free SSR, raw HTML, structured-data, styled SSR, and hydration tests.
- [x] Wire dedicated v1 package scripts without changing v2 or legacy build ownership.
- [x] Run v1 typecheck, tests, SEO validation, full build, and stage verification.
- [x] Run Prettier on every modified code file.
- [x] Complete the required review agent and resolve all findings.
- [x] Mark T028 done only after verification and review.

## Indexing policy

- Frozen v1 pages remain indexable and use self-referencing `/v1` canonical URLs.
- The v1 sitemap contains only routes owned by the v1 route manifest.
- The v1 robots output allows `/v1` pages and points only to the v1 sitemap.
- Structured data identifies the documentation as v1 for package version 1.33.1.
- v1 metadata, structured data, sitemap, and robots output never claim v2 or unversioned content.
- T030 owns final artifact assembly and the root deployment robots policy.

## Verification

- `npm run build:v1 --workspace example` passed the recipe validation, v1 typecheck, all 298 v1 tests, client build, DOM-free SSR build, SSG build, independent SEO validation, and stage verification.
- The focused SEO, SSR, and hydration suites passed 71 tests across five files.
- Modified-code ESLint, Prettier, and diff checks passed.
- The review agent found no issues. Residual deployment-base combinations remain owned by T030.
