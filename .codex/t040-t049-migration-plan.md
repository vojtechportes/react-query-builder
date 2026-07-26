# T040-T049 shared CSS Modules migration plan

This file is the planning brief for T040 through T049. It satisfies the required
pre-implementation planning pass for these ten migrations as long as the relevant
task, repository guidance, public API, and source ownership have not materially
changed.

It does not combine the ten tasks into one implementation. Each task remains a
separate dependency-gated, reviewable change with its own verification and required
post-implementation code review.

## How to use this plan

At the start of a T040-T049 implementation session:

1. Read `.codex/AGENTS.md`, the task entry in `.codex/TASKS.md`, the common contract
   below, and the task-specific section in this file.
2. Confirm the task dependencies are marked done and inspect the current source and
   public exports for drift.
3. If the scope and assumptions still match, treat the relevant section as the
   required planning-agent output and proceed without creating another task-specific
   planning file.
4. If the source ownership, public API, task scope, dependency boundary, or repository
   rules changed materially, stop and update/re-run planning before implementation.
5. Complete only one numbered task at a time. Run its focused checks and the common
   completion gate, then use the required code review agent before marking it done.

`.codex/TASKS.md` remains authoritative for task status and acceptance criteria. This
file is authoritative only for the shared implementation plan.

## Dependency and execution order

The tasks must follow the existing dependency graph:

```text
T037 -> T040 --------------------------\
T033 + T035 -> T041                     |
T035 -> T042 ----\                      |
T035 -> T043 ----+-> T044 -> T045 --\   |
T038 + T043 -> T046 -----------------+-> T047
T039 ---------------------------------------+-> T048
T040 ---------------------------------------/
T039 + T042 + T048 ----------------------------> T049
```

T040, T041, T042, and T043 can start independently once their own prerequisites are
done. T044-T049 must not bypass the dependency gates above. T041 is intentionally
independent of the form, group, rule, Builder, and text-mode chain.

## Shared implementation brief

Migrate the task-owned styled-components presentation to colocated CSS Modules and
plain React/DOM composition while preserving the current public and internal runtime
contracts. Use explicit classes for finite states, inherited public CSS variables for
theme values, and the smallest structural move that gives each component an adjacent
module stylesheet.

For files currently imported through extensionless paths such as `./popover` or
`./form/input`, use a folder plus `index.ts` when needed so existing internal and
public import paths remain stable. Do not introduce compatibility re-export files
unless a move would otherwise break an existing path.

## Shared constraints

- Follow the current `.codex/AGENTS.md` naming and placement rules. New folders and
  files use kebab-case; utilities retain the `.util.ts` suffix.
- Preserve public component names, props, exported interfaces, ref types, DOM
  semantics, `className`, inline `style`, `data-*`, ARIA attributes, and event order
  unless the task explicitly calls for a documented API decision.
- Keep CSS Modules colocated with the component or component slice that owns the
  rules. `src/styles/input.module.css` is the one planned shared stylesheet because
  T042 explicitly owns conversion of the shared input fragment.
- Use `clsx` and explicit state classes or semantic `data-*` attributes for finite
  visual states. Do not reproduce transient styled props as leaked DOM attributes.
- Use the public `--query-builder-*` variables established by T035. Default color
  variables are generated from `src/constants/colors.ts` into
  `src/styles/tokens.css`; component CSS should consume variables directly rather
  than duplicate color fallbacks.
- Preserve the agreed precedence: generated stylesheet defaults, inherited CSS
  variables, then explicit root `style` overrides. Inline CSS variable serialization
  belongs only at explicit override boundaries such as the Builder root or a future
  provider/root wrapper, and should include only provided overrides.
- Do not add per-component ThemeProvider bridge behavior while migrating leaves.
  Migrated nested presentation should inherit variables instead of re-emitting
  default or provider-derived color values. ThemeProvider compatibility is not a
  migration requirement, though the public API remains until an explicit removal
  task changes it.
- Preserve the compiled 900px responsive behavior until T050 retires the styled
  responsive helper. A task may replace only the helper usage it owns with the
  equivalent CSS media query.
- Preserve stylesheet extraction as one explicit package stylesheet. Do not add
  runtime style injection, per-component stylesheet exports, or adapter stylesheet
  entry points.
- Avoid unrelated behavior refactors, abstraction cleanups, adapter migrations, and
  public API expansion. Adapter-owned presentation remains in its later task unless a
  focused type/import compatibility adjustment is strictly required.
- Update import/export paths and declaration coverage whenever a public or
  component-set type moves. Packed consumers must not see styled-components types
  after the owning task removes them.
- Format every modified code/CSS file and run task-scoped ESLint. Preserve unrelated
  worktree changes.

## Common completion gate

Every task must complete the following in addition to its focused checklist:

- Add or update focused Jest tests for DOM, classes, states, refs, public props, and
  interactions affected by the migration.
- Add an SSR assertion for a newly migrated public/default root when one does not
  already exist. Confirm rendered markup contains no styled-components runtime
  output.
- Run the focused test files plus directly affected Builder, iterator, form, or
  component-set tests.
- Run `npm run test:css-infrastructure` to verify extraction, public stylesheet
  consumers, one-stylesheet output, and clean non-UI entries.
- Run `npm run build` and task-scoped lint/Prettier checks.
- Run the example build when the task changes Builder, responsive layout, public
  component composition, or package declarations.
- Inspect representative visual states at default and overridden token values.
  Include the 900px boundary for responsive tasks.
- Search the task-owned source for `styled-components`, `styled.`, styled `css`
  fragments, and obsolete transient props.
- Complete the required post-implementation code review and resolve findings before
  changing the task status in `.codex/TASKS.md`.

## T040 - Popover and PopoverItem

### Implementation scope

- Move `src/popover.tsx` to `src/popover/popover.tsx` with an adjacent
  `popover.module.css` and compatibility `index.ts`.
- Move `src/popover-item.tsx` to `src/popover-item/popover-item.tsx` with an adjacent
  `popover-item.module.css` and compatibility `index.ts`.
- Replace `Container`, `Content`, and `Item` styled elements with semantic DOM plus
  module classes.
- Preserve the trigger Button, child cloning, original child `onClick` ordering,
  close-after-selection behavior, outside-mousedown cleanup, class placement, and
  existing data-test hooks.
- Preserve absolute positioning, 5-level z-index, minimum width, borders, shadow,
  last-item border removal, hover state, and inherited theme colors.
- Preserve the public `IPopoverProps` and `IPopoverItemProps` declaration surfaces.
  The current default item has no disabled prop even though T040 names a disabled
  state. Add an optional `disabled?: boolean` only if the implementation confirms
  that acceptance criterion is intentional, then forward native `disabled`, add its
  CSS state, and update compatible adapter declarations/tests as an additive API.
- Do not add a portal or redesign focus management in this styling migration.

### Focused verification

- Extend/move `src/popover.test.tsx` to cover open/close, repeated trigger toggles,
  outside click, inside click, child callback order, non-element children, cleanup,
  className, data hooks, and SSR.
- Add PopoverItem assertions for `type="button"`, callback, className, item class,
  last-child/hover rule presence, the resolved disabled contract, and public prop
  typing.
- Check keyboard activation inherited from Button/button semantics and visually inspect
  trigger focus, item hover, stacking, long labels, and viewport-edge behavior.

### Boundaries and risks

- Form select popovers belong to T044, not T040.
- Adapter popovers/items are unchanged.
- Current Popover does not expose a ref, disabled item prop, Escape handling, focus
  trapping, or collision positioning. Do not invent those APIs under T040.

## T041 - Remaining drag-and-drop presentation

### Implementation scope

- Move `src/drag-handle.tsx`, `src/drag-preview.tsx`, and
  `src/empty-group-drop-zone.tsx` into same-named folders with adjacent CSS Modules
  and stable index exports.
- Preserve DragHandle `forwardRef`, spread-prop order, `data-test`, DnD attributes,
  listeners, 14px hit area, full height, grab cursor, and `touch-action`.
- Preserve DragPreview lookup and null behavior, group/rule branching, overlay
  iterator props, pointer-event suppression, opacity, and responsive min/max width.
- Replace EmptyGroupDropZone interpolation with explicit active, dragging, and
  transition-disabled classes. Preserve droppable data, ref target, fragments, hit
  area layering, conditional test id, height/margin/opacity transitions, and dashed
  active placeholder.
- Follow the established T033 DropZone class/token pattern without merging the
  distinct default and empty-group components.

### Focused verification

- Add focused tests for DragHandle ref/attribute/class forwarding and theme variables.
- Add DragPreview tests for missing IDs, rule previews, group previews, nested child
  selection, overlay iterator configuration, and class mapping.
- Add EmptyGroupDropZone tests that mock `useDroppable` and assert registration data,
  ref ownership, active/dragging combinations, transition disabling, and class maps.
- Run `src/iterator.test.tsx`, Builder DnD tests, and affected group/rule tests.
- Visually inspect empty/nested groups, active target, settling/no-transition state,
  rule/group previews, viewport-constrained overlay width, and pointer hit areas.

### Boundaries and risks

- Do not alter DnD algorithms, collision detection, normalized query updates, or
  adapter-specific empty drop zones.
- The current DragHandle border declaration may rely on an existing theme value that
  is not a complete CSS border. Capture actual baseline output before translating it;
  preserve observed behavior rather than silently "fixing" it.

## T042 - Shared input styles, Input, and Switch

### Implementation scope

- Replace `src/styles/input.styles.ts` with explicit reusable classes in
  `src/styles/input.module.css`. Keep the surface narrow: shared typography and
  control foundation only.
- Move `src/form/input.tsx` and `src/form/switch.tsx` into adjacent `input/` and
  `switch/` folders with stable index exports and component-owned CSS Modules.
- Update the SelectMulti trigger import of the old shared fragment just enough to
  consume the new shared classes; its full presentation remains T044.
- Preserve Input types, controlled string conversion, id/name, disabled state,
  className composition, date/datetime WebKit typography, number spinner removal,
  width/min-width variables, and native attributes currently exposed.
- Replace Switch interpolations with switched and disabled classes. Preserve
  `role="switch"`, `aria-checked`, `aria-disabled`, click guard, optional callback,
  className, knob position, focus-visible ring, and animation timings.
- Use current CSS-variable tokens and accepted fallbacks for all former theme reads.

### Focused verification

- Extend `src/form/input.test.tsx` for text/number/date values, change conversion,
  disabled/id/name/className, shared class composition, CSS variables, pseudo-element
  rules, and SSR.
- Extend `src/form/switch.test.tsx` for all switched/disabled combinations, callback
  counts and values, keyboard activation, ARIA, className, knob classes, token
  overrides, and SSR.
- Run affected Select/SelectMulti tests to prove the shared class migration did not
  change trigger sizing before T044.
- Visually inspect default/disabled/focus states, narrow and custom control widths,
  date and number inputs, switch knob endpoints, and the 900px boundary.

### Boundaries and risks

- Do not migrate SelectMulti internals beyond the minimum shared-class import change.
- Do not create a general form-style API or export the shared CSS Module publicly.
- CSS Modules `composes` and shared class application must produce rules in the one
  extracted stylesheet without relying on JavaScript import order.

## T043 - Option and public OptionContainer

### Implementation scope

- Move `src/form/option.tsx` and `src/form/option-container.tsx` into adjacent folders
  with CSS Modules and stable index exports.
- Replace StyledOption with a plain span and preserve its children, presentation, and
  inherited colors.
- Replace the public styled OptionContainer with a typed, ref-forwarding React
  component that renders a div by default and composes its module class with incoming
  `className`.
- Before coding, lock the `as` decision with a packed declaration/runtime fixture.
  Planning default: preserve the currently available styled-components `as` behavior
  because removing it is a public breaking change. Implement only the intrinsic
  polymorphism actually supported by the existing public surface; do not build a new
  design-system polymorphic abstraction.
- Forward valid DOM attributes, event handlers, `style`, children, and ref without
  leaking an `as` attribute to the DOM. Keep the default div DOM and grid layout.
- Source inspection at planning time shows `src/form/option.tsx` has no selected
  state, className prop, or public export. Do not confuse it with the SelectMulti
  option in T044 or group option in T046. T043 preserves the current form Option
  contract; the selected-state wording in `.codex/TASKS.md` applies only if a
  task-owned state is found after dependency work lands.

### Focused verification

- Add Option tests for children, class mapping, tokens, and SSR.
- Add OptionContainer tests for default div, custom class/style/data/ARIA/event
  forwarding, ref forwarding, children, supported intrinsic `as` cases, and SSR.
- Add packed TypeScript consumer assertions for default props, ref inference,
  className, DOM attributes, supported `as`, and expected failures.
- Inspect emitted declarations and confirm they do not import styled-components
  types.

### Boundaries and risks

- SelectMulti options belong to T044 and group options belong to T046.
- The exact inferred styled-components polymorphic type may be broader than consumers
  need. Preserve demonstrated compatibility, document the chosen boundary, and avoid
  claiming arbitrary custom-component typing unless it is tested.

## T044 - SelectMulti internals and form popover

### Implementation scope

- Migrate `src/widgets/select-multi/components/trigger.tsx`,
  `tag.tsx`, and `option.tsx` into same-named component folders with adjacent CSS
  Modules and stable local index exports.
- Migrate `src/form/popover.tsx` into an adjacent folder/module.
- Keep `check-icon.tsx`, `remove-icon.tsx`, hooks, and utilities in place unless an
  import-only adjustment is required.
- Replace trigger, label, summary badge, chevron, tag, tag label, remove button,
  option, option label, and indicator styled elements with plain DOM and explicit
  state classes.
- Preserve expanded, selected, disabled, and removable states; text truncation;
  summary creation; chevron rotation; check/remove icons; listbox role; current
  keyboard behavior; callback ordering; and host class composition.
- Preserve form popover positioning, z-index 10, minimum/maximum dimensions,
  overflow, border, radius, background, and shadow.
- Remove presentation-only `theme` props from internal component calls only after all
  callers and tests are updated. Do not change public Select/SelectMulti props.

### Focused verification

- Extend `src/widgets/select-multi/select-multi.test.tsx`,
  `src/form/select-multi.test.tsx`, and `src/form/select.test.tsx` for finite state
  classes, keyboard navigation, open/close, disabled options, selected indicators,
  tag removal, summary thresholds, truncation, and class composition.
- Add direct component tests where wrapper tests cannot prove refs, callback order, or
  class mapping.
- Test empty, one, many, all-disabled, long-label, and mixed selected/disabled lists.
- Visually inspect trigger focus/open/disabled states, tag wrapping/removal, option
  hover/selected/disabled states, scrolling, viewport max width, and token overrides.

### Boundaries and risks

- T044 does not migrate the Select and SelectMulti root containers or hidden inputs;
  those remain T045.
- Preserve the current hook and selection behavior. Do not replace the widget with a
  third-party select or broaden accessibility behavior beyond compatibility fixes
  required by the migration.

## T045 - Select and SelectMulti wrappers

### Implementation scope

- Move `src/form/select.tsx` and `src/form/select-multi.tsx` into adjacent folders with
  CSS Modules and stable index exports.
- Replace root Container and HiddenInput styled elements with plain elements and
  module classes.
- Preserve root refs, incoming className placement, hidden input id/name/value,
  control width/min-width variables, inline-block layout, disabled behavior,
  open/close behavior, option selection/removal, loading/summary content, and form
  integration.
- Preserve `ISelectProps` and `ISelectMultiProps`, existing public exports, and
  component-set compatibility.

### Focused verification

- Extend both form select test files for ref ownership through the hook, root classes,
  hidden inputs, ids/names, controlled selections, empty values, disabled roots and
  options, opening/closing, deletion, summary/loading states, and SSR.
- Run widget SelectMulti tests and Builder field/operator/value editor tests.
- Add packed declaration/consumer checks for both public props after the file moves.
- Visually inspect single/multi roots, custom width/min-width variables, long content,
  loading, disabled state, form submission values, and responsive sizing.

### Boundaries and risks

- Do not change selection value shapes, `any` typing, hook behavior, or public form
  semantics as an incidental cleanup.
- Adapter selects are outside T045.

## T046 - Group option and container

### Implementation scope

- Move `src/group/option.tsx` and `src/group/group-container.tsx` into adjacent module
  folders with stable index exports. Add colocated CSS Modules.
- Update `src/group/group.tsx` only as needed to emit semantic state classes/data and
  remove CSSOM-dependent test coupling.
- Replace option interpolation with explicit modifier/selected classes. Preserve
  option content, disabled/custom behavior, and mode selection.
- Replace group root, body, header, left, and right styled elements with plain DOM,
  explicit classes, and finite state classes for drag handle/controls/layout cases.
- Preserve nested groups, negation/modifier controls, selected modes, root/nested
  differences, padding, borders, radius, shadow, responsive behavior, className,
  custom components, and public `IGroupProps`.
- Replace group tests that inspect styled-components CSSOM with semantic state
  assertions plus real extracted-CSS integration coverage.

### Focused verification

- Extend `src/group/group.test.tsx` for root/nested groups, controls present/absent,
  drag handles, modifiers, negation, selected option modes, read-only/disabled custom
  controls, className/data hooks, and SSR.
- Run iterator, DnD, CloneButton, LockToggle, PopoverItem, and Builder group flows.
- Add extracted CSS assertions for group state selectors and the 900px layout without
  reconstructing style rules in Jest.
- Visually inspect deep nesting, empty groups, long controls, root/non-root radius and
  shadow, selected modifiers, and responsive layouts.

### Boundaries and risks

- Rule presentation remains T047. Adapter group containers remain later adapter
  tasks.
- Semantic state must be derived from existing React props/state, not computed styles.
  Capture baseline CSSOM-dependent expectations before deleting the old test helper.

## T047 - Rule container, layout, and range inputs

### Implementation scope

- Migrate `src/rule/rule.tsx` and `src/rule/rule-container.tsx` to adjacent CSS
  Modules while preserving their existing slice ownership and stable import paths.
- Move `src/widgets/input.tsx` into an adjacent `input/` module folder and migrate its
  range-input layout styling.
- Replace BooleanContainer, FieldsContent, LayoutItem, ValueContent,
  ValueEditorGrid, ValidationIssues, StyledRule, Content,
  ContentWithoutControls, Controls, and RangeInputs with semantic DOM/classes.
- Use explicit classes for drag-handle/controls column combinations, value editor
  shapes, validation, read-only states, and responsive layout.
- Preserve all field types, comparison/range/multi-value editors, value-source
  selection, validation list content, custom components, refs/data hooks, control
  ordering, className, root composition, and public `IRuleProps`.
- Translate owned `compactBuilderMedia` usage to the equivalent CSS media query. Do
  not delete the shared helper until T050.

### Focused verification

- Extend `src/rule/rule.test.tsx` for every field/editor shape, field comparison,
  range/multi values, missing controls, drag handle combinations, validation,
  read-only/disabled paths, custom components, class mapping, and SSR.
- Add focused range-input tests for ordering, values, callbacks, disabled state,
  layout classes, and responsive rules.
- Run group/iterator tests and Builder validation/read-only/field-comparison suites.
- Visually inspect all grid column combinations, range editors, validation wrapping,
  long options, custom components, nesting, and both sides of 900px.

### Boundaries and risks

- Do not refactor rule business logic, field normalization, value reconciliation,
  validation algorithms, or custom-component contracts.
- CSS grid equivalence is sensitive to wrapper count and `min-width: 0`. Preserve the
  existing DOM unless a wrapper change is proven by focused and visual tests.

## T048 - Builder root, root controls, and history

### Implementation scope

- Migrate `src/builder/components/styled-builder.tsx`,
  `root-controls.tsx`, `history-controls.tsx`, and
  `text-mode-blocked-alert-container.tsx` to component-owned CSS Modules.
- Update `src/builder/components/builder-root-actions.tsx` and
  `src/builder/builder.tsx` only as needed for class composition and plain React
  replacements.
- Keep the internal `StyledBuilder` name if that minimizes churn, but it must become a
  typed React wrapper rather than a styled component. Preserve its ref/DOM behavior
  as used by Builder.
- Preserve Builder root `className`, typed `style`, stable root data hook, explicit
  root variable precedence, typography, padding, background, border, radius, and
  shadow. Keep any remaining ThemeProvider compatibility scoped to the root override
  boundary until a removal task explicitly changes that public API.
- Preserve root action ordering, text-mode toggle, add group/rule actions,
  single/multiple roots, history availability, undo/redo buttons, blocked alert
  spacing, modes, custom component sets, and responsive layout.
- Preserve `HistoryControls` className and public export.

### Focused verification

- Extend `src/builder/builder.test.tsx` and
  `src/builder/builder-theme-css-variables.test.tsx` for class/style/data precedence,
  no/partial/nested ThemeProvider cases, root configurations, modes, actions,
  history, blocked text mode, custom components, and SSR.
- Add direct tests for root controls, HistoryControls, and the Builder root wrapper
  when Builder-level tests cannot prove class/ref behavior.
- Re-run `create-builder-root-style` tests and packed declarations.
- Run group/rule/popover tests because Builder composes all three.
- Visually inspect empty and populated roots, single/multiple roots, history/action
  combinations, blocked alert, custom component sets, token overrides, and responsive
  layouts.

### Boundaries and risks

- Do not change Builder state, history semantics, root action permissions, DnD
  behavior, validation, or text-mode reconciliation.
- T048 does not migrate the default text-mode editor/input/toggle presentation beyond
  the blocked-alert container and their placement in the Builder shell.
- Root variable emission is a high-risk compatibility boundary. Reuse the established
  T035/T036 utilities and precedence tests rather than creating a second style merge.

## T049 - Default text-mode toggle, input, and editor

### Implementation scope

- Migrate `src/builder/components/text-mode-toggle-content.tsx`,
  `src/builder/text-mode/components/text-mode-input.tsx`, and
  `src/builder/text-mode/components/text-mode-editor.tsx` to adjacent CSS Modules.
- Preserve the current locations and public exports unless a same-path component
  folder is required for colocation; update `src/builder/index.ts`, `src/index.tsx`,
  default component sets, and type imports without changing their public names.
- Replace toggle container, input root/textarea, editor root/frame/layers, diagnostic
  overlay/text, missing-token marker, and error elements with plain DOM/classes.
- Preserve icon choice, label markup, typography, minimum height, resize behavior,
  transparent input text, visible caret, selection, aligned syntax and diagnostic
  layers, protected ranges, read-only behavior, error rendering, custom
  TextModeInputComponent composition, data hooks, and SSR.
- Scope deliberate Prism selectors through the editor layer with CSS Modules
  `:global(.token...)` selectors. Preserve keyword, boolean, operator, punctuation,
  string, number, function, selector, property, and column-name styling.
- Preserve SQL grammar registration and highlighting utility behavior. Do not move or
  re-register Prism as part of the CSS migration.
- Keep `TEXT_MODE_INPUT_CLASS` and `TEXT_MODE_INPUT_FIELD_CLASS` compatibility classes
  because adapter/custom input implementations and tests consume them. Compose module
  classes in addition to these stable classes.

### Focused verification

- Add focused default toggle/input/editor tests for both toggle modes, icon/label DOM,
  controlled editing, disabled/read-only, spellcheck, custom classes/data hooks,
  custom input component, SSR, and public types.
- Test empty and multiline SQL, every Prism token category, overlapping/out-of-range
  diagnostics, zero-width missing markers, errors, caret/selection styles, protected
  ranges, and layer content alignment.
- Run all Builder text-mode parser/formatter/diagnostic/protection tests plus Builder
  mode-switching tests.
- Run adapter component-set tests that assert the stable text-mode input classes.
- Visually inspect long/multiline content, horizontal/vertical scroll alignment,
  resize, selection/caret, syntax colors, multiple diagnostics, missing markers,
  read-only mode, custom input composition, and token overrides.

### Boundaries and risks

- Monaco presentation and adapter-specific text-mode toggles/inputs remain assigned to
  later tasks. Do not migrate them in T049.
- Prism selectors are intentionally global only below the local editor layer. An
  unscoped `.token` rule would leak into host applications and fails this plan.
- Layer alignment depends on identical font, padding, line-height, white-space,
  word-break, size, and scroll position. Treat any divergence as blocking.

## Shared public API impact

Most tasks are implementation-only and must preserve their declarations. The known
API-sensitive checkpoints are:

- T040: public Popover and PopoverItem props and exports.
- T043: public OptionContainer ref, DOM attributes, and existing `as` behavior.
- T045: public Select/SelectMulti props and hidden form behavior.
- T046/T047: public Group/Rule container props used by adapter component sets.
- T048: Builder root class/style/data behavior and public HistoryControls.
- T049: public default text-mode components, types, stable compatibility classes, and
  custom component composition.

Any proposed breaking change at these checkpoints is a material scope change and
requires a new planning decision instead of being folded into the migration.

## Shared risks and assumptions

- The plan assumes T035's public token set covers every migrated value. If a genuinely
  missing reusable token is discovered, first verify the T035 contract and add the
  smallest documented token change; do not encode theme reads in JavaScript.
- Jest cannot prove computed CSS layout by itself. State/class tests, extracted CSS
  verification, SSR, and representative visual checks are all required.
- File moves can silently break adapter type imports and package declarations even
  when root tests pass. Search all root and adapter entry graphs after every move.
- CSS rule order and specificity may change when styled inheritance becomes multiple
  classes. Test disabled plus selected/focus combinations, not only individual states.
- Standalone public controls may need legacy theme variables while nested controls
  must inherit host overrides. Follow the T036 bridge rules component by component.
- Existing behavior that looks imperfect is not automatically a migration bug to fix.
  Record it and preserve it unless `.codex/TASKS.md` explicitly requires a change.
- T039 is a prerequisite only for T048 and T049. Its implementation may establish
  additional Alert/Text patterns; consume those patterns if compatible, but do not
  broaden T040-T047 around them.
