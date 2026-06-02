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
  <a href="https://vojtechportes.github.io/react-query-builder/documentation" target="_blank" rel="noopener noreferrer">Documentation</a>
  ·
  <a href="https://vojtechportes.github.io/react-query-builder/demo" target="_blank" rel="noopener noreferrer">Demo</a>
</p>

![React Query Builder](https://github.com/vojtechportes/react-query-builder/blob/master/example.png)

---

React Query Builder is a TypeScript library for building nested filter editors,
formatting them into external query syntaxes, and parsing supported expressions
back into builder state.

It also supports an optional SQL text mode for `Builder`, with built-in syntax
and semantic validation, plus an optional Monaco-based advanced editor
integration for protected locked ranges.

Full documentation, API reference, and the interactive demo are available on
the project website:

- <a href="https://vojtechportes.github.io/react-query-builder/documentation" target="_blank" rel="noopener noreferrer">Documentation</a>
- <a href="https://vojtechportes.github.io/react-query-builder/api" target="_blank" rel="noopener noreferrer">API</a>
- <a href="https://vojtechportes.github.io/react-query-builder/demo" target="_blank" rel="noopener noreferrer">Demo</a>

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
        field: 'STATE',
        operator: 'EQUAL',
        value: 'CZ',
        readOnly: true,
      },
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

## UI Adapters

The package also exposes ready-made component mappings through versioned
subpath exports:

- `@vojtechportes/react-query-builder/mui/v9` for new Material UI projects
- `@vojtechportes/react-query-builder/mui/v7` for applications still on MUI 7
- `@vojtechportes/react-query-builder/bootstrap/v5` for Bootstrap 5 projects
- `@vojtechportes/react-query-builder/antd/v6` for new Ant Design projects
- `@vojtechportes/react-query-builder/antd/v5` for applications still on Ant Design 5
- `@vojtechportes/react-query-builder/mantine/v9` for new Mantine projects
- `@vojtechportes/react-query-builder/mantine/v8` for applications still on Mantine 8
- `@vojtechportes/react-query-builder/fluentui/v8` for Fluent UI React 8 projects

Install the peer dependencies that match the adapter you want to use and pass
the exported `components` object to `Builder`.

Bootstrap 5 example:

```tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Builder } from '@vojtechportes/react-query-builder';
import { components } from '@vojtechportes/react-query-builder/bootstrap/v5';

export const MyBootstrapBuilder = () => {
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

Material UI example:

```bash
npm install @mui/material@^9.0.1 @mui/icons-material@^9.0.1 @emotion/react @emotion/styled
```

```tsx
import React from 'react';
import { Builder } from '@vojtechportes/react-query-builder';
import { components } from '@vojtechportes/react-query-builder/mui/v9';

export const MyMuiBuilder = () => {
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

Ant Design example:

```bash
npm install antd@^6.0.0 @ant-design/icons@^6.0.0
```

```tsx
import React from 'react';
import { Builder } from '@vojtechportes/react-query-builder';
import { components } from '@vojtechportes/react-query-builder/antd/v6';

export const MyAntdBuilder = () => {
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

Mantine example:

```bash
npm install @mantine/core@^9.0.0 @mantine/hooks@^9.0.0
```

```tsx
import React from 'react';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Builder } from '@vojtechportes/react-query-builder';
import { components } from '@vojtechportes/react-query-builder/mantine/v9';

export const MyMantineBuilder = () => {
  return (
    <MantineProvider>
      <Builder
        fields={fields}
        data={data}
        components={components}
        onChange={setData}
      />
    </MantineProvider>
  );
};
```

Fluent UI example:

```bash
npm install @fluentui/react@^8.125.6
```

```tsx
import React from 'react';
import { Builder } from '@vojtechportes/react-query-builder';
import { components } from '@vojtechportes/react-query-builder/fluentui/v8';

export const MyFluentUiBuilder = () => {
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

`ThemeProvider` customizes the built-in default component set. It does not
theme the MUI, ANTD, Mantine, or Fluent UI adapters, which keep their styling in their host UI
libraries.

More adapter details:

- <a href="https://vojtechportes.github.io/react-query-builder/documentation/adapters" target="_blank" rel="noopener noreferrer">Documentation: Adapters</a>
- <a href="https://vojtechportes.github.io/react-query-builder/api/adapters" target="_blank" rel="noopener noreferrer">API: Adapters</a>

## Text Mode

`Builder` can optionally switch between the visual query UI and a SQL text
editor view.

```tsx
<Builder
  fields={fields}
  data={data}
  textMode
  defaultMode="text"
  onChange={setData}
/>;
```

For advanced text editing, the package also exposes
`@vojtechportes/react-query-builder/monaco`. The built-in editor is lightweight
and works without extra dependencies, while the Monaco integration is the
recommended path when locked query segments must stay protected in text mode.

- <a href="https://vojtechportes.github.io/react-query-builder/documentation/text-mode" target="_blank" rel="noopener noreferrer">Documentation: Text Mode</a>
- <a href="https://vojtechportes.github.io/react-query-builder/api/builder" target="_blank" rel="noopener noreferrer">API: Builder</a>
- <a href="https://vojtechportes.github.io/react-query-builder/api/components" target="_blank" rel="noopener noreferrer">API: Components</a>

## Read-only and Protected Editing

Rules and groups can be fully read-only or partially read-only through
`readOnly.targets`.

- Rule targets: `field`, `operator`, `value`
- Group targets: `combinator`, `negation`

Targeted read-only controls stay visible but become non-editable. When using
the Monaco text editor integration, protected SQL fragments remain locked while
users can still edit the unlocked parts of the query.

By default, deleting a group is also blocked when that delete would indirectly
remove read-only protected descendants. Set `readOnlyProtectsDelete={false}` on
`Builder` if you want to disable that subtree delete protection.

- <a href="https://vojtechportes.github.io/react-query-builder/documentation/locking-and-read-only" target="_blank" rel="noopener noreferrer">Documentation: Locking and Read-only</a>
- <a href="https://vojtechportes.github.io/react-query-builder/documentation/text-mode" target="_blank" rel="noopener noreferrer">Documentation: Text Mode</a>
- <a href="https://vojtechportes.github.io/react-query-builder/api/builder" target="_blank" rel="noopener noreferrer">API: Builder</a>
- <a href="https://vojtechportes.github.io/react-query-builder/api/data" target="_blank" rel="noopener noreferrer">API: Data</a>

## Query Conversion

The library also provides parser and formatter helpers through subpath exports:

- `@vojtechportes/react-query-builder/formatQuery`
- `@vojtechportes/react-query-builder/parseQuery`

Supported formats are documented on the website:

- <a href="https://vojtechportes.github.io/react-query-builder/documentation/parsing-and-formatting" target="_blank" rel="noopener noreferrer">Documentation: Parsing and Formatting</a>
- <a href="https://vojtechportes.github.io/react-query-builder/documentation/parsing-and-formatting/supported-formats" target="_blank" rel="noopener noreferrer">Documentation: Supported Formats</a>
- <a href="https://vojtechportes.github.io/react-query-builder/api/format-query" target="_blank" rel="noopener noreferrer">API: formatQuery</a>
- <a href="https://vojtechportes.github.io/react-query-builder/api/parse-query" target="_blank" rel="noopener noreferrer">API: parseQuery</a>

## Responsive Behavior

The default builder components include a compact responsive layout for medium-width screens.

- Rule rows reflow to preserve field, operator, action, and value legibility when horizontal space gets tighter.
- Multi-select values use a summarized closed state to avoid chip overflow.
- The default responsive behavior applies automatically when you use the built-in components.
- If you replace layout containers such as `components.Rule` or `components.Group`, your custom components are responsible for their own responsive behavior.

Responsive behavior is documented in more detail on the website:

- <a href="https://vojtechportes.github.io/react-query-builder/documentation/components" target="_blank" rel="noopener noreferrer">Documentation: Components</a>
- <a href="https://vojtechportes.github.io/react-query-builder/api/components" target="_blank" rel="noopener noreferrer">API: Components</a>
