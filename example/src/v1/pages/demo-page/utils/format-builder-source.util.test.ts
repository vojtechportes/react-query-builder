import { colors } from '@vojtechportes/react-query-builder';
import { describe, expect, it } from 'vitest';
import type { IBuilderSourceOptions } from '../types/builder-source-options';
import type { CustomizationMode } from '../types/customization-mode';
import { formatBuilderSource } from './format-builder-source.util';

const defaultOptions: IBuilderSourceOptions = {
  readOnly: false,
  readOnlyProtectsDelete: true,
  lockable: false,
  cloneable: false,
  draggable: false,
  allowGroupNegation: true,
  allowFieldComparisons: true,
  newNodePlacement: 'append',
  locale: 'en-US',
  history: false,
  textMode: false,
  defaultMode: 'builder',
  useMonacoTextEditor: false,
  singleRootGroup: true,
  showValidation: true,
  customizationMode: 'default',
  themeColors: colors,
  defaultThemeColors: colors,
};

describe('v1 formatBuilderSource', () => {
  it('preserves the default 1.33.1 Builder source', () => {
    const source = formatBuilderSource(defaultOptions);

    expect(source).toContain(
      "import { Builder, strings, type DenormalizedQuery } from '@vojtechportes/react-query-builder';"
    );
    expect(source).toContain(
      "import { demoFields, initialQueryTree } from '../constants/demo-data';"
    );
    expect(source).toContain('singleRootGroup');
    expect(source).toContain('showValidation');
    expect(source).not.toContain('ThemeProvider');
  });

  it.each([
    ['mui', '@vojtechportes/react-query-builder/mui/v9'],
    ['antd', '@vojtechportes/react-query-builder/antd/v6'],
    ['mantine', '@vojtechportes/react-query-builder/mantine/v9'],
    ['fluentui', '@vojtechportes/react-query-builder/fluentui/v8'],
    ['radix', '@vojtechportes/react-query-builder/radix/v1'],
    ['bootstrap', '@vojtechportes/react-query-builder/bootstrap/v5'],
  ] as const)(
    'preserves the %s adapter import',
    (customizationMode: CustomizationMode, packagePath) => {
      expect(
        formatBuilderSource({ ...defaultOptions, customizationMode })
      ).toContain(packagePath);
    }
  );

  it('preserves locale, Monaco, behavior toggles, and theme overrides', () => {
    const source = formatBuilderSource({
      ...defaultOptions,
      readOnly: true,
      lockable: true,
      cloneable: true,
      draggable: true,
      history: true,
      textMode: true,
      defaultMode: 'text',
      useMonacoTextEditor: true,
      locale: 'fr-FR',
      themeColors: {
        ...colors,
        primary: { ...colors.primary, default: '#123456' },
      },
    });

    expect(source).toContain(
      "import { strings } from '@vojtechportes/react-query-builder/locale/fr-FR';"
    );
    expect(source).toContain(
      "import { createMonacoComponents } from '@vojtechportes/react-query-builder/monaco';"
    );
    expect(source).toContain('readOnly');
    expect(source).toContain('lockable');
    expect(source).toContain('cloneable');
    expect(source).toContain('draggable');
    expect(source).toContain('history');
    expect(source).toContain('textMode');
    expect(source).toContain('defaultMode="text"');
    expect(source).toContain('primary: {');
    expect(source).toContain('default: "#123456"');
  });
});
