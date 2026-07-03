import { baseBuilderImportItems } from './constants/base-builder-import-items';
import type { IBuilderSourceOptions } from './types';
import { createThemeOverrides } from './utils/create-theme-overrides.util';
import { formatThemeOverrides } from './utils/format-theme-overrides.util';

const indentBlock = (block: string, spaces: number) =>
  block
    .split('\n')
    .map(line => `${' '.repeat(spaces)}${line}`)
    .join('\n');

export const formatBuilderSource = ({
  readOnly,
  readOnlyProtectsDelete,
  lockable,
  cloneable,
  draggable,
  allowGroupNegation,
  allowFieldComparisons,
  newNodePlacement,
  history,
  textMode,
  defaultMode,
  useMonacoTextEditor,
  singleRootGroup,
  showValidation,
  customizationMode,
  themeColors,
  defaultThemeColors,
}: IBuilderSourceOptions) => {
  const usesMuiAdapter = customizationMode === 'mui';
  const usesAntdAdapter = customizationMode === 'antd';
  const usesMantineAdapter = customizationMode === 'mantine';
  const usesFluentUiAdapter = customizationMode === 'fluentui';
  const usesRadixAdapter = customizationMode === 'radix';
  const usesBootstrapAdapter = customizationMode === 'bootstrap';
  const themeOverrides =
    customizationMode === 'default'
      ? createThemeOverrides(themeColors, defaultThemeColors)
      : null;
  const usesThemeProvider = Boolean(themeOverrides);
  const builderImportItems = [...baseBuilderImportItems];

  if (usesThemeProvider) {
    builderImportItems.splice(1, 0, 'colors');
  }

  const imports = [
    `import React, { useState } from 'react';`,
    `import { ${builderImportItems.join(', ')} } from '@vojtechportes/react-query-builder';`,
    usesThemeProvider
      ? `import { ThemeProvider } from '@vojtechportes/react-query-builder/theme-provider';`
      : null,
    useMonacoTextEditor
      ? `import { createMonacoComponents } from '@vojtechportes/react-query-builder/monaco';`
      : null,
    usesMuiAdapter
      ? `import { components as muiComponents } from '@vojtechportes/react-query-builder/mui/v9';`
      : null,
    usesAntdAdapter
      ? `import { components as antdComponents } from '@vojtechportes/react-query-builder/antd/v6';`
      : null,
    usesBootstrapAdapter
      ? `import 'bootstrap/dist/css/bootstrap.min.css';
import { components as bootstrapComponents } from '@vojtechportes/react-query-builder/bootstrap/v5';`
      : null,
    usesMantineAdapter
      ? `import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { components as mantineComponents } from '@vojtechportes/react-query-builder/mantine/v9';`
      : null,
    usesFluentUiAdapter
      ? `import { components as fluentUiComponents } from '@vojtechportes/react-query-builder/fluentui/v8';`
      : null,
    usesRadixAdapter
      ? `import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { components as radixComponents } from '@vojtechportes/react-query-builder/radix/v1';`
      : null,
    `import { demoFields, initialQueryTree } from '../constants/demo-data';`,
  ]
    .filter(Boolean)
    .join('\n');

  const builderProps: string[] = [
    'data={data}',
    'fields={demoFields}',
    'onChange={setData}',
    readOnly ? 'readOnly' : null,
    readOnlyProtectsDelete
      ? null
      : 'readOnlyProtectsDelete={false}',
    lockable ? 'lockable' : null,
    cloneable ? 'cloneable' : null,
    draggable ? 'draggable' : null,
    allowGroupNegation ? null : 'allowGroupNegation={false}',
    allowFieldComparisons ? 'allowFieldComparisons' : null,
    newNodePlacement === 'prepend'
      ? 'newNodePlacement="prepend"'
      : null,
    history ? 'history' : null,
    textMode ? 'textMode' : null,
    textMode && defaultMode === 'text' ? 'defaultMode="text"' : null,
    'groupTypes="both"',
    singleRootGroup ? 'singleRootGroup' : 'singleRootGroup={false}',
    showValidation ? 'showValidation' : null,
    usesMuiAdapter ? 'components={muiComponents}' : null,
    usesAntdAdapter ? 'components={antdComponents}' : null,
    usesMantineAdapter ? 'components={mantineComponents}' : null,
    usesFluentUiAdapter ? 'components={fluentUiComponents}' : null,
    usesRadixAdapter ? 'components={radixComponents}' : null,
    usesBootstrapAdapter ? 'components={bootstrapComponents}' : null,
  ].filter((prop): prop is string => Boolean(prop));

  const componentExpression = useMonacoTextEditor
    ? usesMuiAdapter
      ? 'createMonacoComponents(muiComponents)'
      : usesAntdAdapter
        ? 'createMonacoComponents(antdComponents)'
        : usesMantineAdapter
          ? 'createMonacoComponents(mantineComponents)'
        : usesFluentUiAdapter
          ? 'createMonacoComponents(fluentUiComponents)'
        : usesRadixAdapter
          ? 'createMonacoComponents(radixComponents)'
        : usesBootstrapAdapter
          ? 'createMonacoComponents(bootstrapComponents)'
        : 'createMonacoComponents({})'
    : null;

  if (componentExpression) {
    const existingComponentPropIndex = builderProps.findIndex(prop =>
      prop.startsWith('components=')
    );

    if (existingComponentPropIndex >= 0) {
      builderProps[existingComponentPropIndex] = 'components={components}';
    } else {
      builderProps.push('components={components}');
    }
  }

  const builderMarkup = [
    '    <Builder',
    ...builderProps.map(prop => `      ${prop}`),
    '    />',
  ].join('\n');

  const themedBuilderMarkup = usesThemeProvider
    ? [
        '    <ThemeProvider',
        '      colors={',
        formatThemeOverrides(themeOverrides!)
          .split('\n')
          .map(line => `      ${line}`)
          .join('\n'),
        '      }',
        '    >',
        builderMarkup,
        '    </ThemeProvider>',
      ].join('\n')
    : builderMarkup;

  const wrappedBuilderMarkup = usesMantineAdapter
    ? [
        '    <MantineProvider>',
        indentBlock(themedBuilderMarkup, 2),
        '    </MantineProvider>',
      ].join('\n')
    : usesRadixAdapter
      ? [
          '    <Theme>',
          indentBlock(themedBuilderMarkup, 2),
          '    </Theme>',
        ].join('\n')
    : themedBuilderMarkup;

  return [
    imports,
    '',
    'export const DemoBuilderExample = () => {',
    '  const [data, setData] = useState<DenormalizedQuery>(initialQueryTree);',
    componentExpression ? `  const components = ${componentExpression};` : null,
    '',
    '  return (',
    wrappedBuilderMarkup,
    '  );',
    '};',
  ]
    .filter(line => line !== null)
    .join('\n');
};



