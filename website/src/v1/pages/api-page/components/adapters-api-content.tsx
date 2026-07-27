import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
  TextLink,
} from '../../../../components/docs-primitives';

export const AdaptersApiContent: React.FC = () => (
  <>
    <SectionTitle>Available adapter entrypoints</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <TextLink to="/api/adapters/mui">MUI</TextLink>:
        </ItemTitle>{' '}
        Covers <InlineCode>mui/v9</InlineCode>, legacy{' '}
        <InlineCode>mui/v7</InlineCode>, and the MUI-specific merge helper.
      </li>
      <li>
        <ItemTitle>
          <TextLink to="/api/adapters/antd">ANTD</TextLink>:
        </ItemTitle>{' '}
        Covers <InlineCode>antd/v6</InlineCode>, legacy{' '}
        <InlineCode>antd/v5</InlineCode>, and the ANTD-specific merge helper.
      </li>
      <li>
        <ItemTitle>
          <TextLink to="/api/adapters/fluentui">Fluent UI</TextLink>:
        </ItemTitle>{' '}
        Covers <InlineCode>fluentui/v8</InlineCode> and the Fluent-UI-specific
        merge helper.
      </li>
      <li>
        <ItemTitle>
          <TextLink to="/api/adapters/mantine">Mantine</TextLink>:
        </ItemTitle>{' '}
        Covers <InlineCode>mantine/v9</InlineCode>, legacy{' '}
        <InlineCode>mantine/v8</InlineCode>, and the Mantine-specific merge
        helper.
      </li>
      <li>
        <ItemTitle>
          <TextLink to="/api/adapters/bootstrap">Bootstrap</TextLink>:
        </ItemTitle>{' '}
        Covers <InlineCode>bootstrap/v5</InlineCode> and the Bootstrap-specific
        merge helper.
      </li>
      <li>
        <ItemTitle>
          <TextLink to="/api/adapters/radix">Radix</TextLink>:
        </ItemTitle>{' '}
        Covers <InlineCode>radix/v1</InlineCode>, Radix Themes provider setup,
        and the Radix-specific merge helper.
      </li>
    </List>
    <SectionTitle>What adapters export</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>components</InlineCode>:
        </ItemTitle>{' '}
        A ready-to-pass object that matches{' '}
        <InlineCode>IBuilderComponentsProps</InlineCode>.
      </li>
      <li>
        <ItemTitle>Individual mapped components:</ItemTitle> Named exports such
        as <InlineCode>MuiSelect</InlineCode>,{' '}
        <InlineCode>AntdSelect</InlineCode>,{' '}
        <InlineCode>BootstrapSelect</InlineCode>,{' '}
        <InlineCode>MantineSelect</InlineCode>,{' '}
        <InlineCode>FluentUiSelect</InlineCode>, or{' '}
        <InlineCode>RadixSelect</InlineCode> for partial customization.
      </li>
      <li>
        <ItemTitle>Adapter merge helpers:</ItemTitle>{' '}
        <InlineCode>createMuiComponents</InlineCode>,{' '}
        <InlineCode>createAntdComponents</InlineCode>,{' '}
        <InlineCode>createBootstrapComponents</InlineCode>,{' '}
        <InlineCode>createMantineComponents</InlineCode>,{' '}
        <InlineCode>createFluentUiComponents</InlineCode>, and{' '}
        <InlineCode>createRadixComponents</InlineCode> merge adapter defaults
        with local overrides while preserving the nested{' '}
        <InlineCode>form</InlineCode> mapping.
      </li>
    </List>
    <SectionTitle>Relationship to the Components API</SectionTitle>
    <List>
      <li>
        Adapters are built on top of the same override surface documented in{' '}
        <TextLink to="/api/components">Components</TextLink>.
      </li>
      <li>They are a convenience layer, not a separate rendering engine.</li>
      <li>
        Each <InlineCode>create*Components(base, overrides)</InlineCode> helper
        returns a merged <InlineCode>IBuilderComponentsProps</InlineCode> object
        and handles shallow top-level merging plus nested{' '}
        <InlineCode>form</InlineCode> merging for you.
      </li>
    </List>
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/adapters">Adapters</TextLink>,{' '}
      <TextLink to="/documentation/components">Components</TextLink>, and{' '}
      <TextLink to="/api/theming">Theming</TextLink>.
    </AlertBox>
  </>
);
