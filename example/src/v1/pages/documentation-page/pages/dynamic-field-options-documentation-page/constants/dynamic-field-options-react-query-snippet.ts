export const dynamicFieldOptionsReactQuerySnippet = `import React, { useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import {
  Builder,
  useBuilderRef,
  useBuilderRuleDependencies,
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

export const ReactQueryOptionsExample = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);
  const builderRef = useBuilderRef();
  const cityEntries = useBuilderRuleDependencies(
    builderRef,
    'CITY',
    ['COUNTRY']
  );

  const cityQueries = useQueries({
    queries: cityEntries.map((entry) => {
      const countryValue = entry.dependencies.COUNTRY?.value;
      const country =
        typeof countryValue === 'string' ? countryValue : undefined;

      return {
        queryKey: ['cities', entry.ruleId, country],
        queryFn: () => loadCities(country as string),
        enabled: Boolean(country),
      };
    }),
  });

  useEffect(() => {
    cityEntries.forEach((entry, index) => {
      const countryValue = entry.dependencies.COUNTRY?.value;
      const query = cityQueries[index];

      if (!builderRef.current || !query) {
        return;
      }

      if (typeof countryValue !== 'string') {
        builderRef.current.clearRuleOptions(entry.ruleId);
        return;
      }

      if (query.status === 'pending') {
        builderRef.current.setRuleOptionsStatus(entry.ruleId, 'loading');
        return;
      }

      if (query.status === 'error') {
        builderRef.current.setRuleOptionsStatus(entry.ruleId, 'error');
        return;
      }

      builderRef.current.setRuleOptions(
        entry.ruleId,
        query.data.data.map(({ code, city }) => ({
          value: code,
          label: city,
        }))
      );
      builderRef.current.reconcileRuleValueWithOptions(entry.ruleId, {
        strategy: 'clear-if-missing',
      });
    });
  }, [builderRef, cityEntries, cityQueries]);

  return (
    <Builder
      ref={builderRef}
      fields={fields}
      data={data}
      onChange={setData}
    />
  );
};`;
