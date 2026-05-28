import * as React from 'react';
import styled from 'styled-components';
import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import { components as antdComponents } from '@vojtechportes/react-query-builder/antd/v6';
import { createMonacoComponents } from '@vojtechportes/react-query-builder/monaco';
import { components as muiComponents } from '@vojtechportes/react-query-builder/mui/v9';
import type { IColors } from '../../../src/constants/colors';
import { ThemeProvider } from '../../../src/theme-provider/theme-provider';
import { demoFields, defaultTheme, initialQueryTree } from '../constants/demo-data';
import { siteTheme } from '../constants/site-theme';
import {
  formatLabels,
  formatBuilderSource,
  formatQueryText,
  inferCodeLanguage,
  serializeNativeQuery,
  type CustomizationMode,
  type OutputFormat,
} from '../utils/query-formatters';
import { CodeBlock } from './code-block';
import { ThemeEditor } from './theme-editor';

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

const Panel = styled.section`
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #0f172a;
`;

const ToggleRow = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #334155;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

const Toggle = styled.input<{ $disabled?: boolean }>`
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: #2563eb;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  flex: 0 0 18px;

  &:disabled {
    opacity: 1;
  }
`;

const SelectField = styled.label`
  display: grid;
  gap: 0.35rem;
`;

const SelectFieldLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 400;
  color: #334155;
`;

const SelectControl = styled.select`
  width: 100%;
  padding: 0.68rem 2.2rem 0.68rem 0.85rem;
  border: 1px solid #dbe4f0;
  border-radius: 10px;
  background: #fff;
  color: #0f172a;
  font-size: 0.92rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%230f172a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.85rem center;

  &:focus {
    outline: none;
    border-color: ${siteTheme.primaryLight};
    box-shadow: 0 0 0 3px ${siteTheme.primaryGlow};
  }
`;

const ChoiceGroup = styled.div`
  display: grid;
  gap: 0.7rem;
`;

const Main = styled.div`
  display: grid;
  gap: 1.25rem;
  min-width: 0;
`;

const BuilderCard = styled.section`
  overflow-x: auto;
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

const BuilderSurface = styled.div`
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: normal;
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.65rem 0.95rem;
  border: 1px solid ${({ $active }) => ($active ? siteTheme.primary : '#dbe4f0')};
  border-radius: 999px;
  background: ${({ $active }) => ($active ? siteTheme.primarySurfaceStrong : '#fff')};
  color: ${({ $active }) => ($active ? siteTheme.primaryDark : '#475569')};
  font-weight: 600;
  cursor: pointer;
`;

const OutputCard = styled.section`
  display: grid;
  gap: 1rem;
`;

const SourceActions = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const SourceButton = styled.button`
  padding: 0.65rem 0.95rem;
  border: 1px solid ${siteTheme.primaryBorder};
  border-radius: 999px;
  background: ${siteTheme.primarySurface};
  color: ${siteTheme.primaryDark};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${siteTheme.primarySurfaceStrong};
  }
`;

export interface IDemoPlaygroundProps {
  initialData?: DenormalizedQuery;
}

export const DemoPlayground: React.FC<IDemoPlaygroundProps> = ({
  initialData = initialQueryTree,
}) => {
  const [data, setData] = React.useState<DenormalizedQuery>(initialData);
  const [outputFormat, setOutputFormat] = React.useState<OutputFormat>('Native');
  const [readOnly, setReadOnly] = React.useState(false);
  const [lockable, setLockable] = React.useState(false);
  const [cloneable, setCloneable] = React.useState(false);
  const [draggable, setDraggable] = React.useState(false);
  const [newNodePlacement, setNewNodePlacement] = React.useState<
    'append' | 'prepend'
  >('append');
  const [history, setHistory] = React.useState(false);
  const [textMode, setTextMode] = React.useState(false);
  const [defaultMode, setDefaultMode] = React.useState<'builder' | 'text'>('builder');
  const [useMonacoTextEditor, setUseMonacoTextEditor] = React.useState(false);
  const [singleRootGroup, setSingleRootGroup] = React.useState(true);
  const [showValidation, setShowValidation] = React.useState(true);
  const [customizationMode, setCustomizationMode] =
    React.useState<CustomizationMode>('default');
  const [themeColors, setThemeColors] = React.useState<IColors>(
    defaultTheme.colors
  );
  const [showSourceCode, setShowSourceCode] = React.useState(false);
  const isMuiMode = customizationMode === 'mui';
  const isAntdMode = customizationMode === 'antd';
  const usesAdapterMode = isMuiMode || isAntdMode;

  React.useEffect(() => {
    if (!singleRootGroup && textMode) {
      setTextMode(false);
    }
  }, [singleRootGroup, textMode]);

  const builderComponents = React.useMemo(() => {
    const baseComponents =
      customizationMode === 'mui'
        ? muiComponents
        : customizationMode === 'antd'
          ? antdComponents
          : undefined;

    if (!useMonacoTextEditor) {
      return baseComponents;
    }

    return createMonacoComponents(baseComponents || {});
  }, [customizationMode, useMonacoTextEditor]);

  const builderProps = {
    data,
    fields: demoFields,
    readOnly,
    lockable,
    cloneable,
    onChange: setData,
    draggable,
    newNodePlacement,
    history,
    textMode,
    defaultMode,
    groupTypes: 'both' as const,
    singleRootGroup,
    showValidation,
    ...(builderComponents ? { components: builderComponents } : {}),
  };

  const outputText = React.useMemo(() => {
    if (outputFormat === 'Native') {
      return serializeNativeQuery(data);
    }

    return formatQueryText(data, outputFormat, demoFields);
  }, [data, outputFormat]);

  const builderSource = React.useMemo(
    () =>
      formatBuilderSource({
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
        defaultThemeColors: defaultTheme.colors,
      }),
    [
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
    ]
  );

  return (
    <Layout>
      <Sidebar>
        <Panel>
          <PanelTitle>Controls</PanelTitle>

          <ToggleRow>
            <Toggle
              type="checkbox"
              checked={readOnly}
              onChange={event => setReadOnly(event.target.checked)}
            />
            <span>Read-only mode</span>
          </ToggleRow>

          <ToggleRow>
            <Toggle
              type="checkbox"
              checked={lockable}
              onChange={event => setLockable(event.target.checked)}
            />
            <span>Lock controls</span>
          </ToggleRow>

          <ToggleRow>
            <Toggle
              type="checkbox"
              checked={cloneable}
              onChange={event => setCloneable(event.target.checked)}
            />
            <span>Clone controls</span>
          </ToggleRow>

          <ToggleRow>
            <Toggle
              type="checkbox"
              checked={draggable}
              onChange={event => setDraggable(event.target.checked)}
            />
            <span>Draggable nodes</span>
          </ToggleRow>

          <ToggleRow>
            <Toggle
              type="checkbox"
              checked={history}
              onChange={event => setHistory(event.target.checked)}
            />
            <span>Undo / redo history</span>
          </ToggleRow>

          <ToggleRow $disabled={!singleRootGroup}>
            <Toggle
              type="checkbox"
              checked={textMode}
              disabled={!singleRootGroup}
              $disabled={!singleRootGroup}
              onChange={event => setTextMode(event.target.checked)}
            />
            <span>
              Text editor mode
              {!singleRootGroup ? ' (requires single root group)' : ''}
            </span>
          </ToggleRow>

          <ToggleRow $disabled={!textMode}>
            <Toggle
              type="checkbox"
              checked={defaultMode === 'text'}
              disabled={!textMode}
              $disabled={!textMode}
              onChange={event =>
                setDefaultMode(event.target.checked ? 'text' : 'builder')
              }
            />
            <span>
              Open in text mode
              {!textMode ? ' (requires text editor mode)' : ''}
            </span>
          </ToggleRow>

          <ToggleRow $disabled={!textMode}>
            <Toggle
              type="checkbox"
              checked={useMonacoTextEditor}
              disabled={!textMode}
              $disabled={!textMode}
              onChange={event => setUseMonacoTextEditor(event.target.checked)}
            />
            <span>
              Monaco text editor
              {!textMode ? ' (requires text editor mode)' : ''}
            </span>
          </ToggleRow>

          <ToggleRow>
            <Toggle
              type="checkbox"
              checked={singleRootGroup}
              onChange={event => setSingleRootGroup(event.target.checked)}
            />
            <span>Single root group</span>
          </ToggleRow>

          <ToggleRow>
            <Toggle
              type="checkbox"
              checked={showValidation}
              onChange={event => setShowValidation(event.target.checked)}
            />
            <span>Show validation errors</span>
          </ToggleRow>

          <SelectField>
            <SelectFieldLabel>New node placement</SelectFieldLabel>
            <SelectControl
              value={newNodePlacement}
              onChange={event =>
                setNewNodePlacement(event.target.value as 'append' | 'prepend')
              }
            >
              <option value="append">Append to end</option>
              <option value="prepend">Prepend to start</option>
            </SelectControl>
          </SelectField>
        </Panel>

        <Panel>
          <PanelTitle>Customization</PanelTitle>

          <ChoiceGroup>
            <ToggleRow>
              <Toggle
                type="radio"
                name="customization-mode"
                checked={customizationMode === 'default'}
                onChange={() => setCustomizationMode('default')}
              />
              <span>Default components</span>
            </ToggleRow>

            <ToggleRow>
              <Toggle
                type="radio"
                name="customization-mode"
                checked={customizationMode === 'mui'}
                onChange={() => setCustomizationMode('mui')}
              />
              <span>MUI adapter</span>
            </ToggleRow>

            <ToggleRow>
              <Toggle
                type="radio"
                name="customization-mode"
                checked={customizationMode === 'antd'}
                onChange={() => setCustomizationMode('antd')}
              />
              <span>ANTD adapter</span>
            </ToggleRow>
          </ChoiceGroup>
        </Panel>

        <Panel>
          <ThemeEditor
            value={themeColors}
            onChange={setThemeColors}
            disabled={usesAdapterMode}
            disabledMessage={
              usesAdapterMode
                ? isMuiMode
                  ? 'ThemeProvider colors style the default builder components only. The MUI adapter uses Material UI styling instead.'
                  : 'ThemeProvider colors style the default builder components only. The ANTD adapter uses Ant Design styling instead.'
                : undefined
            }
          />
        </Panel>
      </Sidebar>

      <Main>
        <OutputCard>
          <SourceActions>
            <SourceButton onClick={() => setShowSourceCode(current => !current)}>
              {showSourceCode ? 'Hide Builder source' : 'Show Builder source'}
            </SourceButton>
          </SourceActions>

          {showSourceCode ? (
            <CodeBlock
              code={builderSource}
              label="Builder source"
              language="tsx"
            />
          ) : null}
        </OutputCard>

        <BuilderCard>
          <BuilderSurface>
            {isMuiMode ? (
              <Builder {...builderProps} />
            ) : isAntdMode ? (
              <Builder {...builderProps} />
            ) : (
              <ThemeProvider colors={themeColors}>
                <Builder {...builderProps} />
              </ThemeProvider>
            )}
          </BuilderSurface>
        </BuilderCard>

        <OutputCard>
          <Tabs>
            {Object.keys(formatLabels).map(key => {
              const format = key as OutputFormat;

              return (
                <Tab
                  key={format}
                  $active={outputFormat === format}
                  onClick={() => setOutputFormat(format)}
                >
                  {formatLabels[format]}
                </Tab>
              );
            })}
          </Tabs>

          <CodeBlock
            code={outputText}
            label={`${formatLabels[outputFormat]} output`}
            language={inferCodeLanguage(outputFormat)}
          />
        </OutputCard>
      </Main>
    </Layout>
  );
};
