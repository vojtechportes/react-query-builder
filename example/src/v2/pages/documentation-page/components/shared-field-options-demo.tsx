import * as React from 'react';
import {
  Builder,
  useBuilderRef,
  type DenormalizedQuery,
  type IBuilderFieldOptionState,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { DocumentationDemoButton } from './documentation-demo-button';
import { DocumentationDemoCard } from './documentation-demo-card';
import { DocumentationDemoStatusRow } from './documentation-demo-status-row';
import { DocumentationDemoToolbar } from './documentation-demo-toolbar';

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

const initialData: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'CITY',
        operator: 'EQUAL',
        value: 'PRG',
      },
      {
        field: 'CITY',
        operator: 'EQUAL',
        value: 'BTS',
      },
    ],
  },
];

export const SharedFieldOptionsDemo: React.FC = () => {
  const [data, setData] = React.useState<DenormalizedQuery>(initialData);
  const [cityOptionState, setCityOptionState] =
    React.useState<IBuilderFieldOptionState>({
      options: Array.isArray(fields[0].value) ? fields[0].value : [],
      status: 'idle',
    });
  const builderRef = useBuilderRef();

  React.useEffect(
    () => builderRef.subscribeToFieldOptionState('CITY', setCityOptionState),
    [builderRef]
  );

  const loadSharedOptions = React.useCallback(
    (mode: 'default' | 'czech' | 'slovak' | 'german') => {
      builderRef.current?.setFieldOptionsStatus('CITY', 'loading');

      window.setTimeout(() => {
        if (mode === 'czech') {
          builderRef.current?.setFieldOptions('CITY', [
            { value: 'PRG', label: 'Prague' },
            { value: 'BRN', label: 'Brno' },
            { value: 'OSR', label: 'Ostrava' },
          ]);
          return;
        }

        if (mode === 'slovak') {
          builderRef.current?.setFieldOptions('CITY', [
            { value: 'BTS', label: 'Bratislava' },
            { value: 'KSC', label: 'Kosice' },
            { value: 'ZIL', label: 'Zilina' },
          ]);
          return;
        }

        if (mode === 'german') {
          builderRef.current?.setFieldOptions('CITY', [
            { value: 'BER', label: 'Berlin' },
            { value: 'MUC', label: 'Munich' },
            { value: 'HAM', label: 'Hamburg' },
          ]);
          return;
        }

        builderRef.current?.invalidateFieldOptions('CITY');
      }, 500);
    },
    [builderRef]
  );
  return (
    <DocumentationDemoCard>
      <DocumentationDemoToolbar>
        <DocumentationDemoButton
          type="button"
          onClick={() => loadSharedOptions('czech')}
        >
          Load Czech cities
        </DocumentationDemoButton>
        <DocumentationDemoButton
          type="button"
          onClick={() => loadSharedOptions('slovak')}
        >
          Load Slovak cities
        </DocumentationDemoButton>
        <DocumentationDemoButton
          type="button"
          onClick={() => loadSharedOptions('german')}
        >
          Load German cities
        </DocumentationDemoButton>
        <DocumentationDemoButton
          type="button"
          onClick={() => loadSharedOptions('default')}
        >
          Reset to field.value
        </DocumentationDemoButton>
      </DocumentationDemoToolbar>
      <DocumentationDemoStatusRow>
        <span>Field state: {cityOptionState.status}</span>
        <span>Shared options: {cityOptionState.options.length}</span>
      </DocumentationDemoStatusRow>
      <Builder
        ref={builderRef}
        fields={fields}
        data={data}
        onChange={setData}
      />
    </DocumentationDemoCard>
  );
};
