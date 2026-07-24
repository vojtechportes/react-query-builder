# T032 - Capture the package baseline and add CSS build/test infrastructure

- [x] Validate T032 scope and constraints with the required planning agent.
- [x] Capture pre-change package, consumer, dependency, ESM/CJS, and tarball baselines.
- [x] Pin `@tsdown/css` and `clsx` and synchronize the lockfile.
- [x] Add deterministic single-file CSS extraction with injection disabled.
- [x] Add CSS Module TypeScript declarations and Jest handling.
- [x] Add a focused CSS Module class-composition contract test.
- [x] Add automated CSS output, non-UI boundary, shared-chunk, ESM, and CJS checks.
- [x] Run the T032 smoke/build/test matrix.
- [x] Run Prettier on all modified code.
- [x] Complete the required review-agent pass and resolve findings.
- [x] Mark T032 done only after verification and review.

## Scope boundary

T033 owns the first production component migration, including `src/drop-zone.tsx`. T032 adds infrastructure only and does not migrate or move a production component. T035 owns the public stylesheet export and token contract, so `dist/styles.css` is intentionally not exported from `package.json` yet.

## Review

The independent review agent reported two P2 verification gaps. Both were resolved by accurately labeling native non-UI ESM coverage, documenting the existing native root ESM limitation, and deriving the boundary check across all locale ESM/CJS entries. The re-review found no issues.

## Residual limitations

- Native Node loading of the ESM root retains the pre-existing styled-components interop failure. The supported Vite client and SSR ESM consumer matrix passes.
- The in-place node_modules tree cannot rerun the full root Jest suite because npm's legacy peer resolver omitted the lockfile-recorded `@testing-library/dom` peer while an active preview process locks Rollup. The committed lockfile retains the peer, and the focused test passed before the local install was disturbed.
