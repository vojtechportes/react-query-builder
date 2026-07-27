import * as React from 'react';
import { AlertBox } from '../../../../../../components/alert-box';
import { CodeBlock } from '../../../../../../components/code-block';
import {
  InlineCode,
  List,
  SectionTitle,
  TextLink,
} from '../../../../../../components/docs-primitives';
import { validationSnippet } from '../constants/validation-snippet';
import { usageLimitSnippet } from '../constants/usage-limit-snippet';

export const ValidationDocumentationContent: React.FC = () => (
  <>
    <p>
      Built-in validation is defined in{' '}
      <TextLink to="/api/fields">field metadata</TextLink> and evaluated by{' '}
      <TextLink to="/api/builder">Builder</TextLink>.
    </p>
    <List>
      <li>
        Use <InlineCode>validation.common</InlineCode> for operator-agnostic
        rules such as required values.
      </li>
      <li>
        Use <InlineCode>validation.rules</InlineCode> for operator-specific
        rules.
      </li>
      <li>
        Use <InlineCode>showValidation</InlineCode> to render built-in
        validation messages in the UI.
      </li>
      <li>
        Use <InlineCode>onStateChange</InlineCode> when query data and
        validation state need to be read together.
      </li>
    </List>
    <CodeBlock
      code={validationSnippet}
      language="tsx"
      label="Built-in validation"
    />
    <SectionTitle>Built-in rule types</SectionTitle>
    <List>
      <li>
        Text fields support rules such as <InlineCode>minLength</InlineCode> and{' '}
        <InlineCode>maxLength</InlineCode>.
      </li>
      <li>
        Number and date fields support boundary rules such as{' '}
        <InlineCode>min</InlineCode>, <InlineCode>max</InlineCode>,{' '}
        <InlineCode>minDate</InlineCode>, and <InlineCode>maxDate</InlineCode>.
      </li>
      <li>
        List and multi-list fields support item-count constraints such as{' '}
        <InlineCode>minItems</InlineCode> and <InlineCode>maxItems</InlineCode>.
      </li>
      <li>
        Range operators such as <InlineCode>BETWEEN</InlineCode> can use{' '}
        <InlineCode>range</InlineCode> validation to validate both values
        together.
      </li>
    </List>
    <SectionTitle>Structural usage limits</SectionTitle>
    <p>
      Use <InlineCode>usageLimit</InlineCode> when a constraint depends on how
      many rules already use a field or a shared usage bucket. This is separate
      from value validation because it governs query structure rather than the
      validity of a single rule value.
    </p>
    <CodeBlock
      code={usageLimitSnippet}
      language="tsx"
      label="Field usage limits"
    />
    <List>
      <li>
        <InlineCode>max</InlineCode> defines how many matching rules are allowed
        inside the selected scope.
      </li>
      <li>
        <InlineCode>scope=&quot;global&quot;</InlineCode> limits usage across
        the whole query tree.
      </li>
      <li>
        <InlineCode>scope=&quot;parent&quot;</InlineCode> limits usage only
        among sibling rules in the same immediate parent group.
      </li>
      <li>
        <InlineCode>key</InlineCode> lets multiple different fields share the
        same quota bucket.
      </li>
      <li>
        Exhausted fields are disabled in the field selector, and the Add Rule
        button is disabled when no selectable fields remain in the current
        scope.
      </li>
      <li>
        <InlineCode>showValidation</InlineCode> still surfaces an issue when
        data arrives in an already invalid state, such as external input or text
        mode edits.
      </li>
    </List>
    <AlertBox title="Custom validator" variant="info">
      Use <InlineCode>validator</InlineCode> when validation depends on multiple
      rules, external state, or rules that are not expressible in field-level
      validation config or <InlineCode>usageLimit</InlineCode>.
    </AlertBox>
    <AlertBox title="API reference" variant="info">
      <TextLink to="/api/builder">Builder</TextLink> and{' '}
      <TextLink to="/api/fields">Fields</TextLink>.
    </AlertBox>
  </>
);
