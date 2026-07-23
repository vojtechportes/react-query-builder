import * as React from 'react';
import { AlertBox } from '../../../../../../components/alert-box';
import { CodeBlock } from '../../../../../../components/code-block';
import {
  InlineCode,
  List,
  SectionTitle,
  TextLink,
} from '../../../../../../components/docs-primitives';
import { fieldComparisonSnippet } from '../constants/field-comparison-snippet';

export const FieldComparisonsDocumentationContent: React.FC = () => (
  <>
    <p>
      Enable <InlineCode>allowFieldComparisons</InlineCode> on{' '}
      <TextLink to="/api/builder">Builder</TextLink> when a rule should be able
      to compare against another field instead of a literal value.
    </p>
    <CodeBlock
      code={fieldComparisonSnippet}
      language="tsx"
      label="Enable field comparisons"
    />
    <SectionTitle>How It Works</SectionTitle>
    <List>
      <li>
        <InlineCode>valueSource: 'field'</InlineCode> plus{' '}
        <InlineCode>valueField</InlineCode> stores the selected comparison field
        in query data.
      </li>
      <li>
        <InlineCode>fieldComparison.type</InlineCode> lets semantically
        compatible fields compare even when their builder UI types differ, such
        as <InlineCode>LIST</InlineCode> to <InlineCode>TEXT</InlineCode>.
      </li>
      <li>
        <InlineCode>fieldComparison.comparableFields</InlineCode> narrows the
        right-hand-side selector to an explicit allowlist owned by the source
        field.
      </li>
    </List>
    <AlertBox title="API reference" variant="info">
      <TextLink to="/api/builder">Builder</TextLink>,{' '}
      <TextLink to="/api/fields">Fields</TextLink>,{' '}
      <TextLink to="/api/data">Data</TextLink>,{' '}
      <TextLink to="/api/format-query">formatQuery</TextLink>, and{' '}
      <TextLink to="/api/parse-query">parseQuery</TextLink>.
    </AlertBox>
    <AlertBox title="Parsing and formatting" variant="tip">
      Native field-to-field formatting and parsing examples are documented in{' '}
      <TextLink to="/documentation/parsing-and-formatting/supported-formats">
        Supported Formats
      </TextLink>
      .
    </AlertBox>
  </>
);
