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

const historySnippet = `import React, { useState } from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderStateChange,
} from '@vojtechportes/react-query-builder';

export const MyBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);
  const [historyState, setHistoryState] = useState({
    canUndo: false,
    canRedo: false,
  });

  const handleStateChange = (state: IBuilderStateChange) => {
    setHistoryState({
      canUndo: state.canUndo,
      canRedo: state.canRedo,
    });
  };

  return (
    <>
      <Builder
        fields={fields}
        data={data}
        draggable
        cloneable
        history={{ maxEntries: 30, controls: true }}
        onStateChange={handleStateChange}
        onChange={setData}
      />
      <p>Undo available: {String(historyState.canUndo)}</p>
      <p>Redo available: {String(historyState.canRedo)}</p>
    </>
  );
};`;

const historyControlsSnippet = `const components = {
  HistoryControls: ({
    undoButton,
    redoButton,
    canUndo,
    canRedo,
  }) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span>History</span>
      {undoButton}
      {redoButton}
      <small>{canUndo ? 'Undo ready' : 'No undo yet'}</small>
      <small>{canRedo ? 'Redo ready' : 'No redo yet'}</small>
    </div>
  ),
};

<Builder
  fields={fields}
  data={data}
  history
  components={components}
  onChange={setData}
/>;

// HistoryControls receives:
// undoButton: React.ReactNode
// redoButton: React.ReactNode
// canUndo: boolean
// canRedo: boolean
// onUndo: () => void
// onRedo: () => void`;

export const historyDocumentationPage: IDocumentationPage = {
  path: '/documentation/history',
  title: 'Undo and Redo',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Documentation for enabling inverse-history undo and redo, built-in controls, state callbacks, and drag-and-drop coverage.',
  searchText:
    'undo redo history inverse history maxEntries controls canUndo canRedo onStateChange drag and drop clone delete edit builder',
  content: (
    <>
      <p>
        Set <InlineCode>history</InlineCode> on{' '}
        <TextLink to="/api/builder">Builder</TextLink> to enable built-in undo
        and redo support for structural edits and value changes. The builder
        records inverse actions internally, so history stays smaller than
        full-query snapshots and still works with drag-and-drop, cloning,
        deletes, and inline edits.
      </p>
      <CodeBlock code={historySnippet} language="tsx" label="History support" />
      <SectionTitle>How to enable it</SectionTitle>
      <List>
        <li>
          <InlineCode>history={true}</InlineCode> enables history with default
          behavior.
        </li>
        <li>
          <InlineCode>history={`{{ maxEntries, controls }}`}</InlineCode>{' '}
          enables history with custom configuration.
        </li>
        <li>
          <InlineCode>maxEntries</InlineCode> limits how many undo steps are
          kept in memory.
        </li>
        <li>
          <InlineCode>controls</InlineCode> controls whether the built-in Undo
          and Redo buttons are rendered.
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
          <InlineCode>canUndo</InlineCode> and <InlineCode>canRedo</InlineCode>{' '}
          so custom toolbars can stay in sync.
        </li>
        <li>
          The built-in controls already use those flags and render disabled when
          no action is available.
        </li>
        <li>
          Redo history is cleared after a new forward edit, which matches
          standard editor behavior.
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
        <TextLink to="/documentation/builder-behavior">
          Builder Behavior
        </TextLink>
        , <TextLink to="/documentation/builder-ref">Builder Ref</TextLink>,{' '}
        <TextLink to="/demo">Demo</TextLink>, and{' '}
        <TextLink to="/api/builder">Builder</TextLink>.
      </AlertBox>
    </>
  ),
};
