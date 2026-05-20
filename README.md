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

<p align="center">
  <a href="https://vojtechportes.github.io/react-query-builder/documentation">Documentation</a>
  ·
  <a href="https://vojtechportes.github.io/react-query-builder/demo">Demo</a>
</p>

![React Query Builder](https://github.com/vojtechportes/react-query-builder/blob/master/example.png)

---

React Query Builder is a TypeScript library for building nested filter editors,
formatting them into external query syntaxes, and parsing supported expressions
back into builder state.

Full documentation, API reference, and the interactive demo are available on
the project website:

- [Documentation](https://vojtechportes.github.io/react-query-builder/documentation)
- [API](https://vojtechportes.github.io/react-query-builder/api)
- [Demo](https://vojtechportes.github.io/react-query-builder/demo)

## Installation

```bash
npm install @vojtechportes/react-query-builder
```

React Query Builder supports React `18+`.

## Example

```tsx
import React, { useState } from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
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
        operator: 'EQUAL',
        value: true,
      },
    ],
  },
];

export const MyBuilder = () => {
  const [data, setData] = useState(initialData);

  return <Builder fields={fields} data={data} onChange={setData} />;
};
```

## Query Conversion

The library also provides parser and formatter helpers through subpath exports:

- `@vojtechportes/react-query-builder/formatQuery`
- `@vojtechportes/react-query-builder/parseQuery`

Supported formats are documented on the website:

- [Parsing and Formatting](https://vojtechportes.github.io/react-query-builder/documentation/parsing-and-formatting)
- [Supported Formats](https://vojtechportes.github.io/react-query-builder/documentation/parsing-and-formatting/supported-formats)
- [formatQuery API](https://vojtechportes.github.io/react-query-builder/api/format-query)
- [parseQuery API](https://vojtechportes.github.io/react-query-builder/api/parse-query)
