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
- [Example / Demo](#example--demo)
- [Usage](#usage)
- [Configuration](#configuration)
  - [Fields](#fields)
    - [Type](#type)
    - [Operators](#operators)
    - [Validation](#validation)
  - [Data](#data)
    - [Group With Modifiers](#group-with-modifiers)
    - [Group Without Modifiers](#group-without-modifiers)
    - [Number Values](#number-values)
  - [Builder Props](#builder-props)
    - [`readOnly`](#readonly)
    - [`draggable`](#draggable)
    - [`singleRootGroup`](#singlerootgroup)
    - [`groupTypes`](#grouptypes)
    - [`validator`](#validator)
    - [`onStateChange`](#onstatechange)
    - [`showValidation`](#showvalidation)
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

## Example / Demo

Try the live example here:

[https://vojtechportes.github.io/react-query-builder/](https://vojtechportes.github.io/react-query-builder/)

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
- validation rules
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
- `validation`: optional validation rules for the field

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
IN
NOT_IN
ALL_IN
ANY_IN
BETWEEN
NOT_BETWEEN
IS_NULL
IS_NOT_NULL
CONTAINS
NOT_CONTAINS
STARTS_WITH
ENDS_WITH
LIKE
NOT_LIKE
```

`ANY_IN`, `LIKE`, and `NOT_LIKE` are deprecated and will be removed in `2.0.0`.
Prefer `IN`, `CONTAINS`, and `NOT_CONTAINS`.

`IS_NULL` and `IS_NOT_NULL` are value-less operators, so the built-in UI does not render a value input for them.

#### Validation

Validation is defined per field and is type-aware.

```typescript
const fields: IBuilderFieldProps[] = [
  {
    field: 'NAME',
    label: 'Name',
    type: 'TEXT',
    operators: ['EQUAL', 'CONTAINS'],
    validation: {
      common: {
        required: true,
      },
      rules: [
        {
          operators: ['EQUAL', 'CONTAINS'],
          minLength: 2,
          maxLength: 50,
        },
      ],
    },
  },
  {
    field: 'PRICE',
    label: 'Price',
    type: 'NUMBER',
    operators: ['EQUAL', 'BETWEEN', 'NOT_BETWEEN'],
    validation: {
      common: {
        required: true,
      },
      rules: [
        {
          operators: ['EQUAL'],
          min: 0,
          max: 100,
        },
        {
          operators: ['BETWEEN', 'NOT_BETWEEN'],
          range: {
            common: {
              min: 0,
              max: 100,
            },
            start: {
              max: 80,
            },
            end: {
              min: 10,
            },
            requireAscending: true,
            allowEqual: false,
          },
        },
      ],
    },
  },
];
```

Built-in validation supports:

- operator-agnostic validation in `validation.common`
- operator-aware validation in `validation.rules`
- shared rules like `required`, `oneOf`, and `custom`
- text rules like `minLength`, `maxLength`, and `matches`
- number rules like `min`, `max`, `integer`, `positive`, and `negative`
- date rules like `minDate` and `maxDate`
- multi-list rules like `minItems` and `maxItems`
- range validation for `BETWEEN` and `NOT_BETWEEN`

If you use `range`, you can validate both values together and individually:

- `common`
- `start`
- `end`
- `requireAscending`
- `allowEqual`
- `validate`
- `message`

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

#### Number values

`NUMBER` fields emit numeric values in the builder output.

- standard numeric operators emit `number`
- `BETWEEN` and `NOT_BETWEEN` emit `number[]`

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
- `validator?: IBuilderValidator`
- `onStateChange?: (state: IBuilderStateChange) => void`
- `showValidation?: boolean`

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

`singleRootGroup` is enabled by default. When it is `true`, the builder is locked to exactly one root group.

- root-level rules cannot be added
- additional root-level groups cannot be added
- the root group cannot be deleted
- the root group cannot be dragged
- root-level drop zones are not rendered

Nested rules and groups inside the root group still work normally.

If the incoming `data` contains root-level rules or multiple root items, React Query Builder wraps them into a single root group automatically.

Set `singleRootGroup={false}` if you want to allow root-level rules, multiple root groups, and root-level drag-and-drop slots.

#### `groupTypes`

Controls what kinds of groups users can add:

- `'with-modifiers'` (default)
- `'without-modifiers'`
- `'both'`

When set to `'both'`, the `Add Group` action becomes a popover that lets the user choose which group type to create.

#### `validator`

`validator` lets you override the built-in validation engine with your own implementation.

The validator receives:

- the current query data
- builder validation context including `fields`, `singleRootGroup`, and `groupTypes`

It should return an `IBuilderValidationResult` or a promise resolving to one.

#### `onStateChange`

`onStateChange` emits the current builder state together with validation output:

```typescript
{
  data: DenormalizedQuery;
  isValid: boolean;
  validation: IBuilderValidationResult;
}
```

`onChange` still emits only the denormalized query data.

#### `showValidation`

When `showValidation` is `true`, the built-in `Rule` component renders validation issues under the affected rule.

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
- shared popovers used by single-select, multi-select, and multi-group-type selection
- form controls
- add/remove buttons

The built-in `Select` and `SelectMulti` are custom popover-based controls.
`SelectMulti` renders selected values as removable tags/chips.

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

The theme currently controls the built-in color system used by buttons, form fields, groups, rules, shared dropdown popovers, option states, drag handles, and drop zones.

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
    IN: 'In',
    ANY_IN: 'Any in',
    NOT_IN: 'Not in',
    BETWEEN: 'Between',
    NOT_BETWEEN: 'Not between',
    IS_NULL: 'Is null',
    IS_NOT_NULL: 'Is not null',
    CONTAINS: 'Contains',
    NOT_CONTAINS: 'Does not contain',
    STARTS_WITH: 'Starts with',
    ENDS_WITH: 'Ends with',
    LIKE: 'Like',
    NOT_LIKE: 'Not like',
  },
};
```

`ANY_IN`, `LIKE`, and `NOT_LIKE` are deprecated here as well and will be removed in `2.0.0`.

It is not required to translate every string. Any string you omit falls back to the built-in defaults.

Validation copy is also configurable through `strings.validation`, for example:

```typescript
const strings: IStrings = {
  validation: {
    required: 'This field is required',
    min: 'Value must be at least {min}',
    max: 'Value must be at most {max}',
    minItems: 'Select at least {min} values',
    maxItems: 'Select at most {max} values',
  },
};
```

Validation strings support placeholder replacement for values such as `{field}`, `{operator}`, `{min}`, and `{max}`.
