# T034 - Prove adapter multi-entry CSS output with one minimal module

- [x] Validate T034 scope and constraints with the required planning agent.
- [x] Create the required feature branch.
- [x] Move the ANTD text-mode toggle content into its adjacent module folder.
- [x] Replace its styled-components wrapper with a scoped CSS Module.
- [x] Preserve mode icons, label markup, accessibility attributes, and layout rules.
- [x] Add focused component tests for both modes and CSS class mappings.
- [x] Verify root and ANTD v5/v6 CSS mappings across ESM and CJS entry graphs.
- [x] Verify one stylesheet, exactly-once sentinel rules, no JS injection, and clean non-UI entries.
- [x] Run focused tests, the CSS infrastructure gate, and the package-binding client/SSR matrix.
- [x] Run task-scoped ESLint and Prettier on all modified code.
- [x] Complete the required post-implementation review-agent pass and resolve findings.
- [x] Mark T034 done after review approval.

## Scope boundary

T034 migrates only `AntdTextModeToggleContent` and proves that its adapter CSS and the root DropZone CSS are coalesced into the existing single extracted stylesheet. T035 owns the public `./styles.css` package export and token contract. T051 owns the remaining ANTD and MUI toggle wrapper migrations. Separate per-adapter stylesheet exports are not introduced because T034 explicitly validates one package-level stylesheet. Native Node loading of ESM UI entries retains the styled-components interop limitation recorded in T032; T034 accepts the passing supported Vite client/SSR matrix and does not expand into the later styled-components removal.

## Styling decision

MUI-owned controls should prefer MUI's `sx`, theme, or component styling APIs and generally do not need a separate adapter stylesheet. The current MUI text-mode toggle still uses styled-components and remains scheduled for T051, where it can be migrated with MUI-native styling. ANTD was selected for T034 because its small raw-span wrapper needs a scoped `.anticon` rule and therefore exercises the adapter CSS extraction contract directly.


## Review

The review agent initially flagged that native Node ESM UI loading was not distinguished from supported SSR coverage. The verifier and report were clarified, direct CJS ANTD runtime checks were added, and re-review found no blocking issues. The known native Node ESM styled-components limitation remains explicitly deferred under the T032 scope decision.
