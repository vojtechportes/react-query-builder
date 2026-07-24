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
import { queryTreeSignature } from '../constants/query-tree-signature';
import { dataFieldComparisonSnippet } from '../constants/data-field-comparison-snippet';

export const DataApiContent: React.FC = () => (
  <>
    <CodeBlock
      code={queryTreeSignature}
      language="ts"
      label="Query tree types"
    />
    <CodeBlock
      code={dataFieldComparisonSnippet}
      language="ts"
      label="Field-reference rule data"
    />
    <SectionTitle>Rule props</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>field</InlineCode>:
        </ItemTitle>{' '}
        Required field identifier matching one of the configured fields.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>operator</InlineCode>:
        </ItemTitle>{' '}
        Optional operator for the rule. Some field and operator combinations
        imply different value shapes.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>valueSource</InlineCode>:
        </ItemTitle>{' '}
        Optional discriminant. Omit it or set <InlineCode>'value'</InlineCode>{' '}
        for literal comparisons, or set <InlineCode>'field'</InlineCode> for
        right-hand-side field references.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>value</InlineCode>:
        </ItemTitle>{' '}
        Optional literal rule value used when{' '}
        <InlineCode>valueSource</InlineCode> is omitted or set to{' '}
        <InlineCode>'value'</InlineCode>. Supported scalar and array forms are
        defined by <InlineCode>QueryRuleValue</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>valueField</InlineCode>:
        </ItemTitle>{' '}
        Required when <InlineCode>valueSource</InlineCode> is{' '}
        <InlineCode>'field'</InlineCode>. Stores the compared field identifier
        instead of a literal value.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>operators</InlineCode>:
        </ItemTitle>{' '}
        Optional rule-level operator override list.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>readOnly</InlineCode>:
        </ItemTitle>{' '}
        Optional per-rule lock definition. Supported shapes are{' '}
        <InlineCode>false</InlineCode> or omitted, <InlineCode>true</InlineCode>
        , or{' '}
        <InlineCode>{`{ enabled: boolean; targets?: ('field' | 'operator' | 'value')[] }`}</InlineCode>
        .
      </li>
      <li>
        <ItemTitle>
          <InlineCode>readOnly.targets</InlineCode>:
        </ItemTitle>{' '}
        Part of the <InlineCode>readOnly</InlineCode> object config. Rule
        targets are <InlineCode>'field'</InlineCode>,{' '}
        <InlineCode>'operator'</InlineCode>, and{' '}
        <InlineCode>'value'</InlineCode>. Targeted controls stay visible but
        become non-editable.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>readOnly.enabled</InlineCode>:
        </ItemTitle>{' '}
        Part of the <InlineCode>readOnly</InlineCode> object config. When{' '}
        <InlineCode>true</InlineCode>, the listed targets are protected. When{' '}
        <InlineCode>readOnly.targets</InlineCode> is omitted, the whole rule is
        read-only.
      </li>
      <li>
        <ItemTitle>Delete behavior:</ItemTitle> A rule with any effective
        read-only target is also non-deletable, and cloned rules preserve the
        same read-only configuration.
      </li>
      <li>
        <ItemTitle>GUI cycle:</ItemTitle> When <InlineCode>lockable</InlineCode>{' '}
        is enabled, rules cycle between unlocked and locked. Object-based{' '}
        <InlineCode>readOnly.targets</InlineCode> are preserved when the user
        unlocks and re-locks the same rule.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>id</InlineCode> and <InlineCode>parent</InlineCode>:
        </ItemTitle>{' '}
        Optional in denormalized input. The builder can ingest data without
        them.
      </li>
    </List>
    <SectionTitle>Group props</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>type</InlineCode>:
        </ItemTitle>{' '}
        Always <InlineCode>'GROUP'</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>children</InlineCode>:
        </ItemTitle>{' '}
        Required nested nodes.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>value</InlineCode>:
        </ItemTitle>{' '}
        Present only for groups with modifiers and must be{' '}
        <InlineCode>'AND'</InlineCode> or <InlineCode>'OR'</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>isNegated</InlineCode>:
        </ItemTitle>{' '}
        Present only for groups with modifiers.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>readOnly</InlineCode>:
        </ItemTitle>{' '}
        Can be <InlineCode>false</InlineCode> or omitted,{' '}
        <InlineCode>true</InlineCode>, or{' '}
        <InlineCode>{`{ enabled: boolean; targets?: ('negation' | 'combinator')[]; inheritToChildren?: boolean }`}</InlineCode>
        .
      </li>
      <li>
        <ItemTitle>
          <InlineCode>readOnly: true</InlineCode>:
        </ItemTitle>{' '}
        Locks only the group&apos;s own controls by default. Descendant rules
        and groups remain editable unless inheritance is enabled.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>readOnly.targets</InlineCode>:
        </ItemTitle>{' '}
        Part of the <InlineCode>readOnly</InlineCode> object config. Group
        targets are <InlineCode>'negation'</InlineCode> and{' '}
        <InlineCode>'combinator'</InlineCode>. Targeted controls stay visible
        but become non-editable.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>readOnly.enabled</InlineCode>:
        </ItemTitle>{' '}
        Part of the <InlineCode>readOnly</InlineCode> object config. When{' '}
        <InlineCode>true</InlineCode>, the listed targets are protected. When{' '}
        <InlineCode>readOnly.targets</InlineCode> is omitted, the whole group is
        read-only.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>readOnly.inheritToChildren</InlineCode>:
        </ItemTitle>{' '}
        Part of the <InlineCode>readOnly</InlineCode> object config. Applies the
        group lock to descendant groups and their children when the group is
        enabled.
      </li>
      <li>
        <ItemTitle>Delete behavior:</ItemTitle> A group cannot be deleted when
        it has effective read-only targets. By default, it also cannot be
        deleted when that would remove protected descendants indirectly. This
        subtree behavior can be disabled with{' '}
        <InlineCode>Builder.readOnlyProtectsDelete={false}</InlineCode>.
      </li>
      <li>
        <ItemTitle>GUI cycle:</ItemTitle> When <InlineCode>lockable</InlineCode>{' '}
        is enabled, groups cycle through unlocked, locked group only, and locked
        group with descendants while preserving object-based{' '}
        <InlineCode>readOnly.targets</InlineCode>.
      </li>
      <li>
        <ItemTitle>Inheritance behavior:</ItemTitle> Descendants cannot override
        an inherited lock from an ancestor.
      </li>
    </List>
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/usage">Usage</TextLink> and{' '}
      <TextLink to="/documentation/locking-and-read-only">
        Locking and Read-only
      </TextLink>
      .
    </AlertBox>
  </>
);
