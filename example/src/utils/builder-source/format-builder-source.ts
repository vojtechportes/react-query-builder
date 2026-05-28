import { baseBuilderImportItems } from './constants/base-builder-import-items';
import type { IBuilderSourceOptions } from './types';
import { createThemeOverrides } from './utils/create-theme-overrides.util';
import { formatThemeOverrides } from './utils/format-theme-overrides.util';

export const formatBuilderSource = ({
  readOnly,
  lockable,
  cloneable,
  draggable,
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
    `import { demoFields, initialQueryTree } from '../constants/demo-data';`,
  ]
    .filter(Boolean)
    .join('\n');

  const builderProps = [
    'data={data}',
    'fields={demoFields}',
    'onChange={setData}',
    readOnly ? 'readOnly' : null,
    lockable ? 'lockable' : null,
    cloneable ? 'cloneable' : null,
    draggable ? 'draggable' : null,
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
  ].filter(Boolean);

  const componentExpression = useMonacoTextEditor
    ? usesMuiAdapter
      ? 'createMonacoComponents(muiComponents)'
      : usesAntdAdapter
        ? 'createMonacoComponents(antdComponents)'
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

  const wrappedBuilderMarkup = usesThemeProvider
    ? [
        '    <ThemeProvider',
        '      colors={',
        formatThemeOverrides(themeOverrides)
          .split('\n')
          .map(line => `      ${line}`)
          .join('\n'),
        '      }',
        '    >',
        builderMarkup,
        '    </ThemeProvider>',
      ].join('\n')
    : builderMarkup;

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
  ].join('\n');
};
