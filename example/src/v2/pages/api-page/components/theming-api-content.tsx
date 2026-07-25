import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import { CodeBlock } from '../../../../components/code-block';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
  TextLink,
} from '../../../../components/docs-primitives';
import { themeProviderSignature } from '../constants/theme-provider-signature';
import { colorsSignature } from '../constants/colors-signature';

export const ThemingApiContent: React.FC = () => (
  <>
    <CodeBlock
      code={themeProviderSignature}
      language="ts"
      label="ThemeProvider"
    />
    <CodeBlock code={colorsSignature} language="ts" label="Color types" />
    <SectionTitle>Props</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>colors</InlineCode>:
        </ItemTitle>{' '}
        Optional deep partial color overrides. Only provided leaves become CSS
        variables; omitted leaves continue to inherit from consumer CSS.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>children</InlineCode>:
        </ItemTitle>{' '}
        Optional React subtree that receives context without an added DOM node.
      </li>
      <li>
        <ItemTitle>Nested providers:</ItemTitle> The nearest provider replaces
        the outer context value. Missing legacy values resolve from the exported{' '}
        <InlineCode>colors</InlineCode> defaults instead of the outer provider.
      </li>
      <li>
        <ItemTitle>Precedence:</ItemTitle> Stylesheet defaults, inherited CSS,
        explicit provider colors, then explicit{' '}
        <InlineCode>Builder.style</InlineCode> values.
      </li>
      <li>
        <ItemTitle>Adapter note:</ItemTitle>{' '}
        <InlineCode>ThemeProvider</InlineCode> affects the built-in default
        components. If a packaged adapter is used instead, these tokens do not
        theme the adapter UI.
      </li>
    </List>
    <AlertBox title="Legacy theming" variant="warning">
      <InlineCode>ThemeProvider</InlineCode> is deprecated for new integrations.
      Use public <InlineCode>--query-builder-*</InlineCode> variables instead.
      The provider, exported <InlineCode>colors</InlineCode>, and color types
      stay available for the compatibility cycle.
    </AlertBox>
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/theming">Theming</TextLink> and{' '}
      <TextLink to="/documentation/adapters">Adapters</TextLink>.
    </AlertBox>
  </>
);
