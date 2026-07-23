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

const antdSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import { components } from '@vojtechportes/react-query-builder/antd/v6';

export const MyAntdBuilder = () => {
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

const antdAdaptersInstallSnippet = `npm install antd@^6.0.0 @ant-design/icons@^6.0.0`;

const antdCreateComponentsSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import {
  createAntdComponents,
  components as antdComponents,
} from '@vojtechportes/react-query-builder/antd/v6';

const components = createAntdComponents(antdComponents, {
  form: {
    Input: MyInput,
  },
  Add: MyAddButton,
});

export const MyAntdBuilder = () => {
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

export const adaptersAntdDocumentationPage: IDocumentationPage = {
  path: '/documentation/adapters/antd',
  title: 'ANTD',
  depth: 1,
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for the Ant Design adapter, including antd/v6, legacy antd/v5 support, installation, and component merging.',
  searchText:
    'ANTD adapter ant design antd v6 antd v5 adapter install createAntdComponents components',
  content: (
    <>
      <p>
        Use the ANTD adapter when your application uses Ant Design and you want
        the builder controls to match the surrounding system components.
      </p>
      <SectionTitle>Available entrypoints</SectionTitle>
      <List>
        <li>
          <InlineCode>@vojtechportes/react-query-builder/antd/v6</InlineCode> is
          the recommended entrypoint for new Ant Design projects and is
          available in the demo.
        </li>
        <li>
          <InlineCode>@vojtechportes/react-query-builder/antd/v5</InlineCode> is
          available for applications that are still on Ant Design 5.
        </li>
      </List>
      <SectionTitle>Installing ANTD</SectionTitle>
      <p>
        Install the Ant Design peer dependencies that match the adapter version
        you want to use. For new setups, prefer <InlineCode>antd/v6</InlineCode>
        .
      </p>
      <CodeBlock
        code={antdAdaptersInstallSnippet}
        language="bash"
        label="ANTD v6 peers"
      />
      <SectionTitle>Using ANTD v6</SectionTitle>
      <CodeBlock code={antdSnippet} language="tsx" label="ANTD v6 adapter" />
      <SectionTitle>Supporting ANTD v5</SectionTitle>
      <p>
        If your application is still on Ant Design 5, switch the import path to{' '}
        <InlineCode>@vojtechportes/react-query-builder/antd/v5</InlineCode>.
      </p>
      <SectionTitle>Extending the ANTD adapter</SectionTitle>
      <CodeBlock
        code={antdCreateComponentsSnippet}
        language="tsx"
        label="Merging ANTD defaults"
      />
      <AlertBox title="Related docs" variant="info">
        <TextLink to="/documentation/adapters">Adapters</TextLink>,{' '}
        <TextLink to="/documentation/components">Components</TextLink>, and{' '}
        <TextLink to="/api/adapters/antd">ANTD adapter API</TextLink>.
      </AlertBox>
    </>
  ),
};
