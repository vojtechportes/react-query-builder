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

const mantineSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { components } from '@vojtechportes/react-query-builder/mantine/v9';

export const MyMantineBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <MantineProvider>
      <Builder
        data={data}
        fields={fields}
        components={components}
        onChange={setData}
      />
    </MantineProvider>
  );
};`;

const mantineAdaptersInstallSnippet = `npm install @mantine/core@^9.0.0 @mantine/hooks@^9.0.0 react@^19.2.0 react-dom@^19.2.0`;

const mantineCreateComponentsSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import {
  createMantineComponents,
  components as mantineComponents,
} from '@vojtechportes/react-query-builder/mantine/v9';

const components = createMantineComponents(mantineComponents, {
  form: {
    Input: MyInput,
  },
  Add: MyAddButton,
});

export const MyMantineBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <MantineProvider>
      <Builder
        data={data}
        fields={fields}
        components={components}
        onChange={setData}
      />
    </MantineProvider>
  );
};`;

export const adaptersMantineDocumentationPage: IDocumentationPage = {
  path: '/documentation/adapters/mantine',
  title: 'Mantine',
  depth: 1,
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for the Mantine adapter, including mantine/v9, legacy mantine/v8 support, installation, provider setup, and component merging.',
  searchText:
    'Mantine adapter mantine v9 mantine v8 adapter install MantineProvider createMantineComponents components',
  content: (
    <>
      <p>
        Use the Mantine adapter when your application already uses Mantine and
        you want the builder controls to inherit that component language.
      </p>
      <SectionTitle>Available entrypoints</SectionTitle>
      <List>
        <li>
          <InlineCode>@vojtechportes/react-query-builder/mantine/v9</InlineCode>{' '}
          is the recommended entrypoint for new Mantine projects and the one
          used in the demo.
        </li>
        <li>
          <InlineCode>@vojtechportes/react-query-builder/mantine/v8</InlineCode>{' '}
          is available for applications that are still on Mantine 8.
        </li>
      </List>
      <SectionTitle>Installing Mantine</SectionTitle>
      <p>
        Install the Mantine peer dependencies that match the adapter version you
        want to use. For new setups, prefer <InlineCode>mantine/v9</InlineCode>.
      </p>
      <CodeBlock
        code={mantineAdaptersInstallSnippet}
        language="bash"
        label="Mantine v9 peers"
      />
      <AlertBox title="React version note" variant="info">
        Mantine 9 requires React 19. The library website runs on React 19 so it
        can exercise <InlineCode>mantine/v9</InlineCode> directly, while the
        library package itself keeps broad React 18 and 19 peer compatibility.
      </AlertBox>
      <AlertBox title="Stylesheet required" variant="info">
        Import <InlineCode>@mantine/core/styles.css</InlineCode> once in your
        application entrypoint. Without it, Mantine components render without
        their expected styling.
      </AlertBox>
      <SectionTitle>Using Mantine v9</SectionTitle>
      <CodeBlock
        code={mantineSnippet}
        language="tsx"
        label="Mantine v9 adapter"
      />
      <SectionTitle>Supporting Mantine v8</SectionTitle>
      <p>
        If your application is still on Mantine 8, switch the import path to{' '}
        <InlineCode>@vojtechportes/react-query-builder/mantine/v8</InlineCode>.
      </p>
      <SectionTitle>Extending the Mantine adapter</SectionTitle>
      <CodeBlock
        code={mantineCreateComponentsSnippet}
        language="tsx"
        label="Merging Mantine defaults"
      />
      <AlertBox title="Related docs" variant="info">
        <TextLink to="/documentation/adapters">Adapters</TextLink>,{' '}
        <TextLink to="/documentation/components">Components</TextLink>, and{' '}
        <TextLink to="/api/adapters/mantine">Mantine adapter API</TextLink>.
      </AlertBox>
    </>
  ),
};
