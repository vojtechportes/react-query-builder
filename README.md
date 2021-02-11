<h1>:information_source: RFC 1.x.x</h1>
<p>Please note that right now I am planning to start working on version 1.x.x. It will involve lot of refactoring, new features and some breaking changes. I will try to introduce ways how to keep things backwards compatible though.</p>
<p>If you are interested, check https://github.com/vojtechportes/react-query-builder/issues/37 for RFC and let me know what you think and what new features you would welcome.</p>
<hr />

<h1 align="center">
  <img src="https://i.imgur.com/VXiYZ8g.png" alt="React Query Builder" />
</h1>

<h3 align="center">
  Simple, highly configurable query builder<br /> for React written in TypeSript


</h3>
<p align="center">
<a href="https://www.npmjs.com/package/@vojtechportes/react-query-builder" target="_blank"><img src="https://badge.fury.io/js/%40vojtechportes%2Freact-query-builder.svg" alt="npm version" /></a> <a href="https://opensource.org/licenses/MIT" target="_blank"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a> <a href="https://travis-ci.org/vojtechportes/react-query-builder" target="_blank"><img src="https://travis-ci.org/vojtechportes/react-query-builder.svg?branch=master" alt="Travis CI Status" /></a> 
<a href="https://coveralls.io/github/vojtechportes/react-query-builder?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/vojtechportes/react-query-builder/badge.svg?branch=master" alt="Coverage Status" /></a> <a href="https://deepscan.io/dashboard#view=project&tid=5247&pid=7017&bid=64425" target="_blank"><img src="https://deepscan.io/api/teams/5247/projects/7017/branches/64425/badge/grade.svg" alt="DeepScan grade"></a>
</p>
<br />

---

- [Installation](#installation)
- [Demo](#demo)
- [Usage](#usage)
- [Configuration](#configuration)
  - [Fields](#lets-start-with-fields)
    - [Field](#field)
    - [Label](#label)
    - [Type](#type)
    - [Operators](#operators)
    - [Value](#value)
  - [Data](#data)
  - [Components](#components)
  - [onChange](#onchange)
- [Localization](#Localization)
- [Future development](#future-development)

---

## Installation

```bash
npm install @vojtechportes/react-query-builder
```

or

```bash
yarn add @vojtechportes/react-query-builder
```

## [Demo](https://react-query-builder-demo.herokuapp.com/)

with examples of field definition and custom components...<br />
...or check source code on [GitHub](https://github.com/vojtechportes/react-query-builder-demo)

<img src="https://i.imgur.com/N3smtv6.png" alt="React Query Builder" />

---

## Usage

```typescript
import React from 'react';
import {
  Builder,
  BuilderFieldProps,
  BuilderComponentsProps,
} from 'react-query-builder';

const fields: BuilderFieldProps[] = [
  // Fields configuration
];

const data: any = [
  // Initial query tree
];

const components: BuilderComponentsProps = {
  // Custom components configuration
};

const MyBuilder: React.FC = () => (
  <Builder
    readOnly={false}
    fields={fields}
    data={data}
    components={components}
    onChange={data => console.log(data)}
  />
);
```

---

## Configuration

Since React Query Builder is highly configurable, you can define look of the Query Builder, you can define and use your own components, set whether the Builder should be readOnly or not and of course, you will need to set up fields Query Builder will be using.

### Lets start with fields...

```typescript
import { BuilderFieldProps } from 'react-query-builder';

const fields: BuilderFieldProps[] = [
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
        type: 'BOOLEAN'
    }
];
```

As you can see, there are few things you can define. `field`, `label`, `type`, `operators` and `value`.

#### Field

Field is a key and needs to be unique, since it is used to reference field in query tree as you will see further down in documentation.

#### Label

Label is pretty obvious, so lets skip to type.

#### Type

Type can be any of following constants:

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

\* GROUP type is not intended to be used in field props definition but only in data object.

#### Operators

Operator can be array of following constants

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

#### Value

Value can be either string (STATEMENT) or array of objects with value and label keys (LIST, MULTI_LIST). Values for other types are empty by default.

### Data

Data can be either empty array or array of rules and groups.

```Typescript
[
    {
        "type": "GROUP",
        "value": "AND",
        "isNegated": false,
        "children": [
            {
                "field": "IS_IN_EU", // <- Type here is refering to field property in fields configuration
                "value": false
            }
        ]
    }
]
```

### Components

Components is set of components you can use to customize React Query Builder. You can either just style them using [styled-components](https://www.styled-components.com/ 'styled-components') or use your own components as long as they follow typings of original components.

You can customize following componetns

```
Select
SelectMulti
Switch
Input
Remove
Add
Component
Group
GroupHeaderOption
```

via config object

```typescript
const components: BuilderComponentsProps = {
  form: {
    Select: MyCustomSelect,
    SelectMulti: MyCustomSelectMulti,
    Switch: MyCustomSwitch,
    Input: MyCustomInput,
  },
  Remove: MyCustomRemove,
  Add: MyCustomAdd,
  Component: MyCustomComponent,
  Group: MyCustomGroup,
  GroupHeaderOption: MyCustomHeaderOption,
};
```

### onChange

onChange property is allowing you to retrieve query tree after every change that occures in React Query Builder.

---

## Localization

To either use custom strings or localize ReactBuilder, you can use strings property on Builder component.

You can work with object of following format:

```typescript
const strings: Strings = {
  "group": {
    "not": "Not",
    "or": "Or",
    "and": "And",
    "addRule": "Add Rule",
    "addGroup": "Add Group",
    "delete": "Delete"
  },
  "components": {
    "delete": "Delete"
  },
  "form": {
    "selectYourValue": "Select your value"
  },
  "operators": {
    "LARGER": "Larger",
    "SMALLER": "Smaller",
    "LARGER_EQUAL": "Larger or equal",
    "SMALLER_EQUAL": "Smaller or equal",
    "EQUAL": "Equal",
    "NOT_EQUAL": "Not equal",
    "ALL_IN": "All in",
    "ANY_IN": "Any in",
    "NOT_IN": "Not in",
    "BETWEEN": "Between",
    "NOT_BETWEEN": "Not between"
  }
};
```

It is not required to translate all the strings. Strings that are not specified by you will be loaded from default strings.

To work with multiple locales, you can use for example amazing [i18next framework](https://www.i18next.com/ 'i18next framework').

```typescript
import React from 'react';
import { Builder, Strings } from '@vojtechportes/react-query-builder';
import { Trans, useTranslation } from 'react-i18next';

export const QueryBuiler:React.FC = () => {
  useTranslation('query-builder')

  const strings: Strings = {
    operators: {
      LARGER: <Trans ns="query-builder" i18nKey="larger" />,
      SMALLER: <Trans ns="query-builder" i18nKey="smaller" />
      /* And so on */
    }
  };

  return (
    <Builder
      strings={strings}
      fields={fields}
      data={[]}
      onChange={(data: any) => console.log(data)} 
      />
  );
};
```

#Feature development

Please check https://github.com/vojtechportes/react-query-builder/issues/37
