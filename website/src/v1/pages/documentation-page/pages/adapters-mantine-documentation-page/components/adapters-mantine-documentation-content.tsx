import * as React from 'react';
import { AlertBox } from '../../../../../../components/alert-box';
import { CodeBlock } from '../../../../../../components/code-block';
import {
  InlineCode,
  List,
  SectionTitle,
  TextLink,
} from '../../../../../../components/docs-primitives';
import { mantineSnippet } from '../constants/mantine-snippet';
import { mantineAdaptersInstallSnippet } from '../constants/mantine-adapters-install-snippet';
import { mantineCreateComponentsSnippet } from '../constants/mantine-create-components-snippet';

export const AdaptersMantineDocumentationContent: React.FC = () => (
  <>
    <p>
      Use the Mantine adapter when your application already uses Mantine and you
      want the builder controls to inherit that component language.
    </p>
    <SectionTitle>Available entrypoints</SectionTitle>
    <List>
      <li>
        <InlineCode>@vojtechportes/react-query-builder/mantine/v9</InlineCode>{' '}
        is the recommended entrypoint for new Mantine projects and the one used
        in the demo.
      </li>
      <li>
        <InlineCode>@vojtechportes/react-query-builder/mantine/v8</InlineCode>{' '}
        is available for applications that are still on Mantine 8.
      </li>
    </List>
    <SectionTitle>Installing Mantine</SectionTitle>
    <p>
      Install the Mantine peer dependencies that match the adapter version you
      want to use. For new setups, prefer <InlineCode>mantine/v9</InlineCode>.
    </p>
    <CodeBlock
      code={mantineAdaptersInstallSnippet}
      language="bash"
      label="Mantine v9 peers"
    />
    <AlertBox title="React version note" variant="info">
      Mantine 9 requires React 19. The library website runs on React 19 so it
      can exercise <InlineCode>mantine/v9</InlineCode> directly, while the
      library package itself keeps broad React 18 and 19 peer compatibility.
    </AlertBox>
    <AlertBox title="Stylesheet required" variant="info">
      Import <InlineCode>@mantine/core/styles.css</InlineCode> once in your
      application entrypoint. Without it, Mantine components render without
      their expected styling.
    </AlertBox>
    <SectionTitle>Using Mantine v9</SectionTitle>
    <CodeBlock
      code={mantineSnippet}
      language="tsx"
      label="Mantine v9 adapter"
    />
    <SectionTitle>Supporting Mantine v8</SectionTitle>
    <p>
      If your application is still on Mantine 8, switch the import path to{' '}
      <InlineCode>@vojtechportes/react-query-builder/mantine/v8</InlineCode>.
    </p>
    <SectionTitle>Extending the Mantine adapter</SectionTitle>
    <CodeBlock
      code={mantineCreateComponentsSnippet}
      language="tsx"
      label="Merging Mantine defaults"
    />
    <AlertBox title="Related docs" variant="info">
      <TextLink to="/documentation/adapters">Adapters</TextLink>,{' '}
      <TextLink to="/documentation/components">Components</TextLink>, and{' '}
      <TextLink to="/api/adapters/mantine">Mantine adapter API</TextLink>.
    </AlertBox>
  </>
);
