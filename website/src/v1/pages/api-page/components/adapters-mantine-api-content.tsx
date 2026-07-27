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
import { mantineAdapterSnippet } from '../constants/mantine-adapter-snippet';
import { mantineV8Snippet } from '../constants/mantine-v8-snippet';
import { mantineCreateComponentsSnippet } from '../constants/mantine-create-components-snippet';

export const AdaptersMantineApiContent: React.FC = () => (
  <>
    <CodeBlock
      code={mantineAdapterSnippet}
      language="tsx"
      label="Mantine v9 adapter usage"
    />
    <CodeBlock
      code={mantineV8Snippet}
      language="tsx"
      label="Mantine v8 import"
    />
    <CodeBlock
      code={mantineCreateComponentsSnippet}
      language="tsx"
      label="createMantineComponents"
    />
    <SectionTitle>Available entrypoints</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>@vojtechportes/react-query-builder/mantine/v9</InlineCode>
          :
        </ItemTitle>{' '}
        Recommended Mantine adapter for new projects on Mantine 9.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>@vojtechportes/react-query-builder/mantine/v8</InlineCode>
          :
        </ItemTitle>{' '}
        Mantine adapter for applications still on Mantine 8.
      </li>
    </List>
    <SectionTitle>Exports</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>components</InlineCode>:
        </ItemTitle>{' '}
        Ready-made Mantine component mapping for{' '}
        <InlineCode>Builder</InlineCode>.
      </li>
      <li>
        <ItemTitle>Individual mapped components:</ItemTitle> Named exports such
        as <InlineCode>MantineSelect</InlineCode>,{' '}
        <InlineCode>MantineInput</InlineCode>, and related Mantine-backed
        controls for partial overrides.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>createMantineComponents</InlineCode>:
        </ItemTitle>{' '}
        Merges Mantine defaults with local overrides while preserving nested{' '}
        <InlineCode>form</InlineCode> keys.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>MantineProvider</InlineCode>:
        </ItemTitle>{' '}
        Mantine-backed builders should be rendered within Mantine's provider so
        the host app theme and styles are available.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>@mantine/core/styles.css</InlineCode>:
        </ItemTitle>{' '}
        Import Mantine's base stylesheet once in your application entrypoint so
        Mantine controls render correctly.
      </li>
    </List>
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/adapters/mantine">
        Mantine adapter guide
      </TextLink>
      .
    </AlertBox>
  </>
);
