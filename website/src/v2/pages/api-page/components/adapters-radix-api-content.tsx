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
import { radixAdapterSnippet } from '../constants/radix-adapter-snippet';
import { radixV1Snippet } from '../constants/radix-v1-snippet';
import { radixCreateComponentsSnippet } from '../constants/radix-create-components-snippet';

export const AdaptersRadixApiContent: React.FC = () => (
  <>
    <CodeBlock
      code={radixAdapterSnippet}
      language="tsx"
      label="Radix v1 adapter usage"
    />
    <CodeBlock code={radixV1Snippet} language="tsx" label="Radix v1 import" />
    <CodeBlock
      code={radixCreateComponentsSnippet}
      language="tsx"
      label="createRadixComponents"
    />
    <SectionTitle>Available entrypoint</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>@vojtechportes/react-query-builder/radix/v1</InlineCode>:
        </ItemTitle>{' '}
        Radix Themes adapter for applications on{' '}
        <InlineCode>@radix-ui/themes</InlineCode> 1.x.
      </li>
    </List>
    <SectionTitle>Exports</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>components</InlineCode>:
        </ItemTitle>{' '}
        Ready-made Radix Themes component mapping for{' '}
        <InlineCode>Builder</InlineCode>.
      </li>
      <li>
        <ItemTitle>Individual mapped components:</ItemTitle> Named exports such
        as <InlineCode>RadixSelect</InlineCode>,{' '}
        <InlineCode>RadixInput</InlineCode>, and related Radix-backed controls
        for partial overrides.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>createRadixComponents</InlineCode>:
        </ItemTitle>{' '}
        Merges Radix defaults with local overrides while preserving nested{' '}
        <InlineCode>form</InlineCode> keys.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>Theme</InlineCode>:
        </ItemTitle>{' '}
        Radix-backed builders should be rendered within Radix Themes' provider
        so the host app theme and tokens are available.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>@radix-ui/themes/styles.css</InlineCode>:
        </ItemTitle>{' '}
        Import the Radix Themes stylesheet once in your application entrypoint
        so the adapter controls render correctly.
      </li>
    </List>
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/adapters/radix">
        Radix adapter guide
      </TextLink>
      .
    </AlertBox>
  </>
);
