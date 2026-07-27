# Intended repository structure

This document records the target repository organization for the structural refactor tracked by T062-T069 in `TASKS.md`.

The refactor is organizational only. It must not intentionally change runtime behavior, rendered DOM, styling, declarations, exported symbols, or published import paths.

## Principles

- Organize source code by ownership and domain before technical role.
- Keep builder-owned code in `src/builder`.
- Keep reusable implementation in domain slices under `src/shared`.
- Keep separately built public entry surfaces in `src/subpackages`.
- Use kebab-case for internal folder and file names while preserving existing published path casing.
- Keep tests and CSS modules colocated with the code they verify.
- Create slice-local `components`, `hooks`, `types`, `utils`, and `constants` folders only when they contain code owned by that slice. The tree below is an intended destination map, not a requirement to create empty folders.
- Do not introduce root-level `shared/utils`, `shared/types`, `shared/hooks`, or `shared/constants` dumping grounds.

## Intended tree

```text
/website                              # renamed from /example
/scripts
/types                                # ambient declarations such as CSS modules

/src
  /__mocks__

  /builder
    /components
      /alert
      /button
      /builder-root-actions
      /clone-button
      /form-controls                  # current src/form
        /input
        /option
        /option-container
        /select
        /select-multi
        /switch
      /group
        /components
      /lock-toggle
      /outlined-button
      /popover
      /popover-item
      /root-controls
      /rule
        /components
      /rule-controls                  # current src/widgets
        /boolean
        /field-select
        /input
        /operator-select
        /select
        /select-multi
        /value-field-select
        /value-source-select
      /secondary-button
      /styled-builder
      /text
    /constants
    /context
      /builder-context.tsx
      /index.ts
    /drag-and-drop
      /components
        /drag-handle
        /drag-preview
        /draggable-item
        /drop-zone
        /empty-group-drop-zone
        /iterator
      /hooks
      /types
      /utils
    /history
      /components
        /history-button
        /history-controls
      /hooks
      /types
      /utils
    /hooks
    /read-only
      /types
      /utils
    /text-mode
      /components
        /text-mode-blocked-alert-container
        /text-mode-editor
        /text-mode-input
        /text-mode-toggle-content
      /hooks
      /types
      /utils
    /theme
      /components
        /theme-provider
      /hooks
      /styles
      /types
      /utils
    /types
    /utils
    /validation
      /types
      /utils
    /builder.tsx
    /builder.test.tsx
    /builder-theme-css-variables.test.tsx
    /index.ts

  /shared
    /builder-components
      /types                          # only contracts genuinely shared with adapters
    /localization
      /locales
        /en-us                        # canonical default strings used by builder
      /types
    /query
      /model
      /normalization
      /transformations
    /query-formats
      /aql
      /cel
      /django
      /dynamo
      /elasticsearch
      /json-logic
      /jsonata
      /mongo
      /odata
      /prisma
      /rsql
      /spel
      /sql
      /registry.ts
      /types.ts

  /subpackages
    /adapters
      /antd
        /shared
        /v5
        /v6
      /bootstrap
        /shared
        /v5
      /fluent-ui
        /shared
        /v8
      /mantine
        /shared
        /v8
        /v9
      /mui
        /shared
        /v7
        /v9
      /radix
        /shared
        /v1
    /format-query
      /index.ts
    /locales
      /cs-cz
      /de-de
      /en-us                         # thin public re-export of shared default strings
      /es-es
      /fr-fr
      /it-it
      /pt-pt
      /sk-sk
      /zh-cn
      /zh-tw
      /test-utils
      /locales.test.ts
    /monaco
      /components
      /types
      /utils
      /create-components.ts
      /index.ts
    /parse-query
      /index.ts

  /index.tsx
```

Some details will be decided from actual ownership during migration. In particular, `shared/builder-components` should contain only contracts used by both the builder and adapters. If extracting a contract adds indirection without establishing a useful boundary, it should remain in the builder slice and adapters may depend on it there.

## Ownership rules

- Code used only by the builder belongs in `builder`.
- Code used across the builder and query-format subpackages belongs in `shared/query`. The current read-only and validation behavior has only builder consumers and belongs in the builder slice.
- Parsing and formatting implementation specific to a query language belongs in `shared/query-formats/<format>`.
- Code shared only within one adapter family belongs in that adapter's `shared` folder.
- Localization contracts and the canonical default en-US strings used by the builder belong in `shared/localization`. The public en-US locale entry is a thin re-export.
- Code used by one component or slice should remain colocated with that owner.
- Public entry wiring belongs in `subpackages`; reusable implementation does not.
- Classification must be based on actual consumers rather than the current folder name.

## Dependency direction

Allowed high-level dependencies are:

```text
builder -> shared
subpackages/adapters -> builder, shared
subpackages/monaco -> builder, shared
subpackages/locales -> shared
subpackages/parse-query -> shared
subpackages/format-query -> shared
root entry -> builder, shared, subpackages/locales
```

The following dependencies are not allowed:

- `shared` importing from `builder` or `subpackages`.
- `builder` importing from `subpackages`.
- One adapter family importing implementation from another adapter family.
- Public parse and format entries owning implementation needed by the builder or other entries.

## Public compatibility contract

Internal paths may change, but these published imports and output paths must remain unchanged:

```text
@vojtechportes/react-query-builder
@vojtechportes/react-query-builder/styles.css
@vojtechportes/react-query-builder/parseQuery
@vojtechportes/react-query-builder/formatQuery
@vojtechportes/react-query-builder/locale/en-US
@vojtechportes/react-query-builder/locale/fr-FR
@vojtechportes/react-query-builder/locale/it-IT
@vojtechportes/react-query-builder/locale/de-DE
@vojtechportes/react-query-builder/locale/es-ES
@vojtechportes/react-query-builder/locale/pt-PT
@vojtechportes/react-query-builder/locale/cs-CZ
@vojtechportes/react-query-builder/locale/sk-SK
@vojtechportes/react-query-builder/locale/zh-CN
@vojtechportes/react-query-builder/locale/zh-TW
@vojtechportes/react-query-builder/bootstrap/v5
@vojtechportes/react-query-builder/mui/v7
@vojtechportes/react-query-builder/mui/v9
@vojtechportes/react-query-builder/antd/v5
@vojtechportes/react-query-builder/antd/v6
@vojtechportes/react-query-builder/fluentui/v8
@vojtechportes/react-query-builder/mantine/v8
@vojtechportes/react-query-builder/mantine/v9
@vojtechportes/react-query-builder/radix/v1
@vojtechportes/react-query-builder/monaco
```

Explicit build entries must map kebab-case internal names such as `format-query`, `parse-query`, and `fluent-ui` to the current public output names and casing.

## Migration rules

- Move one ownership area at a time and keep each task independently committable.
- Avoid behavior changes, component rewrites, API cleanup, and unrelated formatting during file moves.
- Update path-sensitive tests, build entries, scripts, and configuration in the same task as the affected move.
- Use temporary intermediate paths for case-only or camel-to-kebab renames so Git records them reliably on Windows.
- Preserve public declarations and optional peer-dependency isolation.
- Run focused tests after each move and the full compatibility suite after the final task.
