import * as React from 'react';
import styled from 'styled-components';
import type { CustomizationMode } from '../types/customization-mode';

const Panel = styled.section`
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #0f172a;
`;

const ChoiceGroup = styled.div`
  display: grid;
  gap: 0.7rem;
`;

const Choice = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #334155;
  cursor: pointer;
`;

const Radio = styled.input`
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: #2563eb;
  cursor: pointer;
  flex: 0 0 18px;
`;

const customizationOptions: Array<{
  label: string;
  value: CustomizationMode;
}> = [
  { label: 'Default components', value: 'default' },
  { label: 'MUI adapter', value: 'mui' },
  { label: 'ANTD adapter', value: 'antd' },
  { label: 'Fluent UI adapter', value: 'fluentui' },
  { label: 'Mantine adapter', value: 'mantine' },
  { label: 'Bootstrap adapter', value: 'bootstrap' },
  { label: 'Radix adapter', value: 'radix' },
];

export interface IDemoPlaygroundCustomizationProps {
  mode: CustomizationMode;
  onChange: (mode: CustomizationMode) => void;
}

export const DemoPlaygroundCustomization: React.FC<
  IDemoPlaygroundCustomizationProps
> = ({ mode, onChange }) => (
  <Panel>
    <PanelTitle>Customization</PanelTitle>
    <ChoiceGroup>
      {customizationOptions.map((option) => (
        <Choice key={option.value}>
          <Radio
            type="radio"
            name="customization-mode"
            checked={mode === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </Choice>
      ))}
    </ChoiceGroup>
  </Panel>
);
