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
import { antdAdapterSnippet } from '../constants/antd-adapter-snippet';
import { antdV5Snippet } from '../constants/antd-v5-snippet';
import { antdCreateComponentsSnippet } from '../constants/antd-create-components-snippet';

export const AdaptersAntdApiContent: React.FC = () => (
  <>
    <CodeBlock
      code={antdAdapterSnippet}
      language="tsx"
      label="ANTD v6 adapter usage"
    />
    <CodeBlock code={antdV5Snippet} language="tsx" label="ANTD v5 import" />
    <CodeBlock
      code={antdCreateComponentsSnippet}
      language="tsx"
      label="createAntdComponents"
    />
    <SectionTitle>Available entrypoints</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>@vojtechportes/react-query-builder/antd/v6</InlineCode>:
        </ItemTitle>{' '}
        Recommended Ant Design adapter for new projects.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>@vojtechportes/react-query-builder/antd/v5</InlineCode>:
        </ItemTitle>{' '}
        Ant Design adapter for applications still on Ant Design 5.
      </li>
    </List>
    <SectionTitle>Exports</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>components</InlineCode>:
        </ItemTitle>{' '}
        Ready-made Ant Design component mapping for{' '}
        <InlineCode>Builder</InlineCode>.
      </li>
      <li>
        <ItemTitle>Individual mapped components:</ItemTitle> Named exports such
        as <InlineCode>AntdSelect</InlineCode>,{' '}
        <InlineCode>AntdInput</InlineCode>, and related ANTD-backed controls for
        partial overrides.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>createAntdComponents</InlineCode>:
        </ItemTitle>{' '}
        Merges ANTD defaults with local overrides while preserving nested{' '}
        <InlineCode>form</InlineCode> keys.
      </li>
    </List>
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/adapters/antd">ANTD adapter guide</TextLink>.
    </AlertBox>
  </>
);
