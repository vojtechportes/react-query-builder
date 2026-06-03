import * as React from 'react';
import styled from 'styled-components';
import {
  Builder,
  useBuilderRef,
  type DenormalizedQuery,
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
  font-size: 0.92rem;
  color: #475569;
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
        field: 'COUNTRY',
        operator: 'EQUAL',
        value: 'CZ',
      },
      {
        field: 'CITY',
        operator: 'EQUAL',
        value: '',
      },
    ],
  },
];

export const ImperativeFieldOptionsDemo: React.FC = () => {
  const [data, setData] = React.useState<DenormalizedQuery>(initialData);
  const [cityOptionsStatus, setCityOptionsStatus] = React.useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [cityReloadToken, setCityReloadToken] = React.useState(0);
  const builderRef = useBuilderRef();
  const cityRuleInUse = React.useMemo(
    () =>
      data.some(
        node =>
          'children' in node &&
          node.children.some(
            child => 'field' in child && child.field === 'CITY'
          )
      ),
    [data]
  );
  const selectedCountry = React.useMemo(() => {
    const rootGroup = data[0];
    const countryRule =
      rootGroup && 'children' in rootGroup
        ? rootGroup.children.find(
            child => 'field' in child && child.field === 'COUNTRY'
          )
        : undefined;

    return countryRule && 'value' in countryRule && typeof countryRule.value === 'string'
      ? countryRule.value
      : '';
  }, [data]);

  const handleReloadCityOptions = React.useCallback(() => {
    setCityReloadToken(token => token + 1);
  }, []);

  React.useEffect(() => {
    if (!cityRuleInUse) {
      setCityOptionsStatus('idle');
      builderRef.current?.clearFieldOptions('CITY');
      return;
    }

    builderRef.current?.invalidateFieldOptions('CITY');
    builderRef.current?.setFieldOptionsStatus('CITY', 'loading');
    setCityOptionsStatus('loading');

    const timeoutId = window.setTimeout(() => {
      if (selectedCountry === 'CZ') {
        builderRef.current?.setFieldOptions('CITY', [
          { value: 'PRG', label: 'Prague' },
          { value: 'BRN', label: 'Brno' },
          { value: 'OSR', label: 'Ostrava' },
        ]);
      } else if (selectedCountry === 'SK') {
        builderRef.current?.setFieldOptions('CITY', [
          { value: 'BTS', label: 'Bratislava' },
          { value: 'KSC', label: 'Kosice' },
          { value: 'ZIL', label: 'Zilina' },
        ]);
      } else if (selectedCountry === 'DE') {
        builderRef.current?.setFieldOptions('CITY', [
          { value: 'BER', label: 'Berlin' },
          { value: 'MUC', label: 'Munich' },
          { value: 'HAM', label: 'Hamburg' },
        ]);
      } else {
        builderRef.current?.setFieldOptions('CITY', []);
      }

      setCityOptionsStatus('success');
    }, 650);

    return () => window.clearTimeout(timeoutId);
  }, [builderRef, cityRuleInUse, cityReloadToken, selectedCountry]);

  return (
    <DemoCard>
      <Toolbar>
        <SmallButton
          type="button"
          onClick={() => {
            const rootGroupId = builderRef.current
              ?.getNodes()
              .find((node) => 'type' in node)?.id;
            const cityRuleId = builderRef.current
              ?.getNodes()
              .find((node) => 'field' in node && node.field === 'CITY')?.id;

            if (cityRuleId) {
              builderRef.current?.deleteNode(cityRuleId);
              return;
            }

            if (rootGroupId) {
              builderRef.current?.addRule(
                {
                  field: 'CITY',
                  operator: 'EQUAL',
                  value: '',
                },
                rootGroupId
              );
            }
          }}
        >
          {cityRuleInUse ? 'Remove city rule' : 'Add city rule'}
        </SmallButton>
        <SmallButton
          type="button"
          onClick={() => builderRef.current?.reloadFieldOptions('CITY')}
        >
          Reload city options
        </SmallButton>
      </Toolbar>
      <StatusRow>
        <span>City rule in scope: {cityRuleInUse ? 'yes' : 'no'}</span>
        <span>City options status: {cityOptionsStatus}</span>
        <span>
          Runtime options:{' '}
          {builderRef.current?.getFieldOptionState('CITY').options.length ?? 0}
        </span>
      </StatusRow>
      <Builder
        ref={builderRef}
        fields={fields}
        data={data}
        onFieldOptionsReload={(field) => {
          if (field === 'CITY') {
            handleReloadCityOptions();
          }
        }}
        onChange={setData}
      />
    </DemoCard>
  );
};
