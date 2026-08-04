import * as React from 'react';
import { CodeBlock } from '../../../../components/code-block';
import { Typography } from '../../../../components/typography/typography';
import {
  InlineCode,
  SectionTitle,
  TextLink,
} from '../../../../components/docs-primitives';
import { cssVariablesReference } from '../constants/css-variables-reference';

export const CssVariablesApiContent: React.FC = () => (
  <>
    <Typography color="muted">
      These are all public CSS variables supported by the built-in components.
      The values shown are the defaults from the package stylesheet. Override
      only the variables your theme needs on <InlineCode>:root</InlineCode>, an
      application-owned wrapper, or one builder through its typed{' '}
      <InlineCode>style</InlineCode> prop.
    </Typography>
    <SectionTitle>Color schemes</SectionTitle>
    <Typography color="muted">
      The base stylesheet defines root defaults and an explicit light palette.
      The optional{' '}
      <InlineCode>
        @vojtechportes/react-query-builder/dark-mode.variables.css
      </InlineCode>{' '}
      export defines the scoped dark palette. Select either palette with the
      typed <InlineCode>Builder.colorScheme</InlineCode> prop.
    </Typography>
    <Typography color="muted">
      <InlineCode>--query-builder-color-background</InlineCode> replaces the
      former <InlineCode>--query-builder-color-white</InlineCode> surface token.
    </Typography>{' '}
    <SectionTitle>Variables and defaults</SectionTitle>
    <CodeBlock
      code={cssVariablesReference}
      language="css"
      label="Public CSS variables"
    />
    <Typography color="muted">
      <InlineCode>IBuilderStyle</InlineCode> contains the same complete set for
      TypeScript users. See <TextLink to="/api/theming">Theming</TextLink> for
      precedence, supported override boundaries, and the legacy{' '}
      <InlineCode>ThemeProvider</InlineCode> API.
    </Typography>
  </>
);
