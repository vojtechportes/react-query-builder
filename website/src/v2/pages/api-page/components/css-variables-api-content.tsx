import * as React from 'react';
import { CodeBlock } from '../../../../components/code-block';
import {
  InlineCode,
  SectionTitle,
  TextLink,
} from '../../../../components/docs-primitives';
import { cssVariablesReference } from '../constants/css-variables-reference';

export const CssVariablesApiContent: React.FC = () => (
  <>
    <p>
      These are all public CSS variables supported by the built-in components.
      The values shown are the defaults from the package stylesheet. Override
      only the variables your theme needs on <InlineCode>:root</InlineCode>, an
      application-owned wrapper, or one builder through its typed{' '}
      <InlineCode>style</InlineCode> prop.
    </p>
    <SectionTitle>Variables and defaults</SectionTitle>
    <CodeBlock
      code={cssVariablesReference}
      language="css"
      label="Public CSS variables"
    />
    <p>
      <InlineCode>IBuilderStyle</InlineCode> contains the same complete set for
      TypeScript users. See <TextLink to="/api/theming">Theming</TextLink> for
      precedence, supported override boundaries, and the legacy{' '}
      <InlineCode>ThemeProvider</InlineCode> API.
    </p>
  </>
);
