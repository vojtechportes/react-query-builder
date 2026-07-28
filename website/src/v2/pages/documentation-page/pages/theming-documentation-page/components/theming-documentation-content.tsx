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
import { builderStyleThemeSnippet } from '../constants/builder-style-theme-snippet';
import { globalThemeSnippet } from '../constants/global-theme-snippet';
import { themeSnippet } from '../constants/theme-snippet';
import { wrapperThemeSnippet } from '../constants/wrapper-theme-snippet';

export const ThemingDocumentationContent: React.FC = () => (
  <>
    <p>
      Import{' '}
      <InlineCode>@vojtechportes/react-query-builder/styles.css</InlineCode>{' '}
      once, then customize the built-in components with inherited{' '}
      <InlineCode>--query-builder-*</InlineCode> CSS variables. The stylesheet
      supplies the default token values; components do not inject runtime
      styles.
    </p>
    <SectionTitle>Global overrides</SectionTitle>
    <p>
      Set variables on <InlineCode>:root</InlineCode> when every builder and
      standalone built-in control should share the same values.
    </p>
    <CodeBlock code={globalThemeSnippet} language="css" label="Global tokens" />
    <SectionTitle>Wrapper overrides</SectionTitle>
    <p>
      Set variables on an application-owned wrapper to scope a theme to one
      subtree. The values are inherited by the builder and its built-in
      controls.
    </p>
    <CodeBlock
      code={wrapperThemeSnippet}
      language="css"
      label="Wrapper-scoped tokens"
    />
    <SectionTitle>Builder overrides</SectionTitle>
    <p>
      Use the typed <InlineCode>Builder.style</InlineCode> prop for values that
      belong to one builder instance. This is the most specific supported token
      override boundary.
    </p>
    <CodeBlock
      code={builderStyleThemeSnippet}
      language="tsx"
      label="Per-Builder tokens"
    />
    <SectionTitle>Public token groups</SectionTitle>
    <List>
      <li>
        <ItemTitle>Colors:</ItemTitle>{' '}
        <InlineCode>--query-builder-color-primary-*</InlineCode>,{' '}
        <InlineCode>--query-builder-color-secondary-*</InlineCode>, grey scale,
        status colors, and white.
      </li>
      <li>
        <ItemTitle>Spacing and layout:</ItemTitle>{' '}
        <InlineCode>--query-builder-spacing-*</InlineCode>, root/group/rule
        padding, control/group gaps, control dimensions, and drop-zone height.
      </li>
      <li>
        <ItemTitle>Shape and depth:</ItemTitle>{' '}
        <InlineCode>--query-builder-radius-*</InlineCode> and{' '}
        <InlineCode>--query-builder-shadow-*</InlineCode> tokens for roots,
        groups, popovers, and focus rings.
      </li>
      <li>
        <ItemTitle>Typography and editors:</ItemTitle> Font, font size, line
        height, editor typography, editor minimum height, motion, and popover
        layering tokens.
      </li>
    </List>
    <p>
      <InlineCode>IBuilderStyle</InlineCode> is the typed list of every public
      token accepted by <InlineCode>Builder.style</InlineCode>. The same
      variable names can be declared in global or wrapper CSS. See the{' '}
      <TextLink to="/api/css-variables">
        complete CSS variables reference
      </TextLink>{' '}
      for every variable and its default value.
    </p>
    <SectionTitle>Precedence</SectionTitle>
    <p>Values are resolved in this order, from lowest to highest:</p>
    <List>
      <li>
        <ItemTitle>Stylesheet defaults:</ItemTitle> Generated color defaults and
        the public layout, sizing, typography, motion, and layering defaults in{' '}
        <InlineCode>styles.css</InlineCode>.
      </li>
      <li>
        <ItemTitle>Inherited CSS:</ItemTitle> Variables declared by your app on{' '}
        <InlineCode>:root</InlineCode> or a wrapper around the builder.
      </li>
      <li>
        <ItemTitle>ThemeProvider:</ItemTitle> Only color values explicitly
        supplied to the nearest legacy provider become compatibility variables.
      </li>
      <li>
        <ItemTitle>Builder style:</ItemTitle> Variables passed through the{' '}
        <InlineCode>Builder.style</InlineCode> prop are the final override on
        the builder root.
      </li>
    </List>
    <SectionTitle>Stable styling hooks</SectionTitle>
    <List>
      <li>
        Pass an application-owned <InlineCode>className</InlineCode> to{' '}
        <InlineCode>Builder</InlineCode> or select its stable{' '}
        <InlineCode>[data-query-builder=&quot;root&quot;]</InlineCode>{' '}
        attribute.
      </li>
      <li>
        Prefer public CSS variables for built-in presentation and the component
        override API when you need different markup.
      </li>
      <li>
        CSS Module classes shaped like{' '}
        <InlineCode>rqb_[local]_[hash]</InlineCode> are private build output.
        Their names can change between releases and must not be used as
        selectors.
      </li>
    </List>
    <SectionTitle>Migrating from ThemeProvider</SectionTitle>
    <CodeBlock
      code={themeSnippet}
      language="tsx"
      label="Legacy theme provider"
    />
    <p>
      Replace each legacy color leaf with its matching CSS variable. For
      example, <InlineCode>colors.primary.default</InlineCode> becomes{' '}
      <InlineCode>--query-builder-color-primary-default</InlineCode>. Put shared
      values on a wrapper or pass one-off values through{' '}
      <InlineCode>Builder.style</InlineCode>, then remove the provider when it
      no longer serves other builders.
    </p>
    <AlertBox title="Legacy API" variant="warning">
      Prefer CSS variables for new code. <InlineCode>ThemeProvider</InlineCode>,{' '}
      <InlineCode>colors</InlineCode>, and the public color types remain
      available for the v2 compatibility cycle. The provider has no DOM wrapper,
      only handles colors, and nested providers replace rather than merge the
      outer color value.
    </AlertBox>
    <AlertBox title="Adapters and theming" variant="info">
      <InlineCode>ThemeProvider</InlineCode> and the built-in color tokens do
      not theme host-library controls supplied by an adapter. Configure the host
      UI library through its own theme API and use query-builder variables for
      the remaining structural surfaces. See{' '}
      <TextLink to="/documentation/adapters">Adapters</TextLink>.
    </AlertBox>
    <AlertBox title="API reference" variant="info">
      <TextLink to="/api/css-variables">CSS Variables</TextLink>,{' '}
      <TextLink to="/api/theming">Theming</TextLink>, and{' '}
      <TextLink to="/api/adapters">Adapters</TextLink>.
    </AlertBox>
  </>
);
