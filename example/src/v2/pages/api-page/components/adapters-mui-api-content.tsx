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
import { muiAdapterSnippet } from '../constants/mui-adapter-snippet';
import { muiV7Snippet } from '../constants/mui-v7-snippet';
import { muiCreateComponentsSnippet } from '../constants/mui-create-components-snippet';

export const AdaptersMuiApiContent: React.FC = () => (
  <>
    <CodeBlock
      code={muiAdapterSnippet}
      language="tsx"
      label="MUI v9 adapter usage"
    />
    <CodeBlock code={muiV7Snippet} language="tsx" label="MUI v7 import" />
    <CodeBlock
      code={muiCreateComponentsSnippet}
      language="tsx"
      label="createMuiComponents"
    />
    <SectionTitle>Available entrypoints</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>@vojtechportes/react-query-builder/mui/v9</InlineCode>:
        </ItemTitle>{' '}
        Recommended Material UI adapter for new projects.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>@vojtechportes/react-query-builder/mui/v7</InlineCode>:
        </ItemTitle>{' '}
        Material UI adapter for applications still on MUI 7.
      </li>
    </List>
    <SectionTitle>Exports</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>components</InlineCode>:
        </ItemTitle>{' '}
        Ready-made MUI component mapping for <InlineCode>Builder</InlineCode>.
      </li>
      <li>
        <ItemTitle>Individual mapped components:</ItemTitle> Named exports such
        as <InlineCode>MuiSelect</InlineCode>, <InlineCode>MuiInput</InlineCode>
        , and related MUI-backed controls for partial overrides.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>createMuiComponents</InlineCode>:
        </ItemTitle>{' '}
        Merges MUI defaults with local overrides while preserving nested{' '}
        <InlineCode>form</InlineCode> keys.
      </li>
    </List>
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/adapters/mui">MUI adapter guide</TextLink>.
    </AlertBox>
  </>
);
