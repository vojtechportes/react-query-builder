import { colors } from '@vojtechportes/react-query-builder';
import { describe, expect, it } from 'vitest';
import { packageExports } from '../../../../../config/package-bindings/constants/package-exports';
import type { IBuilderSourceOptions } from '../types/builder-source-options';
import type { CustomizationMode } from '../types/customization-mode';
import { formatBuilderSource } from './format-builder-source.util';

const canonicalPackageName = '@vojtechportes/react-query-builder';
const exportedPackageSpecifiers = new Set(
  packageExports.map(({ subpath }) => `${canonicalPackageName}${subpath}`)
);
const adapterCases = [
  ['mui', '@vojtechportes/react-query-builder/mui/v9'],
  ['antd', '@vojtechportes/react-query-builder/antd/v6'],
  ['mantine', '@vojtechportes/react-query-builder/mantine/v9'],
  ['fluentui', '@vojtechportes/react-query-builder/fluentui/v8'],
  ['radix', '@vojtechportes/react-query-builder/radix/v1'],
  ['bootstrap', '@vojtechportes/react-query-builder/bootstrap/v5'],
] as const;

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

const customizedThemeColors = {
  ...colors,
  primary: { ...colors.primary, default: '#123456' },
};

describe('v2 formatBuilderSource', () => {
  it('renders the default v2 Builder source', () => {
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

  it.each(adapterCases)(
    'renders the %s adapter import',
    (customizationMode: CustomizationMode, packagePath) => {
      expect(
        formatBuilderSource({ ...defaultOptions, customizationMode })
      ).toContain(packagePath);
    }
  );

  it('renders locale, Monaco, behavior toggles, and theme overrides', () => {
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
      themeColors: customizedThemeColors,
    });

    expect(source).toContain(
      "import { Builder, colors, ThemeProvider, type DenormalizedQuery } from '@vojtechportes/react-query-builder';"
    );
    expect(source).toContain(
      "import { strings } from '@vojtechportes/react-query-builder/locale/fr-FR';"
    );
    expect(source).toContain(
      "import { createMonacoComponents } from '@vojtechportes/react-query-builder/monaco';"
    );
    expect(source).not.toContain(
      '@vojtechportes/react-query-builder/theme-provider'
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

  it('emits only package specifiers exposed by the v2 binding', () => {
    const generatedSources = [
      formatBuilderSource(defaultOptions),
      formatBuilderSource({
        ...defaultOptions,
        locale: 'fr-FR',
        useMonacoTextEditor: true,
        themeColors: customizedThemeColors,
      }),
      ...adapterCases.map(([customizationMode]) =>
        formatBuilderSource({ ...defaultOptions, customizationMode })
      ),
    ];
    const packageSpecifiers = generatedSources.flatMap((source) =>
      [
        ...source.matchAll(
          /from '(@vojtechportes\/react-query-builder[^']*)'/g
        ),
      ].map((match) => match[1])
    );

    expect(packageSpecifiers.length).toBeGreaterThan(0);

    packageSpecifiers.forEach((specifier) => {
      expect(exportedPackageSpecifiers.has(specifier)).toBe(true);
    });
  });
});
