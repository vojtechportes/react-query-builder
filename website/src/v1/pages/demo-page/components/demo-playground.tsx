import * as React from 'react';
import {
  type DenormalizedQuery,
  type IColors,
} from '@vojtechportes/react-query-builder';
import styled from 'styled-components';
import { defaultTheme } from '../constants/default-theme';
import { demoFields } from '../constants/demo-fields';
import { initialQueryTree } from '../constants/initial-query-tree';
import { localeStrings } from '../constants/locale-strings';
import { unsupportedFieldComparisonFormats } from '../constants/unsupported-field-comparison-formats';
import type { CustomizationMode } from '../types/customization-mode';
import type { LocaleId } from '../types/locale-id';
import type { OutputFormat } from '../types/output-format';
import { containsFieldComparisons } from '../utils/contains-field-comparisons.util';
import { formatBuilderSource } from '../utils/format-builder-source.util';
import { formatQueryText } from '../utils/format-query-text.util';
import { getBuilderComponents } from '../utils/get-builder-components.util';
import { serializeNativeQuery } from '../utils/serialize-native-query.util';
import { DemoPlaygroundBuilder } from './demo-playground-builder';
import { DemoPlaygroundControls } from './demo-playground-controls';
import { DemoPlaygroundCustomization } from './demo-playground-customization';
import { DemoPlaygroundOutput } from './demo-playground-output';
import { DemoPlaygroundSource } from './demo-playground-source';
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
  const [data, setData] = React.useState<DenormalizedQuery>(initialData);
  const [outputFormat, setOutputFormat] =
    React.useState<OutputFormat>('Native');
  const [readOnly, setReadOnly] = React.useState(false);
  const [readOnlyProtectsDelete, setReadOnlyProtectsDelete] =
    React.useState(true);
  const [lockable, setLockable] = React.useState(false);
  const [cloneable, setCloneable] = React.useState(false);
  const [draggable, setDraggable] = React.useState(false);
  const [allowGroupNegation, setAllowGroupNegation] = React.useState(true);
  const [allowFieldComparisons, setAllowFieldComparisons] =
    React.useState(true);
  const [newNodePlacement, setNewNodePlacement] = React.useState<
    'append' | 'prepend'
  >('append');
  const [locale, setLocale] = React.useState<LocaleId>('en-US');
  const [history, setHistory] = React.useState(false);
  const [textMode, setTextMode] = React.useState(false);
  const [defaultMode, setDefaultMode] = React.useState<'builder' | 'text'>(
    'builder'
  );
  const [useMonacoTextEditor, setUseMonacoTextEditor] = React.useState(false);
  const [singleRootGroup, setSingleRootGroup] = React.useState(true);
  const [showValidation, setShowValidation] = React.useState(true);
  const [customizationMode, setCustomizationMode] =
    React.useState<CustomizationMode>('default');
  const [themeColors, setThemeColors] = React.useState<IColors>(
    defaultTheme.colors
  );
  const [showSourceCode, setShowSourceCode] = React.useState(false);

  React.useEffect(() => {
    if (!singleRootGroup && textMode) {
      setTextMode(false);
    }
  }, [singleRootGroup, textMode]);

  const builderComponents = React.useMemo(
    () => getBuilderComponents(customizationMode, useMonacoTextEditor),
    [customizationMode, useMonacoTextEditor]
  );
  const builderProps = {
    data,
    fields: demoFields,
    readOnly,
    readOnlyProtectsDelete,
    lockable,
    cloneable,
    onChange: setData,
    draggable,
    allowGroupNegation,
    allowFieldComparisons,
    newNodePlacement,
    strings: localeStrings[locale],
    history,
    textMode,
    defaultMode,
    groupTypes: 'both' as const,
    singleRootGroup,
    showValidation,
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
  }, [isOutputFormatDisabled, outputFormat]);

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
        readOnly,
        readOnlyProtectsDelete,
        lockable,
        cloneable,
        draggable,
        allowGroupNegation,
        allowFieldComparisons,
        newNodePlacement,
        locale,
        history,
        textMode,
        defaultMode,
        useMonacoTextEditor,
        singleRootGroup,
        showValidation,
        customizationMode,
        themeColors,
        defaultThemeColors: defaultTheme.colors,
      }),
    [
      readOnly,
      readOnlyProtectsDelete,
      lockable,
      cloneable,
      draggable,
      allowGroupNegation,
      allowFieldComparisons,
      newNodePlacement,
      locale,
      history,
      textMode,
      defaultMode,
      useMonacoTextEditor,
      singleRootGroup,
      showValidation,
      customizationMode,
      themeColors,
    ]
  );

  return (
    <Layout>
      <Sidebar>
        <DemoPlaygroundControls
          allowFieldComparisons={allowFieldComparisons}
          allowGroupNegation={allowGroupNegation}
          cloneable={cloneable}
          defaultMode={defaultMode}
          draggable={draggable}
          history={history}
          locale={locale}
          lockable={lockable}
          newNodePlacement={newNodePlacement}
          readOnly={readOnly}
          readOnlyProtectsDelete={readOnlyProtectsDelete}
          showValidation={showValidation}
          singleRootGroup={singleRootGroup}
          textMode={textMode}
          useMonacoTextEditor={useMonacoTextEditor}
          onAllowFieldComparisonsChange={setAllowFieldComparisons}
          onAllowGroupNegationChange={setAllowGroupNegation}
          onCloneableChange={setCloneable}
          onDefaultModeChange={setDefaultMode}
          onDraggableChange={setDraggable}
          onHistoryChange={setHistory}
          onLocaleChange={setLocale}
          onLockableChange={setLockable}
          onNewNodePlacementChange={setNewNodePlacement}
          onReadOnlyChange={setReadOnly}
          onReadOnlyProtectsDeleteChange={setReadOnlyProtectsDelete}
          onShowValidationChange={setShowValidation}
          onSingleRootGroupChange={setSingleRootGroup}
          onTextModeChange={setTextMode}
          onUseMonacoTextEditorChange={setUseMonacoTextEditor}
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
