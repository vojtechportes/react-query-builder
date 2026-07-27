import * as React from 'react';
import type { IBuilderStyle } from '@vojtechportes/react-query-builder';
import styled from 'styled-components';
import type { CustomizationMode } from '../types/customization-mode';
import { ThemeEditor } from './theme-editor/theme-editor';

const Panel = styled.section`
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
`;

const adapterMessages: Record<Exclude<CustomizationMode, 'default'>, string> = {
  mui: 'Builder CSS variables style the default components only. The MUI adapter uses Material UI styling instead.',
  antd: 'Builder CSS variables style the default components only. The ANTD adapter uses Ant Design styling instead.',
  mantine:
    'Builder CSS variables style the default components only. The Mantine adapter uses Mantine styling instead.',
  fluentui:
    'Builder CSS variables style the default components only. The Fluent UI adapter uses Fluent UI styling instead.',
  radix:
    'Builder CSS variables style the default components only. The Radix adapter uses Radix Themes styling instead.',
  bootstrap:
    'Builder CSS variables style the default components only. The Bootstrap adapter uses Bootstrap styling instead.',
};

export interface IDemoPlaygroundThemeProps {
  customizationMode: CustomizationMode;
  value: IBuilderStyle;
  onChange: (value: IBuilderStyle) => void;
}

export const DemoPlaygroundTheme: React.FC<IDemoPlaygroundThemeProps> = ({
  customizationMode,
  value,
  onChange,
}) => {
  const disabled = customizationMode !== 'default';

  return (
    <Panel>
      <ThemeEditor
        value={value}
        onChange={onChange}
        disabled={disabled}
        disabledMessage={
          disabled ? adapterMessages[customizationMode] : undefined
        }
      />
    </Panel>
  );
};
