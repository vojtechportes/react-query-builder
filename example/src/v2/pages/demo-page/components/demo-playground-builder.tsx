import * as React from 'react';
import '@radix-ui/themes/styles.css';
import { MantineProvider } from '@mantine/core';
import mantineStyles from '@mantine/core/styles.css?inline';
import {
  Builder,
  ThemeProvider,
  type IColors,
} from '@vojtechportes/react-query-builder';
import { Theme as RadixTheme } from '@radix-ui/themes';
import styled from 'styled-components';
import { bootstrapScopeClassName } from '../constants/bootstrap-scope-class-name';
import { scopedBootstrapStyles } from '../constants/scoped-bootstrap-styles';
import type { CustomizationMode } from '../types/customization-mode';
import { BuilderSurface } from './builder-surface';
import { MuiBuilderSurface } from './mui-builder-surface';

const BuilderCard = styled.section`
  overflow-y: hidden;
  padding: 1.5rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);

  @media (max-width: 540px) {
    padding: 1.25rem;
  }
`;

const mantineScopeClassName = 'mantine-demo-scope';

const scopedMantineStyles = mantineStyles
  .replace(/:root,\s*:host/g, `.${mantineScopeClassName}`)
  .replace(/body,\s*:host/g, `.${mantineScopeClassName}`)
  .replace(
    /:root\[data-mantine-color-scheme='dark'\],\s*:host\(\[data-mantine-color-scheme='dark'\]\)/g,
    `.${mantineScopeClassName}[data-mantine-color-scheme='dark']`
  )
  .replace(
    /:root\[data-mantine-color-scheme='light'\],\s*:host\(\[data-mantine-color-scheme='light'\]\)/g,
    `.${mantineScopeClassName}[data-mantine-color-scheme='light']`
  )
  .replace(
    /\*,\s*\*::before,\s*\*::after/g,
    `.${mantineScopeClassName}, .${mantineScopeClassName} *, .${mantineScopeClassName} *::before, .${mantineScopeClassName} *::after`
  )
  .replace(
    /input,\s*button,\s*textarea,\s*select/g,
    `.${mantineScopeClassName} input, .${mantineScopeClassName} button, .${mantineScopeClassName} textarea, .${mantineScopeClassName} select`
  )
  .replace(
    /button,\s*select/g,
    `.${mantineScopeClassName} button, .${mantineScopeClassName} select`
  )
  .replace(
    /fieldset:disabled \.mantine-active:active/g,
    `.${mantineScopeClassName} fieldset:disabled .mantine-active:active`
  );

const scopedMantineDemoOverrides = `
  .${mantineScopeClassName} .mantine-Button-root,
  .${mantineScopeClassName} .mantine-UnstyledButton-root,
  .${mantineScopeClassName} .mantine-ActionIcon-root {
    font-size: 14px !important;
  }

  .${mantineScopeClassName} .mantine-Button-root,
  .${mantineScopeClassName} .mantine-UnstyledButton-root {
    min-height: 34px;
  }

  .${mantineScopeClassName} .mantine-Input-input,
  .${mantineScopeClassName} .mantine-Select-input,
  .${mantineScopeClassName} .mantine-MultiSelect-input,
  .${mantineScopeClassName} .mantine-Combobox-option,
  .${mantineScopeClassName} .mantine-PillsInput-input {
    font-size: 14px !important;
  }
`;

export interface IDemoPlaygroundBuilderProps {
  builderProps: React.ComponentProps<typeof Builder>;
  customizationMode: CustomizationMode;
  themeColors: IColors;
}

export const DemoPlaygroundBuilder: React.FC<IDemoPlaygroundBuilderProps> = ({
  builderProps,
  customizationMode,
  themeColors,
}) => {
  const mantineRootRef = React.useRef<HTMLDivElement>(null);
  const isMuiMode = customizationMode === 'mui';
  const isAntdMode = customizationMode === 'antd';
  const isMantineMode = customizationMode === 'mantine';
  const isFluentUiMode = customizationMode === 'fluentui';
  const isRadixMode = customizationMode === 'radix';
  const isBootstrapMode = customizationMode === 'bootstrap';
  const BuilderDemoSurface = isMuiMode ? MuiBuilderSurface : BuilderSurface;

  return (
    <BuilderCard>
      {isMantineMode ? (
        <>
          <style>{scopedMantineStyles}</style>
          <style>{scopedMantineDemoOverrides}</style>
          <BuilderSurface
            ref={mantineRootRef}
            className={mantineScopeClassName}
            style={
              {
                fontSize: '14px',
                lineHeight: 1.5,
                '--mantine-font-size-xs': '0.75rem',
                '--mantine-font-size-sm': '0.8125rem',
                '--mantine-font-size-md': '0.875rem',
                '--mantine-font-size-lg': '1rem',
                '--mantine-font-size-xl': '1.125rem',
              } as React.CSSProperties
            }
          >
            <MantineProvider
              cssVariablesSelector={`.${mantineScopeClassName}`}
              getRootElement={() => mantineRootRef.current ?? undefined}
              withGlobalClasses={false}
            >
              <Builder {...builderProps} />
            </MantineProvider>
          </BuilderSurface>
        </>
      ) : (
        <BuilderDemoSurface
          className={isBootstrapMode ? bootstrapScopeClassName : undefined}
        >
          {isBootstrapMode ? <style>{scopedBootstrapStyles}</style> : null}
          {isMuiMode || isFluentUiMode || isAntdMode || isBootstrapMode ? (
            <Builder {...builderProps} />
          ) : isRadixMode ? (
            <RadixTheme>
              <Builder {...builderProps} />
            </RadixTheme>
          ) : (
            <ThemeProvider colors={themeColors}>
              <Builder {...builderProps} />
            </ThemeProvider>
          )}
        </BuilderDemoSurface>
      )}
    </BuilderCard>
  );
};
