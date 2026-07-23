import * as React from 'react';
import { AlertBox } from '../../../../../../components/alert-box';
import { CodeBlock } from '../../../../../../components/code-block';
import {
  InlineCode,
  List,
  SectionTitle,
  TextLink,
} from '../../../../../../components/docs-primitives';
import { builderRefBasicSnippet } from '../constants/builder-ref-basic-snippet';
import { builderRefMutationSnippet } from '../constants/builder-ref-mutation-snippet';
import { builderRefFieldOptionsSnippet } from '../constants/builder-ref-field-options-snippet';
import { builderRefHistorySnippet } from '../constants/builder-ref-history-snippet';
import { builderRefReadSnippet } from '../constants/builder-ref-read-snippet';

export const BuilderRefDocumentationContent: React.FC = () => (
  <>
    <p>
      Use <InlineCode>useBuilderRef()</InlineCode> with the{' '}
      <TextLink to="/api/builder">Builder</TextLink> ref to access internal node
      actions and history from custom toolbars, menus, keyboard shortcuts, or
      surrounding workflow logic.
    </p>
    <CodeBlock
      code={builderRefBasicSnippet}
      language="tsx"
      label="Basic builderRef setup"
    />
    <SectionTitle>When to use it</SectionTitle>
    <List>
      <li>
        Trigger builder changes from controls rendered outside the builder.
      </li>
      <li>Implement keyboard shortcuts for clone, delete, undo, or redo.</li>
      <li>
        Insert preconfigured rules or groups from business-specific UI flows.
      </li>
      <li>
        Inspect normalized nodes or history without reimplementing builder
        internals.
      </li>
    </List>
    <SectionTitle>Read methods</SectionTitle>
    <CodeBlock
      code={builderRefReadSnippet}
      language="tsx"
      label="Reading builder state"
    />
    <List>
      <li>
        <InlineCode>getNodeById(id)</InlineCode> returns one normalized node by
        id.
      </li>
      <li>
        <InlineCode>getNodes()</InlineCode> returns the current normalized node
        array.
      </li>
      <li>
        <InlineCode>getData()</InlineCode> returns the denormalized public query
        shape.
      </li>
      <li>
        <InlineCode>isFieldInUse(field)</InlineCode> tells you whether a field
        is currently present in the query.
      </li>
      <li>
        <InlineCode>getFieldOptionState(field)</InlineCode> returns runtime
        options and the current option status for that field.
      </li>
    </List>
    <SectionTitle>Mutation methods</SectionTitle>
    <CodeBlock
      code={builderRefMutationSnippet}
      language="tsx"
      label="Mutating nodes"
    />
    <List>
      <li>
        <InlineCode>cloneNode</InlineCode>, <InlineCode>deleteNode</InlineCode>,
        and <InlineCode>moveNode</InlineCode> follow the same behavior as the
        built-in UI controls.
      </li>
      <li>
        <InlineCode>addNode</InlineCode>, <InlineCode>addGroup</InlineCode>,{' '}
        <InlineCode>addRule</InlineCode>, and{' '}
        <InlineCode>insertNodes</InlineCode> let you build structure
        imperatively.
      </li>
      <li>
        <InlineCode>replaceNode</InlineCode> swaps a node directly, while{' '}
        <InlineCode>updateNode</InlineCode> is useful when you want the next
        value to depend on the current node.
      </li>
      <li>
        <InlineCode>setNodeLock</InlineCode>, <InlineCode>lockNode</InlineCode>,
        and <InlineCode>unlockNode</InlineCode> write the same read-only states
        as the lock UI.
      </li>
    </List>
    <SectionTitle>Dynamic field options</SectionTitle>
    <CodeBlock
      code={builderRefFieldOptionsSnippet}
      language="tsx"
      label="Managing field options"
    />
    <List>
      <li>
        <InlineCode>setFieldOptionsStatus(field, status)</InlineCode> lets
        surrounding app code reflect loading, success, idle, or error state.
      </li>
      <li>
        <InlineCode>setFieldOptions(field, options)</InlineCode> replaces the
        runtime option set without changing the original{' '}
        <InlineCode>fields</InlineCode> array.
      </li>
      <li>
        <InlineCode>invalidateFieldOptions(field)</InlineCode> drops runtime
        options and falls back to the static options defined in{' '}
        <InlineCode>field.value</InlineCode>.
      </li>
      <li>
        <InlineCode>clearFieldOptions(field)</InlineCode> removes the runtime
        state entirely, which is useful when a dependent field leaves scope.
      </li>
    </List>
    <SectionTitle>History methods</SectionTitle>
    <CodeBlock
      code={builderRefHistorySnippet}
      language="tsx"
      label="History access"
    />
    <List>
      <li>
        <InlineCode>undo()</InlineCode> and <InlineCode>redo()</InlineCode> use
        the same history engine as the built-in controls.
      </li>
      <li>
        <InlineCode>getHistory()</InlineCode> returns the current{' '}
        <InlineCode>past</InlineCode> and <InlineCode>future</InlineCode>{' '}
        stacks.
      </li>
      <li>
        <InlineCode>setHistory()</InlineCode> lets you replace or clear the
        internal history state.
      </li>
    </List>
    <AlertBox title="Data shapes" variant="info">
      Most imperative methods use normalized nodes because that matches the
      internal builder engine. Use <InlineCode>getData()</InlineCode> when you
      need the public denormalized query shape.
    </AlertBox>
    <AlertBox title="API reference" variant="info">
      <TextLink to="/api/builder-ref">Builder Ref</TextLink>,{' '}
      <TextLink to="/api/builder">Builder</TextLink>,{' '}
      <TextLink to="/api/data">Data</TextLink>, and{' '}
      <TextLink to="/documentation/dynamic-field-options">
        Dynamic Field Options
      </TextLink>
      .
    </AlertBox>
  </>
);
