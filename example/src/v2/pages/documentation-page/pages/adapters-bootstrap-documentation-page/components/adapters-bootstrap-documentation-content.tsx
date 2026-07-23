import * as React from 'react';
import { AlertBox } from '../../../../../../components/alert-box';
import { CodeBlock } from '../../../../../../components/code-block';
import {
  InlineCode,
  List,
  SectionTitle,
  TextLink,
} from '../../../../../../components/docs-primitives';
import { bootstrapSnippet } from '../constants/bootstrap-snippet';
import { bootstrapAdaptersInstallSnippet } from '../constants/bootstrap-adapters-install-snippet';
import { bootstrapCreateComponentsSnippet } from '../constants/bootstrap-create-components-snippet';

export const AdaptersBootstrapDocumentationContent: React.FC = () => (
  <>
    <p>
      Use the Bootstrap adapter when your application already ships Bootstrap 5
      styles and you want the builder controls mapped to Bootstrap-flavored UI.
    </p>
    <SectionTitle>Available entrypoint</SectionTitle>
    <List>
      <li>
        <InlineCode>@vojtechportes/react-query-builder/bootstrap/v5</InlineCode>{' '}
        is the Bootstrap 5 adapter and is available in the demo.
      </li>
    </List>
    <SectionTitle>Installing Bootstrap</SectionTitle>
    <p>
      Install Bootstrap and import its stylesheet before rendering the adapter.
    </p>
    <CodeBlock
      code={bootstrapAdaptersInstallSnippet}
      language="bash"
      label="Bootstrap 5 peer"
    />
    <AlertBox title="Stylesheet required" variant="info">
      Import <InlineCode>bootstrap/dist/css/bootstrap.min.css</InlineCode> in
      your application entrypoint or the specific subtree where the adapter is
      rendered. Also import{' '}
      <InlineCode>bootstrap-icons/font/bootstrap-icons.css</InlineCode> so the
      adapter icon buttons render with the official Bootstrap Icons package.
      Without these stylesheets, the adapter falls back to unstyled HTML.
    </AlertBox>
    <SectionTitle>Using Bootstrap v5</SectionTitle>
    <CodeBlock
      code={bootstrapSnippet}
      language="tsx"
      label="Bootstrap v5 adapter"
    />
    <SectionTitle>Extending the Bootstrap adapter</SectionTitle>
    <CodeBlock
      code={bootstrapCreateComponentsSnippet}
      language="tsx"
      label="Merging Bootstrap defaults"
    />
    <AlertBox title="Related docs" variant="info">
      <TextLink to="/documentation/adapters">Adapters</TextLink>,{' '}
      <TextLink to="/documentation/components">Components</TextLink>, and{' '}
      <TextLink to="/api/adapters/bootstrap">Bootstrap adapter API</TextLink>.
    </AlertBox>
  </>
);
