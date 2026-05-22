import * as React from 'react';
import styled from 'styled-components';
import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import { components as antdComponents } from '@vojtechportes/react-query-builder/antd/v6';
import { components as muiComponents } from '@vojtechportes/react-query-builder/mui/v9';
import type { IColors } from '../../../src/constants/colors';
import { ThemeProvider } from '../../../src/theme-provider/theme-provider';
import { demoFields, defaultTheme, initialQueryTree } from '../constants/demo-data';
import { siteTheme } from '../constants/site-theme';
import {
  formatLabels,
  formatQueryText,
  inferCodeLanguage,
  serializeNativeQuery,
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

const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #334155;
`;

const Toggle = styled.input`
  width: 18px;
  height: 18px;
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

export interface IDemoPlaygroundProps {
  initialData?: DenormalizedQuery;
}

type CustomizationMode = 'default' | 'mui' | 'antd';

export const DemoPlayground: React.FC<IDemoPlaygroundProps> = ({
  initialData = initialQueryTree,
}) => {
  const [data, setData] = React.useState<DenormalizedQuery>(initialData);
  const [outputFormat, setOutputFormat] = React.useState<OutputFormat>('Native');
  const [readOnly, setReadOnly] = React.useState(false);
  const [lockable, setLockable] = React.useState(false);
  const [cloneable, setCloneable] = React.useState(false);
  const [draggable, setDraggable] = React.useState(false);
  const [history, setHistory] = React.useState(false);
  const [singleRootGroup, setSingleRootGroup] = React.useState(true);
  const [showValidation, setShowValidation] = React.useState(true);
  const [customizationMode, setCustomizationMode] =
    React.useState<CustomizationMode>('default');
  const [themeColors, setThemeColors] = React.useState<IColors>(
    defaultTheme.colors
  );
  const isMuiMode = customizationMode === 'mui';
  const isAntdMode = customizationMode === 'antd';
  const usesAdapterMode = isMuiMode || isAntdMode;

  const builderProps = {
    data,
    fields: demoFields,
    readOnly,
    lockable,
    cloneable,
    onChange: setData,
    draggable,
    history,
    groupTypes: 'both' as const,
    singleRootGroup,
    showValidation,
  };

  const outputText = React.useMemo(() => {
    if (outputFormat === 'Native') {
      return serializeNativeQuery(data);
    }

    return formatQueryText(data, outputFormat, demoFields);
  }, [data, outputFormat]);

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
              <span>ANTD v6 adapter</span>
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
                  : 'ThemeProvider colors style the default builder components only. The ANTD v6 adapter uses Ant Design styling instead.'
                : undefined
            }
          />
        </Panel>
      </Sidebar>

      <Main>
        <BuilderCard>
          <BuilderSurface>
            {isMuiMode ? (
              <Builder
                {...builderProps}
                components={muiComponents}
              />
            ) : isAntdMode ? (
              <Builder
                {...builderProps}
                components={antdComponents}
              />
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
