<h1 align="center">
  <img src="https://github.com/vojtechportes/react-query-builder/blob/master/logo.png" alt="React Query Builder" />
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
- [Parsing And Formatting](#parsing-and-formatting)
- [Configuration](#configuration)
  - [Fields](#fields)
    - [Type](#type)
    - [Operators](#operators)
    - [Validation](#validation)
  - [Data](#data)
    - [Group With Modifiers](#group-with-modifiers)
    - [Group Without Modifiers](#group-without-modifiers)
    - [Node-level Read-only](#node-level-read-only)
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

## Parsing And Formatting

React Query Builder also provides separate subpath exports for converting between
the builder's native `DenormalizedQuery` format and other query formats.

### Format query to SQL

```typescript
import {
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const fields: IBuilderFieldProps[] = [
  {
    field: 'CUSTOMER_COUNTRY',
    label: 'Customer country',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL', 'IN', 'NOT_IN'],
    value: [
      { value: 'CZ', label: 'Czech Republic' },
      { value: 'SK', label: 'Slovakia' },
    ],
  },
  {
    field: 'ORDER_TOTAL',
    label: 'Order total',
    type: 'NUMBER',
    operators: ['BETWEEN', 'LARGER_EQUAL'],
  },
];

const data: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'CUSTOMER_COUNTRY',
        operator: 'EQUAL',
        value: 'CZ',
      },
      {
        field: 'ORDER_TOTAL',
        operator: 'BETWEEN',
        value: [1000, 5000],
      },
    ],
  },
];

const sql = formatQuery(data, 'SQL', {
  fields,
  wrapWhereClause: true,
});

// WHERE (CUSTOMER_COUNTRY = 'CZ' AND ORDER_TOTAL BETWEEN 1000 AND 5000)
```

`formatQuery` signature:

```typescript
const formatQuery: (
  value: DenormalizedQuery,
  format: 'SQL',
  options?: {
    fields?: IBuilderFieldProps[];
    rootlessCombinator?: 'AND' | 'OR';
    modifierlessGroupCombinator?: 'AND' | 'OR';
    wrapWhereClause?: boolean;
  }
) => string;
```

Options:

- `fields`: optional field metadata used during formatting
- `rootlessCombinator`: how root-level items are combined when there is no root group
- `modifierlessGroupCombinator`: how children of groups without modifiers are combined
- `wrapWhereClause`: prefixes the output with `WHERE `

### Format query to Mongo

```typescript
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const mongo = formatQuery(data, 'Mongo');

// {
//   "$and": [
//     { "CUSTOMER_COUNTRY": "CZ" },
//     { "ORDER_TOTAL": { "$gte": 1000, "$lte": 5000 } }
//   ]
// }
```

`Mongo` formatting outputs a MongoDB filter document serialized as JSON.

### Format query to AQL

```typescript
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const aql = formatQuery(data, 'AQL', {
  variableName: 'doc',
});

// FILTER (doc.CUSTOMER_COUNTRY == "CZ" AND
//         (doc.ORDER_TOTAL >= 1000 AND doc.ORDER_TOTAL <= 5000))
```

`AQL` formatting targets `FILTER` expressions. You can customize:

- `variableName`: the AQL document variable prefix, default `doc`
- `wrapFilterClause`: whether to prefix the expression with `FILTER `

### Format query to JSONata

```typescript
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const jsonata = formatQuery(data, 'JSONata');

// (CUSTOMER_COUNTRY = "CZ" and
//  (ORDER_TOTAL >= 1000 and ORDER_TOTAL <= 5000))
```

`JSONata` formatting targets boolean/filter expressions over JSON data rather
than full transformation templates.

### Format query to JsonLogic

```typescript
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const jsonLogic = formatQuery(data, 'JsonLogic');

// {
//   "and": [
//     { "==": [{ "var": "CUSTOMER_COUNTRY" }, "CZ"] },
//     { "<=": [1000, { "var": "ORDER_TOTAL" }, 5000] }
//   ]
// }
```

`JsonLogic` formatting outputs a standard JsonLogic rule serialized as JSON.

### Format query to CEL

```typescript
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const cel = formatQuery(data, 'CEL');

// (CUSTOMER_COUNTRY == "CZ" &&
//  (ORDER_TOTAL >= 1000 && ORDER_TOTAL <= 5000))
```

`CEL` formatting targets boolean expressions compatible with Common Expression
Language predicate use cases.

### Format query to Elasticsearch

```typescript
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const elasticsearch = formatQuery(data, 'Elasticsearch', {
  wrapQueryClause: true,
});

// {
//   "query": {
//     "bool": {
//       "must": [
//         { "term": { "CUSTOMER_COUNTRY": "CZ" } },
//         { "range": { "ORDER_TOTAL": { "gte": 1000, "lte": 5000 } } }
//       ]
//     }
//   }
// }
```

`Elasticsearch` formatting outputs a Query DSL clause serialized as JSON.

### Format query to SpEL

```typescript
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const spel = formatQuery(data, 'SpEL');

// (CUSTOMER_COUNTRY == 'CZ' and
//  (ORDER_TOTAL >= 1000 and ORDER_TOTAL <= 5000))
```

`SpEL` formatting targets Spring Expression Language predicate expressions.

### Format query to Prisma

```typescript
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const prisma = formatQuery(data, 'Prisma', {
  wrapWhereClause: true,
});

// {
//   "where": {
//     "AND": [
//       { "CUSTOMER_COUNTRY": "CZ" },
//       { "ORDER_TOTAL": { "gte": 1000, "lte": 5000 } }
//     ]
//   }
// }
```

`Prisma` formatting outputs a Prisma `where` object serialized as JSON.

### Format query to OData

```typescript
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const odata = formatQuery(data, 'OData', {
  wrapFilterClause: true,
});

// $filter=(CUSTOMER_COUNTRY eq 'CZ' and
//          (ORDER_TOTAL ge 1000 and ORDER_TOTAL le 5000))
```

`OData` formatting targets OData `$filter` expressions.

### Format query to RSQL

```typescript
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const rsql = formatQuery(data, 'RSQL');

// (CUSTOMER_COUNTRY==CZ;(ORDER_TOTAL=ge=1000;ORDER_TOTAL=le=5000))
```

`RSQL` formatting targets builder-compatible RSQL / FIQL-style filter expressions.

### Format query to Dynamo

```typescript
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const dynamo = formatQuery(data, 'Dynamo');

// (CUSTOMER_COUNTRY = 'CZ' AND ORDER_TOTAL BETWEEN 1000 AND 5000)
```

`Dynamo` formatting targets raw DynamoDB filter expressions.

### Format query to Django

```typescript
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const django = formatQuery(data, 'Django');

// (Q(CUSTOMER_COUNTRY='CZ') & Q(ORDER_TOTAL__gte=1000, ORDER_TOTAL__lte=5000))
```

`Django` formatting targets `django.db.models.Q(...)` predicate expressions.

### Parse SQL to query builder input

```typescript
import { parseQuery } from '@vojtechportes/react-query-builder/parseQuery';

const result = parseQuery(
  "SELECT * FROM customers WHERE CUSTOMER_COUNTRY = 'CZ' AND ORDER_TOTAL >= 1000",
  'SQL'
);

console.log(result.fields);
console.log(result.data);
```

`parseQuery` signature:

```typescript
const parseQuery: (
  value: string,
  format:
    | 'SQL'
    | 'Mongo'
    | 'AQL'
    | 'JSONata'
    | 'JsonLogic'
    | 'CEL'
    | 'Elasticsearch'
    | 'SpEL'
    | 'Prisma'
    | 'OData'
    | 'RSQL'
    | 'Dynamo'
    | 'Django'
) => {
  fields: IBuilderFieldProps[];
  data: DenormalizedQuery;
};
```

### Parse Mongo to query builder input

```typescript
import { parseQuery } from '@vojtechportes/react-query-builder/parseQuery';

const result = parseQuery(
  JSON.stringify({
    $and: [
      { CUSTOMER_COUNTRY: 'CZ' },
      { ORDER_TOTAL: { $gte: 1000, $lte: 5000 } },
    ],
  }),
  'Mongo'
);
```

The current SQL implementation is focused on builder-compatible filter
expressions. SQL support includes:

- comparison operators like `=`, `<>`, `>`, `>=`, `<`, `<=`
- `AND`, `OR`, `NOT`, and nested parentheses
- `IN`, `NOT IN`, `BETWEEN`, `NOT BETWEEN`
- `IS NULL`, `IS NOT NULL`
- `LIKE`, `NOT LIKE`, including mapping simple wildcard patterns to
  `CONTAINS`, `STARTS_WITH`, and `ENDS_WITH`
- parsing either a raw predicate or the `WHERE` portion of a larger SQL query

Mongo support includes:

- logical operators like `$and`, `$or`, and `$nor`
- direct equality and field operator objects
- comparison operators like `$gt`, `$gte`, `$lt`, `$lte`, `$ne`, and `$eq`
- array operators like `$in`, `$nin`, and `$all`
- regex expressions mapped to `CONTAINS`, `STARTS_WITH`, `ENDS_WITH`, `LIKE`,
  `NOT_CONTAINS`, and `NOT_LIKE`
- parsing and formatting MongoDB filter documents serialized as JSON strings

AQL support includes:

- comparison operators like `==`, `!=`, `>`, `>=`, `<`, `<=`
- `AND`, `OR`, `NOT`, and nested parentheses
- `IN`, `NOT IN`, and `LIKE`, `NOT LIKE`
- null checks using `== null` and `!= null`
- parsing either a raw AQL filter expression or the `FILTER` portion of a
  larger `FOR ... FILTER ... RETURN ...` query
- configurable variable prefixes such as `doc`, `item`, or `current` during formatting

JSONata support includes:

- comparison operators like `=`, `!=`, `>`, `>=`, `<`, `<=`
- `and`, `or`, and `$not(...)`
- `in` array membership expressions
- string matching through `$contains(...)` with either strings or regex patterns
- JSONata filter-style expressions rather than full transformation programs

JsonLogic support includes:

- comparison operators like `==`, `!=`, `>`, `>=`, `<`, `<=`
- boolean groups through `and`, `or`, and `!`
- array and string membership through `in`
- array quantifiers through `all` and `some`
- JsonLogic rules serialized as JSON strings for both formatting and parsing

CEL support includes:

- comparison operators like `==`, `!=`, `>`, `>=`, `<`, `<=`
- boolean groups through `&&`, `||`, and `!`
- array membership through `in`
- collection macros through `.all(...)` and `.exists(...)`
- string methods like `.contains(...)`, `.startsWith(...)`, `.endsWith(...)`, and `.matches(...)`

Elasticsearch support includes:

- `bool.must`, `bool.should`, and `bool.must_not`
- `term`, `terms`, `range`, and `exists` queries
- string matching through `prefix` and `wildcard`
- parsing either a raw Query DSL clause or a `{ "query": ... }` wrapper

SpEL support includes:

- comparison operators like `==`, `!=`, `>`, `>=`, `<`, `<=`
- boolean groups through `and`, `or`, and `!`
- inline list membership via `{...}.contains(...)`
- collection-based `ALL_IN` and `ANY_IN` expressions using selection and `.size()`
- string methods like `.contains(...)`, `.startsWith(...)`, `.endsWith(...)`, and regex `matches`

Prisma support includes:

- `AND`, `OR`, and `NOT` groups
- scalar filters like `gt`, `gte`, `lt`, `lte`, `in`, `notIn`, and `not`
- string filters like `contains`, `startsWith`, and `endsWith`
- scalar-list filters like `hasEvery` and `hasSome`
- parsing either a raw Prisma `where` object or a `{ "where": ... }` wrapper

OData support includes:

- comparison operators like `eq`, `ne`, `gt`, `ge`, `lt`, `le`
- boolean groups through `and`, `or`, and `not`
- string functions like `contains`, `startswith`, and `endswith`
- parsing either a raw filter expression or a `$filter=...` wrapper

RSQL support includes:

- comparison operators like `==`, `!=`, `=gt=`, `=ge=`, `=lt=`, and `=le=`
- boolean groups through `;` for `AND`, `,` for `OR`, and nested parentheses
- set operators `=in=` and `=out=`
- wildcard-based string matching that maps `*value*`, `value*`, and `*value`
  to `CONTAINS`, `STARTS_WITH`, and `ENDS_WITH`
- collapsed parsing and formatting for builder-friendly `BETWEEN`, `NOT_BETWEEN`,
  `ALL_IN`, and `ANY_IN` patterns

Dynamo support includes:

- comparison operators like `=`, `<>`, `>`, `>=`, `<`, and `<=`
- boolean groups through `AND`, `OR`, and `NOT`
- `IN` and `BETWEEN`
- null-style checks through `attribute_exists(...)` and `attribute_not_exists(...)`
- string functions through `contains(...)` and `begins_with(...)`
- raw DynamoDB filter expressions only, without placeholder maps such as
  `ExpressionAttributeNames` or `ExpressionAttributeValues`

Django support includes:

- `Q(...)` expressions combined with `&`, `|`, and `~`
- common lookups like exact equality, `__gt`, `__gte`, `__lt`, `__lte`,
  `__in`, `__contains`, `__startswith`, `__endswith`, and `__isnull`
- grouped keyword arguments inside a single `Q(...)` call for builder-friendly
  cases like `BETWEEN`

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

#### Node-level read-only

Read-only can be set globally on `Builder`, but it can also be set directly in the query data on groups and rules.

```typescript
const data = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    readOnly: {
      enabled: true,
      inheritToChildren: true,
    },
    children: [
      {
        field: 'IS_IN_EU',
        operator: 'EQUAL',
        value: false,
      },
      {
        field: 'CUSTOMER_COUNTRY',
        operator: 'EQUAL',
        value: 'CZ',
        readOnly: true,
      },
    ],
  },
];
```

Supported shapes:

- rule: `readOnly?: boolean`
- group: `readOnly?: boolean | { enabled: boolean; inheritToChildren?: boolean }`

When a group or rule is read-only, it cannot be edited, deleted, or dragged.
If a group uses `inheritToChildren: true`, the read-only state is passed down to all descendants.

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
