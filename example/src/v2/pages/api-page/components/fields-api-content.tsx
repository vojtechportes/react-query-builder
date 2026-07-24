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
import { fieldTypesSignature } from '../constants/field-types-signature';
import { fieldBaseSignature } from '../constants/field-base-signature';
import { fieldUsageLimitSignature } from '../constants/field-usage-limit-signature';
import { fieldComparisonConfigSignature } from '../constants/field-comparison-config-signature';
import { fieldOptionTypesSignature } from '../constants/field-option-types-signature';
import { fieldsFieldComparisonSnippet } from '../constants/fields-field-comparison-snippet';

export const FieldsApiContent: React.FC = () => (
  <>
    <CodeBlock code={fieldTypesSignature} language="ts" label="Field unions" />
    <CodeBlock
      code={fieldBaseSignature}
      language="ts"
      label="Shared field shape"
    />
    <CodeBlock
      code={fieldUsageLimitSignature}
      language="ts"
      label="Field usage limits"
    />
    <CodeBlock
      code={fieldComparisonConfigSignature}
      language="ts"
      label="Field comparison config"
    />
    <CodeBlock
      code={fieldOptionTypesSignature}
      language="ts"
      label="Imperative option types"
    />
    <SectionTitle>Props</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>field</InlineCode>:
        </ItemTitle>{' '}
        Required stable identifier used in query data and conversion helpers.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>label</InlineCode>:
        </ItemTitle>{' '}
        Required user-facing caption shown in the field selector.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>type</InlineCode>:
        </ItemTitle>{' '}
        Required field type. This controls which widget and value semantics are
        used.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>value</InlineCode>:
        </ItemTitle>{' '}
        Optional default or backing field value metadata. For{' '}
        <InlineCode>LIST</InlineCode> and <InlineCode>MULTI_LIST</InlineCode>,
        this is the initial static option set.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>operators</InlineCode>:
        </ItemTitle>{' '}
        Optional operator whitelist. When omitted, the builder falls back to the
        default operators for the field type.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>usageLimit</InlineCode>:
        </ItemTitle>{' '}
        Optional structural constraint that limits how many rules may use this
        field or its shared usage bucket.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>validation</InlineCode>:
        </ItemTitle>{' '}
        Optional validation config. The shape depends on field type.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>fieldComparison</InlineCode>:
        </ItemTitle>{' '}
        Optional semantic config for field-to-field comparisons, including a
        comparison type override and an allowlist of valid target fields.
      </li>
    </List>
    <SectionTitle>usageLimit</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>max</InlineCode>:
        </ItemTitle>{' '}
        Required maximum number of matching rules allowed in the selected scope.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>scope</InlineCode>:
        </ItemTitle>{' '}
        Optional. Defaults to <InlineCode>global</InlineCode>. Use{' '}
        <InlineCode>parent</InlineCode> to limit usage only within the same
        immediate parent group.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>key</InlineCode>:
        </ItemTitle>{' '}
        Optional shared bucket identifier. When omitted, the builder uses the
        field&apos;s own <InlineCode>field</InlineCode> value.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>message</InlineCode>:
        </ItemTitle>{' '}
        Optional custom validation message used when persisted or imported data
        exceeds the allowed limit.
      </li>
    </List>
    <SectionTitle>fieldComparison</SectionTitle>
    <CodeBlock
      code={fieldsFieldComparisonSnippet}
      language="tsx"
      label="Semantic field comparison metadata"
    />
    <List>
      <li>
        <ItemTitle>
          <InlineCode>type</InlineCode>:
        </ItemTitle>{' '}
        Optional semantic comparison type. When omitted,{' '}
        <InlineCode>TEXT</InlineCode>, <InlineCode>NUMBER</InlineCode>,{' '}
        <InlineCode>DATE</InlineCode>, and <InlineCode>BOOLEAN</InlineCode>{' '}
        infer automatically, while <InlineCode>LIST</InlineCode> can infer from
        uniform option values.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>comparableFields</InlineCode>:
        </ItemTitle>{' '}
        Optional source-owned allowlist that restricts which fields may appear
        on the right-hand side.
      </li>
      <li>
        <ItemTitle>Operator support:</ItemTitle> Field comparisons are only
        offered for operators that have a direct single-value right-hand side.
        Range and set-style operators continue to use literal values.
      </li>
    </List>
    <SectionTitle>Type notes</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>BOOLEAN</InlineCode> / <InlineCode>TEXT</InlineCode> /{' '}
          <InlineCode>DATE</InlineCode> / <InlineCode>NUMBER</InlineCode>:
        </ItemTitle>{' '}
        The standard scalar field families with built-in widget and validation
        behavior.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>LIST</InlineCode> / <InlineCode>MULTI_LIST</InlineCode>:
        </ItemTitle>{' '}
        Option-backed selectors where <InlineCode>value</InlineCode> holds the
        initial static option set, field-level runtime options can be shared
        across all rules of that field, and rule-level runtime options can
        override them per rule instance.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>STATEMENT</InlineCode>:
        </ItemTitle>{' '}
        Advanced field type for free-form statement-like values. Document it
        carefully in consuming apps because it is less self-explanatory than
        scalar or list fields.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>GROUP</InlineCode>:
        </ItemTitle>{' '}
        Advanced structural field type intended for specialized query models
        rather than everyday filter fields.
      </li>
    </List>
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/usage">Usage</TextLink>,{' '}
      <TextLink to="/documentation/validation">Validation</TextLink>,{' '}
      <TextLink to="/documentation/dynamic-field-options">
        Dynamic Field Options
      </TextLink>
      , and <TextLink to="/documentation/localization">Localization</TextLink>.
    </AlertBox>
  </>
);
