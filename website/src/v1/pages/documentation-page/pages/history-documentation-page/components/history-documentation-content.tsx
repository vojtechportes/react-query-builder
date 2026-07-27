import * as React from 'react';
import { AlertBox } from '../../../../../../components/alert-box';
import { CodeBlock } from '../../../../../../components/code-block';
import {
  InlineCode,
  List,
  SectionTitle,
  TextLink,
} from '../../../../../../components/docs-primitives';
import { historySnippet } from '../constants/history-snippet';
import { historyControlsSnippet } from '../constants/history-controls-snippet';

export const HistoryDocumentationContent: React.FC = () => (
  <>
    <p>
      Set <InlineCode>history</InlineCode> on{' '}
      <TextLink to="/api/builder">Builder</TextLink> to enable built-in undo and
      redo support for structural edits and value changes. The builder records
      inverse actions internally, so history stays smaller than full-query
      snapshots and still works with drag-and-drop, cloning, deletes, and inline
      edits.
    </p>
    <CodeBlock code={historySnippet} language="tsx" label="History support" />
    <SectionTitle>How to enable it</SectionTitle>
    <List>
      <li>
        <InlineCode>history={true}</InlineCode> enables history with default
        behavior.
      </li>
      <li>
        <InlineCode>history={`{{ maxEntries, controls }}`}</InlineCode> enables
        history with custom configuration.
      </li>
      <li>
        <InlineCode>maxEntries</InlineCode> limits how many undo steps are kept
        in memory.
      </li>
      <li>
        <InlineCode>controls</InlineCode> controls whether the built-in Undo and
        Redo buttons are rendered.
      </li>
    </List>
    <SectionTitle>What gets tracked</SectionTitle>
    <List>
      <li>Adding, removing, cloning, and editing rules.</li>
      <li>Adding, removing, cloning, and editing groups.</li>
      <li>Drag-and-drop reordering and movement between groups.</li>
      <li>
        Changes driven through the builder UI that emit through{' '}
        <InlineCode>onChange</InlineCode>.
      </li>
    </List>
    <SectionTitle>State callbacks</SectionTitle>
    <List>
      <li>
        <InlineCode>onStateChange</InlineCode> includes{' '}
        <InlineCode>canUndo</InlineCode> and <InlineCode>canRedo</InlineCode> so
        custom toolbars can stay in sync.
      </li>
      <li>
        The built-in controls already use those flags and render disabled when
        no action is available.
      </li>
      <li>
        Redo history is cleared after a new forward edit, which matches standard
        editor behavior.
      </li>
    </List>
    <SectionTitle>Custom HistoryControls</SectionTitle>
    <p>
      Use <InlineCode>components.HistoryControls</InlineCode> when you want to
      change the placement or surrounding layout of the built-in history
      controls without reimplementing undo and redo behavior yourself.
    </p>
    <CodeBlock
      code={historyControlsSnippet}
      language="tsx"
      label="HistoryControls override"
    />
    <List>
      <li>
        The override receives ready-to-render{' '}
        <InlineCode>undoButton</InlineCode> and{' '}
        <InlineCode>redoButton</InlineCode> nodes.
      </li>
      <li>
        It also receives <InlineCode>canUndo</InlineCode>,{' '}
        <InlineCode>canRedo</InlineCode>, <InlineCode>onUndo</InlineCode>, and{' '}
        <InlineCode>onRedo</InlineCode> when you need custom wrappers or
        auxiliary UI.
      </li>
      <li>
        This lets you reorder, wrap, or annotate the default buttons without
        having to rebuild their disabled-state logic.
      </li>
    </List>
    <AlertBox title="Related docs" variant="info">
      <TextLink to="/documentation/builder-behavior">Builder Behavior</TextLink>
      , <TextLink to="/documentation/builder-ref">Builder Ref</TextLink>,{' '}
      <TextLink to="/demo">Demo</TextLink>, and{' '}
      <TextLink to="/api/builder">Builder</TextLink>.
    </AlertBox>
  </>
);
