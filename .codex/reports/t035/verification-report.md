# T035 verification report

## Result

T035 added `@vojtechportes/react-query-builder/styles.css` as the stable, explicit
stylesheet export. The packed package contains exactly one CSS asset and declares CSS
side effects narrowly. The stylesheet defines inherited public color, spacing,
padding, gap, radius, shadow, sizing, typography, editor, DropZone, motion, and popover
variables while retaining the compiled 900px responsive breakpoint.

Builder now accepts `className` and a typed `IBuilderStyle`, exposes
`data-query-builder="root"`, and preserves precedence from inherited defaults through
ThemeProvider compatibility variables to explicit Builder styles. The current Builder
shell and migrated DropZone consume the relevant tokens without pulling later module
migrations into T035.

## Verification

- Focused Builder, ThemeProvider, style-merge, and DropZone tests: 24 passed.
- CSS infrastructure gate: passed.
- Build output: exactly one `dist/styles.css`, no runtime injection, non-UI entries CSS-free.
- Packed artifact: `./styles.css` resolved through the real package export map.
- Packed Vite consumers: styled client emitted one CSS asset; unstyled client emitted none.
- Packed SSR consumers: styled and unstyled bundles built and rendered the Builder root.
- V1/V2 package bindings: typechecks, snippets, client builds, SSR builds, 26 tests, and runtime verification passed.
- Task-scoped ESLint: passed with no errors.
- Modified code Prettier check: passed.
- Repository code-review agent: initial packed-resolution P2 fixed; re-review approved with no findings.

The complete root Jest run passed 101 suites and all 518 executed tests. Its only failing
suite is the previously recorded example fixture failure caused by the missing local
`@vojtechportes/react-query-builder` workspace link. The dedicated package-binding
matrix passed against both intended package bindings.

The repository-wide unscoped lint command remains polluted by generated `.tmp` and
`example/.versioned-dist` artifacts. Task-scoped lint passes. The packed consumer harness
uses the system `tar` executable, which is available in the verification environment.
