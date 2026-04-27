import * as React from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import {
  Builder,
  BuilderFieldProps,
  colors,
} from '@vojtechportes/react-query-builder';

const Page = styled.div`
  padding: 2rem;
  font-family: Arial, sans-serif;
  color: #373737;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 0.75rem;
  background: #fff;
  border: 1px solid ${colors.medium};
  cursor: pointer;
`;

const Code = styled.pre`
  margin: 1rem 0 0;
  padding: 1rem;
  font-size: 0.75rem;
  background: ${colors.light};
  border: 1px solid ${colors.darker};
  overflow: auto;
`;

const initialQueryTree = [
  {
    type: 'GROUP' as const,
    value: 'AND' as const,
    isNegated: false,
    children: [
      {
        field: 'IS_IN_CZ',
        value: false,
      },
    ],
  },
];

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

const App: React.FC = () => {
  const [output, setOutput] = React.useState(initialQueryTree);
  const [readOnly, setReadOnly] = React.useState(false);

  return (
    <Page>
      <Toolbar>
        <ActionButton
          type="button"
          onClick={() => setReadOnly(value => !value)}
        >
          Toggle read-only
        </ActionButton>
        <ActionButton
          type="button"
          onClick={() =>
            setOutput(value => [
              ...value,
              {
                type: 'GROUP' as const,
                value: 'AND' as const,
                isNegated: false,
                children: [
                  {
                    field: 'IS_IN_EU',
                    value: false,
                  },
                ],
              },
            ])
          }
        >
          Append group to query
        </ActionButton>
      </Toolbar>

      <Builder
        data={output}
        fields={fields}
        readOnly={readOnly}
        onChange={setOutput}
      />

      <h3>Output</h3>
      <Code>{JSON.stringify(output, null, 2)}</Code>
    </Page>
  );
};

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(<App />);
