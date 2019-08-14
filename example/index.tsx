import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Builder, BuilderFieldProps } from '../src';
import { colors } from '../src/constants/colors';
import styled from 'styled-components';

const Code = styled.pre`
  background: ${colors.light};
  border: 1px solid ${colors.darker};
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.7rem;
`;

export const queryTree = [];

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
    operators: ['NOT_BETWEEN', 'EQUAL', 'NOT_EQUAL', 'BETWEEN'],
  },
  {
    field: 'HAS_LOW_CREDIT',
    label: 'Has low credits',
    type: 'STATEMENT',
    value: 'HAS_DEBT() AND IS_IN_INSOLVENCY_REGISTER()',
  },
];

const App = () => {
  // const data = assignIDs(queryTree);
  const [output, setOutput] = React.useState(queryTree);

  return (
    <>
      <Builder
        data={queryTree}
        fields={fields}
        onChange={data => setOutput(data)}
      />

      <h3>Output</h3>
      <Code>{JSON.stringify(output, null, 4)}</Code>
    </>
  );

  // return <div />
};

ReactDOM.render(<App />, document.getElementById('root'));
