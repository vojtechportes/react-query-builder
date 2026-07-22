import { formatBuilderSource } from '../../example/src/utils/builder-source/format-builder-source';

describe('example builder source formatting', () => {
  const baseOptions: any = {
    readOnly: false,
    readOnlyProtectsDelete: true,
    lockable: false,
    cloneable: false,
    draggable: false,
    allowGroupNegation: true,
    allowFieldComparisons: false,
    newNodePlacement: 'append',
    locale: 'en-US',
    history: false,
    textMode: false,
    defaultMode: 'builder',
    useMonacoTextEditor: false,
    singleRootGroup: true,
    showValidation: true,
    customizationMode: 'bootstrap',
    themeColors: {},
    defaultThemeColors: {},
  };

  it('includes allowFieldComparisons only when enabled', () => {
    const disabledOutput = formatBuilderSource(baseOptions);
    const enabledOutput = formatBuilderSource({
      ...baseOptions,
      allowFieldComparisons: true,
    });

    expect(disabledOutput).not.toContain('allowFieldComparisons');
    expect(enabledOutput).toContain('allowFieldComparisons');
  });

  it('uses the backward-compatible root strings export for en-US', () => {
    const output = formatBuilderSource(baseOptions);

    expect(output).toContain(
      "import { Builder, strings, type DenormalizedQuery } from '@vojtechportes/react-query-builder';"
    );
    expect(output).toContain('strings={strings}');
    expect(output).not.toContain('/locale/en-US');
  });

  it('uses the exact locale subpath for non-English translations', () => {
    const output = formatBuilderSource({
      ...baseOptions,
      locale: 'zh-TW',
    });

    expect(output).toContain(
      "import { strings } from '@vojtechportes/react-query-builder/locale/zh-TW';"
    );
    expect(output).toContain('strings={strings}');
  });
});
