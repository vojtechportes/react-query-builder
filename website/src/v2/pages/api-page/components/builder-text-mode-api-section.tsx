import * as React from 'react';
import { CodeBlock } from '../../../../components/code-block';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
} from '../../../../components/docs-primitives';
import { textModeConfigSignature } from '../constants/text-mode-config-signature';

export const BuilderTextModeApiSection: React.FC = () => (
  <>
    <SectionTitle>Text mode behavior</SectionTitle>
    <CodeBlock
      code={textModeConfigSignature}
      language="ts"
      label="Text mode types"
    />
    <List>
      <li>
        <ItemTitle>Format:</ItemTitle> The current text-mode implementation
        edits SQL.
      </li>
      <li>
        <ItemTitle>Config shape:</ItemTitle> <InlineCode>textMode</InlineCode>{' '}
        accepts either <InlineCode>true</InlineCode> or{' '}
        <InlineCode>{`{ format?: 'SQL'; defaultMode?: 'builder' | 'text' }`}</InlineCode>
        .
      </li>
      <li>
        <ItemTitle>Default-mode precedence:</ItemTitle> If both{' '}
        <InlineCode>textMode.defaultMode</InlineCode> and the top-level{' '}
        <InlineCode>defaultMode</InlineCode> prop are provided, the top-level
        prop wins.
      </li>
      <li>
        <ItemTitle>Syntax and semantic validation:</ItemTitle> The built-in
        editor highlights invalid SQL syntax plus builder-specific issues such
        as unknown fields, unsupported operators, and invalid select values.
      </li>
      <li>
        <ItemTitle>Field comparisons:</ItemTitle> When{' '}
        <InlineCode>allowFieldComparisons</InlineCode> is enabled, SQL text mode
        accepts builder-compatible right-hand-side field references such as{' '}
        <InlineCode>ORDER_TOTAL &gt;= ORDER_APPROVAL_LIMIT</InlineCode>. When
        disabled, the same expression is reported as a semantic validation
        issue.
      </li>
      <li>
        <ItemTitle>Invalid text flow:</ItemTitle> Invalid text stays local to
        text mode, the last valid builder query is preserved, and{' '}
        <InlineCode>onChange</InlineCode> is fired only after a valid parse and
        semantic validation.
      </li>
      <li>
        <ItemTitle>History:</ItemTitle> Valid text edits are committed into
        builder history. Invalid intermediate text is not committed into builder
        state or history.
      </li>
      <li>
        <ItemTitle>Built-in editor:</ItemTitle> Included in the main package and
        suitable for freely editable SQL text mode.
      </li>
      <li>
        <ItemTitle>Locked queries:</ItemTitle> The built-in text editor blocks
        locked or targeted read-only queries because it cannot preserve
        protected text ranges safely after freeform edits.
      </li>
      <li>
        <ItemTitle>Custom editors:</ItemTitle> Custom text editors receive{' '}
        <InlineCode>protectedRanges</InlineCode> so localized read-only SQL
        fragments can stay visible while remaining non-editable.
      </li>
      <li>
        <ItemTitle>Monaco path:</ItemTitle> Use the optional{' '}
        <InlineCode>@vojtechportes/react-query-builder/monaco</InlineCode>{' '}
        subpackage when you need a protected-range editor that can preserve
        locked and targeted read-only query segments.
      </li>
    </List>
  </>
);
