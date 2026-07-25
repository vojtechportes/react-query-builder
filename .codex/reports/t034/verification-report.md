# T034 verification report

## Outcome

`AntdTextModeToggleContent` was moved into a colocated module folder and migrated from styled-components to a CSS Module. The wrapper keeps the existing two-span structure, mode-specific ANTD icons, hidden icon accessibility state, label copy, inline-flex layout, spacing, alignment, and line height.

The CSS build verifier now follows emitted dependency graphs instead of scanning arbitrary chunks. It proves that the root DropZone mappings are reachable from root ESM/CJS entries and that identical ANTD toggle mappings are reachable from ANTD v5/v6 ESM/CJS entries.

## Verification

- Focused ANTD toggle and adapter tests: 7 passed.
- CSS Module infrastructure test: 1 passed.
- Production package build: passed for every configured entry in ESM and CJS.
- CSS output: exactly one `dist/styles.css`; root and ANTD sentinel rules occur once; the scoped `.anticon` rule occurs once.
- Runtime output: no emitted JavaScript imports CSS or injects style elements; CJS root and ANTD v5/v6 entries load directly in Node.
- Non-UI boundaries: parser, formatter, and all locale ESM/CJS graphs remain CSS- and clsx-free.
- Package bindings: v1/v2 type checks, recipe snippet checks, client builds, SSR builds, 26 Vitest assertions, and runtime verification passed.
- Task-scoped ESLint: passed.

The package-binding build initially hit the sandbox's `spawn EPERM` restriction. The same command passed when rerun with permission to spawn the existing Vite/esbuild workers.

## Scope notes

The stylesheet remains explicit and is not yet exported from `package.json`; T035 owns that public surface. No MUI files changed. Separate adapter stylesheet paths were intentionally not added because they conflict with T034's single-stylesheet acceptance criterion and the current `splitting: false` extraction design.

Native Node loading of the ESM root and ANTD UI entries retains the styled-components interop failure already recorded by T032. T034 does not claim that unsupported native path as passing. The supported Vite client and SSR package-binding matrix passes for v1 and v2; removing the underlying styled-components dependency remains later migration work.

## Review

The review agent initially flagged that the report did not explicitly distinguish supported Vite SSR from the pre-existing native Node ESM styled-components interop failure. The verifier now directly loads both CJS ANTD entries, and the report records the native ESM limitation and accepted supported SSR gate. Re-review found no blocking issues and approved T034 under the existing T032 scope decision.
