export const dynamicFieldOptionsSnippet = `import React, { useCallback, useEffect, useState } from 'react';
import {
  Builder,
  useBuilderRef,
  type DenormalizedQuery,
  type IBuilderFieldOptionState,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

const fields: IBuilderFieldProps[] = [
  {
    field: 'CITY',
    label: 'City',
    type: 'LIST',
    operators: ['EQUAL'],
    value: [
      { value: 'PRG', label: 'Prague' },
      { value: 'BTS', label: 'Bratislava' },
    ],
  },
];

export const SharedFieldOptionsExample = () => {
  const [data, setData] = useState<DenormalizedQuery>([
    {
      type: 'GROUP',
      value: 'AND',
      isNegated: false,
      children: [
        { field: 'CITY', operator: 'EQUAL', value: 'PRG' },
        { field: 'CITY', operator: 'EQUAL', value: 'BTS' },
      ],
    },
  ]);
  const [cityOptionState, setCityOptionState] = useState<IBuilderFieldOptionState>({
    options: fields[0].value ?? [],
    status: 'idle',
  });
  const builderRef = useBuilderRef();

  useEffect(() => builderRef.subscribeToFieldOptionState('CITY', setCityOptionState), [
    builderRef,
  ]);

  const loadSharedCities = useCallback((scope: 'CZ' | 'SK' | 'DE') => {
    builderRef.current?.setFieldOptionsStatus('CITY', 'loading');

    window.setTimeout(() => {
      if (scope === 'CZ') {
        builderRef.current?.setFieldOptions('CITY', [
          { value: 'PRG', label: 'Prague' },
          { value: 'BRN', label: 'Brno' },
          { value: 'OSR', label: 'Ostrava' },
        ]);
        return;
      }

      if (scope === 'SK') {
        builderRef.current?.setFieldOptions('CITY', [
          { value: 'BTS', label: 'Bratislava' },
          { value: 'KSC', label: 'Kosice' },
          { value: 'ZIL', label: 'Zilina' },
        ]);
        return;
      }

      builderRef.current?.setFieldOptions(
        'CITY',
        [
          { value: 'BER', label: 'Berlin' },
          { value: 'MUC', label: 'Munich' },
          { value: 'HAM', label: 'Hamburg' },
        ]
      );
    }, 500);
  }, [builderRef]);

  return (
    <>
      <button type="button" onClick={() => loadSharedCities('CZ')}>
        Load Czech cities
      </button>
      <p>
        Field state: {cityOptionState.status} ({cityOptionState.options.length} options)
      </p>
      <Builder ref={builderRef} fields={fields} data={data} onChange={setData} />
    </>
  );
};`;
