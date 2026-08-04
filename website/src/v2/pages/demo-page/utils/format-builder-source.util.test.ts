import { defaultTheme } from '../constants/default-theme';
import { describe, expect, it } from 'vitest';
import { packageExports } from '../../../../../config/package-bindings/constants/package-exports';
import type { IBuilderSourceOptions } from '../types/builder-source-options';
import type { CustomizationMode } from '../types/customization-mode';
import { formatBuilderSource } from './format-builder-source.util';

const canonicalPackageName = '@vojtechportes/react-query-builder';
const packageStylesheetImport = `import '${canonicalPackageName}/styles.css';`;
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
  darkMode: false,
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
  useDefaultContainerStyles: true,
  showValidation: true,
  customizationMode: 'default',
  themeStyle: defaultTheme,
  defaultThemeStyle: defaultTheme,
};

const customizedThemeStyle = {
  ...defaultTheme,
  '--query-builder-color-primary-default': '#123456',
  '--query-builder-root-padding': '1.5rem',
  '--query-builder-radius-sm': '10px',
  '--query-builder-shadow-root': '0 12px 30px rgb(15 23 42 / 20%)',
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
    expect(source.split(packageStylesheetImport)).toHaveLength(2);
    expect(source).toContain('singleRootGroup');
    expect(source).toContain('showValidation');
    expect(source).toContain('colorScheme="light"');
    expect(source).not.toContain('useDefaultContainerStyles');
    expect(source).not.toContain('ThemeProvider');
  });

  it('adds the scoped dark stylesheet and typed color scheme for dark mode', () => {
    const source = formatBuilderSource({
      ...defaultOptions,
      darkMode: true,
    });

    expect(source).toContain(
      "import '@vojtechportes/react-query-builder/dark-mode.variables.css';"
    );
    expect(source).toContain('colorScheme="dark"');

    const monacoSource = formatBuilderSource({
      ...defaultOptions,
      darkMode: true,
      textMode: true,
      useMonacoTextEditor: true,
    });

    expect(monacoSource).toContain(
      'const components = createMonacoComponents({});'
    );
    expect(monacoSource).toContain('colorScheme="dark"');
    expect(monacoSource).toContain('dark-mode.variables.css');

    const adapterSource = formatBuilderSource({
      ...defaultOptions,
      customizationMode: 'mui',
      darkMode: true,
    });

    expect(adapterSource).not.toContain('dark-mode.variables.css');
    expect(adapterSource).not.toContain('colorScheme');
  });
  it.each(adapterCases)(
    'renders the %s adapter import',
    (customizationMode: CustomizationMode, packagePath) => {
      const source = formatBuilderSource({
        ...defaultOptions,
        customizationMode,
      });

      expect(source).toContain(packagePath);
      expect(source.split(packageStylesheetImport)).toHaveLength(2);
    }
  );

  it('renders locale, Monaco, behavior toggles, and theme overrides', () => {
    const source = formatBuilderSource({
      ...defaultOptions,
      readOnly: true,
      lockable: true,
      cloneable: true,
      draggable: true,
      useDefaultContainerStyles: false,
      history: true,
      textMode: true,
      defaultMode: 'text',
      useMonacoTextEditor: true,
      locale: 'fr-FR',
      themeStyle: customizedThemeStyle,
    });

    expect(source).toContain(
      "import { Builder, type IBuilderStyle, type DenormalizedQuery } from '@vojtechportes/react-query-builder';"
    );
    expect(source).toContain(
      "import { strings } from '@vojtechportes/react-query-builder/locale/fr-FR';"
    );
    expect(source).toContain(
      "import { createMonacoComponents } from '@vojtechportes/react-query-builder/monaco';"
    );
    expect(source.split(packageStylesheetImport)).toHaveLength(2);
    expect(source).not.toContain(
      '@vojtechportes/react-query-builder/theme-provider'
    );
    expect(source).toContain('readOnly');
    expect(source).toContain('lockable');
    expect(source).toContain('cloneable');
    expect(source).toContain('draggable');
    expect(source).toContain('useDefaultContainerStyles={false}');
    expect(source).toContain('history');
    expect(source).toContain('textMode');
    expect(source).toContain('defaultMode="text"');
    expect(source).toContain('const builderStyle: IBuilderStyle');
    expect(source).toContain(
      '"--query-builder-color-primary-default": "#123456"'
    );
    expect(source).toContain('"--query-builder-root-padding": "1.5rem"');
    expect(source).toContain('"--query-builder-radius-sm": "10px"');
    expect(source).toContain('"--query-builder-shadow-root"');
    expect(source).toContain('style={builderStyle}');
    expect(source).not.toContain('ThemeProvider');
  });

  it.each([
    ['bootstrap', 'bootstrap-icons/font/bootstrap-icons.css'],
    ['mantine', '@mantine/core/styles.css'],
    ['radix', '@radix-ui/themes/styles.css'],
  ] as const)(
    'loads the %s host stylesheet before the package stylesheet',
    (customizationMode, hostStylesheet) => {
      const source = formatBuilderSource({
        ...defaultOptions,
        customizationMode,
      });

      expect(source.indexOf(hostStylesheet)).toBeLessThan(
        source.indexOf(packageStylesheetImport)
      );
    }
  );

  it('emits only package specifiers exposed by the v2 binding', () => {
    const generatedSources = [
      formatBuilderSource(defaultOptions),
      formatBuilderSource({
        ...defaultOptions,
        locale: 'fr-FR',
        useMonacoTextEditor: true,
        themeStyle: customizedThemeStyle,
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
