# T030 - Assemble versioned artifacts and update deployment redirects

- [x] Validate T024/T025/T028/T029 boundaries and deployment-host decisions.
- [x] Separate deployment router basename from version-specific Vite asset base.
- [x] Add content-agnostic v1/v2 artifact assembly.
- [x] Generate root, unversioned, and version-local redirect artifacts.
- [x] Add root robots/sitemap policy and GitHub Pages fallback artifacts.
- [x] Generate and verify FTP rewrite configuration.
- [x] Update FTP and GitHub Pages workflows to deploy both versions.
- [x] Add final artifact, redirect, asset-isolation, and crawl verification.
- [x] Verify root and repository basenames.
- [x] Run typechecks, builds, tests, lint, and Prettier.
- [x] Complete the required review-agent pass and resolve findings.
- [x] Mark T030 done only after verification and review.

## Decisions

- FTP uses generated Apache rules for real 308 redirects.
- GitHub Pages uses noindex HTML redirect documents because it cannot configure 308 responses. JavaScript preserves query strings and hashes; the no-JavaScript meta-refresh fallback can only reach the canonical destination because static HTML cannot inspect the request suffix.
- `package-module-graph.json` remains staging-only verification evidence.
- Root `sitemap.xml` references the independently generated v1 and v2 sitemaps.
- Root `robots.txt` allows both version trees and references the root sitemap index.
- The assembled artifact includes `.htaccess`; GitHub Pages safely ignores it.

## Verification

- The complete root deployment build passed 303 v1 tests and 303 v2 tests, both typechecks, both client and SSR builds, both SEO validators, stage checks, assembly, and final verification.
- The GitHub Pages repository-base build passed both client and SSR builds, both SEO validators, stage checks, assembly, and final verification.
- Final verification covered 110 crawlable canonical documents, version-owned asset URLs, staging-file exclusion, root policies, and 79 redirect documents.
- Deployment utility tests, modified-code ESLint, Prettier, and `git diff --check` passed.
- The review agent's repository-base robots finding was fixed and re-reviewed. Its no-JavaScript Pages suffix finding was recorded as a host limitation; no actionable findings remain.
