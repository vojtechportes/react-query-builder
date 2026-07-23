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
import type { IDocumentationPage } from '../types/documentation-page';

const textModeSnippet = `import React, { useState } from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

const fields: IBuilderFieldProps[] = [
  {
    field: 'CUSTOMER_COUNTRY',
    label: 'Customer country',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL'],
    value: [
      { value: 'CZ', label: 'Czech Republic' },
      { value: 'SK', label: 'Slovakia' },
    ],
  },
  {
    field: 'ORDER_TOTAL',
    label: 'Order total',
    type: 'NUMBER',
    operators: ['LARGER_EQUAL', 'BETWEEN'],
  },
];

export const TextModeBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Builder
      fields={fields}
      data={data}
      textMode
      onChange={setData}
    />
  );
};`;

const textModeDefaultModeSnippet = `<Builder
  fields={fields}
  data={data}
  textMode
  defaultMode="text"
  onChange={setData}
/>;

// defaultMode only takes effect when textMode is enabled.`;

const textModeConfigSnippet = `<Builder
  fields={fields}
  data={data}
  textMode={{
    format: 'SQL',
    defaultMode: 'builder',
  }}
  defaultMode="text"
  onChange={setData}
/>;

// textMode can be either:
// - true
// - { format?: 'SQL'; defaultMode?: 'builder' | 'text' }
//
// If both are provided, the top-level defaultMode prop wins.`;

const monacoInstallSnippet = `npm install monaco-editor`;

const monacoTextModeSnippet = `import React, { useState } from 'react';
import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import { createMonacoComponents } from '@vojtechportes/react-query-builder/monaco';

const components = createMonacoComponents({});

export const MonacoTextModeBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Builder
      fields={fields}
      data={data}
      textMode
      defaultMode="text"
      components={components}
      onChange={setData}
    />
  );
};`;

const monacoWithMuiSnippet = `import { Builder } from '@vojtechportes/react-query-builder';
import { components as muiComponents } from '@vojtechportes/react-query-builder/mui/v9';
import { createMonacoComponents } from '@vojtechportes/react-query-builder/monaco';

const components = createMonacoComponents(muiComponents);

<Builder
  fields={fields}
  data={data}
  textMode
  components={components}
  onChange={setData}
/>;

// The same pattern works with @vojtechportes/react-query-builder/antd/v6.`;

const monacoWithAntdSnippet = `import { Builder } from '@vojtechportes/react-query-builder';
import { components as antdComponents } from '@vojtechportes/react-query-builder/antd/v6';
import { createMonacoComponents } from '@vojtechportes/react-query-builder/monaco';

const components = createMonacoComponents(antdComponents);

<Builder
  fields={fields}
  data={data}
  textMode
  components={components}
  onChange={setData}
/>;`;

const textModeStringsSnippet = `import { strings } from '@vojtechportes/react-query-builder';

<Builder
  fields={fields}
  data={data}
  textMode
  strings={{
    ...strings,
    textMode: {
      ...strings.textMode,
      toggleToText: 'Switch to SQL mode',
      toggleToBuilder: 'Switch to visual builder',
      syntaxError: 'SQL syntax error',
      locksUnsupported: 'Locked rules and groups are not supported in this text editor mode.',
      lockedRangesHover: 'This SQL fragment is locked and cannot be edited.',
    },
  }}
  onChange={setData}
/>;`;

export const textModeDocumentationPage: IDocumentationPage = {
  path: '/documentation/text-mode',
  title: 'Text Mode',
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for SQL text mode, syntax and semantic validation, default mode selection, and the optional Monaco text editor integration.',
  searchText:
    'Text mode SQL text editor monaco createMonacoComponents syntax highlighting syntax validation semantic validation locked rules locked groups defaultMode singleRootGroup',
  content: (
    <>
      <p>
        Text mode lets the builder switch between the visual query UI and a SQL
        editor view of the same query.
      </p>
      <CodeBlock
        code={textModeSnippet}
        language="tsx"
        label="Enable built-in text mode"
      />
      <SectionTitle>Current scope</SectionTitle>
      <List>
        <li>Text mode currently uses SQL as the editable text format.</li>
        <li>
          It requires <InlineCode>singleRootGroup</InlineCode> to stay enabled.
          If <InlineCode>singleRootGroup</InlineCode> is{' '}
          <InlineCode>false</InlineCode>, text mode is unavailable and the
          builder stays in visual mode.
        </li>
        <li>
          When text mode is enabled, modifierless groups are normalized to{' '}
          <InlineCode>AND</InlineCode> groups so the query can round-trip
          through SQL.
        </li>
      </List>
      <SectionTitle>Opening mode</SectionTitle>
      <p>
        Use <InlineCode>defaultMode</InlineCode> to choose whether the builder
        opens in the visual builder or in text mode.
      </p>
      <CodeBlock
        code={textModeDefaultModeSnippet}
        language="tsx"
        label="Open directly in text mode"
      />
      <CodeBlock
        code={textModeConfigSnippet}
        language="tsx"
        label="Explicit textMode config"
      />
      <SectionTitle>Validation</SectionTitle>
      <List>
        <li>
          Missing brackets, quotes, commas, and other SQL syntax mistakes are
          highlighted directly in the editor.
        </li>
        <li>Unknown fields are highlighted on the field token.</li>
        <li>
          Unsupported operators for a field are highlighted on the operator
          token.
        </li>
        <li>
          Invalid <InlineCode>LIST</InlineCode> values are highlighted on the
          invalid value token.
        </li>
        <li>
          Invalid <InlineCode>MULTI_LIST</InlineCode> values are highlighted on
          the invalid value token.
        </li>
        <li>
          Read-only negation changes are rejected after parsing and shown as
          below-editor semantic errors.
        </li>
      </List>
      <SectionTitle>Invalid text behavior</SectionTitle>
      <List>
        <li>
          Invalid text stays local to the text editor until the SQL becomes
          valid again.
        </li>
        <li>
          The last valid builder query is preserved while the user is fixing
          text-mode errors.
        </li>
        <li>
          <InlineCode>onChange</InlineCode> is fired only after a valid parse
          and successful semantic validation.
        </li>
      </List>
      <SectionTitle>History behavior</SectionTitle>
      <List>
        <li>
          Valid text edits are committed into builder history, so they can be
          undone and redone.
        </li>
        <li>
          Invalid intermediate text is not committed into builder state or
          history.
        </li>
      </List>
      <SectionTitle>Choosing an editor</SectionTitle>
      <List>
        <li>
          <ItemTitle>Choose the built-in editor:</ItemTitle> when you want
          lightweight SQL editing, built-in validation, and no extra
          dependencies.
        </li>
        <li>
          <ItemTitle>Choose Monaco:</ItemTitle> when locked or targeted
          read-only query segments must stay protected in text mode, or when you
          want a more advanced editor experience.
        </li>
      </List>
      <SectionTitle>Built-in editor vs Monaco</SectionTitle>
      <List>
        <li>
          <ItemTitle>Built-in text mode:</ItemTitle> Included in the core
          package, uses the default <InlineCode>TextModeEditor</InlineCode>, and
          supports SQL formatting, syntax highlighting, syntax validation, and
          semantic validation without extra dependencies.
        </li>
        <li>
          <ItemTitle>Built-in editor limitation:</ItemTitle> Locked rules,
          locked groups, and targeted read-only queries are blocked before
          entering text mode there, because the basic editor cannot preserve
          protected query segments safely after freeform text edits.
        </li>
        <li>
          <ItemTitle>Monaco text mode:</ItemTitle> Optional advanced editor
          integration exposed from{' '}
          <InlineCode>@vojtechportes/react-query-builder/monaco</InlineCode>. It
          preserves locked and targeted read-only query segments by rendering
          them as protected ranges.
        </li>
        <li>
          <ItemTitle>Monaco protected behavior:</ItemTitle> Protected SQL
          fragments are dimmed, protected from edits, and expose their lock
          explanation on hover.
        </li>
        <li>
          <ItemTitle>Localized read-only protection:</ItemTitle> Rule field,
          operator, and value segments can be protected inline, while read-only
          negation is additionally enforced semantically and reported below the
          editor when changed.
        </li>
        <li>
          <ItemTitle>Group negation validation:</ItemTitle> When{' '}
          <InlineCode>allowGroupNegation={false}</InlineCode>, the text editor
          rejects group-level <InlineCode>NOT (...)</InlineCode> expressions and
          highlights the offending <InlineCode>NOT</InlineCode> token, while
          still allowing operator-level negation such as{' '}
          <InlineCode>NOT IN</InlineCode> or{' '}
          <InlineCode>IS NOT NULL</InlineCode>.
        </li>
        <li>
          <ItemTitle>Monaco packaging:</ItemTitle>{' '}
          <InlineCode>monaco-editor</InlineCode> is an optional peer dependency.
          Consumers only need to install it when they actually want the Monaco
          editor.
        </li>
      </List>
      <SectionTitle>Using Monaco text mode</SectionTitle>
      <CodeBlock
        code={monacoTextModeSnippet}
        language="tsx"
        label="Monaco text mode with default components"
      />
      <CodeBlock
        code={monacoWithMuiSnippet}
        language="tsx"
        label="Compose Monaco with MUI"
      />
      <CodeBlock
        code={monacoWithAntdSnippet}
        language="tsx"
        label="Compose Monaco with ANTD"
      />
      <SectionTitle>Text-mode strings</SectionTitle>
      <p>
        Text-mode labels and messages are part of the regular{' '}
        <InlineCode>strings</InlineCode> override surface.
      </p>
      <CodeBlock
        code={textModeStringsSnippet}
        language="tsx"
        label="Custom text-mode strings"
      />
      <List>
        <li>
          <InlineCode>strings.textMode.toggleToText</InlineCode> customizes the
          button label for entering text mode.
        </li>
        <li>
          <InlineCode>strings.textMode.toggleToBuilder</InlineCode> customizes
          the button label for returning to the visual builder.
        </li>
        <li>
          <InlineCode>strings.textMode.syntaxError</InlineCode> customizes the
          syntax error prefix.
        </li>
        <li>
          <InlineCode>strings.textMode.locksUnsupported</InlineCode> customizes
          the built-in alert shown when the basic editor cannot open a locked or
          targeted read-only query.
        </li>
        <li>
          <InlineCode>strings.textMode.lockedRangesHover</InlineCode> customizes
          the hover message shown for protected Monaco ranges.
        </li>
        <li>
          <InlineCode>strings.textMode.sql</InlineCode> customizes SQL parser
          and syntax-validation messages such as missing brackets, missing
          quotes, missing keywords, and unexpected tokens.
        </li>
      </List>
      <SectionTitle>Installing Monaco</SectionTitle>
      <CodeBlock
        code={monacoInstallSnippet}
        language="bash"
        label="Monaco peer dependency"
      />
      <AlertBox title="Locks and Monaco" variant="info">
        The built-in text editor blocks locked and targeted read-only queries.
        Monaco is the intended path when protected query segments need to remain
        editable only around their unlocked ranges.
      </AlertBox>
      <AlertBox title="API reference" variant="info">
        <TextLink to="/api/builder">Builder</TextLink> and{' '}
        <TextLink to="/api/components">Components</TextLink>.
      </AlertBox>
    </>
  ),
};
