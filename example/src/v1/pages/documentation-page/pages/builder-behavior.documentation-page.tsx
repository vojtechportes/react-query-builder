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

const builderBehaviorSnippet = `<Builder
  fields={fields}
  data={data}
  lockable
  readOnlyProtectsDelete
  cloneable
  draggable
  allowGroupNegation={false}
  newNodePlacement="prepend"
  singleRootGroup={false}
  groupTypes="both"
  onChange={setData}
/>;

// lockable:
// Renders built-in lock controls for rules and groups and writes the resulting
// lock state back into the emitted query via rule/group readOnly values.
//
// readOnlyProtectsDelete:
// Prevents deleting parent groups when that delete would indirectly remove
// read-only protected descendants. Defaults to true.
//
// cloneable:
// Renders built-in clone controls for rules and groups and inserts the cloned
// node directly below the original node.
//
// draggable:
// Enables drag-and-drop for editable rules and groups.
//
// allowGroupNegation={false}:
// Hides the group-level NOT toggle and rejects NOT (...) groups in text mode
// while still allowing operator-level negation such as NOT IN or IS NOT NULL.
//
// newNodePlacement="prepend":
// Inserts newly added rules and groups at the beginning of their parent instead
// of appending them to the end. The default is "append".
//
// singleRootGroup={false}:
// Allows multiple root-level nodes instead of wrapping everything into one root group.
//
// groupTypes="both":
// Lets users choose between groups with AND/OR/NOT controls and groups without modifiers.`;

export const builderBehaviorDocumentationPage: IDocumentationPage = {
  path: '/documentation/builder-behavior',
  title: 'Builder Behavior',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Documentation for clone controls, drag-and-drop, insertion placement, root-group behavior, and group mode configuration.',
  searchText:
    'builder behavior cloneable clone controls draggable drag and drop allowGroupNegation group negation not groups readOnlyProtectsDelete newNodePlacement append prepend singleRootGroup groupTypes with modifiers without modifiers both root group',
  content: (
    <>
      <p>
        A few builder props shape the overall editing model more than the field
        or query data itself. These are worth deciding early because they affect
        how users add, move, and organize rules.
      </p>
      <CodeBlock
        code={builderBehaviorSnippet}
        language="tsx"
        label="Builder behavior"
      />
      <SectionTitle>cloneable</SectionTitle>
      <List>
        <li>
          Defaults to <InlineCode>false</InlineCode> and renders built-in clone
          controls for rules and groups.
        </li>
        <li>
          The clone button appears immediately to the left of the lock button
          when both controls are enabled.
        </li>
        <li>Cloning a rule inserts a duplicate directly below that rule.</li>
        <li>
          Cloning a group duplicates the entire subtree and inserts the clone
          directly below that group.
        </li>
        <li>
          When <InlineCode>singleRootGroup</InlineCode> is enabled, the
          synthetic root group does not expose a clone control.
        </li>
      </List>
      <SectionTitle>draggable</SectionTitle>
      <List>
        <li>
          Use <InlineCode>lockable</InlineCode> to expose lock controls directly
          in the UI.
        </li>
        <li>
          Enables drag-and-drop reordering and movement for editable rules and
          groups.
        </li>
        <li>Read-only rules and groups are excluded from dragging.</li>
        <li>
          When the entire builder is read-only, drag-and-drop is disabled as
          well.
        </li>
        <li>
          Empty groups expose a dedicated drop zone so items can be moved into
          them.
        </li>
      </List>
      <SectionTitle>readOnlyProtectsDelete</SectionTitle>
      <List>
        <li>
          Defaults to <InlineCode>true</InlineCode>.
        </li>
        <li>
          When enabled, deleting a group is blocked if that would indirectly
          remove read-only protected descendants.
        </li>
        <li>
          Set it to <InlineCode>false</InlineCode> when your product wants only
          directly protected nodes to be non-deletable, while still allowing
          parent-group deletes around them.
        </li>
      </List>
      <SectionTitle>singleRootGroup</SectionTitle>
      <List>
        <li>
          Defaults to <InlineCode>true</InlineCode>, which means the builder
          maintains a single root group around the visible tree.
        </li>
        <li>
          The root group cannot be deleted while{' '}
          <InlineCode>singleRootGroup</InlineCode> is enabled.
        </li>
        <li>
          Set it to <InlineCode>false</InlineCode> when your application wants
          multiple top-level nodes instead of one wrapped root group.
        </li>
      </List>
      <SectionTitle>newNodePlacement</SectionTitle>
      <List>
        <li>
          Defaults to <InlineCode>'append'</InlineCode>, which inserts newly
          added rules and groups at the end of their parent.
        </li>
        <li>
          Set it to <InlineCode>'prepend'</InlineCode> to insert new rules and
          groups at the beginning of their parent instead.
        </li>
        <li>
          This affects built-in Add Rule and Add Group controls, root-level add
          controls, and imperative ref methods when no explicit index is
          provided.
        </li>
        <li>
          It does not change cloning or drag-and-drop behavior, since those
          actions already use explicit target positions.
        </li>
      </List>
      <SectionTitle>groupTypes</SectionTitle>
      <List>
        <li>
          <InlineCode>with-modifiers</InlineCode> shows group controls such as{' '}
          <InlineCode>AND</InlineCode>, <InlineCode>OR</InlineCode>, and
          negation.
        </li>
        <li>
          <InlineCode>without-modifiers</InlineCode> creates structural groups
          that do not render combinator or negation controls.
        </li>
        <li>
          <InlineCode>both</InlineCode> lets users choose which group kind to
          insert when adding a new group.
        </li>
      </List>
      <SectionTitle>allowGroupNegation</SectionTitle>
      <List>
        <li>
          Set <InlineCode>allowGroupNegation={false}</InlineCode> when you want
          groups to keep combinators like <InlineCode>AND</InlineCode> and{' '}
          <InlineCode>OR</InlineCode> but remove the group-level{' '}
          <InlineCode>NOT</InlineCode> option.
        </li>
        <li>
          This is narrower than <InlineCode>groupTypes</InlineCode>: it only
          disables negating whole groups and does not affect whether groups
          render combinator controls.
        </li>
        <li>
          Operator-level negation still works normally, including{' '}
          <InlineCode>NOT IN</InlineCode>, <InlineCode>NOT LIKE</InlineCode>,{' '}
          <InlineCode>IS NOT NULL</InlineCode>, and{' '}
          <InlineCode>NOT BETWEEN</InlineCode>.
        </li>
        <li>
          When disabled, incoming negated groups are normalized to non-negated
          form so the builder output stays consistent with the visible UI.
        </li>
      </List>
      <AlertBox title="Related docs" variant="info">
        <TextLink to="/documentation/history">Undo and Redo</TextLink>,{' '}
        <TextLink to="/documentation/builder-ref">Builder Ref</TextLink>,{' '}
        <TextLink to="/documentation/locking-and-read-only">
          Locking and Read-only
        </TextLink>{' '}
        and <TextLink to="/api/builder">Builder</TextLink>.
      </AlertBox>
    </>
  ),
};
