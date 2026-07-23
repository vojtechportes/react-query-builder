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

const componentsSnippet = `const components = {
  Add: MyAddButton,
  Remove: MyRemoveButton,
  form: {
    Input: MyInput,
    Select: MySelect,
  },
};

<Builder
  data={data}
  fields={fields}
  components={components}
  onChange={setData}
/>;`;

export const componentsDocumentationPage: IDocumentationPage = {
  path: '/documentation/components',
  title: 'Components',
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for replacing built-in builder controls and containers with custom components.',
  searchText:
    'Components component overrides custom controls custom renderers builder customization add remove select input group rule responsive responsiveness compact layout multiselect summary',
  content: (
    <>
      <p>
        Replace built-in controls and containers through the{' '}
        <InlineCode>components</InlineCode> prop.
      </p>
      <CodeBlock
        code={componentsSnippet}
        language="tsx"
        label="Component overrides"
      />
      <SectionTitle>Override contracts</SectionTitle>
      <List>
        <li>
          Form controls should behave like controlled inputs. They receive the
          current value plus change handlers and disabled state.
        </li>
        <li>
          <InlineCode>Rule</InlineCode> and <InlineCode>Group</InlineCode> are
          layout containers. They receive already-prepared children and control
          regions rather than raw builder state.
        </li>
        <li>
          <InlineCode>DropZone</InlineCode> and{' '}
          <InlineCode>EmptyGroupDropZone</InlineCode> are drag-and-drop render
          hooks. They receive ids, indices, parent ids, drag state, and active
          state.
        </li>
        <li>
          Button-like overrides such as <InlineCode>Add</InlineCode>,{' '}
          <InlineCode>Remove</InlineCode>, <InlineCode>Popover</InlineCode>, and{' '}
          <InlineCode>PopoverItem</InlineCode> should preserve click semantics
          and remain accessible.
        </li>
        <li>
          <InlineCode>HistoryControls</InlineCode> receives built-in undo and
          redo button nodes plus history state and handlers, so custom layouts
          can reuse the default controls instead of recreating them.
        </li>
        <li>
          <InlineCode>TextModeEditor</InlineCode> replaces the whole text-mode
          editor surface. This is the correct override point for Monaco or other
          advanced editors.
        </li>
        <li>
          <InlineCode>TextModeInput</InlineCode> replaces only the input control
          used by the built-in text editor. It is useful when you want the
          built-in overlay editor behavior but need a UI-library-specific input
          shell.
        </li>
        <li>
          <InlineCode>TextModeToggleContent</InlineCode>,{' '}
          <InlineCode>OutlinedButton</InlineCode>, and{' '}
          <InlineCode>Alert</InlineCode> let you align text-mode controls and
          warnings with your design system.
        </li>
      </List>
      <SectionTitle>Responsive behavior</SectionTitle>
      <List>
        <li>
          The built-in <InlineCode>Rule</InlineCode> and{' '}
          <InlineCode>Group</InlineCode> components include a compact responsive
          layout for medium-width screens.
        </li>
        <li>
          Multi-select controls use a summarized closed state so selected values
          do not overflow the available rule width.
        </li>
        <li>
          Responsive behavior is automatic when you use the default components.
        </li>
        <li>
          If you replace <InlineCode>components.Rule</InlineCode> or{' '}
          <InlineCode>components.Group</InlineCode>, your custom layout is
          responsible for its own responsive behavior.
        </li>
      </List>
      <AlertBox title="Adapter packages" variant="info">
        If you want ready-made component mappings instead of wiring every
        override by hand, see{' '}
        <TextLink to="/documentation/adapters">Adapters</TextLink>.
      </AlertBox>
      <AlertBox title="Related docs" variant="info">
        <TextLink to="/documentation/text-mode">Text Mode</TextLink> covers the
        built-in SQL editor and the optional Monaco editor integration.
      </AlertBox>
      <AlertBox title="API reference" variant="info">
        <TextLink to="/api/components">Components</TextLink>.
      </AlertBox>
    </>
  ),
};
