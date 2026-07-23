import * as React from 'react';
import { AlertBox } from '../../../../../../components/alert-box';
import { CodeBlock } from '../../../../../../components/code-block';
import {
  InlineCode,
  List,
  SectionTitle,
  TextLink,
} from '../../../../../../components/docs-primitives';
import { radixSnippet } from '../constants/radix-snippet';
import { radixAdaptersInstallSnippet } from '../constants/radix-adapters-install-snippet';
import { radixCreateComponentsSnippet } from '../constants/radix-create-components-snippet';

export const AdaptersRadixDocumentationContent: React.FC = () => (
  <>
    <p>
      Use the Radix adapter when your application uses Radix Themes and you want
      the builder controls to align with that design system.
    </p>
    <SectionTitle>Available entrypoint</SectionTitle>
    <List>
      <li>
        <InlineCode>@vojtechportes/react-query-builder/radix/v1</InlineCode>{' '}
        targets <InlineCode>@radix-ui/themes</InlineCode> 1.x and is available
        in the demo.
      </li>
    </List>
    <SectionTitle>Installing Radix Themes</SectionTitle>
    <p>
      Install the Radix Themes peer dependency and the Radix icons package
      before using the adapter.
    </p>
    <CodeBlock
      code={radixAdaptersInstallSnippet}
      language="bash"
      label="Radix Themes v1 peer"
    />
    <AlertBox title="Icons package required" variant="info">
      The Radix adapter renders icons from{' '}
      <InlineCode>@radix-ui/react-icons</InlineCode>, so applications using the
      adapter should install that package alongside{' '}
      <InlineCode>@radix-ui/themes</InlineCode>.
    </AlertBox>
    <AlertBox title="Stylesheet required" variant="info">
      Import <InlineCode>@radix-ui/themes/styles.css</InlineCode> once in your
      application entrypoint so Radix Themes components render with the expected
      styling.
    </AlertBox>
    <AlertBox title="Provider required" variant="info">
      Render the builder inside <InlineCode>Theme</InlineCode> so Radix Themes
      tokens and component styles are available to the adapter.
    </AlertBox>
    <SectionTitle>Using Radix v1</SectionTitle>
    <CodeBlock code={radixSnippet} language="tsx" label="Radix v1 adapter" />
    <SectionTitle>Extending the Radix adapter</SectionTitle>
    <CodeBlock
      code={radixCreateComponentsSnippet}
      language="tsx"
      label="Merging Radix defaults"
    />
    <AlertBox title="Related docs" variant="info">
      <TextLink to="/documentation/adapters">Adapters</TextLink>,{' '}
      <TextLink to="/documentation/components">Components</TextLink>, and{' '}
      <TextLink to="/api/adapters/radix">Radix adapter API</TextLink>.
    </AlertBox>
  </>
);
