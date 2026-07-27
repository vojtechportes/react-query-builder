import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import { CodeBlock } from '../../../../components/code-block';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
  TextLink,
} from '../../../../components/docs-primitives';
import { parseQuerySignature } from '../constants/parse-query-signature';
import { parseResultSignature } from '../constants/parse-result-signature';
import { queryFormatSignature } from '../constants/query-format-signature';
import { parseQueryFieldComparisonSnippet } from '../constants/parse-query-field-comparison-snippet';

export const ParseQueryApiContent: React.FC = () => (
  <>
    <CodeBlock
      code={parseQuerySignature}
      language="ts"
      label="parseQuery signature"
    />
    <CodeBlock
      code={queryFormatSignature}
      language="ts"
      label="Supported formats"
    />
    <CodeBlock code={parseResultSignature} language="ts" label="Parse result" />
    <SectionTitle>Parameters</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>value</InlineCode>:
        </ItemTitle>{' '}
        The input string to parse.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>format</InlineCode>:
        </ItemTitle>{' '}
        The source syntax. Parsing behavior is selected entirely from this
        value.
      </li>
    </List>
    <SectionTitle>Return value</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>fields</InlineCode>:
        </ItemTitle>{' '}
        <TextLink to="/api/fields">Field metadata</TextLink> inferred by the
        parser where possible. Some parsers can infer types and operator sets
        from the source expression.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>data</InlineCode>:
        </ItemTitle>{' '}
        The <TextLink to="/api/data">denormalized query tree</TextLink> produced
        from the input string.
      </li>
    </List>
    <SectionTitle>Field comparisons</SectionTitle>
    <CodeBlock
      code={parseQueryFieldComparisonSnippet}
      language="ts"
      label="Parsing a field-reference rule"
    />
    <List>
      <li>
        <ItemTitle>Rule shape:</ItemTitle> When the source syntax uses a native
        right-hand-side field reference, the parsed rule uses{' '}
        <InlineCode>valueSource: 'field'</InlineCode> plus{' '}
        <InlineCode>valueField</InlineCode>.
      </li>
      <li>
        <ItemTitle>Supported native parsing:</ItemTitle>{' '}
        <InlineCode>SQL</InlineCode>, <InlineCode>Mongo</InlineCode>,{' '}
        <InlineCode>AQL</InlineCode>, <InlineCode>JSONata</InlineCode>,{' '}
        <InlineCode>JsonLogic</InlineCode>, <InlineCode>CEL</InlineCode>,{' '}
        <InlineCode>SpEL</InlineCode>, <InlineCode>Prisma</InlineCode>,{' '}
        <InlineCode>OData</InlineCode>, <InlineCode>Dynamo</InlineCode>, and{' '}
        <InlineCode>Django</InlineCode> can infer field comparisons from
        builder-compatible expressions.
      </li>
      <li>
        <ItemTitle>Guardrails:</ItemTitle> Unsupported or ambiguous shapes fail
        explicitly rather than being guessed as field references, including the
        intentionally unsupported <InlineCode>RSQL</InlineCode> and{' '}
        <InlineCode>Elasticsearch</InlineCode> cases.
      </li>
    </List>
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/parsing-and-formatting">
        Parsing and Formatting
      </TextLink>
      .
    </AlertBox>
  </>
);
