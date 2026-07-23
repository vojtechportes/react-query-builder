import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import { CodeBlock } from '../../../../components/code-block';
import { List, TextLink } from '../../../../components/docs-primitives';
import type { IDocumentationPage } from '../types/documentation-page';

const sqlSnippet = `import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const sql = formatQuery(data, 'SQL', {
  fields,
  wrapWhereClause: true,
});

// WHERE (CUSTOMER_COUNTRY = 'CZ' AND ORDER_TOTAL BETWEEN 1000 AND 5000)`;

const parseSnippet = `import { parseQuery } from '@vojtechportes/react-query-builder/parseQuery';

const result = parseQuery(
  "WHERE CUSTOMER_COUNTRY = 'CZ' AND ORDER_TOTAL >= 1000",
  'SQL'
);

console.log(result.fields);
console.log(result.data);`;

export const parsingAndFormattingDocumentationPage: IDocumentationPage = {
  path: '/documentation/parsing-and-formatting',
  title: 'Overview',
  sectionKey: 'parsing',
  sectionTitle: 'Parsing and Formatting',
  summary: '',
  description:
    'Overview of parsing and formatting query data across supported external formats.',
  searchText:
    'Parsing formatting SQL Mongo AQL JSONata JsonLogic CEL Elasticsearch SpEL Prisma OData RSQL Dynamo Django parseQuery formatQuery interoperability sandbox',
  content: (
    <>
      <p>Query data can be converted to and from supported external formats.</p>
      <List>
        <li>
          <TextLink to="/api/format-query">formatQuery</TextLink> converts
          builder state to a target syntax.
        </li>
        <li>
          <TextLink to="/api/parse-query">parseQuery</TextLink> converts
          supported syntaxes back into builder state.
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
  ),
};
