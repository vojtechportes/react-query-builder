import * as React from 'react';
import styled from 'styled-components';
import {
  Builder,
  useBuilderRef,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { waitForTimeout } from '../utils/wait-for-timeout.util';

const DemoCard = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #dbe4f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
`;

const fields: IBuilderFieldProps[] = [
  {
    field: 'COUNTRY',
    label: 'Country',
    type: 'LIST',
    operators: ['EQUAL'],
    value: [
      { value: 'CZ', label: 'Czech Republic' },
      { value: 'SK', label: 'Slovakia' },
      { value: 'DE', label: 'Germany' },
    ],
  },
  {
    field: 'CITY',
    label: 'City',
    type: 'LIST',
    operators: ['EQUAL'],
    value: [],
  },
];

const initialData: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            field: 'COUNTRY',
            operator: 'EQUAL',
            value: 'CZ',
          },
          {
            field: 'CITY',
            operator: 'EQUAL',
            value: 'PRG',
          },
        ],
      },
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            field: 'COUNTRY',
            operator: 'EQUAL',
            value: 'SK',
          },
          {
            field: 'CITY',
            operator: 'EQUAL',
            value: 'BTS',
          },
        ],
      },
    ],
  },
];

const cityOptionsByCountry: Record<string, { value: string; label: string }[]> =
  {
    CZ: [
      { value: 'PRG', label: 'Prague' },
      { value: 'BRN', label: 'Brno' },
      { value: 'OSR', label: 'Ostrava' },
    ],
    SK: [
      { value: 'BTS', label: 'Bratislava' },
      { value: 'KSC', label: 'Kosice' },
      { value: 'ZIL', label: 'Zilina' },
    ],
    DE: [
      { value: 'BER', label: 'Berlin' },
      { value: 'MUC', label: 'Munich' },
      { value: 'HAM', label: 'Hamburg' },
    ],
  };

export const ImperativeFieldOptionsDemo: React.FC = () => {
  const [data, setData] = React.useState<DenormalizedQuery>(initialData);
  const builderRef = useBuilderRef();
  React.useEffect(() => {
    return builderRef.bindRuleOptions('CITY', {
      dependencies: ['COUNTRY'],
      resolve: async ({ dependencies, signal }) => {
        const countryValue = dependencies.COUNTRY?.value;

        if (typeof countryValue !== 'string') {
          return [];
        }

        await waitForTimeout(550, signal);
        return cityOptionsByCountry[countryValue] ?? [];
      },
      onOptionsResolved: ({ ruleId }) => {
        builderRef.reconcileRuleValueWithOptions(ruleId, {
          strategy: 'clear-if-missing',
        });
      },
    });
  }, [builderRef]);

  return (
    <DemoCard>
      <Builder
        ref={builderRef}
        fields={fields}
        data={data}
        onChange={setData}
      />
    </DemoCard>
  );
};
