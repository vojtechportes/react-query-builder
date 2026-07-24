# T033 - Migrate drop-zone as the first CSS Modules review gate

- [x] Validate T033 scope and constraints with the required planning agent.
- [x] Move DropZone into its colocated module folder and preserve import compatibility.
- [x] Replace styled-components with CSS Module and clsx state classes.
- [x] Preserve droppable registration, DOM structure, state behavior, theme color, and incoming classes.
- [x] Add focused DropZone state, ref, data, theme, and class mapping tests.
- [x] Establish one reusable theme-to-CSS-variable bridge for existing colors.
- [x] Run focused DnD tests, ESM/CJS/SSR builds, and all-state visual checks.
- [x] Run Prettier on every modified code file.
- [x] Complete the required post-implementation review-agent pass and resolve findings.
- [x] Mark T033 done after verification and review.

## Scope boundary

T033 migrates only the default DropZone. Adapter-specific drop zones, empty-group drop zones, drag handles, drag previews, public stylesheet exports, and audited non-color token contracts remain owned by later tasks.

## Review

The independent review agent found no blocking or non-blocking issues and confirmed T033 is ready to mark done. Residual token-contract and provider-precedence work remains intentionally assigned to T035 and T036.
