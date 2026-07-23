import * as React from 'react';
import type { IColors } from '@vojtechportes/react-query-builder';
import styled from 'styled-components';
import type { CustomizationMode } from '../types/customization-mode';
import { ThemeEditor } from './theme-editor';

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
  mui: 'ThemeProvider colors style the default builder components only. The MUI adapter uses Material UI styling instead.',
  antd: 'ThemeProvider colors style the default builder components only. The ANTD adapter uses Ant Design styling instead.',
  mantine:
    'ThemeProvider colors style the default builder components only. The Mantine adapter uses Mantine styling instead.',
  fluentui:
    'ThemeProvider colors style the default builder components only. The Fluent UI adapter uses Fluent UI styling instead.',
  radix:
    'ThemeProvider colors style the default builder components only. The Radix adapter uses Radix Themes styling instead.',
  bootstrap:
    'ThemeProvider colors style the default builder components only. The Bootstrap adapter uses Bootstrap styling instead.',
};

export interface IDemoPlaygroundThemeProps {
  customizationMode: CustomizationMode;
  value: IColors;
  onChange: (value: IColors) => void;
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
