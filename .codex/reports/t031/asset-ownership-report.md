# T031 asset ownership report

Date: 2026-07-24

## Production-domain artifact

- V1 staging emitted 118 JavaScript files and 2 CSS files under the v1 asset directory.
- V2 staging emitted 120 JavaScript files and 2 CSS files under the v2 asset directory.
- The final verifier parsed every canonical document and rejected asset URLs outside its owning version prefix.
- Every referenced JavaScript and stylesheet asset existed in the assembled artifact.
- No staging-only package graph, route manifest, or SSR directory was exposed in the deployable version trees.
- V1 and v2 assets remained in separate directories; assembly did not merge or deduplicate their CSS or JavaScript.

## Repository-base artifact

- The same ownership checks passed with `/react-query-builder/v1/` and `/react-query-builder/v2/` prefixes.
- Canonical documents, root policies, version-local policies, and assets used the repository deployment base consistently.

## Portability fix

- FTP configuration comparison now normalizes CRLF and LF before checking content equality.
- Unit coverage confirms normalization for Windows and Unix line endings while preserving already-normalized input.
