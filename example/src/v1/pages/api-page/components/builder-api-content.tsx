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
import { builderSignature } from '../constants/builder-signature';
import { historyConfigSignature } from '../constants/history-config-signature';
import { textModeConfigSignature } from '../constants/text-mode-config-signature';
import { builderFieldComparisonSnippet } from '../constants/builder-field-comparison-snippet';

export const BuilderApiContent: React.FC = () => (
  <>
    <CodeBlock code={builderSignature} language="ts" label="IBuilderProps" />
    <CodeBlock
      code={historyConfigSignature}
      language="ts"
      label="IBuilderHistoryConfig"
    />
    <SectionTitle>Props</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>fields</InlineCode>:
        </ItemTitle>{' '}
        Required. Defines the available fields, their types, allowed operators,
        and optional validation metadata.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>data</InlineCode>:
        </ItemTitle>{' '}
        Required. The current denormalized query tree. The builder treats this
        as controlled input.
      </li>
      <li>
        <ItemTitle>Ref support:</ItemTitle> <InlineCode>Builder</InlineCode>{' '}
        supports React refs and can be paired with{' '}
        <InlineCode>useBuilderRef()</InlineCode> for imperative access.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>components</InlineCode>:
        </ItemTitle>{' '}
        Optional overrides for internal UI pieces. Omitted entries fall back to
        default components.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>strings</InlineCode>:
        </ItemTitle>{' '}
        Optional localized UI strings used by the built-in controls.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>textMode</InlineCode>:
        </ItemTitle>{' '}
        Optional. Enables SQL text mode. Pass <InlineCode>true</InlineCode> for
        the default configuration or{' '}
        <InlineCode>IBuilderTextModeConfig</InlineCode> for explicit SQL
        text-mode settings.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>defaultMode</InlineCode>:
        </ItemTitle>{' '}
        Optional. Controls whether the builder initially opens in{' '}
        <InlineCode>'builder'</InlineCode> or <InlineCode>'text'</InlineCode>{' '}
        mode. This only takes effect when text mode is enabled.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>readOnly</InlineCode>:
        </ItemTitle>{' '}
        Defaults to <InlineCode>false</InlineCode>. Makes the whole builder
        non-editable.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>readOnlyProtectsDelete</InlineCode>:
        </ItemTitle>{' '}
        Defaults to <InlineCode>true</InlineCode>. When enabled, groups cannot
        be deleted if that would indirectly remove read-only protected
        descendants. Set it to <InlineCode>false</InlineCode> to allow those
        parent-group deletes while keeping direct read-only node restrictions.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>lockable</InlineCode>:
        </ItemTitle>{' '}
        Defaults to <InlineCode>false</InlineCode>. Renders lock controls for
        rules and groups and writes the resulting lock state back into emitted
        query data without discarding existing targeted{' '}
        <InlineCode>readOnly.targets</InlineCode> configurations.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>cloneable</InlineCode>:
        </ItemTitle>{' '}
        Defaults to <InlineCode>false</InlineCode>. Renders clone controls for
        rules and groups and inserts the cloned node directly below the
        original.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>draggable</InlineCode>:
        </ItemTitle>{' '}
        Defaults to <InlineCode>false</InlineCode>. Enables drag-and-drop
        reordering and movement of query nodes.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>allowGroupNegation</InlineCode>:
        </ItemTitle>{' '}
        Defaults to <InlineCode>true</InlineCode>. When set to{' '}
        <InlineCode>false</InlineCode>, group negation is disabled across the
        builder: the group-level <InlineCode>NOT</InlineCode> control is hidden,
        emitted groups are normalized to non-negated form, and SQL text mode
        rejects group-level <InlineCode>NOT (...)</InlineCode> expressions.
        Operator-level negation such as <InlineCode>NOT IN</InlineCode>,{' '}
        <InlineCode>NOT LIKE</InlineCode>, <InlineCode>IS NOT NULL</InlineCode>,
        and <InlineCode>NOT BETWEEN</InlineCode> remains supported.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>allowFieldComparisons</InlineCode>:
        </ItemTitle>{' '}
        Defaults to <InlineCode>false</InlineCode>. Enables the built-in
        value-source toggle so supported rules can compare one field against
        another through <InlineCode>valueSource: 'field'</InlineCode> and{' '}
        <InlineCode>valueField</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>singleRootGroup</InlineCode>:
        </ItemTitle>{' '}
        Defaults to <InlineCode>true</InlineCode>. Wraps root-level items into a
        single root group and prevents deleting that root group. Text mode
        requires this to stay enabled.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>groupTypes</InlineCode>:
        </ItemTitle>{' '}
        Defaults to <InlineCode>'with-modifiers'</InlineCode>. Controls whether
        groups use combinator/negation controls, modifierless groups, or both.
        When text mode is active, builder-compatible SQL round-tripping uses
        groups with modifiers.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>newNodePlacement</InlineCode>:
        </ItemTitle>{' '}
        Defaults to <InlineCode>'append'</InlineCode>. Controls whether newly
        added rules and groups are inserted at the end or the beginning of their
        parent when built-in add actions or imperative add methods omit an
        explicit index.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>validator</InlineCode>:
        </ItemTitle>{' '}
        Optional function that receives the denormalized query plus validation
        context and returns a validation result synchronously or asynchronously.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>onStateChange</InlineCode>:
        </ItemTitle>{' '}
        Optional callback fired with <InlineCode>data</InlineCode>,{' '}
        <InlineCode>isValid</InlineCode>, the full validation object, and
        history state flags such as <InlineCode>canUndo</InlineCode> and{' '}
        <InlineCode>canRedo</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>onFieldOptionsReload</InlineCode>:
        </ItemTitle>{' '}
        Optional callback fired by{' '}
        <InlineCode>reloadFieldOptions(field)</InlineCode> for shared
        field-level runtime options.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>onRuleOptionsReload</InlineCode>:
        </ItemTitle>{' '}
        Optional callback fired by{' '}
        <InlineCode>reloadRuleOptions(ruleId)</InlineCode> for dependency-aware
        rule-level runtime options.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>onFieldChange</InlineCode>:
        </ItemTitle>{' '}
        Optional callback fired with node id, field name, previous value, next
        value, and denormalized data after a rule field or value changes.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>showValidation</InlineCode>:
        </ItemTitle>{' '}
        Defaults to <InlineCode>false</InlineCode>. Controls whether validation
        issues are rendered in the built-in UI.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>history</InlineCode>:
        </ItemTitle>{' '}
        Optional. Set to <InlineCode>true</InlineCode> to enable undo and redo
        with default settings, or pass{' '}
        <InlineCode>IBuilderHistoryConfig</InlineCode> to customize retention
        and built-in controls.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>onChange</InlineCode>:
        </ItemTitle>{' '}
        Optional callback fired with the denormalized query tree after changes
        are emitted.
      </li>
    </List>
    <SectionTitle>Field comparisons</SectionTitle>
    <CodeBlock
      code={builderFieldComparisonSnippet}
      language="tsx"
      label="Builder field comparison setup"
    />
    <List>
      <li>
        <ItemTitle>Opt-in:</ItemTitle> The default UI exposes field-to-field
        comparisons only when <InlineCode>allowFieldComparisons</InlineCode> is
        enabled.
      </li>
      <li>
        <ItemTitle>Persisted data:</ItemTitle> Preloaded field-comparison rules
        stay representable through <InlineCode>valueSource</InlineCode> and{' '}
        <InlineCode>valueField</InlineCode>, even though validation will block
        them when the prop is disabled.
      </li>
    </List>
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
    <SectionTitle>History config</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>maxEntries</InlineCode>:
        </ItemTitle>{' '}
        Optional limit for how many undo steps are retained.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>controls</InlineCode>:
        </ItemTitle>{' '}
        Optional toggle for rendering the built-in Undo and Redo buttons inside
        the builder UI.
      </li>
    </List>
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/usage">Usage</TextLink> and{' '}
      <TextLink to="/documentation/text-mode">Text Mode</TextLink>, and{' '}
      <TextLink to="/documentation/history">Undo and Redo</TextLink>, and{' '}
      <TextLink to="/documentation/builder-ref">Builder Ref</TextLink>.
    </AlertBox>
  </>
);
