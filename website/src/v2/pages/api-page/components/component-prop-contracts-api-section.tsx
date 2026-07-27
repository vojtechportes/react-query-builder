import * as React from 'react';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
} from '../../../../components/docs-primitives';

export const ComponentPropContractsApiSection: React.FC = () => (
  <>
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
  </>
);
