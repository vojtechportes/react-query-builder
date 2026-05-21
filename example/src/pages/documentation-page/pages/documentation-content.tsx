import * as React from 'react';
import { AlertBox } from '../../../components/alert-box';
import { CodeBlock } from '../../../components/code-block';
import {
  InlineCode,
  List,
  SectionTitle,
  TextLink,
} from '../../../components/docs-primitives';

export interface IDocumentationPage {
  path: string;
  title: string;
  sectionKey: string;
  sectionTitle: string;
  summary: string;
  description: string;
  searchText: string;
  content: React.ReactNode;
}

export interface IDocumentationGroup {
  key: string;
  title: string;
  pages: IDocumentationPage[];
}

const installationSnippet = `npm install @vojtechportes/react-query-builder`;

const basicUsageSnippet = `import React, { useState } from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

const fields: IBuilderFieldProps[] = [
  {
    field: 'STATE',
    label: 'State',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL'],
    value: [
      { value: 'CZ', label: 'Czech Republic' },
      { value: 'SK', label: 'Slovakia' },
    ],
  },
  {
    field: 'IS_IN_EU',
    label: 'Is in EU',
    type: 'BOOLEAN',
  },
];

const initialData: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'STATE',
        operator: 'EQUAL',
        value: 'CZ',
        readOnly: true,
      },
      {
        field: 'IS_IN_EU',
        operator: 'EQUAL',
        value: true,
      },
    ],
  },
];

export const MyBuilder = () => {
  const [data, setData] = useState(initialData);

  return <Builder fields={fields} data={data} onChange={setData} />;
};`;

const sqlSnippet = `import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const sql = formatQuery(data, 'SQL', {
  fields,
  wrapWhereClause: true,
});

// WHERE (CUSTOMER_COUNTRY = 'CZ' AND ORDER_TOTAL BETWEEN 1000 AND 5000)`;

const parseSnippet = `import { parseQuery } from '@vojtechportes/react-query-builder/parseQuery';

const result = parseQuery(
  "WHERE CUSTOMER_COUNTRY = 'CZ' AND ORDER_TOTAL >= 1000",
  'SQL'
);

console.log(result.fields);
console.log(result.data);`;

const themeSnippet = `import { ThemeProvider } from '@vojtechportes/react-query-builder/theme-provider';
import { colors } from '@vojtechportes/react-query-builder';

<ThemeProvider
  colors={{
    ...colors,
    primary: {
      ...colors.primary,
      default: '#3f51b5',
    },
  }}
>
  <Builder data={data} fields={fields} onChange={setData} />
</ThemeProvider>;`;

const componentsSnippet = `const components = {
  Add: MyAddButton,
  Remove: MyRemoveButton,
  form: {
    Input: MyInput,
    Select: MySelect,
  },
};

<Builder
  data={data}
  fields={fields}
  components={components}
  onChange={setData}
/>;`;

const validationSnippet = `const fields: IBuilderFieldProps[] = [
  {
    field: 'COMPANY_NAME',
    label: 'Company name',
    type: 'TEXT',
    operators: ['EQUAL', 'CONTAINS'],
    validation: {
      common: {
        required: true,
      },
      rules: [
        {
          operators: ['EQUAL', 'CONTAINS'],
          minLength: 2,
          maxLength: 50,
        },
      ],
    },
  },
  {
    field: 'ORDER_TOTAL',
    label: 'Order total',
    type: 'NUMBER',
    operators: ['EQUAL', 'BETWEEN'],
    validation: {
      common: {
        required: true,
      },
      rules: [
        {
          operators: ['EQUAL'],
          min: 0,
          max: 100000,
        },
        {
          operators: ['BETWEEN'],
          range: {
            common: {
              min: 0,
            },
            requireAscending: true,
            allowEqual: false,
          },
        },
      ],
    },
  },
];

<Builder
  fields={fields}
  data={data}
  showValidation
  onStateChange={state => {
    console.log(state.isValid);
    console.log(state.validation);
  }}
  onChange={setData}
/>;`;

const builderBehaviorSnippet = `<Builder
  fields={fields}
  data={data}
  lockable
  draggable
  singleRootGroup={false}
  groupTypes="both"
  onChange={setData}
/>;

// lockable:
// Renders built-in lock controls for rules and groups and writes the resulting
// lock state back into the emitted query via rule/group readOnly values.
//
// draggable:
// Enables drag-and-drop for editable rules and groups.
//
// singleRootGroup={false}:
// Allows multiple root-level nodes instead of wrapping everything into one root group.
//
// groupTypes="both":
// Lets users choose between groups with AND/OR/NOT controls and groups without modifiers.`;

const lockingSnippet = `const data: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'STATUS',
        operator: 'EQUAL',
        value: 'ACTIVE',
        readOnly: true,
      },
      {
        type: 'GROUP',
        value: 'OR',
        isNegated: false,
        readOnly: true,
        children: [
          {
            field: 'COUNTRY',
            operator: 'EQUAL',
            value: 'CZ',
          },
        ],
      },
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        readOnly: {
          enabled: true,
          inheritToChildren: true,
        },
        children: [
          {
            field: 'IS_VAT_PAYER',
            operator: 'EQUAL',
            value: true,
          },
        ],
      },
    ],
  },
];

<Builder fields={fields} data={data} onChange={setData} />;`;

const lockingGuiSnippet = `<Builder
  fields={fields}
  data={data}
  lockable
  onChange={setData}
/>;

// Rules cycle through:
// unlocked -> locked
//
// Groups cycle through:
// unlocked -> locked group only -> locked group and descendants
//
// The emitted query stores those states in readOnly:
// rule: readOnly: true
// group: readOnly: true
// group + descendants: readOnly: { enabled: true, inheritToChildren: true }`;

const lockToggleSnippet = `const components = {
  LockToggle: MyLockToggle,
};

<Builder
  fields={fields}
  data={data}
  lockable
  components={components}
  onChange={setData}
/>;

// LockToggle receives:
// state: 'unlocked' | 'self' | 'all'
// nodeType: 'rule' | 'group'
// disabled?: boolean
// onChange?: (nextState) => void`;

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

const localizationSnippet = `const fields: IBuilderFieldProps[] = [
  {
    field: 'STATE',
    label: 'Stav',
    type: 'LIST',
    operators: ['EQUAL'],
    value: [{ value: 'CZ', label: 'Ceska republika' }],
  },
];`;

export const documentationPages: IDocumentationPage[] = [
  {
    path: '/documentation',
    title: 'Documentation Overview',
    sectionKey: 'overview',
    sectionTitle: 'Documentation',
    summary: '',
    description:
      'Documentation overview for installation, usage, parsing and formatting, customization, and localization.',
    searchText:
      'Documentation overview installation usage parsing formatting configuration theming localization demo query builder react library website',
    content: (
      <>
        <List>
          <li>Start with installation and the first controlled builder example.</li>
          <li>Move to parsing and formatting when you need interoperability with external query syntaxes.</li>
          <li>
            Use the <TextLink to="/api">API reference</TextLink> when you need
            prop, data-shape, or export-level details.
          </li>
        </List>
        <AlertBox title="Recommended path" variant="tip">
          If you are evaluating the library, visit the <TextLink to="/demo">Demo</TextLink>{' '}
          first and then continue with <TextLink to="/documentation/usage">Usage</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/documentation/installation',
    title: 'Installation',
    sectionKey: 'getting-started',
    sectionTitle: 'Getting Started',
    summary: '',
    description:
      'Package installation details for React Query Builder and React version requirements.',
    searchText:
      'Installation npm install React Query Builder react 18 peer dependencies package import library',
    content: (
      <>
        <p>Install the package and use it with React <InlineCode>18+</InlineCode>.</p>
        <CodeBlock code={installationSnippet} language="bash" label="npm" />
        <AlertBox title="Peer dependencies" variant="info">
          The package expects compatible <InlineCode>react</InlineCode> and{' '}
          <InlineCode>react-dom</InlineCode> versions in the consuming app. In
          monorepos, it is worth checking that your app and the library resolve
          to the same React instance.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/documentation/usage',
    title: 'Usage',
    sectionKey: 'getting-started',
    sectionTitle: 'Getting Started',
    summary: '',
    description:
      'Basic controlled usage with Builder, field definitions, query data, and onChange handling.',
    searchText:
      'Usage Builder controlled component fields data onChange React useState denormalized query query builder example',
    content: (
      <>
        <p>Basic controlled usage.</p>
        <CodeBlock code={basicUsageSnippet} language="tsx" label="Basic setup" />
        <p>
          The example includes a single rule with <InlineCode>readOnly: true</InlineCode>{' '}
          to show that locking can live directly in the query data without changing
          the rest of the builder configuration.
        </p>
        <AlertBox title="API reference" variant="info">
          <TextLink to="/api/builder">Builder</TextLink>,{' '}
          <TextLink to="/api/fields">Fields</TextLink>, and{' '}
          <TextLink to="/api/data">Data</TextLink>.
        </AlertBox>
        <AlertBox title="Next step" variant="tip">
          Continue with{' '}
          <TextLink to="/documentation/builder-behavior">Builder Behavior</TextLink>{' '}
          for editing model choices, or{' '}
          <TextLink to="/documentation/locking-and-read-only">Locking and Read-only</TextLink>{' '}
          for partial locking.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/documentation/validation',
    title: 'Validation',
    sectionKey: 'getting-started',
    sectionTitle: 'Getting Started',
    summary: '',
    description:
      'Built-in validation for fields and rules, validation rendering with showValidation, and custom validator integration.',
    searchText:
      'Validation built-in validation validator showValidation onStateChange required minLength maxLength minItems maxItems range validation rules fields builder',
    content: (
      <>
        <p>
          Built-in validation is defined in <TextLink to="/api/fields">field metadata</TextLink>{' '}
          and evaluated by <TextLink to="/api/builder">Builder</TextLink>.
        </p>
        <List>
          <li>Use <InlineCode>validation.common</InlineCode> for operator-agnostic rules such as required values.</li>
          <li>Use <InlineCode>validation.rules</InlineCode> for operator-specific rules.</li>
          <li>Use <InlineCode>showValidation</InlineCode> to render built-in validation messages in the UI.</li>
          <li>Use <InlineCode>onStateChange</InlineCode> when query data and validation state need to be read together.</li>
        </List>
        <CodeBlock code={validationSnippet} language="tsx" label="Built-in validation" />
        <SectionTitle>Built-in rule types</SectionTitle>
        <List>
          <li>Text fields support rules such as <InlineCode>minLength</InlineCode> and <InlineCode>maxLength</InlineCode>.</li>
          <li>Number and date fields support boundary rules such as <InlineCode>min</InlineCode>, <InlineCode>max</InlineCode>, <InlineCode>minDate</InlineCode>, and <InlineCode>maxDate</InlineCode>.</li>
          <li>List and multi-list fields support item-count constraints such as <InlineCode>minItems</InlineCode> and <InlineCode>maxItems</InlineCode>.</li>
          <li>Range operators such as <InlineCode>BETWEEN</InlineCode> can use <InlineCode>range</InlineCode> validation to validate both values together.</li>
        </List>
        <AlertBox title="Custom validator" variant="info">
          Use <InlineCode>validator</InlineCode> when validation depends on
          multiple rules, external state, or rules that are not expressible in
          field-level validation config.
        </AlertBox>
        <AlertBox title="API reference" variant="info">
          <TextLink to="/api/builder">Builder</TextLink> and{' '}
          <TextLink to="/api/fields">Fields</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/documentation/builder-behavior',
    title: 'Builder Behavior',
    sectionKey: 'getting-started',
    sectionTitle: 'Getting Started',
    summary: '',
    description:
      'Documentation for drag-and-drop, root-group behavior, and group mode configuration.',
    searchText:
      'builder behavior draggable drag and drop singleRootGroup groupTypes with modifiers without modifiers both root group',
    content: (
      <>
        <p>
          A few builder props shape the overall editing model more than the
          field or query data itself. These are worth deciding early because
          they affect how users add, move, and organize rules.
        </p>
        <CodeBlock code={builderBehaviorSnippet} language="tsx" label="Builder behavior" />
        <SectionTitle>draggable</SectionTitle>
        <List>
          <li>Use <InlineCode>lockable</InlineCode> to expose lock controls directly in the UI.</li>
          <li>Enables drag-and-drop reordering and movement for editable rules and groups.</li>
          <li>Read-only rules and groups are excluded from dragging.</li>
          <li>When the entire builder is read-only, drag-and-drop is disabled as well.</li>
          <li>Empty groups expose a dedicated drop zone so items can be moved into them.</li>
        </List>
        <SectionTitle>singleRootGroup</SectionTitle>
        <List>
          <li>
            Defaults to <InlineCode>true</InlineCode>, which means the builder
            maintains a single root group around the visible tree.
          </li>
          <li>
            The root group cannot be deleted while <InlineCode>singleRootGroup</InlineCode>{' '}
            is enabled.
          </li>
          <li>
            Set it to <InlineCode>false</InlineCode> when your application
            wants multiple top-level nodes instead of one wrapped root group.
          </li>
        </List>
        <SectionTitle>groupTypes</SectionTitle>
        <List>
          <li>
            <InlineCode>with-modifiers</InlineCode> shows group controls such as{' '}
            <InlineCode>AND</InlineCode>, <InlineCode>OR</InlineCode>, and negation.
          </li>
          <li>
            <InlineCode>without-modifiers</InlineCode> creates structural groups
            that do not render combinator or negation controls.
          </li>
          <li>
            <InlineCode>both</InlineCode> lets users choose which group kind to
            insert when adding a new group.
          </li>
        </List>
        <AlertBox title="Related docs" variant="info">
          <TextLink to="/documentation/locking-and-read-only">Locking and Read-only</TextLink>{' '}
          and <TextLink to="/api/builder">Builder</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/documentation/locking-and-read-only',
    title: 'Locking and Read-only',
    sectionKey: 'getting-started',
    sectionTitle: 'Getting Started',
    summary: '',
    description:
      'Documentation for builder-level, rule-level, and group-level read-only behavior, including group inheritance semantics.',
    searchText:
      'readOnly locking locked rule group inheritToChildren inheritance read only builder rule group drag delete add controls',
    content: (
      <>
        <p>
          Locking can be applied at the builder, rule, or group level. The key
          distinction is that rules lock only themselves, while groups can lock
          either just their own controls or their entire subtree.
        </p>
        <SectionTitle>GUI Locking</SectionTitle>
        <p>
          Set <InlineCode>lockable</InlineCode> on <TextLink to="/api/builder">Builder</TextLink>{' '}
          to render lock controls directly in the UI. The built-in controls update
          the same <InlineCode>readOnly</InlineCode> fields that are already part of
          the query data model, so the resulting lock state is preserved in output.
        </p>
        <CodeBlock code={lockingGuiSnippet} language="tsx" label="GUI locking" />
        <List>
          <li>Rules cycle through two states: unlocked and locked.</li>
          <li>Groups cycle through three states: unlocked, locked group only, and locked group with descendants.</li>
          <li>The default group cycle maps to <InlineCode>false</InlineCode>, <InlineCode>true</InlineCode>, and <InlineCode>{`{ enabled: true, inheritToChildren: true }`}</InlineCode>.</li>
          <li>When a parent group inherits a lock to descendants, child lock controls render disabled because descendants cannot override that inherited state.</li>
        </List>
        <SectionTitle>How each level behaves</SectionTitle>
        <List>
          <li>
            <InlineCode>{'<Builder readOnly />'}</InlineCode> locks the entire
            builder. No rules or groups remain editable.
          </li>
          <li>
            <InlineCode>rule.readOnly = true</InlineCode> locks only that rule.
            Siblings and parent groups are unaffected.
          </li>
          <li>
            <InlineCode>group.readOnly = true</InlineCode> locks only that
            group&apos;s own controls. Its child rules and child groups stay
            editable by default.
          </li>
          <li>
            <InlineCode>{`group.readOnly = { enabled: true, inheritToChildren: true }`}</InlineCode>{' '}
            locks the group and all descendant rules and groups.
          </li>
        </List>
        <CodeBlock code={lockingSnippet} language="tsx" label="Locking examples" />
        <SectionTitle>Custom Lock Control</SectionTitle>
        <p>
          The default lock button can be replaced through{' '}
          <InlineCode>components.LockToggle</InlineCode>.
        </p>
        <CodeBlock code={lockToggleSnippet} language="tsx" label="LockToggle override" />
        <SectionTitle>What &quot;locked&quot; means in the UI</SectionTitle>
        <List>
          <li>Locked rules cannot change field, operator, or value, and cannot be deleted.</li>
          <li>Locked groups cannot change their group operator, negation, add actions, or delete action.</li>
          <li>Locked rules and groups are removed from drag-and-drop interactions.</li>
          <li>
            A locked group without inheritance still renders editable descendants
            when those descendants are not otherwise locked.
          </li>
        </List>
        <SectionTitle>Inheritance and precedence</SectionTitle>
        <List>
          <li>Inheritance only applies to groups, never to rules.</li>
          <li>
            <InlineCode>inheritToChildren</InlineCode> has an effect only when{' '}
            <InlineCode>enabled</InlineCode> is <InlineCode>true</InlineCode>.
          </li>
          <li>
            Once a parent group inherits read-only to descendants, child nodes
            cannot opt back into editability with <InlineCode>readOnly: false</InlineCode>.
          </li>
          <li>
            Descendants may still add their own local <InlineCode>readOnly</InlineCode>{' '}
            flags, but they cannot override an inherited lock from an ancestor.
          </li>
        </List>
        <AlertBox title="API reference" variant="info">
          <TextLink to="/api/builder">Builder</TextLink> and{' '}
          <TextLink to="/api/data">Data</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/documentation/parsing-and-formatting',
    title: 'Overview',
    sectionKey: 'parsing',
    sectionTitle: 'Parsing and Formatting',
    summary: '',
    description:
      'Overview of parsing and formatting query data across supported external formats.',
    searchText:
      'Parsing formatting SQL Mongo AQL JSONata JsonLogic CEL Elasticsearch SpEL Prisma OData RSQL Dynamo Django parseQuery formatQuery interoperability sandbox',
    content: (
      <>
        <p>
          Query data can be converted to and from supported external formats.
        </p>
        <List>
          <li>
            <TextLink to="/api/format-query">formatQuery</TextLink> converts
            builder state to a target syntax.
          </li>
          <li>
            <TextLink to="/api/parse-query">parseQuery</TextLink> converts
            supported syntaxes back into builder state.
          </li>
          <li>The documentation sandbox on this page lets you experiment with every supported format live.</li>
        </List>
        <CodeBlock code={sqlSnippet} language="ts" label="Formatting to SQL" />
        <CodeBlock code={parseSnippet} language="ts" label="Parsing from SQL" />
        <AlertBox title="Round-tripping" variant="info">
          Some formats are more expressive than others. A round-trip is best when
          the source expression stays within the subset that maps cleanly to the
          builder model.
        </AlertBox>
        <AlertBox title="API reference" variant="info">
          <TextLink to="/api/format-query">formatQuery</TextLink> and{' '}
          <TextLink to="/api/parse-query">parseQuery</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/documentation/parsing-and-formatting/supported-formats',
    title: 'Supported Formats',
    sectionKey: 'parsing',
    sectionTitle: 'Parsing and Formatting',
    summary: '',
    description:
      'Supported query conversion formats including SQL, Mongo, AQL, JSONata, JsonLogic, CEL, Elasticsearch, SpEL, Prisma, OData, RSQL, Dynamo, and Django.',
    searchText:
      'SQL Mongo AQL JSONata JsonLogic CEL Elasticsearch SpEL Prisma OData RSQL Dynamo Django supported formats parser formatter query builder',
    content: (
      <>
        <p>
          Supported formats and their primary use cases.
        </p>
        <SectionTitle>SQL</SectionTitle>
        <p>Formatting and predicate parsing for builder-compatible SQL expressions.</p>
        <CodeBlock code={sqlSnippet} language="ts" label="SQL formatter" />
        <AlertBox title="Parsing scope" variant="warning">
          SQL support is aimed at builder-compatible predicates. It is not meant
          to be a full SQL parser for arbitrary queries with joins, projections,
          or nested subqueries.
        </AlertBox>
        <SectionTitle>Mongo</SectionTitle>
        <p>
          Formatting returns a serialized JSON filter document. Parsing expects
          a JSON object string and can infer <TextLink to="/api/fields">fields</TextLink>{' '}
          from the document shape.
        </p>
        <CodeBlock
          code={`const mongo = formatQuery(data, 'Mongo');\n// { "$and": [ ... ] }`}
          language="ts"
          label="Mongo formatter"
        />
        <AlertBox title="Field inference" variant="tip">
          Mongo parsing can infer field names and basic types from the filter
          document.
        </AlertBox>
        <SectionTitle>AQL</SectionTitle>
        <List>
          <li>ArangoDB-style filter expressions with optional filter-clause wrapping and configurable variable names.</li>
        </List>
        <SectionTitle>JSONata and JsonLogic</SectionTitle>
        <List>
          <li>JSON-oriented expression formats for rules evaluated against object-shaped data.</li>
        </List>
        <SectionTitle>CEL and SpEL</SectionTitle>
        <List>
          <li>Expression languages used in application and policy evaluation environments.</li>
        </List>
        <SectionTitle>Prisma and Django</SectionTitle>
        <List>
          <li>Framework-oriented filter output for backend query layers.</li>
        </List>
        <SectionTitle>OData, RSQL, Dynamo, and Elasticsearch</SectionTitle>
        <List>
          <li>API and datastore integrations with format-specific output conventions.</li>
        </List>
        <AlertBox title="API reference" variant="info">
          <TextLink to="/api/format-query">formatQuery</TextLink> and{' '}
          <TextLink to="/api/parse-query">parseQuery</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/documentation/components',
    title: 'Components',
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'Documentation for replacing built-in builder controls and containers with custom components.',
    searchText:
      'Components component overrides custom controls custom renderers builder customization add remove select input group rule responsive responsiveness compact layout multiselect summary',
    content: (
      <>
        <p>
          Replace built-in controls and containers through the{' '}
          <InlineCode>components</InlineCode> prop.
        </p>
        <CodeBlock code={componentsSnippet} language="tsx" label="Component overrides" />
        <SectionTitle>Override contracts</SectionTitle>
        <List>
          <li>
            Form controls should behave like controlled inputs. They receive the
            current value plus change handlers and disabled state.
          </li>
          <li>
            <InlineCode>Rule</InlineCode> and <InlineCode>Group</InlineCode> are
            layout containers. They receive already-prepared children and
            control regions rather than raw builder state.
          </li>
          <li>
            <InlineCode>DropZone</InlineCode> and <InlineCode>EmptyGroupDropZone</InlineCode>{' '}
            are drag-and-drop render hooks. They receive ids, indices, parent
            ids, drag state, and active state.
          </li>
          <li>
            Button-like overrides such as <InlineCode>Add</InlineCode>,{' '}
            <InlineCode>Remove</InlineCode>, <InlineCode>Popover</InlineCode>,
            and <InlineCode>PopoverItem</InlineCode> should preserve click
            semantics and remain accessible.
          </li>
        </List>
        <SectionTitle>Responsive behavior</SectionTitle>
        <List>
          <li>
            The built-in <InlineCode>Rule</InlineCode> and <InlineCode>Group</InlineCode>{' '}
            components include a compact responsive layout for medium-width screens.
          </li>
          <li>
            Multi-select controls use a summarized closed state so selected
            values do not overflow the available rule width.
          </li>
          <li>
            Responsive behavior is automatic when you use the default
            components.
          </li>
          <li>
            If you replace <InlineCode>components.Rule</InlineCode> or{' '}
            <InlineCode>components.Group</InlineCode>, your custom layout is
            responsible for its own responsive behavior.
          </li>
        </List>
        <AlertBox title="API reference" variant="info">
          <TextLink to="/api/components">Components</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/documentation/theming',
    title: 'Theming',
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'Documentation for customizing builder colors with ThemeProvider and shared theme tokens.',
    searchText:
      'Theming theme provider colors primary secondary grey tokens design system',
    content: (
      <>
        <p>
          Use the theme provider to override builder color tokens. For control
          and container replacement, see <TextLink to="/documentation/components">Components</TextLink>.
        </p>
        <CodeBlock code={themeSnippet} language="tsx" label="Theme provider" />
        <AlertBox title="API reference" variant="info">
          <TextLink to="/api/theming">Theming</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
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
        <CodeBlock code={localizationSnippet} language="ts" label="Localized fields" />
        <SectionTitle>Built-in UI strings</SectionTitle>
        <p>
          The exported <InlineCode>strings</InlineCode> object can be used as a
          base for selective overrides of built-in copy.
        </p>
        <CodeBlock code={stringsSnippet} language="tsx" label="Custom UI strings" />
        <List>
          <li><InlineCode>group</InlineCode> covers labels such as add, delete, and group mode choices.</li>
          <li><InlineCode>rule</InlineCode> covers rule-level action labels.</li>
          <li><InlineCode>operators</InlineCode> lets you rename operator captions shown in selectors.</li>
          <li><InlineCode>validation</InlineCode> customizes built-in validation messages.</li>
        </List>
        <AlertBox title="API reference" variant="info">
          <TextLink to="/api/builder">Builder</TextLink>.
        </AlertBox>
      </>
    ),
  },
];

export const documentationGroups: IDocumentationGroup[] = [
  {
    key: 'getting-started',
    title: 'Getting Started',
    pages: documentationPages.filter(page => page.sectionKey === 'getting-started'),
  },
  {
    key: 'parsing',
    title: 'Parsing and Formatting',
    pages: documentationPages.filter(page => page.sectionKey === 'parsing'),
  },
  {
    key: 'customization',
    title: 'Customization',
    pages: documentationPages.filter(page => page.sectionKey === 'customization'),
  },
  {
    key: 'single-localization',
    title: 'Localization',
    pages: documentationPages.filter(page => page.sectionKey === 'single-localization'),
  },
];

export const findDocumentationPage = (pathname: string) =>
  documentationPages.find(page => page.path === pathname) ?? documentationPages[0];

export const documentationOverviewPage = documentationPages[0];
