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
import { migrationStylesheetImportSnippet } from '../constants/migration-stylesheet-import-snippet';
import { migrationTokenOverridesSnippet } from '../constants/migration-token-overrides-snippet';

export const MigrationTo20DocumentationContent: React.FC = () => (
  <>
    <p>
      React Query Builder 2.0 replaces the library&apos;s runtime{' '}
      <InlineCode>styled-components</InlineCode> implementation with an explicit
      package stylesheet and inherited CSS custom properties. Query data and
      component APIs remain compatible unless noted below.
    </p>
    <SectionTitle>Import the stylesheet</SectionTitle>
    <p>
      Import the stylesheet once in the client entry for every application that
      renders built-in components. Server-rendered applications should include
      the same import in the client and server build graph so the bundler emits
      one shared CSS asset.
    </p>
    <p>
      Adapter styles remain owned by their host packages. Load host-library
      styles before the React Query Builder stylesheet when the adapter
      documentation requires them.
    </p>
    <CodeBlock
      code={migrationStylesheetImportSnippet}
      language="tsx"
      label="Application entry"
    />
    <SectionTitle>Customize CSS tokens</SectionTitle>
    <p>
      Set inherited <InlineCode>--query-builder-*</InlineCode> variables on an
      application wrapper for a shared theme or pass them through one{' '}
      <InlineCode>Builder.style</InlineCode> prop for a local override.
    </p>
    <CodeBlock
      code={migrationTokenOverridesSnippet}
      language="css"
      label="Wrapper tokens"
    />
    <p>Token values are resolved from lowest to highest priority:</p>
    <List>
      <li>Defaults generated into the package stylesheet.</li>
      <li>Custom properties inherited from application CSS.</li>
      <li>Color values supplied by the legacy ThemeProvider.</li>
      <li>Custom properties passed through the Builder style prop.</li>
    </List>
    <AlertBox title="Stable styling hooks" variant="info">
      CSS Module class names are private build output. Use documented root
      classes, data attributes, component overrides, and CSS custom properties
      instead of generated hashes. See{' '}
      <TextLink to="/documentation/theming">Theming</TextLink> for the complete
      token reference.
    </AlertBox>
    <SectionTitle>ThemeProvider is legacy</SectionTitle>
    <p>
      <InlineCode>ThemeProvider</InlineCode>, <InlineCode>colors</InlineCode>,
      and their public color types remain available for the 2.0 compatibility
      cycle. New integrations should use CSS custom properties. Existing
      provider integrations can migrate incrementally without an immediate API
      change. Only supplied legacy color values become inline custom properties.
      Omitted values continue to inherit from application CSS or use the
      stylesheet defaults.
    </p>
    <SectionTitle>OptionContainer remains polymorphic</SectionTitle>
    <p>
      The public <InlineCode>OptionContainer</InlineCode> keeps its{' '}
      <InlineCode>as</InlineCode> prop. Intrinsic and custom React elements keep
      their compatible props and forwarded refs, so existing polymorphic uses
      require no migration.
    </p>
    <SectionTitle>Versioned documentation</SectionTitle>
    <List>
      <li>
        <ItemTitle>Version 2:</ItemTitle>{' '}
        <TextLink to="/documentation">Documentation</TextLink> and{' '}
        <TextLink to="/api">API reference</TextLink>.
      </li>
      <li>
        <ItemTitle>Version 1:</ItemTitle>{' '}
        <TextLink to="https://www.react-query-builder.com/v1/documentation">
          Documentation
        </TextLink>{' '}
        and{' '}
        <TextLink to="https://www.react-query-builder.com/v1/api">
          API reference
        </TextLink>
        .
      </li>
    </List>
    <p>
      Use the v1 pages when maintaining a 1.33.1 application. New integrations
      and migrations should follow the v2 documentation.
    </p>
  </>
);
