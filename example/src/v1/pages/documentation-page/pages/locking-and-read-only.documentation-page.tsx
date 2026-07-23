import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import { CodeBlock } from '../../../../components/code-block';
import {
  InlineCode,
  List,
  SectionTitle,
  TextLink,
} from '../../../../components/docs-primitives';
import type { IDocumentationPage } from '../types/documentation-page';

const lockingSnippet = `const data: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'STATUS',
        operator: 'EQUAL',
        value: 'ACTIVE',
        readOnly: {
          enabled: true,
          targets: ['field', 'operator'],
        },
      },
      {
        type: 'GROUP',
        value: 'OR',
        isNegated: false,
        readOnly: {
          enabled: true,
          targets: ['combinator'],
        },
        children: [
          {
            field: 'COUNTRY',
            operator: 'EQUAL',
            value: 'CZ',
          },
        ],
      },
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        readOnly: {
          enabled: true,
          inheritToChildren: true,
        },
        children: [
          {
            field: 'IS_VAT_PAYER',
            operator: 'EQUAL',
            value: true,
          },
        ],
      },
    ],
  },
];

<Builder fields={fields} data={data} onChange={setData} />;`;

const targetedReadOnlySnippet = `const data: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    readOnly: {
      enabled: true,
      targets: ['combinator'],
    },
    children: [
      {
        field: 'CUSTOMER_COUNTRY',
        operator: 'EQUAL',
        value: 'CZ',
        readOnly: {
          enabled: true,
          targets: ['field', 'operator'],
        },
      },
      {
        field: 'ORDER_TOTAL',
        operator: 'BETWEEN',
        value: [1000, 5000],
        readOnly: {
          enabled: true,
          targets: ['value'],
        },
      },
    ],
  },
];`;

const lockingGuiSnippet = `<Builder
  fields={fields}
  data={data}
  lockable
  onChange={setData}
/>;

// Rules cycle through:
// unlocked -> locked
//
// Groups cycle through:
// unlocked -> locked group only -> locked group and descendants
//
// The emitted query stores those states in readOnly:
// rule: readOnly: true
// group: readOnly: true
// group + descendants: readOnly: { enabled: true, inheritToChildren: true }
//
// If a node already uses readOnly.targets, the lock toggle preserves those
// targets and only changes enabled/inheritToChildren.`;

const lockToggleSnippet = `const components = {
  LockToggle: MyLockToggle,
};

<Builder
  fields={fields}
  data={data}
  lockable
  components={components}
  onChange={setData}
/>;

// LockToggle receives:
// state: 'unlocked' | 'self' | 'all'
// nodeType: 'rule' | 'group'
// disabled?: boolean
// onChange?: (nextState) => void`;

const cloneButtonSnippet = `const components = {
  CloneButton: MyCloneButton,
};

<Builder
  fields={fields}
  data={data}
  cloneable
  components={components}
  onChange={setData}
/>;

// CloneButton receives:
// nodeType: 'rule' | 'group'
// disabled?: boolean
// onClick?: () => void`;

export const lockingAndReadOnlyDocumentationPage: IDocumentationPage = {
  path: '/documentation/locking-and-read-only',
  title: 'Locking and Read-only',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Documentation for builder-level, rule-level, and group-level read-only behavior, including targeted read-only and group inheritance semantics.',
  searchText:
    'readOnly locking locked rule group targets field operator value combinator negation inheritToChildren inheritance read only builder rule group drag delete add controls',
  content: (
    <>
      <p>
        Locking can be applied at the builder, rule, or group level. The key
        distinction is that rules lock only themselves, while groups can lock
        either just their own controls or their entire subtree. Object-based{' '}
        <InlineCode>readOnly</InlineCode> configs also support targeted
        read-only for specific controls.
      </p>
      <SectionTitle>GUI Locking</SectionTitle>
      <p>
        Set <InlineCode>lockable</InlineCode> on{' '}
        <TextLink to="/api/builder">Builder</TextLink> to render lock controls
        directly in the UI. The built-in controls update the same{' '}
        <InlineCode>readOnly</InlineCode> fields that are already part of the
        query data model, so the resulting lock state is preserved in output. If
        a node already has <InlineCode>readOnly.targets</InlineCode>, the lock
        toggle preserves those targets and only changes whether the lock is
        enabled and, for groups, whether it inherits to descendants.
      </p>
      <CodeBlock code={lockingGuiSnippet} language="tsx" label="GUI locking" />
      <List>
        <li>Rules cycle through two states: unlocked and locked.</li>
        <li>
          Groups cycle through three states: unlocked, locked group only, and
          locked group with descendants.
        </li>
        <li>
          The default group cycle maps to <InlineCode>false</InlineCode>,{' '}
          <InlineCode>true</InlineCode>, and{' '}
          <InlineCode>{`{ enabled: true, inheritToChildren: true }`}</InlineCode>
          .
        </li>
        <li>
          When a parent group inherits a lock to descendants, child lock
          controls render disabled because descendants cannot override that
          inherited state.
        </li>
        <li>
          When <InlineCode>cloneable</InlineCode> is also enabled, the clone
          button renders immediately to the left of the lock button.
        </li>
      </List>
      <SectionTitle>Targeted read-only</SectionTitle>
      <p>
        Use object-based <InlineCode>readOnly</InlineCode> configs when you want
        to keep specific controls visible but non-editable instead of locking
        the entire rule or group.
      </p>
      <CodeBlock
        code={targetedReadOnlySnippet}
        language="tsx"
        label="Targeted read-only"
      />
      <List>
        <li>
          Rule targets are <InlineCode>field</InlineCode>,{' '}
          <InlineCode>operator</InlineCode>, and <InlineCode>value</InlineCode>.
        </li>
        <li>
          Group targets are <InlineCode>combinator</InlineCode> and{' '}
          <InlineCode>negation</InlineCode>.
        </li>
        <li>
          If <InlineCode>enabled</InlineCode> is <InlineCode>true</InlineCode>{' '}
          and <InlineCode>targets</InlineCode> is omitted, the whole node is
          read-only.
        </li>
        <li>
          If <InlineCode>enabled</InlineCode> is <InlineCode>false</InlineCode>,
          the config stays dormant until the node is locked again.
        </li>
      </List>
      <SectionTitle>How each level behaves</SectionTitle>
      <List>
        <li>
          <InlineCode>{'<Builder readOnly />'}</InlineCode> locks the entire
          builder. No rules or groups remain editable.
        </li>
        <li>
          <InlineCode>rule.readOnly = true</InlineCode> locks only that rule.
          Siblings and parent groups are unaffected.
        </li>
        <li>
          <InlineCode>{`rule.readOnly = { enabled: true, targets: ['field'] }`}</InlineCode>{' '}
          keeps the field visible but non-editable, and also prevents deleting
          that rule.
        </li>
        <li>
          <InlineCode>group.readOnly = true</InlineCode> locks only that
          group&apos;s own controls. Its child rules and child groups stay
          editable by default.
        </li>
        <li>
          <InlineCode>{`group.readOnly = { enabled: true, targets: ['combinator'] }`}</InlineCode>{' '}
          keeps the group combinator visible but non-editable without forcing
          descendant rules to become read-only.
        </li>
        <li>
          <InlineCode>{`group.readOnly = { enabled: true, inheritToChildren: true }`}</InlineCode>{' '}
          locks the group and all descendant rules and groups.
        </li>
      </List>
      <CodeBlock
        code={lockingSnippet}
        language="tsx"
        label="Locking examples"
      />
      <SectionTitle>Custom Lock Control</SectionTitle>
      <p>
        The default lock button can be replaced through{' '}
        <InlineCode>components.LockToggle</InlineCode>.
      </p>
      <CodeBlock
        code={lockToggleSnippet}
        language="tsx"
        label="LockToggle override"
      />
      <SectionTitle>Custom Clone Control</SectionTitle>
      <p>
        The default clone button can be replaced through{' '}
        <InlineCode>components.CloneButton</InlineCode>.
      </p>
      <CodeBlock
        code={cloneButtonSnippet}
        language="tsx"
        label="CloneButton override"
      />
      <SectionTitle>What &quot;locked&quot; means in the UI</SectionTitle>
      <List>
        <li>
          Read-only targets stay visible. They become disabled, not hidden.
        </li>
        <li>
          Locked rules cannot change field, operator, or value, and cannot be
          deleted.
        </li>
        <li>
          Targeted rule read-only also blocks deleting that rule, even if only
          one target such as <InlineCode>field</InlineCode> is protected.
        </li>
        <li>
          Locked groups cannot change their group operator, negation, add
          actions, or delete action.
        </li>
        <li>
          By default, groups also cannot be deleted when that would remove
          protected descendants indirectly.
        </li>
        <li>
          Set <InlineCode>Builder.readOnlyProtectsDelete={false}</InlineCode> to
          disable that subtree delete protection while keeping direct node-level
          read-only deletion rules.
        </li>
        <li>
          Locked rules and groups are removed from drag-and-drop interactions.
        </li>
        <li>
          Clone controls render only for editable rules and groups. Cloned nodes
          preserve their read-only configuration.
        </li>
        <li>
          A locked group without inheritance still renders editable descendants
          when those descendants are not otherwise locked.
        </li>
      </List>
      <SectionTitle>Inheritance and precedence</SectionTitle>
      <List>
        <li>Inheritance only applies to groups, never to rules.</li>
        <li>
          <InlineCode>inheritToChildren</InlineCode> has an effect only when{' '}
          <InlineCode>enabled</InlineCode> is <InlineCode>true</InlineCode>.
        </li>
        <li>
          Once a parent group inherits read-only to descendants, child nodes
          cannot opt back into editability with{' '}
          <InlineCode>readOnly: false</InlineCode>.
        </li>
        <li>
          Descendants may still add their own local{' '}
          <InlineCode>readOnly</InlineCode> flags, but they cannot override an
          inherited lock from an ancestor.
        </li>
        <li>
          Group target inheritance preserves only the group-level semantics of
          the inherited lock. It does not turn rule-specific controls such as{' '}
          <InlineCode>field</InlineCode> or <InlineCode>value</InlineCode> into
          inherited targets.
        </li>
      </List>
      <AlertBox title="API reference" variant="info">
        <TextLink to="/api/builder">Builder</TextLink> and{' '}
        <TextLink to="/api/data">Data</TextLink>.
      </AlertBox>
    </>
  ),
};
