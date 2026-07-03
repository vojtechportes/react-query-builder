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
});
