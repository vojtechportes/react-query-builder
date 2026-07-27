import * as React from 'react';
import { CodeBlock } from '../../../../components/code-block';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
} from '../../../../components/docs-primitives';
import { monacoComponentsSnippet } from '../constants/monaco-components-snippet';

export const MonacoSubpackageApiSection: React.FC = () => (
  <>
    <SectionTitle>Monaco subpackage</SectionTitle>
    <CodeBlock
      code={monacoComponentsSnippet}
      language="tsx"
      label="createMonacoComponents"
    />
    <List>
      <li>
        <ItemTitle>
          <InlineCode>@vojtechportes/react-query-builder/monaco</InlineCode>:
        </ItemTitle>{' '}
        Exports <InlineCode>createMonacoComponents</InlineCode>,{' '}
        <InlineCode>createMonacoComponentSet</InlineCode>, and{' '}
        <InlineCode>MonacoTextModeEditor</InlineCode>.
      </li>
      <li>
        <ItemTitle>Stylesheet:</ItemTitle> Import{' '}
        <InlineCode>@vojtechportes/react-query-builder/styles.css</InlineCode>{' '}
        exactly once for both the builder and Monaco integration. The Monaco
        subpackage does not add another CSS asset.
      </li>
      <li>
        <ItemTitle>Styling hooks:</ItemTitle> Use public{' '}
        <InlineCode>--query-builder-*</InlineCode> variables or the stable{' '}
        <InlineCode>.rqb-monaco-text-mode-editor</InlineCode> surface class.
        Generated <InlineCode>rqb_[local]_[hash]</InlineCode> classes are
        private.
      </li>
      <li>
        <ItemTitle>Peer dependency:</ItemTitle>{' '}
        <InlineCode>monaco-editor</InlineCode> is optional and only required
        when you use that subpackage.
      </li>
      <li>
        <ItemTitle>When to use it:</ItemTitle> Prefer it when text mode must
        preserve locked rules or groups through protected editor ranges.
      </li>
      <li>
        <ItemTitle>Protected ranges:</ItemTitle> Monaco text mode can render
        locked SQL fragments as dimmed protected ranges with hover messaging
        while still allowing edits around them.
      </li>
    </List>
  </>
);
