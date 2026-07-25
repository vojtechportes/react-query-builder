import * as React from 'react';
import { AlertBox } from '../../../../../../components/alert-box';
import { CodeBlock } from '../../../../../../components/code-block';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
  TextLink,
} from '../../../../../../components/docs-primitives';
import { themeSnippet } from '../constants/theme-snippet';

export const ThemingDocumentationContent: React.FC = () => (
  <>
    <p>
      Customize new integrations with inherited{' '}
      <InlineCode>--query-builder-*</InlineCode> CSS variables. The theme
      provider remains available as a legacy color compatibility API for the
      built-in components.
    </p>
    <CodeBlock
      code={themeSnippet}
      language="tsx"
      label="Legacy theme provider"
    />
    <SectionTitle>Precedence</SectionTitle>
    <p>Color values are resolved in this order, from lowest to highest:</p>
    <List>
      <li>
        <ItemTitle>Stylesheet defaults:</ItemTitle> Tokens from the public{' '}
        <InlineCode>styles.css</InlineCode> stylesheet or component fallbacks.
      </li>
      <li>
        <ItemTitle>Inherited CSS:</ItemTitle> Variables declared by your app on
        a wrapper around the builder or a standalone control.
      </li>
      <li>
        <ItemTitle>ThemeProvider:</ItemTitle> Only color values explicitly
        supplied to the nearest provider are written as compatibility variables.
      </li>
      <li>
        <ItemTitle>Builder style:</ItemTitle> Variables passed through the{' '}
        <InlineCode>Builder</InlineCode> <InlineCode>style</InlineCode> prop are
        the final override on the builder root.
      </li>
    </List>
    <p>
      A provider does not add a DOM wrapper. Partial colors leave other CSS
      variables untouched, so inherited app styles keep working. Nested
      providers replace the outer provider value instead of merging with it;
      omitted legacy colors resolve to the exported defaults.
    </p>
    <AlertBox title="Legacy API" variant="warning">
      Prefer CSS variables for new code. <InlineCode>ThemeProvider</InlineCode>,{' '}
      <InlineCode>colors</InlineCode>, and the public color types remain
      available for the v2 compatibility cycle.
    </AlertBox>
    <AlertBox title="Adapters and theming" variant="info">
      <InlineCode>ThemeProvider</InlineCode> customizes the built-in default
      component set. If you use an adapter from{' '}
      <TextLink to="/documentation/adapters">Adapters</TextLink>, such as{' '}
      <InlineCode>mui/v7</InlineCode>, <InlineCode>mui/v9</InlineCode>,{' '}
      <InlineCode>antd/v5</InlineCode>, <InlineCode>antd/v6</InlineCode>,{' '}
      <InlineCode>bootstrap/v5</InlineCode>,{' '}
      <InlineCode>fluentui/v8</InlineCode>, <InlineCode>mantine/v8</InlineCode>,{' '}
      <InlineCode>mantine/v9</InlineCode>, or <InlineCode>radix/v1</InlineCode>,
      these theme tokens do not affect the adapter UI.
    </AlertBox>
    <AlertBox title="API reference" variant="info">
      <TextLink to="/api/theming">Theming</TextLink> and{' '}
      <TextLink to="/api/adapters">Adapters</TextLink>.
    </AlertBox>
  </>
);
