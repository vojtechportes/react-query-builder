import * as React from 'react';
import { AlertBox } from '../../../../../../components/alert-box';
import { CodeBlock } from '../../../../../../components/code-block';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
  TextLink,
} from '../../../../../../components/docs-primitives';
import { textModeSnippet } from '../constants/text-mode-snippet';
import { textModeDefaultModeSnippet } from '../constants/text-mode-default-mode-snippet';
import { textModeConfigSnippet } from '../constants/text-mode-config-snippet';
import { monacoInstallSnippet } from '../constants/monaco-install-snippet';
import { monacoTextModeSnippet } from '../constants/monaco-text-mode-snippet';
import { monacoWithMuiSnippet } from '../constants/monaco-with-mui-snippet';
import { monacoWithAntdSnippet } from '../constants/monaco-with-antd-snippet';
import { textModeStringsSnippet } from '../constants/text-mode-strings-snippet';

export const TextModeDocumentationContent: React.FC = () => (
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
        It requires <InlineCode>singleRootGroup</InlineCode> to stay enabled. If{' '}
        <InlineCode>singleRootGroup</InlineCode> is{' '}
        <InlineCode>false</InlineCode>, text mode is unavailable and the builder
        stays in visual mode.
      </li>
      <li>
        When text mode is enabled, modifierless groups are normalized to{' '}
        <InlineCode>AND</InlineCode> groups so the query can round-trip through
        SQL.
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
        Unsupported operators for a field are highlighted on the operator token.
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
        Invalid text stays local to the text editor until the SQL becomes valid
        again.
      </li>
      <li>
        The last valid builder query is preserved while the user is fixing
        text-mode errors.
      </li>
      <li>
        <InlineCode>onChange</InlineCode> is fired only after a valid parse and
        successful semantic validation.
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
        lightweight SQL editing, built-in validation, and no extra dependencies.
      </li>
      <li>
        <ItemTitle>Choose Monaco:</ItemTitle> when locked or targeted read-only
        query segments must stay protected in text mode, or when you want a more
        advanced editor experience.
      </li>
    </List>
    <SectionTitle>Built-in editor vs Monaco</SectionTitle>
    <List>
      <li>
        <ItemTitle>Built-in text mode:</ItemTitle> Included in the core package,
        uses the default <InlineCode>TextModeEditor</InlineCode>, and supports
        SQL formatting, syntax highlighting, syntax validation, and semantic
        validation without extra dependencies.
      </li>
      <li>
        <ItemTitle>Built-in editor limitation:</ItemTitle> Locked rules, locked
        groups, and targeted read-only queries are blocked before entering text
        mode there, because the basic editor cannot preserve protected query
        segments safely after freeform text edits.
      </li>
      <li>
        <ItemTitle>Monaco text mode:</ItemTitle> Optional advanced editor
        integration exposed from{' '}
        <InlineCode>@vojtechportes/react-query-builder/monaco</InlineCode>. It
        preserves locked and targeted read-only query segments by rendering them
        as protected ranges.
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
        highlights the offending <InlineCode>NOT</InlineCode> token, while still
        allowing operator-level negation such as <InlineCode>NOT IN</InlineCode>{' '}
        or <InlineCode>IS NOT NULL</InlineCode>.
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
        <InlineCode>strings.textMode.toggleToBuilder</InlineCode> customizes the
        button label for returning to the visual builder.
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
        <InlineCode>strings.textMode.sql</InlineCode> customizes SQL parser and
        syntax-validation messages such as missing brackets, missing quotes,
        missing keywords, and unexpected tokens.
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
);
