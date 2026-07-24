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
        Optional partial replacement source for theme color values provided
        through context.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>children</InlineCode>:
        </ItemTitle>{' '}
        Optional React subtree that receives the theme context.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>colors.primary</InlineCode> and{' '}
          <InlineCode>colors.secondary</InlineCode>:
        </ItemTitle>{' '}
        Color variants used by primary and secondary action surfaces.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>colors.grey</InlineCode>:
        </ItemTitle>{' '}
        Neutral palette used for borders, text, backgrounds, and control states.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>colors.white</InlineCode>:
        </ItemTitle>{' '}
        Surface color used by builder containers and controls.
      </li>
      <li>
        <ItemTitle>Adapter note:</ItemTitle>{' '}
        <InlineCode>ThemeProvider</InlineCode> affects the built-in default
        components. If a packaged adapter is used instead, these tokens do not
        theme the adapter UI.
      </li>
    </List>
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/theming">Theming</TextLink> and{' '}
      <TextLink to="/documentation/adapters">Adapters</TextLink>.
    </AlertBox>
  </>
);
