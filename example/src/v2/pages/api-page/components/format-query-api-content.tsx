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
import { formatQuerySignature } from '../constants/format-query-signature';
import { formatOptionsSignature } from '../constants/format-options-signature';
import { queryFormatSignature } from '../constants/query-format-signature';
import { formatQueryFieldComparisonSnippet } from '../constants/format-query-field-comparison-snippet';

export const FormatQueryApiContent: React.FC = () => (
  <>
    <CodeBlock
      code={formatQuerySignature}
      language="ts"
      label="formatQuery signature"
    />
    <CodeBlock
      code={queryFormatSignature}
      language="ts"
      label="Supported formats"
    />
    <CodeBlock
      code={formatOptionsSignature}
      language="ts"
      label="Options types"
    />
    <SectionTitle>Parameters</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>value</InlineCode>:
        </ItemTitle>{' '}
        The <TextLink to="/api/data">denormalized query tree</TextLink> to
        serialize.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>format</InlineCode>:
        </ItemTitle>{' '}
        The target format. This determines both the formatter used and the shape
        of accepted options.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>options</InlineCode>:
        </ItemTitle>{' '}
        Optional formatter configuration.
      </li>
    </List>
    <SectionTitle>Shared options</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>fields</InlineCode>:
        </ItemTitle>{' '}
        Supplies <TextLink to="/api/fields">field metadata</TextLink> to the
        formatter. This is often required when output depends on field type,
        option labels, or value semantics.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>rootlessCombinator</InlineCode>:
        </ItemTitle>{' '}
        Chooses how root-level items are combined when the query does not have a
        single explicit root group. This matters most when{' '}
        <InlineCode>singleRootGroup</InlineCode> is disabled.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>modifierlessGroupCombinator</InlineCode>:
        </ItemTitle>{' '}
        Chooses how children of modifierless groups are combined when a group
        has structure but no embedded AND/OR modifier.
      </li>
    </List>
    <SectionTitle>Behavior notes</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>fields</InlineCode>:
        </ItemTitle>{' '}
        Treat this as recommended for anything beyond trivial string-only
        formatting, especially for typed values and list-backed fields.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>rootlessCombinator</InlineCode>:
        </ItemTitle>{' '}
        If your tree has multiple top-level nodes, this decides whether the
        exported expression joins them with <InlineCode>AND</InlineCode> or{' '}
        <InlineCode>OR</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>modifierlessGroupCombinator</InlineCode>:
        </ItemTitle>{' '}
        Use this when your UI allows groups without modifiers and your target
        syntax still needs a combinator in serialized output.
      </li>
    </List>
    <SectionTitle>Format-specific options</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>wrapWhereClause</InlineCode>:
        </ItemTitle>{' '}
        Supported by SQL and Prisma format options. Prefixes the output with{' '}
        <InlineCode>WHERE </InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>wrapFilterClause</InlineCode>:
        </ItemTitle>{' '}
        Supported by AQL and OData format options. Prefixes the output with{' '}
        <InlineCode>FILTER </InlineCode> or equivalent filter clause semantics.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>variableName</InlineCode>:
        </ItemTitle>{' '}
        Supported by AQL format options. Sets the document variable prefix used
        in generated expressions.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>wrapQueryClause</InlineCode>:
        </ItemTitle>{' '}
        Supported by Elasticsearch format options. Wraps the generated
        expression in the outer query clause shape.
      </li>
    </List>
    <SectionTitle>Field comparisons</SectionTitle>
    <CodeBlock
      code={formatQueryFieldComparisonSnippet}
      language="ts"
      label="Formatting a field-reference rule"
    />
    <List>
      <li>
        <ItemTitle>Native support:</ItemTitle> <InlineCode>SQL</InlineCode>,{' '}
        <InlineCode>Mongo</InlineCode>, <InlineCode>AQL</InlineCode>,{' '}
        <InlineCode>JSONata</InlineCode>, <InlineCode>JsonLogic</InlineCode>,{' '}
        <InlineCode>CEL</InlineCode>, <InlineCode>SpEL</InlineCode>,{' '}
        <InlineCode>Prisma</InlineCode>, <InlineCode>OData</InlineCode>,{' '}
        <InlineCode>Dynamo</InlineCode>, and <InlineCode>Django</InlineCode>{' '}
        serialize field comparisons when the operator has a direct
        right-hand-side field form.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>fields</InlineCode> option:
        </ItemTitle>{' '}
        Treat field metadata as strongly recommended here because formatter
        behavior depends on field semantics and operator compatibility.
      </li>
      <li>
        <ItemTitle>Explicit rejection:</ItemTitle>{' '}
        <InlineCode>Elasticsearch</InlineCode> and <InlineCode>RSQL</InlineCode>{' '}
        intentionally throw for <InlineCode>valueSource: 'field'</InlineCode>{' '}
        rules instead of inventing backend-only syntax.
      </li>
    </List>
    <AlertBox title="See also" variant="info">
      For a live sandbox that exercises these formats, use{' '}
      <TextLink to="/documentation/parsing-and-formatting">
        Parsing and Formatting
      </TextLink>
      .
    </AlertBox>
  </>
);
