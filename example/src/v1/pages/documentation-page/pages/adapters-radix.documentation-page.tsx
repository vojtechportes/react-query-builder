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

const radixSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { components } from '@vojtechportes/react-query-builder/radix/v1';

export const MyRadixBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Theme>
      <Builder
        data={data}
        fields={fields}
        components={components}
        onChange={setData}
      />
    </Theme>
  );
};`;

const radixAdaptersInstallSnippet = `npm install @radix-ui/themes@^1.1.2 @radix-ui/react-icons@^1.3.2`;

const radixCreateComponentsSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import {
  createRadixComponents,
  components as radixComponents,
} from '@vojtechportes/react-query-builder/radix/v1';

const components = createRadixComponents(radixComponents, {
  form: {
    Input: MyInput,
  },
  Add: MyAddButton,
});

export const MyRadixBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Theme>
      <Builder
        data={data}
        fields={fields}
        components={components}
        onChange={setData}
      />
    </Theme>
  );
};`;

export const adaptersRadixDocumentationPage: IDocumentationPage = {
  path: '/documentation/adapters/radix',
  title: 'Radix',
  depth: 1,
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for the Radix Themes adapter, including radix/v1 installation, provider setup, usage, and component merging.',
  searchText:
    'Radix adapter radix themes radix v1 adapter install Theme createRadixComponents components',
  content: (
    <>
      <p>
        Use the Radix adapter when your application uses Radix Themes and you
        want the builder controls to align with that design system.
      </p>
      <SectionTitle>Available entrypoint</SectionTitle>
      <List>
        <li>
          <InlineCode>@vojtechportes/react-query-builder/radix/v1</InlineCode>{' '}
          targets <InlineCode>@radix-ui/themes</InlineCode> 1.x and is available
          in the demo.
        </li>
      </List>
      <SectionTitle>Installing Radix Themes</SectionTitle>
      <p>
        Install the Radix Themes peer dependency and the Radix icons package
        before using the adapter.
      </p>
      <CodeBlock
        code={radixAdaptersInstallSnippet}
        language="bash"
        label="Radix Themes v1 peer"
      />
      <AlertBox title="Icons package required" variant="info">
        The Radix adapter renders icons from{' '}
        <InlineCode>@radix-ui/react-icons</InlineCode>, so applications using
        the adapter should install that package alongside{' '}
        <InlineCode>@radix-ui/themes</InlineCode>.
      </AlertBox>
      <AlertBox title="Stylesheet required" variant="info">
        Import <InlineCode>@radix-ui/themes/styles.css</InlineCode> once in your
        application entrypoint so Radix Themes components render with the
        expected styling.
      </AlertBox>
      <AlertBox title="Provider required" variant="info">
        Render the builder inside <InlineCode>Theme</InlineCode> so Radix Themes
        tokens and component styles are available to the adapter.
      </AlertBox>
      <SectionTitle>Using Radix v1</SectionTitle>
      <CodeBlock code={radixSnippet} language="tsx" label="Radix v1 adapter" />
      <SectionTitle>Extending the Radix adapter</SectionTitle>
      <CodeBlock
        code={radixCreateComponentsSnippet}
        language="tsx"
        label="Merging Radix defaults"
      />
      <AlertBox title="Related docs" variant="info">
        <TextLink to="/documentation/adapters">Adapters</TextLink>,{' '}
        <TextLink to="/documentation/components">Components</TextLink>, and{' '}
        <TextLink to="/api/adapters/radix">Radix adapter API</TextLink>.
      </AlertBox>
    </>
  ),
};
