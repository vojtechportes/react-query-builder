import * as React from 'react';
import { AlertBox } from '../../../../../../components/alert-box';
import { CodeBlock } from '../../../../../../components/code-block';
import {
  InlineCode,
  List,
  SectionTitle,
  TextLink,
} from '../../../../../../components/docs-primitives';
import { muiSnippet } from '../constants/mui-snippet';
import { muiOverrideSnippet } from '../constants/mui-override-snippet';
import { adaptersInstallSnippet } from '../constants/adapters-install-snippet';
import { muiCreateComponentsSnippet } from '../constants/mui-create-components-snippet';

export const AdaptersMuiDocumentationContent: React.FC = () => (
  <>
    <p>
      Use the MUI adapter when your application already uses Material UI and you
      want the builder to inherit that component language.
    </p>
    <SectionTitle>Available entrypoints</SectionTitle>
    <List>
      <li>
        <InlineCode>@vojtechportes/react-query-builder/mui/v9</InlineCode> is
        the recommended entrypoint for new Material UI projects and the one used
        in the demo.
      </li>
      <li>
        <InlineCode>@vojtechportes/react-query-builder/mui/v7</InlineCode> is
        available for applications that are still on Material UI 7.
      </li>
    </List>
    <SectionTitle>Installing MUI</SectionTitle>
    <p>
      Install the MUI peer dependencies that match the adapter version you want
      to use. For new setups, prefer <InlineCode>mui/v9</InlineCode>.
    </p>
    <CodeBlock
      code={adaptersInstallSnippet}
      language="bash"
      label="MUI v9 peers"
    />
    <SectionTitle>Using MUI v9</SectionTitle>
    <CodeBlock code={muiSnippet} language="tsx" label="MUI v9 adapter" />
    <SectionTitle>Supporting MUI v7</SectionTitle>
    <p>
      If your application is still on Material UI 7, switch the import path to{' '}
      <InlineCode>@vojtechportes/react-query-builder/mui/v7</InlineCode>.
    </p>
    <CodeBlock
      code={muiOverrideSnippet}
      language="tsx"
      label="Starting from the MUI v7 mapping"
    />
    <SectionTitle>Extending the MUI adapter</SectionTitle>
    <CodeBlock
      code={muiCreateComponentsSnippet}
      language="tsx"
      label="Merging MUI defaults"
    />
    <AlertBox title="Related docs" variant="info">
      <TextLink to="/documentation/adapters">Adapters</TextLink>,{' '}
      <TextLink to="/documentation/components">Components</TextLink>, and{' '}
      <TextLink to="/api/adapters/mui">MUI adapter API</TextLink>.
    </AlertBox>
  </>
);
