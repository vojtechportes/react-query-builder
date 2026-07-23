import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import { CodeBlock } from '../../../../components/code-block';
import { InlineCode, TextLink } from '../../../../components/docs-primitives';
import type { IDocumentationPage } from '../types/documentation-page';

const themeSnippet = `import { ThemeProvider } from '@vojtechportes/react-query-builder/theme-provider';
import { colors } from '@vojtechportes/react-query-builder';

<ThemeProvider
  colors={{
    ...colors,
    primary: {
      ...colors.primary,
      default: '#3f51b5',
    },
  }}
>
  <Builder data={data} fields={fields} onChange={setData} />
</ThemeProvider>;`;

export const themingDocumentationPage: IDocumentationPage = {
  path: '/documentation/theming',
  title: 'Theming',
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for customizing builder colors with ThemeProvider and shared theme tokens.',
  searchText:
    'Theming theme provider colors primary secondary grey tokens design system',
  content: (
    <>
      <p>
        Use the theme provider to override builder color tokens. For control and
        container replacement, see{' '}
        <TextLink to="/documentation/components">Components</TextLink>.
      </p>
      <CodeBlock code={themeSnippet} language="tsx" label="Theme provider" />
      <AlertBox title="Adapters and theming" variant="info">
        <InlineCode>ThemeProvider</InlineCode> customizes the built-in default
        component set. If you use an adapter from{' '}
        <TextLink to="/documentation/adapters">Adapters</TextLink>, such as{' '}
        <InlineCode>mui/v7</InlineCode>, <InlineCode>mui/v9</InlineCode>,{' '}
        <InlineCode>antd/v5</InlineCode>, <InlineCode>antd/v6</InlineCode>,{' '}
        <InlineCode>bootstrap/v5</InlineCode>,{' '}
        <InlineCode>fluentui/v8</InlineCode>,{' '}
        <InlineCode>mantine/v8</InlineCode>, <InlineCode>mantine/v9</InlineCode>
        , or <InlineCode>radix/v1</InlineCode>, these theme tokens do not affect
        the adapter UI.
      </AlertBox>
      <AlertBox title="API reference" variant="info">
        <TextLink to="/api/theming">Theming</TextLink> and{' '}
        <TextLink to="/api/adapters">Adapters</TextLink>.
      </AlertBox>
    </>
  ),
};
