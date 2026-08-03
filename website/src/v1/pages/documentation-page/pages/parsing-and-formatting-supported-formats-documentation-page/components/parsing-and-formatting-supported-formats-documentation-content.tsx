import * as React from 'react';
import { Typography } from '../../../../../../components/typography/typography';
import { AlertBox } from '../../../../../../components/alert-box';
import { CodeBlock } from '../../../../../../components/code-block';
import {
  InlineCode,
  List,
  SectionTitle,
  TextLink,
} from '../../../../../../components/docs-primitives';
import { sqlSnippet } from '../constants/sql-snippet';
import { fieldComparisonFormatSnippet } from '../constants/field-comparison-format-snippet';
import { fieldComparisonParseSnippet } from '../constants/field-comparison-parse-snippet';

export const ParsingAndFormattingSupportedFormatsDocumentationContent: React.FC =
  () => (
    <>
      <Typography color="muted">
        Supported formats and their primary use cases.
      </Typography>
      <SectionTitle>SQL</SectionTitle>
      <Typography color="muted">
        Formatting and predicate parsing for builder-compatible SQL expressions.
      </Typography>
      <CodeBlock code={sqlSnippet} language="ts" label="SQL formatter" />
      <AlertBox title="Parsing scope" variant="warning">
        SQL support is aimed at builder-compatible predicates. It is not meant
        to be a full SQL parser for arbitrary queries with joins, projections,
        or nested subqueries.
      </AlertBox>
      <SectionTitle>Mongo</SectionTitle>
      <Typography color="muted">
        Formatting returns a serialized JSON filter document. Parsing expects a
        JSON object string and can infer{' '}
        <TextLink to="/api/fields">fields</TextLink> from the document shape.
      </Typography>
      <CodeBlock
        code={`const mongo = formatQuery(data, 'Mongo');\n// { "$and": [ ... ] }`}
        language="ts"
        label="Mongo formatter"
      />
      <AlertBox title="Field inference" variant="tip">
        Mongo parsing can infer field names and basic types from the filter
        document.
      </AlertBox>
      <SectionTitle>AQL</SectionTitle>
      <List>
        <li>
          ArangoDB-style filter expressions with optional filter-clause wrapping
          and configurable variable names.
        </li>
      </List>
      <SectionTitle>JSONata and JsonLogic</SectionTitle>
      <List>
        <li>
          JSON-oriented expression formats for rules evaluated against
          object-shaped data.
        </li>
      </List>
      <SectionTitle>CEL and SpEL</SectionTitle>
      <List>
        <li>
          Expression languages used in application and policy evaluation
          environments.
        </li>
      </List>
      <SectionTitle>Prisma and Django</SectionTitle>
      <List>
        <li>Framework-oriented filter output for backend query layers.</li>
      </List>
      <SectionTitle>OData, RSQL, Dynamo, and Elasticsearch</SectionTitle>
      <List>
        <li>
          API and datastore integrations with format-specific output
          conventions.
        </li>
      </List>
      <SectionTitle>Advanced: Field-To-Field Comparisons</SectionTitle>
      <Typography color="muted">
        Most formats on this page can be explored with ordinary literal-based
        rules. If you specifically need one field to compare against another,
        start with{' '}
        <TextLink to="/documentation/field-comparisons">
          Field Comparisons
        </TextLink>{' '}
        and then use the native field-reference support only in formats that
        have a direct right-hand-side field form.
      </Typography>
      <List>
        <li>
          Supported native field-to-field formats in this feature are{' '}
          <InlineCode>SQL</InlineCode>, <InlineCode>Mongo</InlineCode>,{' '}
          <InlineCode>AQL</InlineCode>, <InlineCode>JSONata</InlineCode>,{' '}
          <InlineCode>JsonLogic</InlineCode>, <InlineCode>CEL</InlineCode>,{' '}
          <InlineCode>SpEL</InlineCode>, <InlineCode>Prisma</InlineCode>,{' '}
          <InlineCode>OData</InlineCode>, <InlineCode>Dynamo</InlineCode>, and{' '}
          <InlineCode>Django</InlineCode>.
        </li>
        <li>
          String-style field references are also supported where the target
          format has a native form for them, such as{' '}
          <InlineCode>contains</InlineCode>, <InlineCode>startsWith</InlineCode>
          , and <InlineCode>endsWith</InlineCode> in{' '}
          <InlineCode>CEL</InlineCode>, <InlineCode>OData</InlineCode>,{' '}
          <InlineCode>Django</InlineCode>, and <InlineCode>SpEL</InlineCode>.
        </li>
        <li>
          <InlineCode>Elasticsearch</InlineCode> and{' '}
          <InlineCode>RSQL</InlineCode> intentionally reject field comparisons
          because supporting them would require invented syntax or non-native
          backend semantics.
        </li>
      </List>
      <CodeBlock
        code={fieldComparisonFormatSnippet}
        language="ts"
        label="Formatting a field comparison"
      />
      <CodeBlock
        code={fieldComparisonParseSnippet}
        language="ts"
        label="Parsing a field comparison"
      />
      <AlertBox title="API reference" variant="info">
        <TextLink to="/api/format-query">formatQuery</TextLink> and{' '}
        <TextLink to="/api/parse-query">parseQuery</TextLink>.
      </AlertBox>
    </>
  );
