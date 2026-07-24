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
import { fluentUiAdapterSnippet } from '../constants/fluent-ui-adapter-snippet';
import { fluentUiV8Snippet } from '../constants/fluent-ui-v8-snippet';
import { fluentUiCreateComponentsSnippet } from '../constants/fluent-ui-create-components-snippet';

export const AdaptersFluentuiApiContent: React.FC = () => (
  <>
    <CodeBlock
      code={fluentUiAdapterSnippet}
      language="tsx"
      label="Fluent UI v8 adapter usage"
    />
    <CodeBlock
      code={fluentUiV8Snippet}
      language="tsx"
      label="Fluent UI v8 import"
    />
    <CodeBlock
      code={fluentUiCreateComponentsSnippet}
      language="tsx"
      label="createFluentUiComponents"
    />
    <SectionTitle>Available entrypoint</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>
            @vojtechportes/react-query-builder/fluentui/v8
          </InlineCode>
          :
        </ItemTitle>{' '}
        Fluent UI React 8 adapter.
      </li>
    </List>
    <SectionTitle>Exports</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>components</InlineCode>:
        </ItemTitle>{' '}
        Ready-made Fluent UI component mapping for{' '}
        <InlineCode>Builder</InlineCode>.
      </li>
      <li>
        <ItemTitle>Individual mapped components:</ItemTitle> Named exports such
        as <InlineCode>FluentUiSelect</InlineCode>,{' '}
        <InlineCode>FluentUiInput</InlineCode>, and related Fluent-backed
        controls for partial overrides.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>createFluentUiComponents</InlineCode>:
        </ItemTitle>{' '}
        Merges Fluent UI defaults with local overrides while preserving nested{' '}
        <InlineCode>form</InlineCode> keys.
      </li>
    </List>
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/adapters/fluentui">
        Fluent UI adapter guide
      </TextLink>
      .
    </AlertBox>
  </>
);
