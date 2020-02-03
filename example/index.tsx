import 'react-app-polyfill/ie11';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Builder, BuilderFieldProps } from '../src';
import { colors } from '../src/constants/colors';

const Code = styled.pre`
  margin: 1rem 0;
  padding: 1rem;
  font-size: 0.7rem;
  background: ${colors.light};
  border: 1px solid ${colors.darker};
`;

export const queryTree = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'IS_IN_CZ',
        value: false,
      },
    ],
  },
];

export const fields: BuilderFieldProps[] = [
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
    field: 'TEST_MULTI',
    label: 'Test Multi',
    type: 'MULTI_LIST',
    operators: ['ALL_IN', 'ANY_IN', 'NOT_IN'],
    value: [
      { value: 'LOREM', label: 'Lorem' },
      { value: 'IPSUM', label: 'Ipsum' },
      { value: 'DOLOR', label: 'Dolor' },
    ],
  },
  {
    field: 'IS_IN_EU',
    label: 'Is in EU',
    type: 'BOOLEAN',
  },
  {
    field: 'IS_IN_CZ',
    label: 'Is in CZ',
    type: 'BOOLEAN',
  },
  {
    field: 'IS_ACTIVE',
    label: 'Is Active',
    type: 'BOOLEAN',
  },
  {
    field: 'TEST_TEXT',
    label: 'Test text',
    type: 'TEXT',
    operators: ['NOT_BETWEEN', 'EQUAL', 'NOT_EQUAL', 'BETWEEN'],
  },
  {
    field: 'TEST_NUMBER',
    label: 'Test Number',
    type: 'NUMBER',
    operators: [
      'EQUAL',
      'NOT_EQUAL',
      'BETWEEN',
      'NOT_BETWEEN',
      'LARGER',
      'SMALLER',
      'LARGER_EQUAL',
      'SMALLER_EQUAL',
    ],
  },
  {
    field: 'TEST_DATE',
    label: 'Test Date',
    type: 'DATE',
    operators: ['NOT_EQUAL', 'NOT_BETWEEN'],
  },
  {
    field: 'BLAH',
    label: 'Blah',
    type: 'TEXT',
    operators: [
      'NOT_BETWEEN',
      'EQUAL',
      'NOT_EQUAL',
      'BETWEEN',
      'LIKE',
      'NOT_LIKE',
    ],
  },
  {
    field: 'HAS_LOW_CREDIT',
    label: 'Has low credits',
    type: 'STATEMENT',
    value: 'HAS_DEBT() AND IS_IN_INSOLVENCY_REGISTER()',
  },
];

const App = () => {
  const [output, setOutput] = React.useState(queryTree);
  const [readOnly, setReadOnly] = React.useState(false);

  return (
    <>
      <a href="#" onClick={() => setReadOnly(!readOnly)}>
        Read Only
      </a>
      <Builder
        data={queryTree}
        fields={fields}
        readOnly={readOnly}
        onChange={setOutput}
      />

      <h3>Output</h3>
      <Code>{JSON.stringify(output, null, 4)}</Code>
    </>
  );

  // return <div />
};

ReactDOM.render(<App />, document.getElementById('root'));
