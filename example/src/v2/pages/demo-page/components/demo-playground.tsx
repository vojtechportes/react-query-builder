import * as React from 'react';
import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';
import styled from 'styled-components';
import { defaultTheme } from '../constants/default-theme';
import { demoFields } from '../constants/demo-fields';
import { initialQueryTree } from '../constants/initial-query-tree';
import { localeStrings } from '../constants/locale-strings';
import { unsupportedFieldComparisonFormats } from '../constants/unsupported-field-comparison-formats';
import { useDemoPlaygroundState } from '../hooks/use-demo-playground-state';
import type { OutputFormat } from '../types/output-format';
import { containsFieldComparisons } from '../utils/contains-field-comparisons.util';
import { formatBuilderSource } from '../utils/format-builder-source.util';
import { formatQueryText } from '../utils/format-query-text.util';
import { getBuilderComponents } from '../utils/get-builder-components.util';
import { serializeNativeQuery } from '../utils/serialize-native-query.util';
import { DemoPlaygroundBehaviorControls } from './demo-playground-behavior-controls';
import { DemoPlaygroundBuilder } from './demo-playground-builder';
import { DemoPlaygroundCustomization } from './demo-playground-customization';
import { DemoPlaygroundOutput } from './demo-playground-output';
import { DemoPlaygroundPreferenceControls } from './demo-playground-preference-controls';
import { DemoPlaygroundSource } from './demo-playground-source';
import { DemoPlaygroundTextControls } from './demo-playground-text-controls';
import { DemoPlaygroundTheme } from './demo-playground-theme';

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
  gap: 1.5rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  display: grid;
  gap: 1rem;
  align-self: start;
`;

const Main = styled.div`
  display: grid;
  gap: 1.25rem;
  min-width: 0;
`;

export interface IDemoPlaygroundProps {
  initialData?: DenormalizedQuery;
}

export const DemoPlayground: React.FC<IDemoPlaygroundProps> = ({
  initialData = initialQueryTree,
}) => {
  const {
    customizationMode,
    data,
    outputFormat,
    settings,
    showSourceCode,
    themeColors,
    setCustomizationMode,
    setData,
    setOutputFormat,
    setShowSourceCode,
    setThemeColors,
    updateSetting,
  } = useDemoPlaygroundState(initialData);

  const builderComponents = React.useMemo(
    () => getBuilderComponents(customizationMode, settings.useMonacoTextEditor),
    [customizationMode, settings.useMonacoTextEditor]
  );
  const builderProps = {
    data,
    fields: demoFields,
    readOnly: settings.readOnly,
    readOnlyProtectsDelete: settings.readOnlyProtectsDelete,
    lockable: settings.lockable,
    cloneable: settings.cloneable,
    onChange: setData,
    draggable: settings.draggable,
    allowGroupNegation: settings.allowGroupNegation,
    allowFieldComparisons: settings.allowFieldComparisons,
    newNodePlacement: settings.newNodePlacement,
    strings: localeStrings[settings.locale],
    history: settings.history,
    textMode: settings.textMode,
    defaultMode: settings.defaultMode,
    groupTypes: 'both' as const,
    singleRootGroup: settings.singleRootGroup,
    showValidation: settings.showValidation,
    ...(builderComponents ? { components: builderComponents } : {}),
  };
  const hasFieldComparisons = React.useMemo(
    () => containsFieldComparisons(data),
    [data]
  );
  const isOutputFormatDisabled = React.useCallback(
    (format: OutputFormat) =>
      hasFieldComparisons && unsupportedFieldComparisonFormats.includes(format),
    [hasFieldComparisons]
  );

  React.useEffect(() => {
    if (isOutputFormatDisabled(outputFormat)) {
      setOutputFormat('Native');
    }
  }, [isOutputFormatDisabled, outputFormat, setOutputFormat]);

  const outputText = React.useMemo(
    () =>
      outputFormat === 'Native'
        ? serializeNativeQuery(data)
        : formatQueryText(data, outputFormat, demoFields),
    [data, outputFormat]
  );
  const builderSource = React.useMemo(
    () =>
      formatBuilderSource({
        ...settings,
        customizationMode,
        themeColors,
        defaultThemeColors: defaultTheme.colors,
      }),
    [customizationMode, settings, themeColors]
  );

  return (
    <Layout>
      <Sidebar>
        <DemoPlaygroundBehaviorControls
          settings={settings}
          onSettingChange={updateSetting}
        />
        <DemoPlaygroundTextControls
          settings={settings}
          onSettingChange={updateSetting}
        />
        <DemoPlaygroundPreferenceControls
          settings={settings}
          onSettingChange={updateSetting}
        />
        <DemoPlaygroundCustomization
          mode={customizationMode}
          onChange={setCustomizationMode}
        />
        <DemoPlaygroundTheme
          customizationMode={customizationMode}
          value={themeColors}
          onChange={setThemeColors}
        />
      </Sidebar>
      <Main>
        <DemoPlaygroundSource
          source={builderSource}
          visible={showSourceCode}
          onVisibleChange={setShowSourceCode}
        />
        <DemoPlaygroundBuilder
          builderProps={builderProps}
          customizationMode={customizationMode}
          themeColors={themeColors}
        />
        <DemoPlaygroundOutput
          format={outputFormat}
          output={outputText}
          isFormatDisabled={isOutputFormatDisabled}
          onFormatChange={setOutputFormat}
        />
      </Main>
    </Layout>
  );
};
