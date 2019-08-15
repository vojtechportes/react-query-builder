# React Query Builder

*Simple, highly configurable query builder for React written in TypeSript*

## Installation

```bash
npm install @vojtechportes/react-query-builder
```
or
```bash
yarn add @vojtechportes/react-query-builder
```

------------


## Usage

```typescript
import React from 'react';
import { Builder, 
         BuilderFieldProps,
	 BuilderComponentsProps } from 'react-query-builder';

const fields:BuilderFieldProps[] = [
    // Fields configuration
]

const data: any = [
    // Initial query tree
]

const components: BuilderComponentsProps = {
    // Custom components configuration
}

const MyBuilder:React.FC = () => (
    <Builder
        fields={fields}
        data={data}
        components={components}
        onChange={data => console.log(data)}
        />
);
```

------------


## Configuration
Since React Query Builder is highly configurable, you can define look of the Query Builder, you can define and use your own components and of course, you will need to set up fields Query Builder will be using. 

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
GROUP
```

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
NOT_IT
BETWEEN
NOT_BETWEEN
```

#### Value
Value can be either string (STATEMENT) or array of objects with value and label keys (LIST, LIST_MULTI). Values for other types are empty by default.

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

------------

### Components
Components is set of components you can use to customize React Query Builder. You can either just style them using [styled-components](https://www.styled-components.com/ "styled-components") or use your own components as long as they follow typings of original components.

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
        Input: MyCustomInput
    },
    Remove: MyCustomRemove,
    Add: MyCustomAdd,
    Component: MyCustomComponent,
    Group: MyCustomGroup,
    GroupHeaderOption: MyCustomHeaderOption
};
```

### OnChange

onChange property is allowing you to retrieve query tree after every change that occures in React Query Builder.
