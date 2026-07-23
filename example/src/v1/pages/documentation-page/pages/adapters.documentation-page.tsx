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

const muiCreateComponentsSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import {
  createMuiComponents,
  components as muiComponents,
  MuiSelect,
} from '@vojtechportes/react-query-builder/mui/v9';

const components = createMuiComponents(muiComponents, {
  form: {
    Select: MuiSelect,
  },
});

export const MyMuiBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Builder
      data={data}
      fields={fields}
      components={components}
      onChange={setData}
    />
  );
};`;

export const adaptersDocumentationPage: IDocumentationPage = {
  path: '/documentation/adapters',
  title: 'Adapters',
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation overview for packaged UI adapters, versioned entrypoints, adapter-specific subpages, and shared customization patterns.',
  searchText:
    'Adapters customization mui material ui antd ant design bootstrap mantine fluent ui versioned adapter entrypoints adapter overview create components pages ready made overrides',
  content: (
    <>
      <p>
        Adapters provide pre-mapped <InlineCode>components</InlineCode> objects
        for UI libraries so you do not need to implement every override in{' '}
        <TextLink to="/documentation/components">Components</TextLink> yourself.
      </p>
      <SectionTitle>Adapter guides</SectionTitle>
      <List>
        <li>
          <TextLink to="/documentation/adapters/mui">MUI</TextLink> covers{' '}
          <InlineCode>mui/v9</InlineCode>, legacy{' '}
          <InlineCode>mui/v7</InlineCode>, install steps, and merge patterns.
        </li>
        <li>
          <TextLink to="/documentation/adapters/antd">ANTD</TextLink> covers{' '}
          <InlineCode>antd/v6</InlineCode>, legacy{' '}
          <InlineCode>antd/v5</InlineCode>, install steps, and merge patterns.
        </li>
        <li>
          <TextLink to="/documentation/adapters/fluentui">Fluent UI</TextLink>{' '}
          covers <InlineCode>fluentui/v8</InlineCode>, install steps, and merge
          patterns.
        </li>
        <li>
          <TextLink to="/documentation/adapters/mantine">Mantine</TextLink>{' '}
          covers <InlineCode>mantine/v9</InlineCode>, legacy{' '}
          <InlineCode>mantine/v8</InlineCode>, install steps, provider usage,
          and merge patterns.
        </li>
        <li>
          <TextLink to="/documentation/adapters/bootstrap">Bootstrap</TextLink>{' '}
          covers <InlineCode>bootstrap/v5</InlineCode>, stylesheet setup, and
          merge patterns.
        </li>
        <li>
          <TextLink to="/documentation/adapters/radix">Radix</TextLink> covers{' '}
          <InlineCode>radix/v1</InlineCode>, stylesheet and provider setup, and
          merge patterns.
        </li>
      </List>
      <SectionTitle>Extending an adapter</SectionTitle>
      <List>
        <li>
          Start with the exported adapter <InlineCode>components</InlineCode>{' '}
          object.
        </li>
        <li>
          Override only the pieces you want to replace, such as a single select
          or button component.
        </li>
        <li>
          This keeps your app aligned with future adapter updates while still
          allowing local customization.
        </li>
      </List>
      <CodeBlock
        code={muiCreateComponentsSnippet}
        language="tsx"
        label="Merging adapter defaults"
      />
      <SectionTitle>Shared behavior</SectionTitle>
      <List>
        <li>
          Adapters are versioned entrypoints so the package can support multiple
          major UI-library versions in parallel.
        </li>
        <li>
          Each adapter exports a ready-to-pass{' '}
          <InlineCode>components</InlineCode> object plus a merge helper that
          preserves nested <InlineCode>form</InlineCode> overrides.
        </li>
        <li>
          Choose the adapter subpage that matches your UI library for exact
          installation commands and code samples.
        </li>
      </List>
      <AlertBox title="Monaco text mode" variant="info">
        When you want Monaco text mode together with MUI, ANTD, Bootstrap,
        Mantine, Fluent UI, or Radix, compose the adapter{' '}
        <InlineCode>components</InlineCode> object with{' '}
        <InlineCode>createMonacoComponents(...)</InlineCode>. See{' '}
        <TextLink to="/documentation/text-mode">Text Mode</TextLink> for
        examples.
      </AlertBox>
      <AlertBox title="Related docs" variant="info">
        <TextLink to="/documentation/components">Components</TextLink>,{' '}
        <TextLink to="/documentation/theming">Theming</TextLink>, and{' '}
        <TextLink to="/api/adapters">Adapters API</TextLink>.
      </AlertBox>
    </>
  ),
};
