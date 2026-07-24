# T029 - Create the independent v2 SEO/SSG pipeline

- [x] Define v2 SEO types, config, indexing policy, and canonical registry.
- [x] Derive v2 public canonicals and breadcrumbs from the v2 route manifest.
- [x] Remove legacy SEO imports from v2 pages.
- [x] Add granular v2 metadata and structured-data utilities.
- [x] Add the v2-owned SSG build and sitemap/robots generation pipeline.
- [x] Add the v2-owned SEO/SSG validator and ownership checks.
- [x] Add registry, DOM-free SSR, raw HTML, structured-data, styled SSR, and hydration tests.
- [x] Wire dedicated v2 package scripts without changing v1 ownership.
- [x] Run v2 typecheck, tests, SEO validation, full build, and stage verification.
- [x] Run Prettier on every modified code file.
- [x] Complete the required review agent and resolve all findings.
- [x] Mark T029 done only after verification and review.

## Indexing policy

- V2 pages are indexable and use self-referencing `/v2` canonical URLs.
- The v2 sitemap contains only routes owned by the v2 route manifest.
- The v2 robots output allows `/v2` pages and points only to the v2 sitemap.
- Structured data identifies the documentation as v2 and uses the current package version.
- V2 metadata, structured data, sitemap, and robots output never claim v1 or unversioned content.
- T030 owns final artifact assembly and the root deployment robots policy.

## Verification

- `npm run build:v2 --workspace example` passed recipe validation, v2 typecheck, all 303 v2 tests, client build, DOM-free SSR build, SSG generation, independent SEO validation for 55 canonical routes, and stage verification.
- The focused SEO, SSR, structured-data, and hydration suites passed 71 tests across five files.
- Representative raw HTML, structured data, sitemap, and robots output passed manual inspection.
- Modified-code ESLint, Prettier, diff, and v1 ownership checks passed.
- The required review agent found no implementation issues; a reported unrelated timeout passed on the final 303-test rerun.
