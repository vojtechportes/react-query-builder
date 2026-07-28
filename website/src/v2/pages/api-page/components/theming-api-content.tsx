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
import { colorsSignature } from '../constants/colors-signature';
import { themeProviderSignature } from '../constants/theme-provider-signature';

export const ThemingApiContent: React.FC = () => (
  <>
    <SectionTitle>Stylesheet and tokens</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>@vojtechportes/react-query-builder/styles.css</InlineCode>
          :
        </ItemTitle>{' '}
        Import this public stylesheet exactly once in the application entrypoint
        that renders v2 builders.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>--query-builder-*</InlineCode>:
        </ItemTitle>{' '}
        Public inherited variables for colors, spacing, padding, gaps, radii,
        shadows, control sizing, typography, editor sizing, drop zones, motion,
        and popover layering.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>IBuilderStyle</InlineCode>:
        </ItemTitle>{' '}
        Typed <InlineCode>React.CSSProperties</InlineCode> extension containing
        every public variable accepted by <InlineCode>Builder.style</InlineCode>
        .
      </li>
      <li>
        <ItemTitle>Override boundaries:</ItemTitle> Declare variables globally,
        on an app-owned wrapper, or on one Builder through its{' '}
        <InlineCode>style</InlineCode> prop.
      </li>
      <li>
        <ItemTitle>Stable selectors:</ItemTitle> Use an app-owned{' '}
        <InlineCode>Builder.className</InlineCode> or{' '}
        <InlineCode>[data-query-builder=&quot;root&quot;]</InlineCode>.
        Generated CSS Module classes such as{' '}
        <InlineCode>rqb_[local]_[hash]</InlineCode> are private and can change
        between releases.
      </li>
    </List>
    <SectionTitle>Legacy ThemeProvider</SectionTitle>
    <CodeBlock
      code={themeProviderSignature}
      language="ts"
      label="ThemeProvider"
    />
    <CodeBlock code={colorsSignature} language="ts" label="Color types" />
    <SectionTitle>Props and precedence</SectionTitle>
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
        <ItemTitle>Precedence:</ItemTitle> Stylesheet defaults, inherited global
        or wrapper CSS, explicit provider colors, then explicit{' '}
        <InlineCode>Builder.style</InlineCode> values.
      </li>
      <li>
        <ItemTitle>Adapter note:</ItemTitle>{' '}
        <InlineCode>ThemeProvider</InlineCode> affects the built-in default
        components. Packaged host-library adapters use their own theme systems.
      </li>
    </List>
    <AlertBox title="Legacy theming" variant="warning">
      <InlineCode>ThemeProvider</InlineCode> is deprecated for new integrations.
      Map legacy color leaves to public{' '}
      <InlineCode>--query-builder-color-*</InlineCode> variables on a wrapper or{' '}
      <InlineCode>Builder.style</InlineCode>. The provider, exported{' '}
      <InlineCode>colors</InlineCode>, and color types stay available for the v2
      compatibility cycle.
    </AlertBox>
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/api/css-variables">CSS Variables</TextLink>,{' '}
      <TextLink to="/documentation/theming">Theming</TextLink>, and{' '}
      <TextLink to="/documentation/adapters">Adapters</TextLink>.
    </AlertBox>
  </>
);
