import * as React from 'react';
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

const SmallButton = styled.button`
  padding: 0.6rem 0.9rem;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: #fff;
  color: #0f172a;
  cursor: pointer;

  &:hover {
    border-color: #93c5fd;
    background: #eff6ff;
  }
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
  const [cityOptionState, setCityOptionState] = React.useState<IBuilderFieldOptionState>({
    options: fields[0].value ?? [],
    status: 'idle',
  });
  const builderRef = useBuilderRef();

  React.useEffect(() => builderRef.subscribeToFieldOptionState('CITY', setCityOptionState), [
    builderRef,
  ]);

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
        <SmallButton type="button" onClick={() => loadSharedOptions('czech')}>
          Load Czech cities
        </SmallButton>
        <SmallButton type="button" onClick={() => loadSharedOptions('slovak')}>
          Load Slovak cities
        </SmallButton>
        <SmallButton type="button" onClick={() => loadSharedOptions('german')}>
          Load German cities
        </SmallButton>
        <SmallButton type="button" onClick={() => loadSharedOptions('default')}>
          Reset to field.value
        </SmallButton>
      </Toolbar>
      <StatusRow>
        <span>Field state: {cityOptionState.status}</span>
        <span>Shared options: {cityOptionState.options.length}</span>
      </StatusRow>
      <Builder ref={builderRef} fields={fields} data={data} onChange={setData} />
    </DemoCard>
  );
};
