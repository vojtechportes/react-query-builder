import * as React from 'react';
import { Typography } from '../../../../../../components/typography/typography';
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
import { darkModeSnippet } from '../constants/dark-mode-snippet';
import { globalThemeSnippet } from '../constants/global-theme-snippet';
import { themeSnippet } from '../constants/theme-snippet';
import { wrapperThemeSnippet } from '../constants/wrapper-theme-snippet';

export const ThemingDocumentationContent: React.FC = () => (
  <>
    <Typography color="muted">
      Import{' '}
      <InlineCode>@vojtechportes/react-query-builder/styles.css</InlineCode>{' '}
      once, then customize the built-in components with inherited{' '}
      <InlineCode>--query-builder-*</InlineCode> CSS variables. The stylesheet
      supplies the default token values; components do not inject runtime
      styles.
    </Typography>
    <SectionTitle>Dark mode</SectionTitle>
    <Typography color="muted">
      Import the optional{' '}
      <InlineCode>
        @vojtechportes/react-query-builder/dark-mode.variables.css
      </InlineCode>{' '}
      after <InlineCode>styles.css</InlineCode>, then set the{' '}
      <InlineCode>colorScheme</InlineCode> prop. Changing the prop updates
      colors without remounting the Builder.
    </Typography>
    <CodeBlock
      code={darkModeSnippet}
      language="tsx"
      label="Reactive dark mode"
    />
    <List>
      <li>
        Use <InlineCode>colorScheme=&quot;light&quot;</InlineCode> or{' '}
        <InlineCode>colorScheme=&quot;dark&quot;</InlineCode> to create an
        explicit palette boundary for one Builder.
      </li>
      <li>
        Leave <InlineCode>colorScheme</InlineCode> undefined to preserve colors
        inherited from your application or a surrounding wrapper.
      </li>
      <li>
        Explicit light and dark Builders can be siblings or nested. The nearest
        Builder scheme applies to its built-in components.
      </li>
      <li>
        Built-in SQL highlighting uses the same info, success, warning, primary,
        grey, and error variables as the rest of the Builder.
      </li>
    </List>
    <AlertBox title="Monaco editor" variant="info">
      The packaged Monaco light and dark themes use the same query-builder
      palette roles as the built-in SQL editor and update without remounting
      when <InlineCode>colorScheme</InlineCode> changes. Monaco's standalone
      theme service is global, so the latest mounted packaged editor, or the
      editor whose scheme changes most recently, wins across all mounted
      editors. Synchronizing consumer CSS variable overrides or custom
      per-editor themes requires application-level configuration.
    </AlertBox>
    <SectionTitle>Global overrides</SectionTitle>{' '}
    <Typography color="muted">
      Set variables on <InlineCode>:root</InlineCode> when every builder and
      standalone built-in control should share the same values.
    </Typography>
    <CodeBlock code={globalThemeSnippet} language="css" label="Global tokens" />
    <SectionTitle>Wrapper overrides</SectionTitle>
    <Typography color="muted">
      Set variables on an application-owned wrapper to scope a theme to one
      subtree. The values are inherited by the builder and its built-in
      controls.
    </Typography>
    <CodeBlock
      code={wrapperThemeSnippet}
      language="css"
      label="Wrapper-scoped tokens"
    />
    <SectionTitle>Builder overrides</SectionTitle>
    <Typography color="muted">
      Use the typed <InlineCode>Builder.style</InlineCode> prop for values that
      belong to one builder instance. This is the most specific supported token
      override boundary.
    </Typography>
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
        status colors, and the background surface.
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
    <Typography color="muted">
      <InlineCode>IBuilderStyle</InlineCode> is the typed list of every public
      token accepted by <InlineCode>Builder.style</InlineCode>. The same
      variable names can be declared in global or wrapper CSS. See the{' '}
      <TextLink to="/api/css-variables">
        complete CSS variables reference
      </TextLink>{' '}
      for every variable and its default value.
    </Typography>
    <SectionTitle>Precedence</SectionTitle>
    <Typography color="muted">
      Values are resolved in this order, from lowest to highest:
    </Typography>
    <List>
      <li>
        <ItemTitle>Stylesheet defaults:</ItemTitle> Light defaults from{' '}
        <InlineCode>styles.css</InlineCode>.
      </li>
      <li>
        <ItemTitle>Inherited CSS:</ItemTitle> Application variables when{' '}
        <InlineCode>colorScheme</InlineCode> is undefined.
      </li>
      <li>
        <ItemTitle>Explicit scheme:</ItemTitle> The complete light or dark
        palette selected through <InlineCode>colorScheme</InlineCode>.
      </li>
      <li>
        <ItemTitle>Builder class:</ItemTitle> Consumer CSS targeting the root
        through <InlineCode>className</InlineCode>.
      </li>
      <li>
        <ItemTitle>ThemeProvider:</ItemTitle> Explicit legacy provider colors
        mapped to root variables.
      </li>
      <li>
        <ItemTitle>Builder style:</ItemTitle> Variables passed through{' '}
        <InlineCode>Builder.style</InlineCode> as the final override.
      </li>
    </List>
    <SectionTitle>Stable styling hooks</SectionTitle>{' '}
    <List>
      <li>
        Pass an application-owned <InlineCode>className</InlineCode> to{' '}
        <InlineCode>Builder</InlineCode> or select its stable{' '}
        <InlineCode>[data-query-builder=&quot;root&quot;]</InlineCode>{' '}
        attribute.
      </li>
      <li>
        The root remains available when{' '}
        <InlineCode>
          useDefaultContainerStyles={'{'}false{'}'}
        </InlineCode>
        removes its built-in surface class.
      </li>{' '}
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
    <Typography color="muted">
      Replace each legacy color leaf with its matching CSS variable. For
      example, <InlineCode>colors.primary.default</InlineCode> becomes{' '}
      <InlineCode>--query-builder-color-primary-default</InlineCode>. Put shared
      values on a wrapper or pass one-off values through{' '}
      <InlineCode>Builder.style</InlineCode>, then remove the provider when it
      no longer serves other builders.
    </Typography>
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
