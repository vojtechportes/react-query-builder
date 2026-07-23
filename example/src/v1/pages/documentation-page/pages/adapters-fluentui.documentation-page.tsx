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

const fluentUiSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import { components } from '@vojtechportes/react-query-builder/fluentui/v8';

export const MyFluentUiBuilder = () => {
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

const fluentUiAdaptersInstallSnippet = `npm install @fluentui/react@^8.125.6`;

const fluentUiCreateComponentsSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import {
  createFluentUiComponents,
  components as fluentUiComponents,
} from '@vojtechportes/react-query-builder/fluentui/v8';

const components = createFluentUiComponents(fluentUiComponents, {
  form: {
    Input: MyInput,
  },
  Add: MyAddButton,
});

export const MyFluentUiBuilder = () => {
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

export const adaptersFluentuiDocumentationPage: IDocumentationPage = {
  path: '/documentation/adapters/fluentui',
  title: 'Fluent UI',
  depth: 1,
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for the Fluent UI adapter, including fluentui/v8 installation, usage, and component merging.',
  searchText:
    'Fluent UI adapter fluentui v8 adapter install createFluentUiComponents components',
  content: (
    <>
      <p>
        Use the Fluent UI adapter when your application is built on Fluent UI
        React 8 and you want builder controls mapped to that component set.
      </p>
      <SectionTitle>Available entrypoint</SectionTitle>
      <List>
        <li>
          <InlineCode>
            @vojtechportes/react-query-builder/fluentui/v8
          </InlineCode>{' '}
          targets <InlineCode>@fluentui/react</InlineCode> 8.x and is available
          in the demo.
        </li>
      </List>
      <SectionTitle>Installing Fluent UI</SectionTitle>
      <p>
        Install the matching Fluent UI peer dependency before using the adapter.
      </p>
      <CodeBlock
        code={fluentUiAdaptersInstallSnippet}
        language="bash"
        label="Fluent UI v8 peers"
      />
      <SectionTitle>Using Fluent UI v8</SectionTitle>
      <CodeBlock
        code={fluentUiSnippet}
        language="tsx"
        label="Fluent UI v8 adapter"
      />
      <SectionTitle>Extending the Fluent UI adapter</SectionTitle>
      <CodeBlock
        code={fluentUiCreateComponentsSnippet}
        language="tsx"
        label="Merging Fluent UI defaults"
      />
      <AlertBox title="Related docs" variant="info">
        <TextLink to="/documentation/adapters">Adapters</TextLink>,{' '}
        <TextLink to="/documentation/components">Components</TextLink>, and{' '}
        <TextLink to="/api/adapters/fluentui">Fluent UI adapter API</TextLink>.
      </AlertBox>
    </>
  ),
};
