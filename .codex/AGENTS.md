Long-running tooling (tests, docker compose, migrations, etc.) must always be invoked with sensible timeouts or in non-interactive batch mode. Never leave a shell command waiting indefinitely—prefer explicit timeouts, scripted runs, or log polling after the command exits.

<!--
# Repository structure

Over time, repository structure should turn into following. Follow this only when specifically instructed to do wider refactoring, otherwise stick to the structure that currently exists

```
src/
  __mocks__/
  constants/
  hooks/
  utils/
  adapters/
    antd/
      shared/
        ...
    mui/
    mantine/
    radix/
    fluentui/
    bootstrap/
  formatters/
    query-formats/
    parse-query/
    format-query/
  text-editor/
    monaco/
  builder/
    utils/
      history/ // moved from the root level
    components/
      field-control/ // originally root level widgets
      rule/
      group/
      alert.tsx // root level components should be moved under a builder if that is where they logically belong
      button.tsx
      ...
    utils/
    hooks/
    types/
    text-mode/
    constants/
  index.ts
```
-->

## Editing tools

- Do not use `apply_patch` in this repository. It is consistently blocked in the current environment.
- Use a working alternative for file edits instead, preferably PowerShell-based edits via `shell_command` such as `Set-Content` or other safe scripted file updates.
- Before overwriting a file, read the current contents first and keep the change scoped to the task at hand.

# File names and placement

- Utility files should be always suffixed with `*.util.(ts|tsx)`
- Interfaces should be prefixed with `I` in the interface name
- Interface file names must never be prefixed with `i-`; name files after the domain concept, for example `package-binding.ts`
- Enums should be suffixed with `*-enum.ts`
- Types should have no suffix
- Types, interfaces, enums, utility functions, components and so on should not be mixed together in one folder as a flat structure
- File placement into top-level `utils/`, `types/`, `hooks/`, `constants/` is allowed if these are either shared or serve top level files themselves
- Slice-local `types/`, `utils/`, `hooks`, `components` and `constants/` folders are allowed when they serve one concrete slice and contain actual code owned by that slice. Do not create empty or speculative local folders.
- Prefer granular and colocated files over catch-all files such as `types.ts`, `constants.ts`, or `helpers.ts`
- Do not introduce new catch-all files such as `types.ts`, `constants.ts`, or `helpers.ts` unless explicitly instructed
- Do not refactor existing catch-all files such as `types.ts`, `constants.ts`, or `helpers.ts` just to enforce this rule unless explicitly instructed

## Naming Conventions

Use `kebab-case` for:

- folders
- files

### Architecture

- Use a structure that is readable and explicit for long-term readability and maintainability
- Prefer one function / type / interface per file. Where content belongs to the same logical category (like API functions), it can be grouped into one file

  For example component that has one interface / type / enum / constant (that are not shared) and one styled component tied to it can be placed in one file, together with the component
  Utility function and one interface / type / enum / constant can be placed together in one file if they themselves are not shared
  Two or more utility functions should never be placed together in one file
  Two or more components should never be placed together in one file
  Two or more interfaces / enums / types / constants should never be placed together in one file

- Prefer arrow functions over function statements where `this` context is not needed
- Use blank lines to separate variable declarations from following control-flow blocks, function declarations, and other distinct statement blocks
- Adjacent single-line variable declarations may stay together; when either adjacent declaration spans multiple lines, place a blank line between them
- Keep tasks small and committable
- Each code addition or refactor should be tested

## Copy

- Do not use m-dashes "—", use standard n-dash instead "-"
- Always make sure text is readable and understandable, doesn't contain unecessary text or information that are irelevant. That especially apply to the library website.
- Text should be easy to understand even for junior/medior developer, without over-explanation
- As an inspiration how good copy should look like, look at for example https://docs.nestjs.com/recipes/crud-generator or https://mui.com/material-ui/api/slider
- Make sure you are using concise communication style and don't use multiple styles of writing

## Sub-agents

Define and use these two sub-agents from now on.

### Planning agent

Use before implementation begins and again whenever scope changes materially.

Responsibilities:

- Validates the task against AGENTS.md and to any related task list if it exists for that given task
- Larger tasks should be written into `./codex/{task-name}-tasks.md` for easier task tracking and better observability
- Identifies the implementation scope and calls out what is in scope vs out of scope
- Identifies edge cases, affected areas, migration impact, API impact, and test needs
- Prefers incremental refactoring and the minimum structural change needed for the current task
- Flags any conflict with service boundaries, placement rules, naming rules, or the current task checklist
- Does not write code

Expected output:

- A short implementation brief
- A list of constraints pulled from the repo guidance
- A concrete test checklist for the task
- Any open risks or assumptions that should be resolved before coding

### Code review agent

Use after implementation and before considering the task complete.

Responsibilities:

- Reviews the diff, not just the final file contents
- Checks whether naming, placement, ownership, and service-boundary rules from AGENTS.md are followed
- Checks for obvious anti-patterns, misplaced abstractions, overly broad refactors, and Encore/business-logic leakage
- Checks whether tests are sufficient for the behavior and edge cases introduced by the change
- Checks whether migrations are additive and whether existing migration history was preserved
- Calls out any mismatch between the implemented change and the agreed implementation scope

Expected output:

- Findings first, ordered by severity
- Explicit note when no issues are found
- Residual risks or missing tests, if any

Operating rule:

- Do not skip the planning agent for non-trivial work (trivial task could be fixing typo, small styles fix / addition, unused file / folder deletion, minor or patch dependency update that does not bring any breaking changes)
- Do not skip the code review agent after implementation
