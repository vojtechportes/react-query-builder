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
import { componentsSignature } from '../constants/components-signature';
import { textModeEditorSignature } from '../constants/text-mode-editor-signature';
import { monacoComponentsSnippet } from '../constants/monaco-components-snippet';
import { historyControlsSignature } from '../constants/history-controls-signature';
import { lockToggleSignature } from '../constants/lock-toggle-signature';
import { cloneButtonSignature } from '../constants/clone-button-signature';

export const ComponentsApiContent: React.FC = () => (
  <>
    <CodeBlock
      code={componentsSignature}
      language="ts"
      label="Component overrides"
    />
    <CodeBlock
      code={textModeEditorSignature}
      language="ts"
      label="Text mode editor props"
    />
    <CodeBlock
      code={cloneButtonSignature}
      language="ts"
      label="CloneButton props"
    />
    <CodeBlock
      code={lockToggleSignature}
      language="ts"
      label="LockToggle props"
    />
    <CodeBlock
      code={historyControlsSignature}
      language="ts"
      label="HistoryControls props"
    />
    <SectionTitle>Props</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>Alert</InlineCode>:
        </ItemTitle>{' '}
        Replaces the built-in alert component used for builder-level notices
        such as blocked text mode.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>form.Select</InlineCode> /{' '}
          <InlineCode>form.SelectMulti</InlineCode> /{' '}
          <InlineCode>form.Switch</InlineCode> /{' '}
          <InlineCode>form.Input</InlineCode>:
        </ItemTitle>{' '}
        Replace the built-in form controls used by rules and groups.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>Remove</InlineCode> and <InlineCode>Add</InlineCode>:
        </ItemTitle>{' '}
        Replace action buttons used for structural editing.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>OutlinedButton</InlineCode>:
        </ItemTitle>{' '}
        Replaces the built-in outlined action button used by undo, redo, and the
        builder/text mode toggle.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>TextModeToggleContent</InlineCode>:
        </ItemTitle>{' '}
        Replaces the label-and-icon content rendered inside the builder/text
        mode toggle button.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>TextModeEditor</InlineCode>:
        </ItemTitle>{' '}
        Replaces the whole text-mode editor surface. This is the integration
        point for Monaco and other advanced editors.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>TextModeInput</InlineCode>:
        </ItemTitle>{' '}
        Replaces only the input layer used by the built-in text editor.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>CloneButton</InlineCode>:
        </ItemTitle>{' '}
        Replaces the built-in clone control used when{' '}
        <InlineCode>cloneable</InlineCode> is enabled.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>LockToggle</InlineCode>:
        </ItemTitle>{' '}
        Replaces the built-in lock control used when{' '}
        <InlineCode>lockable</InlineCode> is enabled.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>HistoryControls</InlineCode>:
        </ItemTitle>{' '}
        Replaces the layout wrapper around the built-in undo and redo controls
        used when history controls are enabled.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>Rule</InlineCode> and <InlineCode>Group</InlineCode>:
        </ItemTitle>{' '}
        Replace the main structural containers.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>GroupHeaderOption</InlineCode>:
        </ItemTitle>{' '}
        Replaces the header option control used in group UIs.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>Text</InlineCode>:
        </ItemTitle>{' '}
        Replaces the built-in text rendering component.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>DropZone</InlineCode> and{' '}
          <InlineCode>EmptyGroupDropZone</InlineCode>:
        </ItemTitle>{' '}
        Replaces drag-and-drop target renderers.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>Popover</InlineCode> and{' '}
          <InlineCode>PopoverItem</InlineCode>:
        </ItemTitle>{' '}
        Replaces the popover UI used by group creation mode where relevant.
      </li>
    </List>
    <SectionTitle>Key prop contracts</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>form.Input</InlineCode>:
        </ItemTitle>{' '}
        Receives <InlineCode>type</InlineCode>, <InlineCode>value</InlineCode>,{' '}
        <InlineCode>onChange(value)</InlineCode>, and optional{' '}
        <InlineCode>disabled</InlineCode>, <InlineCode>id</InlineCode>, and{' '}
        <InlineCode>name</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>form.Select</InlineCode>:
        </ItemTitle>{' '}
        Receives <InlineCode>values</InlineCode>,{' '}
        <InlineCode>selectedValue</InlineCode>,{' '}
        <InlineCode>emptyValue</InlineCode>, and{' '}
        <InlineCode>onChange(value)</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>form.SelectMulti</InlineCode>:
        </ItemTitle>{' '}
        Receives <InlineCode>selectedValue</InlineCode>,{' '}
        <InlineCode>values</InlineCode>,{' '}
        <InlineCode>onChange(value)</InlineCode>, and{' '}
        <InlineCode>onDelete(value)</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>form.Switch</InlineCode>:
        </ItemTitle>{' '}
        Receives <InlineCode>switched</InlineCode>, optional{' '}
        <InlineCode>onChange(value)</InlineCode>, and optional{' '}
        <InlineCode>disabled</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>TextModeEditor</InlineCode>:
        </ItemTitle>{' '}
        Receives the current SQL text, diagnostics, optional protected ranges,
        an optional hover message for protected ranges, and{' '}
        <InlineCode>onChange(value)</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>TextModeInput</InlineCode>:
        </ItemTitle>{' '}
        Receives the current text value plus controlled input props such as{' '}
        <InlineCode>disabled</InlineCode>, <InlineCode>readOnly</InlineCode>,
        and class names used by the built-in text-mode layout.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>CloneButton</InlineCode>:
        </ItemTitle>{' '}
        Receives <InlineCode>nodeType</InlineCode>, optional{' '}
        <InlineCode>disabled</InlineCode>, and{' '}
        <InlineCode>onClick()</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>LockToggle</InlineCode>:
        </ItemTitle>{' '}
        Receives <InlineCode>state</InlineCode>,{' '}
        <InlineCode>nodeType</InlineCode>, optional{' '}
        <InlineCode>disabled</InlineCode>, and{' '}
        <InlineCode>onChange(nextState)</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>HistoryControls</InlineCode>:
        </ItemTitle>{' '}
        Receives built-in <InlineCode>undoButton</InlineCode> and{' '}
        <InlineCode>redoButton</InlineCode> nodes plus{' '}
        <InlineCode>canUndo</InlineCode>, <InlineCode>canRedo</InlineCode>,{' '}
        <InlineCode>onUndo()</InlineCode>, and <InlineCode>onRedo()</InlineCode>
        .
      </li>
      <li>
        <ItemTitle>
          <InlineCode>Rule</InlineCode>:
        </ItemTitle>{' '}
        Receives already-built <InlineCode>children</InlineCode>,{' '}
        <InlineCode>controls</InlineCode>, and optional{' '}
        <InlineCode>dragHandle</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>Group</InlineCode>:
        </ItemTitle>{' '}
        Receives <InlineCode>controlsLeft</InlineCode>,{' '}
        <InlineCode>controlsRight</InlineCode>,{' '}
        <InlineCode>children</InlineCode>, and optional overlays or drag
        handles.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>DropZone</InlineCode>:
        </ItemTitle>{' '}
        Receives <InlineCode>id</InlineCode>, <InlineCode>index</InlineCode>,
        optional <InlineCode>parentId</InlineCode>, and drag-state flags.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>EmptyGroupDropZone</InlineCode>:
        </ItemTitle>{' '}
        Receives the target group id plus drag-state flags for empty containers.
      </li>
    </List>
    <SectionTitle>Monaco subpackage</SectionTitle>
    <CodeBlock
      code={monacoComponentsSnippet}
      language="tsx"
      label="createMonacoComponents"
    />
    <List>
      <li>
        <ItemTitle>
          <InlineCode>@vojtechportes/react-query-builder/monaco</InlineCode>:
        </ItemTitle>{' '}
        Exports <InlineCode>createMonacoComponents</InlineCode>,{' '}
        <InlineCode>createMonacoComponentSet</InlineCode>, and{' '}
        <InlineCode>MonacoTextModeEditor</InlineCode>.
      </li>
      <li>
        <ItemTitle>Peer dependency:</ItemTitle>{' '}
        <InlineCode>monaco-editor</InlineCode> is optional and only required
        when you use that subpackage.
      </li>
      <li>
        <ItemTitle>When to use it:</ItemTitle> Prefer it when text mode must
        preserve locked rules or groups through protected editor ranges.
      </li>
      <li>
        <ItemTitle>Protected ranges:</ItemTitle> Monaco text mode can render
        locked SQL fragments as dimmed protected ranges with hover messaging
        while still allowing edits around them.
      </li>
    </List>
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/components">Components</TextLink>,{' '}
      <TextLink to="/documentation/text-mode">Text Mode</TextLink>, and{' '}
      <TextLink to="/documentation/adapters">Adapters</TextLink>.
    </AlertBox>
  </>
);
