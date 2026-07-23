import * as React from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { ThemeProvider } from '@vojtechportes/react-query-builder';
import { parseQuery } from '@vojtechportes/react-query-builder/parseQuery';
import { AlertBox } from '../../../../components/alert-box';
import { CodeBlock } from '../../../../components/code-block';
import { defaultTheme } from '../../demo-page/constants/default-theme';
import { demoFields } from '../../demo-page/constants/demo-fields';
import { supportedFormats } from '../../demo-page/constants/supported-formats';
import type { SupportedQueryFormat } from '../../demo-page/types/supported-query-format';
import { formatQueryText } from '../../demo-page/utils/format-query-text.util';
import { formatParsingExample } from '../utils/format-parsing-example.util';
import { ParsingSandboxBuilderCard } from './parsing-sandbox-builder-card';
import { ParsingSandboxBuilderScrollArea } from './parsing-sandbox-builder-scroll-area';
import { ParsingSandboxBuilderViewport } from './parsing-sandbox-builder-viewport';
import { ParsingSandboxHeader } from './parsing-sandbox-header';
import { ParsingSandboxRoot } from './parsing-sandbox-root';
import { ParsingSandboxSelect } from './parsing-sandbox-select';
import { ParsingSandboxSelectRow } from './parsing-sandbox-select-row';
import { ParsingSandboxTextarea } from './parsing-sandbox-textarea';
import { ParsingSandboxTitle } from './parsing-sandbox-title';
import { inferCodeLanguage } from '../../demo-page/utils/infer-code-language.util';
import { parsingSandboxInitialQueryTree } from '../constants/parsing-sandbox-initial-query-tree';

export const ParsingSandbox: React.FC = () => {
  const [inputFormat, setInputFormat] =
    React.useState<SupportedQueryFormat>('SQL');
  const [outputFormat, setOutputFormat] =
    React.useState<SupportedQueryFormat>('Mongo');
  const [builderData, setBuilderData] = React.useState<DenormalizedQuery>(
    parsingSandboxInitialQueryTree
  );
  const [builderFields, setBuilderFields] =
    React.useState<IBuilderFieldProps[]>(demoFields);
  const [inputText, setInputText] = React.useState(() =>
    formatParsingExample(parsingSandboxInitialQueryTree, 'SQL')
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
    <ParsingSandboxRoot>
      <ParsingSandboxHeader>
        <div>
          <ParsingSandboxTitle>
            Parsing and formatting sandbox
          </ParsingSandboxTitle>
          <p>
            Switch formats, paste an expression, and watch the generated builder
            and reformatted output update in one place.
          </p>
        </div>

        <ParsingSandboxSelectRow>
          <ParsingSandboxSelect
            value={inputFormat}
            onChange={(event) => {
              const nextFormat = event.target.value as SupportedQueryFormat;
              setInputFormat(nextFormat);
              const nextText = formatParsingExample(builderData, nextFormat);
              setInputText(nextText);
              setInputError(null);
            }}
          >
            {supportedFormats.map((format) => (
              <option key={format} value={format}>
                Input: {format}
              </option>
            ))}
          </ParsingSandboxSelect>

          <ParsingSandboxSelect
            value={outputFormat}
            onChange={(event) =>
              setOutputFormat(event.target.value as SupportedQueryFormat)
            }
          >
            {supportedFormats.map((format) => (
              <option key={format} value={format}>
                Output: {format}
              </option>
            ))}
          </ParsingSandboxSelect>
        </ParsingSandboxSelectRow>
      </ParsingSandboxHeader>

      <ParsingSandboxTextarea
        value={inputText}
        onChange={(event) => applyParse(event.target.value, inputFormat)}
      />

      {inputError ? (
        <AlertBox title="Parse error" variant="warning">
          {inputError}
        </AlertBox>
      ) : null}

      <ParsingSandboxBuilderCard>
        <ParsingSandboxBuilderScrollArea>
          <ParsingSandboxBuilderViewport>
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
          </ParsingSandboxBuilderViewport>
        </ParsingSandboxBuilderScrollArea>
      </ParsingSandboxBuilderCard>

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
    </ParsingSandboxRoot>
  );
};
