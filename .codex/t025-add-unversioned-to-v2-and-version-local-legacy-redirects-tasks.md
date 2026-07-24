# T025 - Add unversioned-to-v2 and version-local legacy redirects

- [x] Define the redirect and unknown-route behavior at the T025/T030 boundary.
- [x] Add content-agnostic redirect resolution and static document utilities.
- [x] Add independently owned v1 and v2 redirect manifests.
- [x] Preserve search/hash for version-local client redirects and fallbacks.
- [x] Cover root and repository basenames with a full status/location matrix.
- [x] Run typechecks, focused tests, import-boundary tests, and versioned builds.
- [x] Run Prettier on every modified code file.
- [x] Complete the required code-review-agent pass and resolve findings.
- [x] Mark T025 done in `.codex/TASKS.md`.

## Decisions

- Known redirects use permanent HTTP status `308` in the deployment-facing contract.
- Unversioned canonical routes redirect to the same logical v2 route.
- Unversioned legacy routes redirect directly to their v2 canonical destination in one hop.
- Versioned legacy routes stay within their current version.
- Redirects preserve query strings and hashes byte-for-byte.
- Unknown generated/static routes return `404` without a `Location`.
- Unknown client routes fall back to the current version Home while preserving query/hash.
- T030 owns final artifact assembly, hosting configuration, workflows, and deployment documents.

## Verification

- Both v1 and v2 typechecks passed.
- T025-focused v1 and v2 redirect suites passed.
- The full v2 suite passed with 273 tests.
- The full v1 suite passed 272 of 273 tests; the unrelated Demo playground test hit its existing five-second timeout under full-suite load and passed all 12 tests when run in isolation.
- Modified-file ESLint and Prettier checks passed.
- v1 and v2 client and SSR production builds passed.
- The code review agent found no implementation issues; its branch-name finding was resolved by using the full title-derived task name.
