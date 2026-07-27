import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import {
  InlineCode,
  ItemTitle,
  List,
  TextLink,
} from '../../../../components/docs-primitives';

export const OverviewApiContent: React.FC = () => (
  <>
    <List>
      <li>
        <ItemTitle>Core API:</ItemTitle> <InlineCode>Builder</InlineCode>,{' '}
        <InlineCode>Fields</InlineCode>, and <InlineCode>Data</InlineCode>.
      </li>
      <li>
        <ItemTitle>Editing state:</ItemTitle> <InlineCode>Builder</InlineCode>{' '}
        also exposes history-related state such as{' '}
        <InlineCode>canUndo</InlineCode> and <InlineCode>canRedo</InlineCode>{' '}
        through <InlineCode>onStateChange</InlineCode>.
      </li>
      <li>
        <ItemTitle>Imperative control:</ItemTitle>{' '}
        <InlineCode>useBuilderRef</InlineCode> and{' '}
        <InlineCode>IBuilderRef</InlineCode> expose builder actions through a
        React ref.
      </li>
      <li>
        <ItemTitle>Customization:</ItemTitle>{' '}
        <InlineCode>Components</InlineCode>, <InlineCode>Adapters</InlineCode>,
        and <InlineCode>Theming</InlineCode>, including packaged adapters for
        MUI, ANTD, Bootstrap, Mantine, Fluent UI, and Radix.
      </li>
      <li>
        <ItemTitle>Query Conversion:</ItemTitle>{' '}
        <InlineCode>formatQuery</InlineCode> and{' '}
        <InlineCode>parseQuery</InlineCode>.
      </li>
    </List>
    <AlertBox title="Documentation and demo" variant="info">
      Use <TextLink to="/documentation">Documentation</TextLink> for setup,
      usage, and format walkthroughs. Use <TextLink to="/demo">Demo</TextLink>{' '}
      for the live sandbox. Use API pages for exact signatures, props, and
      option meanings.
    </AlertBox>
  </>
);
