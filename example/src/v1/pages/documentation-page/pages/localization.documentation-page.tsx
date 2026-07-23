import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import { CodeBlock } from '../../../../components/code-block';
import {
  InlineCode,
  List,
  SectionTitle,
  TextLink,
} from '../../../../components/docs-primitives';
import type { IDocumentationPage } from '../types/documentation-page';

const stringsSnippet = `import { strings } from '@vojtechportes/react-query-builder';

<Builder
  fields={fields}
  data={data}
  strings={{
    ...strings,
    group: {
      ...strings.group,
      addRule: 'Add filter',
      addGroup: 'Add condition group',
    },
    operators: {
      ...strings.operators,
      EQUAL: 'Is exactly',
      NOT_EQUAL: 'Is not',
    },
    validation: {
      ...strings.validation,
      required: 'Please provide a value',
    },
  }}
  onChange={setData}
/>;

// You can override only the keys you need.
// Unspecified labels fall back to the built-in defaults.`;

const firstPartyLocaleSnippet = `import { Builder } from '@vojtechportes/react-query-builder';
import { strings } from '@vojtechportes/react-query-builder/locale/fr-FR';

<Builder
  fields={fields}
  data={data}
  strings={strings}
  onChange={setData}
/>;`;

const localizationSnippet = `const fields: IBuilderFieldProps[] = [
  {
    field: 'STATE',
    label: 'Stav',
    type: 'LIST',
    operators: ['EQUAL'],
    value: [{ value: 'CZ', label: 'Ceska republika' }],
  },
];`;

export const localizationDocumentationPage: IDocumentationPage = {
  path: '/documentation/localization',
  title: 'Localization',
  sectionKey: 'single-localization',
  sectionTitle: 'Localization',
  summary: '',
  description:
    'Documentation for localizing field labels, option labels, and built-in UI strings.',
  searchText:
    'Localization localized labels fields translated copy internationalization i18n query builder',
  content: (
    <>
      <p>
        Localize field labels, option labels, and surrounding UI in the host
        application. Built-in action labels can be customized through{' '}
        <TextLink to="/api/builder">Builder</TextLink> via{' '}
        <InlineCode>strings</InlineCode>.
      </p>
      <CodeBlock
        code={localizationSnippet}
        language="ts"
        label="Localized fields"
      />
      <SectionTitle>Built-in UI strings</SectionTitle>
      <p>
        Locales can be imported from their subpaths and passed to the Builder
        through the <InlineCode>strings</InlineCode> prop.
      </p>
      <CodeBlock
        code={firstPartyLocaleSnippet}
        language="tsx"
        label="Built-in French translations"
      />
      <p>Supported locale subpaths:</p>
      <List>
        <li>
          <InlineCode>
            @vojtechportes/react-query-builder/locale/en-US
          </InlineCode>{' '}
          — English (United States)
        </li>
        <li>
          <InlineCode>
            @vojtechportes/react-query-builder/locale/fr-FR
          </InlineCode>{' '}
          — French (France)
        </li>
        <li>
          <InlineCode>
            @vojtechportes/react-query-builder/locale/it-IT
          </InlineCode>{' '}
          — Italian (Italy)
        </li>
        <li>
          <InlineCode>
            @vojtechportes/react-query-builder/locale/de-DE
          </InlineCode>{' '}
          — German (Germany)
        </li>
        <li>
          <InlineCode>
            @vojtechportes/react-query-builder/locale/es-ES
          </InlineCode>{' '}
          — Spanish (Spain)
        </li>
        <li>
          <InlineCode>
            @vojtechportes/react-query-builder/locale/pt-PT
          </InlineCode>{' '}
          — Portuguese (Portugal)
        </li>
        <li>
          <InlineCode>
            @vojtechportes/react-query-builder/locale/cs-CZ
          </InlineCode>{' '}
          — Czech (Czechia)
        </li>
        <li>
          <InlineCode>
            @vojtechportes/react-query-builder/locale/sk-SK
          </InlineCode>{' '}
          — Slovak (Slovakia)
        </li>
        <li>
          <InlineCode>
            @vojtechportes/react-query-builder/locale/zh-CN
          </InlineCode>{' '}
          — Simplified Chinese
        </li>
        <li>
          <InlineCode>
            @vojtechportes/react-query-builder/locale/zh-TW
          </InlineCode>{' '}
          — Traditional Chinese
        </li>
      </List>
      <p>
        The package-root <InlineCode>strings</InlineCode> import remains the
        backward-compatible English (<InlineCode>en-US</InlineCode>) form. Use
        it as a base when you only need selective overrides.
      </p>
      <CodeBlock
        code={stringsSnippet}
        language="tsx"
        label="Custom UI strings"
      />
      <List>
        <li>
          <InlineCode>group</InlineCode> covers labels such as add, delete, and
          group mode choices.
        </li>
        <li>
          <InlineCode>rule</InlineCode> covers rule-level action labels.
        </li>
        <li>
          <InlineCode>textMode</InlineCode> covers text-mode labels and messages
          such as the mode toggle, syntax error prefix, lock warning, and
          locked-range hover text.
        </li>
        <li>
          <InlineCode>textMode.sql</InlineCode> covers localized SQL parser and
          syntax-validation messages used by text mode.
        </li>
        <li>
          <InlineCode>operators</InlineCode> lets you rename operator captions
          shown in selectors.
        </li>
        <li>
          <InlineCode>validation</InlineCode> customizes built-in validation
          messages.
        </li>
      </List>
      <AlertBox title="API reference" variant="info">
        <TextLink to="/api/builder">Builder</TextLink>.
      </AlertBox>
    </>
  ),
};
