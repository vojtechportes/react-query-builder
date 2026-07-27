import * as React from 'react';
import styled from 'styled-components';
import { CodeBlock } from '../../../../components/code-block';
import { siteTheme } from '../../../../constants/site-theme';
import { formatLabels } from '../constants/format-labels';
import type { OutputFormat } from '../types/output-format';
import { inferCodeLanguage } from '../utils/infer-code-language.util';

const OutputCard = styled.section`
  display: grid;
  gap: 1rem;
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.65rem 0.95rem;
  border: 1px solid
    ${({ $active }) => ($active ? siteTheme.primary : '#dbe4f0')};
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? siteTheme.primarySurfaceStrong : '#fff'};
  color: ${({ $active }) => ($active ? siteTheme.primaryDark : '#475569')};
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export interface IDemoPlaygroundOutputProps {
  format: OutputFormat;
  output: string;
  isFormatDisabled: (format: OutputFormat) => boolean;
  onFormatChange: (format: OutputFormat) => void;
}

export const DemoPlaygroundOutput: React.FC<IDemoPlaygroundOutputProps> = ({
  format,
  output,
  isFormatDisabled,
  onFormatChange,
}) => (
  <OutputCard>
    <Tabs>
      {(Object.keys(formatLabels) as OutputFormat[]).map((candidateFormat) => {
        const disabled = isFormatDisabled(candidateFormat);

        return (
          <Tab
            key={candidateFormat}
            $active={format === candidateFormat}
            disabled={disabled}
            title={
              disabled
                ? 'Disabled because the current query contains field-to-field comparisons.'
                : undefined
            }
            onClick={() => onFormatChange(candidateFormat)}
          >
            {formatLabels[candidateFormat]}
          </Tab>
        );
      })}
    </Tabs>
    <CodeBlock
      code={output}
      label={`${formatLabels[format]} output`}
      language={inferCodeLanguage(format)}
    />
  </OutputCard>
);
