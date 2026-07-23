export const dynamicRuleOptionsSnippet = `import React, { useEffect, useState } from 'react';
import {
  Builder,
  useBuilderRef,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

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
          { field: 'COUNTRY', operator: 'EQUAL', value: 'CZ' },
          { field: 'CITY', operator: 'EQUAL', value: 'PRG' },
        ],
      },
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'COUNTRY', operator: 'EQUAL', value: 'SK' },
          { field: 'CITY', operator: 'EQUAL', value: 'BTS' },
        ],
      },
    ],
  },
];

export const RuleScopedOptionsExample = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);
  const builderRef = useBuilderRef();

  useEffect(() => {
    return builderRef.bindRuleOptions('CITY', {
      dependencies: ['COUNTRY'],
      resolve: async ({ dependencies, signal }) => {
        const countryValue = dependencies.COUNTRY?.value;

        if (typeof countryValue !== 'string') {
          return [];
        }

        const response = await fetch(
          \`/api/cities?country=\${countryValue}\`,
          { signal }
        );
        const cities = await response.json();

        return cities.data.map(
          (city: { code: string; name: string }) => ({
            value: city.code,
            label: city.name,
          })
        );
      },
      onOptionsResolved: ({ ruleId }) => {
        builderRef.reconcileRuleValueWithOptions(ruleId, {
          strategy: 'clear-if-missing',
        });
      },
    });
  }, [builderRef]);

  return (
    <Builder
      ref={builderRef}
      fields={fields}
      data={data}
      onChange={setData}
    />
  );
};`;
