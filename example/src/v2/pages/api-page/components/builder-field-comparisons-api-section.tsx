import * as React from 'react';
import { CodeBlock } from '../../../../components/code-block';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
} from '../../../../components/docs-primitives';
import { builderFieldComparisonSnippet } from '../constants/builder-field-comparison-snippet';

export const BuilderFieldComparisonsApiSection: React.FC = () => (
  <>
    <SectionTitle>Field comparisons</SectionTitle>
    <CodeBlock
      code={builderFieldComparisonSnippet}
      language="tsx"
      label="Builder field comparison setup"
    />
    <List>
      <li>
        <ItemTitle>Opt-in:</ItemTitle> The default UI exposes field-to-field
        comparisons only when <InlineCode>allowFieldComparisons</InlineCode> is
        enabled.
      </li>
      <li>
        <ItemTitle>Persisted data:</ItemTitle> Preloaded field-comparison rules
        stay representable through <InlineCode>valueSource</InlineCode> and{' '}
        <InlineCode>valueField</InlineCode>, even though validation will block
        them when the prop is disabled.
      </li>
    </List>
  </>
);
