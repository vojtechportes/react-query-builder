import * as React from 'react';
import { AlertBox } from '../../../../../../components/alert-box';
import { CodeBlock } from '../../../../../../components/code-block';
import { List, TextLink } from '../../../../../../components/docs-primitives';
import { sqlSnippet } from '../constants/sql-snippet';
import { parseSnippet } from '../constants/parse-snippet';

export const ParsingAndFormattingDocumentationContent: React.FC = () => (
  <>
    <p>Query data can be converted to and from supported external formats.</p>
    <List>
      <li>
        <TextLink to="/api/format-query">formatQuery</TextLink> converts builder
        state to a target syntax.
      </li>
      <li>
        <TextLink to="/api/parse-query">parseQuery</TextLink> converts supported
        syntaxes back into builder state.
      </li>
      <li>
        The documentation sandbox on this page lets you experiment with every
        supported format live.
      </li>
    </List>
    <CodeBlock code={sqlSnippet} language="ts" label="Formatting to SQL" />
    <CodeBlock code={parseSnippet} language="ts" label="Parsing from SQL" />
    <AlertBox title="Round-tripping" variant="info">
      Some formats are more expressive than others. A round-trip is best when
      the source expression stays within the subset that maps cleanly to the
      builder model.
    </AlertBox>
    <AlertBox title="API reference" variant="info">
      <TextLink to="/api/format-query">formatQuery</TextLink> and{' '}
      <TextLink to="/api/parse-query">parseQuery</TextLink>.
    </AlertBox>
  </>
);
