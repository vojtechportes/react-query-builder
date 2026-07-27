import * as React from 'react';
import { InlineCode, ItemTitle } from '../../../../components/docs-primitives';

export const BuilderBehaviorPropsApiItems: React.FC = () => (
  <>
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
      <InlineCode>isValid</InlineCode>, the full validation object, and history
      state flags such as <InlineCode>canUndo</InlineCode> and{' '}
      <InlineCode>canRedo</InlineCode>.
    </li>
    <li>
      <ItemTitle>
        <InlineCode>onFieldOptionsReload</InlineCode>:
      </ItemTitle>{' '}
      Optional callback fired by{' '}
      <InlineCode>reloadFieldOptions(field)</InlineCode> for shared field-level
      runtime options.
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
      <InlineCode>IBuilderHistoryConfig</InlineCode> to customize retention and
      built-in controls.
    </li>
    <li>
      <ItemTitle>
        <InlineCode>onChange</InlineCode>:
      </ItemTitle>{' '}
      Optional callback fired with the denormalized query tree after changes are
      emitted.
    </li>
  </>
);
