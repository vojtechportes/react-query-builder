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
import { bootstrapAdapterSnippet } from '../constants/bootstrap-adapter-snippet';
import { bootstrapV5Snippet } from '../constants/bootstrap-v5-snippet';
import { bootstrapCreateComponentsSnippet } from '../constants/bootstrap-create-components-snippet';

export const AdaptersBootstrapApiContent: React.FC = () => (
  <>
    <CodeBlock
      code={bootstrapAdapterSnippet}
      language="tsx"
      label="Bootstrap v5 adapter usage"
    />
    <CodeBlock
      code={bootstrapV5Snippet}
      language="tsx"
      label="Bootstrap v5 import"
    />
    <CodeBlock
      code={bootstrapCreateComponentsSnippet}
      language="tsx"
      label="createBootstrapComponents"
    />
    <SectionTitle>Available entrypoint</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>
            @vojtechportes/react-query-builder/bootstrap/v5
          </InlineCode>
          :
        </ItemTitle>{' '}
        Bootstrap 5 adapter.
      </li>
    </List>
    <SectionTitle>Exports</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>components</InlineCode>:
        </ItemTitle>{' '}
        Ready-made Bootstrap component mapping for{' '}
        <InlineCode>Builder</InlineCode>.
      </li>
      <li>
        <ItemTitle>Individual mapped components:</ItemTitle> Named exports such
        as <InlineCode>BootstrapSelect</InlineCode>,{' '}
        <InlineCode>BootstrapInput</InlineCode>, and related Bootstrap-backed
        controls for partial overrides.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>createBootstrapComponents</InlineCode>:
        </ItemTitle>{' '}
        Merges Bootstrap defaults with local overrides while preserving nested{' '}
        <InlineCode>form</InlineCode> keys.
      </li>
      <li>
        <ItemTitle>Stylesheet requirement:</ItemTitle> Import{' '}
        <InlineCode>bootstrap/dist/css/bootstrap.min.css</InlineCode> and{' '}
        <InlineCode>bootstrap-icons/font/bootstrap-icons.css</InlineCode> before
        rendering the adapter so the Bootstrap classes and official icon set
        resolve to actual styles.
      </li>
    </List>
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/adapters/bootstrap">
        Bootstrap adapter guide
      </TextLink>
      .
    </AlertBox>
  </>
);
