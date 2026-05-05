import * as React from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import {
  Builder,
  IBuilderFieldProps,
  colors,
  type DenormalizedQuery,
} from '../../src';
import { Brand } from './components/brand';
import { Checkbox } from './components/checkbox';
import { Sidepanel } from './components/sidepanel';
import { SmallButton } from './components/small-button';
import { Theme } from './components/theme';
import {
  IThemeProviderProps,
  ThemeProvider,
} from '../../src/theme-provider/theme-provider';

const Page = styled.div`
  padding: 2rem;
  font-family: Arial, sans-serif;
  color: #373737;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
`;

const Main = styled.main`
  min-width: 0;
`;

const PanelSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PanelDivider = styled.hr`
  width: 100%;
  margin: 0;
  border: 0;
  border-top: 1px solid ${colors.grey['300']};
`;

const PanelSectionTitle = styled.h3`
  margin: 0;
  font-size: 0.9rem;
`;

const Code = styled.pre`
  margin: 1rem 0 0;
  padding: 1rem;
  font-size: 0.75rem;
  background: ${colors.grey['100']};
  border: 1px solid ${colors.grey['300']};
  overflow: auto;
`;

const initialQueryTree: DenormalizedQuery = [
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
        type: 'GROUP',
        value: 'OR',
        isNegated: false,
        children: [
          {
            field: 'CUSTOMER_CITY',
            operator: 'EQUAL',
            value: 'Prague',
          },
          {
            field: 'ORDER_TOTAL',
            operator: 'BETWEEN',
            value: [2500, 12000],
          },
        ],
      },
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
            field: 'IS_VAT_PAYER',
            operator: 'EQUAL',
            value: true,
          },
          {
            field: 'CUSTOMER_SEGMENTS',
            operator: 'ALL_IN',
            value: ['B2B', 'Priority'],
          },
          {
            type: 'GROUP',
            value: 'OR',
            isNegated: false,
            children: [
              {
                field: 'COMPANY_NAME',
                operator: 'CONTAINS',
                value: 'Prague',
              },
              {
                field: 'ORDER_CREATED_AT',
                operator: 'LARGER_EQUAL',
                value: '2025-01-01',
              },
            ],
          },
        ],
      },
    ],
  },
];

const fields: IBuilderFieldProps[] = [
  {
    field: 'CUSTOMER_COUNTRY',
    label: 'Customer country',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL', 'IN', 'NOT_IN', 'IS_NULL', 'IS_NOT_NULL'],
    value: [
      { value: 'CZ', label: 'Czech Republic' },
      { value: 'SK', label: 'Slovakia' },
      { value: 'DE', label: 'Germany' },
      { value: 'AT', label: 'Austria' },
    ],
  },
  {
    field: 'CUSTOMER_SEGMENTS',
    label: 'Customer segments',
    type: 'MULTI_LIST',
    operators: ['ALL_IN', 'ANY_IN', 'IN', 'NOT_IN'],
    value: [
      { value: 'B2B', label: 'B2B' },
      { value: 'Retail', label: 'Retail' },
      { value: 'Priority', label: 'Priority' },
      { value: 'Dormant', label: 'Dormant' },
    ],
  },
  {
    field: 'IS_IN_EU',
    label: 'Customer is in EU',
    type: 'BOOLEAN',
    operators: ['EQUAL', 'NOT_EQUAL'],
  },
  {
    field: 'IS_VAT_PAYER',
    label: 'Customer is VAT payer',
    type: 'BOOLEAN',
    operators: ['EQUAL', 'NOT_EQUAL', 'IS_NULL', 'IS_NOT_NULL'],
  },
  {
    field: 'CUSTOMER_CITY',
    label: 'Customer city',
    type: 'TEXT',
    operators: [
      'EQUAL',
      'NOT_EQUAL',
      'CONTAINS',
      'NOT_CONTAINS',
      'STARTS_WITH',
      'ENDS_WITH',
      'LIKE',
      'NOT_LIKE',
      'IS_NULL',
      'IS_NOT_NULL',
    ],
  },
  {
    field: 'ORDER_TOTAL',
    label: 'Order total',
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
      'IS_NULL',
      'IS_NOT_NULL',
    ],
  },
  {
    field: 'ORDER_CREATED_AT',
    label: 'Order created at',
    type: 'DATE',
    operators: [
      'EQUAL',
      'NOT_EQUAL',
      'BETWEEN',
      'NOT_BETWEEN',
      'LARGER',
      'SMALLER',
      'LARGER_EQUAL',
      'SMALLER_EQUAL',
      'IS_NULL',
      'IS_NOT_NULL',
    ],
  },
  {
    field: 'COMPANY_NAME',
    label: 'Company name',
    type: 'TEXT',
    operators: [
      'EQUAL',
      'NOT_EQUAL',
      'CONTAINS',
      'NOT_CONTAINS',
      'STARTS_WITH',
      'ENDS_WITH',
      'IS_NULL',
      'IS_NOT_NULL',
    ],
    validation: {
      required: true,
    },
  },
  {
    field: 'DELIVERY_WINDOW',
    label: 'Delivery window',
    type: 'TEXT',
    operators: ['BETWEEN', 'NOT_BETWEEN'],
  },
  {
    field: 'RISK_NOTE',
    label: 'Risk note',
    type: 'STATEMENT',
    value: 'HAS_DEBT() AND LAST_PAYMENT_DAYS_AGO() > 30',
  },
];

const App: React.FC = () => {
  const [output, setOutput] =
    React.useState<DenormalizedQuery>(initialQueryTree);
  const [readOnly, setReadOnly] = React.useState(false);
  const [draggable, setDraggable] = React.useState(false);
  const [singleRootGroup, setSingleRootGroup] = React.useState(true);
  const [showValidationErrors, setShowValidationErrors] = React.useState(true);
  const [theme, setTheme] = React.useState<IThemeProviderProps>({
    colors,
  });

  return (
    <Page>
      <Brand />
      <Layout>
        <Sidepanel title="Example Controls">
          <PanelSection>
            <PanelSectionTitle>Builder</PanelSectionTitle>

            <Checkbox
              checked={readOnly}
              label="Read-only"
              onChange={setReadOnly}
            />
            <Checkbox
              checked={draggable}
              label="Draggable"
              onChange={setDraggable}
            />
            <Checkbox
              checked={singleRootGroup}
              label="Single root group"
              onChange={setSingleRootGroup}
            />
            <Checkbox
              checked={showValidationErrors}
              label="Show validation errors"
              onChange={setShowValidationErrors}
            />

            <SmallButton
              onClick={() =>
                setOutput((value) => [
                  ...value,
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
                ])
              }
            >
              Add group to query
            </SmallButton>
          </PanelSection>

          <PanelDivider />

          <Theme
            onColorsChange={(nextColors) => {
              setTheme((value) => ({ ...value, colors: nextColors }));
            }}
          />
        </Sidepanel>

        <Main>
          <ThemeProvider colors={theme.colors}>
            <Builder
              data={output}
              fields={fields}
              readOnly={readOnly}
              onChange={setOutput}
              draggable={draggable}
              groupTypes="both"
              singleRootGroup={singleRootGroup}
              showValidation={showValidationErrors}
            />
          </ThemeProvider>

          <h3>Output</h3>
          <Code>{JSON.stringify(output, null, 2)}</Code>
        </Main>
      </Layout>
    </Page>
  );
};

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(<App />);
