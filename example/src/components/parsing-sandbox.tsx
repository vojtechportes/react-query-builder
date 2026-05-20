import * as React from 'react';
import styled from 'styled-components';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { ThemeProvider } from '../../../src/theme-provider/theme-provider';
import { parseQuery } from '../../../src/parseQuery';
import { AlertBox } from './alert-box';
import { CodeBlock } from './code-block';
import { demoFields, defaultTheme, initialQueryTree } from '../constants/demo-data';
import { siteTheme } from '../constants/site-theme';
import {
  formatQueryText,
  inferCodeLanguage,
  supportedFormats,
  type SupportedQueryFormat,
} from '../utils/query-formatters';

const Root = styled.section`
  display: grid;
  gap: 1.25rem;
  min-width: 0;
  padding: 1.5rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const SelectRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  min-width: 0;
`;

const Select = styled.select`
  min-width: 170px;
  padding: 0.8rem 2.4rem 0.8rem 0.95rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: #fff;
  color: #0f172a;
  font-size: 0.98rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%230f172a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.95rem center;

  &:focus {
    outline: none;
    border-color: ${siteTheme.primaryLight};
    box-shadow: 0 0 0 3px ${siteTheme.primaryGlow};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  max-width: 100%;
  min-height: 220px;
  padding: 1rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  resize: vertical;
  background: #fff;
  color: #0f172a;
  line-height: 1.6;
`;

const BuilderCard = styled.div`
  min-width: 0;
  padding: 1.25rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: #fff;
`;

const BuilderScrollArea = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 0.35rem;
`;

const BuilderViewport = styled.div`
  display: inline-block;
  min-width: 920px;
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: normal;
`;

const formatExample = (query: DenormalizedQuery, format: SupportedQueryFormat) =>
  formatQueryText(query, format, demoFields);

export const ParsingSandbox: React.FC = () => {
  const [inputFormat, setInputFormat] =
    React.useState<SupportedQueryFormat>('SQL');
  const [outputFormat, setOutputFormat] =
    React.useState<SupportedQueryFormat>('Mongo');
  const [builderData, setBuilderData] =
    React.useState<DenormalizedQuery>(initialQueryTree);
  const [builderFields, setBuilderFields] =
    React.useState<IBuilderFieldProps[]>(demoFields);
  const [inputText, setInputText] = React.useState(() =>
    formatExample(initialQueryTree, 'SQL')
  );
  const [inputError, setInputError] = React.useState<string | null>(null);
  const [outputError, setOutputError] = React.useState<string | null>(null);

  const outputState = React.useMemo(() => {
    try {
      return {
        text: formatQueryText(builderData, outputFormat, builderFields),
        error: null,
      };
    } catch (error) {
      return {
        text: '',
        error:
          error instanceof Error ? error.message : 'Unknown formatting error.',
      };
    }
  }, [builderData, builderFields, outputFormat]);

  React.useEffect(() => {
    setOutputError(outputState.error);
  }, [outputState.error]);

  const applyParse = React.useCallback(
    (value: string, format: SupportedQueryFormat) => {
      setInputText(value);

      try {
        const parsed = parseQuery(value, format);
        setBuilderData(parsed.data);
        setBuilderFields(parsed.fields.length > 0 ? parsed.fields : demoFields);
        setInputError(null);
      } catch (error) {
        setInputError(
          error instanceof Error ? error.message : 'Unknown parsing error.'
        );
      }
    },
    []
  );

  return (
    <Root>
      <Header>
        <div>
          <Title>Parsing and formatting sandbox</Title>
          <p>
            Switch formats, paste an expression, and watch the generated builder
            and reformatted output update in one place.
          </p>
        </div>

        <SelectRow>
          <Select
            value={inputFormat}
            onChange={event => {
              const nextFormat = event.target.value as SupportedQueryFormat;
              setInputFormat(nextFormat);
              const nextText = formatExample(builderData, nextFormat);
              setInputText(nextText);
              setInputError(null);
            }}
          >
            {supportedFormats.map(format => (
              <option key={format} value={format}>
                Input: {format}
              </option>
            ))}
          </Select>

          <Select
            value={outputFormat}
            onChange={event =>
              setOutputFormat(event.target.value as SupportedQueryFormat)
            }
          >
            {supportedFormats.map(format => (
              <option key={format} value={format}>
                Output: {format}
              </option>
            ))}
          </Select>
        </SelectRow>
      </Header>

      <Textarea
        value={inputText}
        onChange={event => applyParse(event.target.value, inputFormat)}
      />

      {inputError ? (
        <AlertBox title="Parse error" variant="warning">
          {inputError}
        </AlertBox>
      ) : null}

      <BuilderCard>
        <BuilderScrollArea>
          <BuilderViewport>
            <ThemeProvider colors={defaultTheme.colors}>
              <Builder
                data={builderData}
                fields={builderFields}
                groupTypes="both"
                singleRootGroup
                showValidation
                onChange={setBuilderData}
              />
            </ThemeProvider>
          </BuilderViewport>
        </BuilderScrollArea>
      </BuilderCard>

      {outputError ? (
        <AlertBox title="Format error" variant="warning">
          {outputError}
        </AlertBox>
      ) : (
        <CodeBlock
          code={outputState.text}
          language={inferCodeLanguage(outputFormat)}
          label={`${outputFormat} output`}
        />
      )}
    </Root>
  );
};
