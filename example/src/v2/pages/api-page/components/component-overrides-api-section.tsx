import * as React from 'react';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
} from '../../../../components/docs-primitives';

export const ComponentOverridesApiSection: React.FC = () => (
  <>
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
  </>
);
