<h1 align="center">
  <img src="https://i.imgur.com/VXiYZ8g.png" alt="React Query Builder" />
</h1>

<h3 align="center">
  Simple, highly configurable query builder<br /> for React written in TypeScript
</h3>

<p align="center">
<a href="https://www.npmjs.com/package/@vojtechportes/react-query-builder" target="_blank"><img src="https://img.shields.io/npm/v/%40vojtechportes%2Freact-query-builder" alt="npm version" /></a>
<a href="https://opensource.org/licenses/MIT" target="_blank"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
</p>

![React Query Builder](https://github.com/vojtechportes/react-query-builder/blob/master/example.png)

---

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
  - [Fields](#fields)
  - [Data](#data)
  - [Builder Props](#builder-props)
  - [Components](#components)
- [Theming](#theming)
- [Localization](#localization)

---

## Installation

```bash
npm install @vojtechportes/react-query-builder
```

React Query Builder supports React `18+`.

---

## Usage

```typescript
import React, { useState } from 'react';
import {
  Builder,
  IBuilderFieldProps,
  IBuilderComponentsProps,
  DenormalizedQuery,
} from '@vojtechportes/react-query-builder';

const fields: IBuilderFieldProps[] = [
  {
    field: 'STATE',
    label: 'State',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL'],
    value: [
      { value: 'CZ', label: 'Czech Republic' },
      { value: 'SK', label: 'Slovakia' },
    ],
  },
  {
    field: 'IS_IN_EU',
    label: 'Is in EU',
    type: 'BOOLEAN',
  },
];

const initialData: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'IS_IN_EU',
        value: false,
      },
    ],
  },
];

const components: IBuilderComponentsProps = {
  // Optional custom components
};

export const MyBuilder: React.FC = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Builder
      fields={fields}
      data={data}
      components={components}
      onChange={setData}
    />
  );
};
```

---

## Configuration

React Query Builder is designed to be highly configurable. You can control:

- field definitions
- initial and controlled query data
- drag and drop support
- read-only behavior
- supported group types
- theming
- custom components
- localization

### Fields

```typescript
import { IBuilderFieldProps } from '@vojtechportes/react-query-builder';

const fields: IBuilderFieldProps[] = [
  {
    field: 'STATE',
    label: 'State',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL'],
    value: [
      { value: 'CZ', label: 'Czech Republic' },
      { value: 'SK', label: 'Slovakia' },
      { value: 'PL', label: 'Poland' },
    ],
  },
  {
    field: 'IS_IN_EU',
    label: 'Is in EU',
    type: 'BOOLEAN',
  },
];
```

Each field can define:

- `field`: unique field identifier
- `label`: label shown in the UI
- `type`: field type
- `operators`: allowed operators for the field
- `value`: source value for `LIST`, `MULTI_LIST`, or `STATEMENT`

#### Type

Type can be any of:

```
BOOLEAN
TEXT
DATE
NUMBER
STATEMENT
LIST
MULTI_LIST
GROUP (*)
```

`GROUP` is only used in the query data, not in field definitions.

#### Operators

Operator can be any of:

```
LARGER
SMALLER
LARGER_EQUAL
SMALLER_EQUAL
EQUAL
NOT_EQUAL
ALL_IN
ANY_IN
NOT_IN
BETWEEN
NOT_BETWEEN
LIKE
NOT_LIKE
```

### Data

`data` is a controlled prop. Pass an array of rules and groups, and update it through `onChange`.

#### Group with modifiers

```typescript
const data = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'IS_IN_EU',
        value: false,
      },
    ],
  },
];
```

#### Group without modifiers

```typescript
const data = [
  {
    type: 'GROUP',
    children: [
      {
        field: 'IS_IN_EU',
        value: false,
      },
    ],
  },
];
```

Groups without modifiers do not render `Not`, `And`, or `Or`, and they do not output `value` or `isNegated`.

### Builder Props

Important `Builder` props:

- `fields: IBuilderFieldProps[]`
- `data: DenormalizedQuery`
- `onChange?: (data: DenormalizedQuery) => void`
- `components?: IBuilderComponentsProps`
- `strings?: IStrings`
- `readOnly?: boolean`
- `draggable?: boolean`
- `singleRootGroup?: boolean`
- `groupTypes?: 'with-modifiers' | 'without-modifiers' | 'both'`

#### `readOnly`

When `readOnly` is `true`, editing controls and drag-and-drop behavior are disabled.

#### `draggable`

When `draggable` is `true`, rules and groups render drag handles and can be:

- reordered within the same group
- moved between groups
- moved between root and nested groups
- reordered at the root level

When `draggable` is `false`, no drag handles or drop zones are rendered.

#### `singleRootGroup`

When `singleRootGroup` is `true`, the builder is locked to exactly one root group.

- root-level rules cannot be added
- additional root-level groups cannot be added
- the root group cannot be deleted
- the root group cannot be dragged
- root-level drop zones are not rendered

Nested rules and groups inside the root group still work normally.

If the incoming `data` contains root-level rules or multiple root items, React Query Builder wraps them into a single root group automatically.

#### `groupTypes`

Controls what kinds of groups users can add:

- `'with-modifiers'` (default)
- `'without-modifiers'`
- `'both'`

When set to `'both'`, the `Add Group` action becomes a popover that lets the user choose which group type to create.

### Components

You can fully customize the rendered components through the `components` prop.

Supported component overrides:

```typescript
const components: IBuilderComponentsProps = {
  form: {
    Select: MyCustomSelect,
    SelectMulti: MyCustomSelectMulti,
    Switch: MyCustomSwitch,
    Input: MyCustomInput,
  },
  Remove: MyCustomRemoveButton,
  Add: MyCustomAddButton,
  Rule: MyCustomRule,
  Group: MyCustomGroup,
  GroupHeaderOption: MyCustomGroupHeaderOption,
  Text: MyCustomText,
  DropZone: MyCustomDropZone,
  EmptyGroupDropZone: MyCustomEmptyGroupDropZone,
  Popover: MyCustomPopover,
  PopoverItem: MyCustomPopoverItem,
};
```

This lets you customize not only rules and groups, but also:

- drag-and-drop placeholders
- the popover used for multi-group-type selection
- form controls
- add/remove buttons

All custom components should follow the typings of the built-in components.

---

## Theming

React Query Builder uses a `ThemeProvider` and exports default `colors`.

```typescript
import React from 'react';
import {
  Builder,
  ThemeProvider,
  colors,
  IColors,
} from '@vojtechportes/react-query-builder';

const customColors: IColors = {
  ...colors,
  white: '#fafafa',
  primary: {
    ...colors.primary,
    default: '#0057b8',
  },
};

export const App: React.FC = () => (
  <ThemeProvider colors={customColors}>
    <Builder fields={fields} data={data} onChange={console.log} />
  </ThemeProvider>
);
```

The theme currently controls the built-in color system used by buttons, form fields, groups, rules, popovers, drag handles, and drop zones.

---

## Localization

To localize React Query Builder, pass a `strings` object to `Builder`.

```typescript
import { IStrings } from '@vojtechportes/react-query-builder';

const strings: IStrings = {
  group: {
    not: 'Not',
    or: 'Or',
    and: 'And',
    addRule: 'Add Rule',
    addGroup: 'Add Group',
    addGroupWithModifiers: 'With Modifiers',
    addGroupWithoutModifiers: 'Without Modifiers',
    delete: 'Delete',
  },
  rule: {
    delete: 'Delete',
  },
  form: {
    selectYourValue: 'Select your value',
  },
  operators: {
    LARGER: 'Larger',
    SMALLER: 'Smaller',
    LARGER_EQUAL: 'Larger or equal',
    SMALLER_EQUAL: 'Smaller or equal',
    EQUAL: 'Equal',
    NOT_EQUAL: 'Not equal',
    ALL_IN: 'All in',
    ANY_IN: 'Any in',
    NOT_IN: 'Not in',
    BETWEEN: 'Between',
    NOT_BETWEEN: 'Not between',
    LIKE: 'Like',
    NOT_LIKE: 'Not like',
  },
};
```

It is not required to translate every string. Any string you omit falls back to the built-in defaults.
