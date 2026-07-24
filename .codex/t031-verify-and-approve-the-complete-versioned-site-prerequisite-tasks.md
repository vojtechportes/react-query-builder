# T031 - Verify and approve the complete versioned-site prerequisite

- [x] Validate T031 scope and constraints with the planning agent.
- [x] Run the library and exact v1/local v2 package-isolation matrix.
- [x] Run page, navigation, search, route, switcher, hydration, accessibility, and import-boundary suites for both versions.
- [x] Run independent v1/v2 SEO and DOM-free SSG pipelines.
- [x] Run production-domain and GitHub Pages deployment matrices.
- [x] Verify unversioned-to-v2, version-local redirect, canonical-route, and fallback behavior.
- [x] Verify version-owned package graphs and CSS/JavaScript asset isolation.
- [x] Fix cross-platform FTP configuration verification.
- [x] Fix deployment-environment isolation in versioned configuration and SEO tests.
- [x] Archive dual-target build, route, dependency, and asset reports.
- [x] Run Prettier and final code-quality checks.
- [x] Complete the required review-agent pass and resolve findings.
- [x] Mark T031 done only after verification and review.

## Approval

- The independent review agent found no issues and confirmed T031 is safe to mark done.
- Maintainer approval is recorded by the request to complete T031 and mark it done after verification and review.

## Approval scope

- `/v1/*` remains the frozen v1 site and uses the published 1.33.1 package.
- `/v2/*` remains the independent v2 site and uses the local package.
- Known unversioned paths redirect to the same logical v2 route.
- Version-owned pages, navigation, search, routes, SEO, package modules, and asset URLs remain isolated.
- Shared modules remain content-agnostic and do not own versioned site content.

## Archived reports

- `reports/t031/dual-target-build-report.md`
- `reports/t031/route-deployment-report.md`
- `reports/t031/dependency-boundary-report.md`
- `reports/t031/asset-ownership-report.md`

## Residual limitations

- GitHub Pages cannot preserve query strings or hashes in a no-JavaScript meta-refresh redirect. The JavaScript redirect preserves both, and all redirect documents remain noindex. This accepted T030 host limitation is unchanged.
- Automated accessibility coverage validates semantics, keyboard interaction, focus behavior, desktop/mobile switcher rendering, and hydration. A separate browser or axe audit was not introduced by this verification-only gate.
