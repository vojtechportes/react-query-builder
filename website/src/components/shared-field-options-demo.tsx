import * as React from 'react';
import { Button } from './button';
import styled from 'styled-components';
import {
  Builder,
  useBuilderRef,
  type DenormalizedQuery,
  type IBuilderFieldOptionState,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

const DemoCard = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #dbe4f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
`;

const StatusRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #334155;
`;

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
    <DemoCard>
      <Toolbar>
        <Button
          color="secondary"
          size="small"
          type="button"
          onClick={() => loadSharedOptions('czech')}
        >
          Load Czech cities
        </Button>
        <Button
          color="secondary"
          size="small"
          type="button"
          onClick={() => loadSharedOptions('slovak')}
        >
          Load Slovak cities
        </Button>
        <Button
          color="secondary"
          size="small"
          type="button"
          onClick={() => loadSharedOptions('german')}
        >
          Load German cities
        </Button>
        <Button
          color="secondary"
          size="small"
          type="button"
          onClick={() => loadSharedOptions('default')}
        >
          Reset to field.value
        </Button>
      </Toolbar>
      <StatusRow>
        <span>Field state: {cityOptionState.status}</span>
        <span>Shared options: {cityOptionState.options.length}</span>
      </StatusRow>
      <Builder
        ref={builderRef}
        fields={fields}
        data={data}
        onChange={setData}
      />
    </DemoCard>
  );
};
