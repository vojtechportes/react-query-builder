import * as React from 'react';
import { AlertBox } from '../../../components/alert-box';
import { CodeBlock } from '../../../components/code-block';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
  TextLink,
} from '../../../components/docs-primitives';

export interface IDocumentationPage {
  path: string;
  title: string;
  depth?: number;
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

const muiSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import { components } from '@vojtechportes/react-query-builder/mui/v9';

export const MyMuiBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Builder
      data={data}
      fields={fields}
      components={components}
      onChange={setData}
    />
  );
};`;

const antdSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import { components } from '@vojtechportes/react-query-builder/antd/v6';

export const MyAntdBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Builder
      data={data}
      fields={fields}
      components={components}
      onChange={setData}
    />
  );
};`;

const fluentUiSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import { components } from '@vojtechportes/react-query-builder/fluentui/v8';

export const MyFluentUiBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Builder
      data={data}
      fields={fields}
      components={components}
      onChange={setData}
    />
  );
};`;

const muiOverrideSnippet = `import {
  components as muiComponents,
  MuiSelect,
} from '@vojtechportes/react-query-builder/mui/v7';

const components = {
  ...muiComponents,
  form: {
    ...muiComponents.form,
    Select: MuiSelect,
  },
};`;

const adaptersInstallSnippet = `npm install @mui/material@^9.0.1 @mui/icons-material@^9.0.1 @emotion/react @emotion/styled`;

const antdAdaptersInstallSnippet = `npm install antd@^6.0.0 @ant-design/icons@^6.0.0`;

const fluentUiAdaptersInstallSnippet = `npm install @fluentui/react@^8.125.6`;

const muiCreateComponentsSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import {
  createMuiComponents,
  components as muiComponents,
  MuiSelect,
} from '@vojtechportes/react-query-builder/mui/v9';

const components = createMuiComponents(muiComponents, {
  form: {
    Select: MuiSelect,
  },
});

export const MyMuiBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Builder
      data={data}
      fields={fields}
      components={components}
      onChange={setData}
    />
  );
};`;

const antdCreateComponentsSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import {
  createAntdComponents,
  components as antdComponents,
} from '@vojtechportes/react-query-builder/antd/v6';

const components = createAntdComponents(antdComponents, {
  form: {
    Input: MyInput,
  },
  Add: MyAddButton,
});

export const MyAntdBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Builder
      data={data}
      fields={fields}
      components={components}
      onChange={setData}
    />
  );
};`;

const fluentUiCreateComponentsSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import {
  createFluentUiComponents,
  components as fluentUiComponents,
} from '@vojtechportes/react-query-builder/fluentui/v8';

const components = createFluentUiComponents(fluentUiComponents, {
  form: {
    Input: MyInput,
  },
  Add: MyAddButton,
});

export const MyFluentUiBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Builder
      data={data}
      fields={fields}
      components={components}
      onChange={setData}
    />
  );
};`;

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
  readOnlyProtectsDelete
  cloneable
  draggable
  newNodePlacement="prepend"
  singleRootGroup={false}
  groupTypes="both"
  onChange={setData}
/>;

// lockable:
// Renders built-in lock controls for rules and groups and writes the resulting
// lock state back into the emitted query via rule/group readOnly values.
//
// readOnlyProtectsDelete:
// Prevents deleting parent groups when that delete would indirectly remove
// read-only protected descendants. Defaults to true.
//
// cloneable:
// Renders built-in clone controls for rules and groups and inserts the cloned
// node directly below the original node.
//
// draggable:
// Enables drag-and-drop for editable rules and groups.
//
// newNodePlacement="prepend":
// Inserts newly added rules and groups at the beginning of their parent instead
// of appending them to the end. The default is "append".
//
// singleRootGroup={false}:
// Allows multiple root-level nodes instead of wrapping everything into one root group.
//
// groupTypes="both":
// Lets users choose between groups with AND/OR/NOT controls and groups without modifiers.`;

const historySnippet = `import React, { useState } from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderStateChange,
} from '@vojtechportes/react-query-builder';

export const MyBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);
  const [historyState, setHistoryState] = useState({
    canUndo: false,
    canRedo: false,
  });

  const handleStateChange = (state: IBuilderStateChange) => {
    setHistoryState({
      canUndo: state.canUndo,
      canRedo: state.canRedo,
    });
  };

  return (
    <>
      <Builder
        fields={fields}
        data={data}
        draggable
        cloneable
        history={{ maxEntries: 30, controls: true }}
        onStateChange={handleStateChange}
        onChange={setData}
      />
      <p>Undo available: {String(historyState.canUndo)}</p>
      <p>Redo available: {String(historyState.canRedo)}</p>
    </>
  );
};`;

const historyControlsSnippet = `const components = {
  HistoryControls: ({
    undoButton,
    redoButton,
    canUndo,
    canRedo,
  }) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span>History</span>
      {undoButton}
      {redoButton}
      <small>{canUndo ? 'Undo ready' : 'No undo yet'}</small>
      <small>{canRedo ? 'Redo ready' : 'No redo yet'}</small>
    </div>
  ),
};

<Builder
  fields={fields}
  data={data}
  history
  components={components}
  onChange={setData}
/>;

// HistoryControls receives:
// undoButton: React.ReactNode
// redoButton: React.ReactNode
// canUndo: boolean
// canRedo: boolean
// onUndo: () => void
// onRedo: () => void`;

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

const builderRefBasicSnippet = `import React, { useState } from 'react';
import {
  Builder,
  useBuilderRef,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

const fields: IBuilderFieldProps[] = [
  {
    field: 'STATUS',
    label: 'Status',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL'],
    value: [
      { value: 'ACTIVE', label: 'Active' },
      { value: 'ARCHIVED', label: 'Archived' },
    ],
  },
];

const initialData: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'STATUS',
        operator: 'EQUAL',
        value: 'ACTIVE',
      },
    ],
  },
];

export const BuilderRefExample = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);
  const builderRef = useBuilderRef();

  return (
    <>
      <button
        type="button"
        onClick={() => {
          const rootGroupId = builderRef.current
            ?.getNodes()
            .find(node => 'type' in node)?.id;

          if (!rootGroupId) {
            return;
          }

          builderRef.current?.addRule(
            {
              field: 'STATUS',
              operator: 'NOT_EQUAL',
              value: 'ARCHIVED',
            },
            rootGroupId
          );
        }}
      >
        Add rule
      </button>
      <Builder ref={builderRef} fields={fields} data={data} onChange={setData} />
    </>
  );
};`;

const builderRefMutationSnippet = `const builderRef = useBuilderRef();

builderRef.current?.cloneNode(nodeId);
builderRef.current?.moveNode(nodeId, 0, targetGroupId);

builderRef.current?.setNodeLock(nodeId, 'self');
builderRef.current?.unlockNode(nodeId);

builderRef.current?.replaceNode(nodeId, nextNode);
builderRef.current?.updateNode(nodeId, node => ({
  ...node,
  readOnly: true,
}));`;

const builderRefHistorySnippet = `const builderRef = useBuilderRef();

const history = builderRef.current?.getHistory();

builderRef.current?.undo();
builderRef.current?.redo();

builderRef.current?.setHistory({
  past: [],
  future: [],
});`;

const builderRefReadSnippet = `const builderRef = useBuilderRef();

const allNodes = builderRef.current?.getNodes();
const singleNode = builderRef.current?.getNodeById(nodeId);
const denormalizedData = builderRef.current?.getData();`;

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
        readOnly: {
          enabled: true,
          targets: ['field', 'operator'],
        },
      },
      {
        type: 'GROUP',
        value: 'OR',
        isNegated: false,
        readOnly: {
          enabled: true,
          targets: ['combinator'],
        },
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

const targetedReadOnlySnippet = `const data: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    readOnly: {
      enabled: true,
      targets: ['combinator'],
    },
    children: [
      {
        field: 'CUSTOMER_COUNTRY',
        operator: 'EQUAL',
        value: 'CZ',
        readOnly: {
          enabled: true,
          targets: ['field', 'operator'],
        },
      },
      {
        field: 'ORDER_TOTAL',
        operator: 'BETWEEN',
        value: [1000, 5000],
        readOnly: {
          enabled: true,
          targets: ['value'],
        },
      },
    ],
  },
];`;

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
// group + descendants: readOnly: { enabled: true, inheritToChildren: true }
//
// If a node already uses readOnly.targets, the lock toggle preserves those
// targets and only changes enabled/inheritToChildren.`;

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

const cloneButtonSnippet = `const components = {
  CloneButton: MyCloneButton,
};

<Builder
  fields={fields}
  data={data}
  cloneable
  components={components}
  onChange={setData}
/>;

// CloneButton receives:
// nodeType: 'rule' | 'group'
// disabled?: boolean
// onClick?: () => void`;

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
      'Documentation overview for installation, usage, parsing and formatting, customization, adapters, and localization.',
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
          or <TextLink to="/documentation/text-mode">Text Mode</TextLink>{' '}
          or <TextLink to="/documentation/history">Undo and Redo</TextLink>{' '}
          for editing workflows, or{' '}
          <TextLink to="/documentation/builder-ref">Builder Ref</TextLink>{' '}
          for imperative control, or{' '}
          <TextLink to="/documentation/locking-and-read-only">Locking and Read-only</TextLink>{' '}
          for partial locking.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/documentation/builder-ref',
    title: 'Builder Ref',
    sectionKey: 'getting-started',
    sectionTitle: 'Getting Started',
    summary: '',
    description:
      'Documentation for the imperative builderRef API exposed through useBuilderRef, including reads, mutations, and history access.',
    searchText:
      'builderRef useBuilderRef forwardRef imperative api clone lock unlock delete update replace insert add move getNodeById getNodes getData getHistory setHistory undo redo',
    content: (
      <>
        <p>
          Use <InlineCode>useBuilderRef()</InlineCode> with the <TextLink to="/api/builder">Builder</TextLink>{' '}
          ref to access internal node actions and history from custom toolbars,
          menus, keyboard shortcuts, or surrounding workflow logic.
        </p>
        <CodeBlock code={builderRefBasicSnippet} language="tsx" label="Basic builderRef setup" />
        <SectionTitle>When to use it</SectionTitle>
        <List>
          <li>Trigger builder changes from controls rendered outside the builder.</li>
          <li>Implement keyboard shortcuts for clone, delete, undo, or redo.</li>
          <li>Insert preconfigured rules or groups from business-specific UI flows.</li>
          <li>Inspect normalized nodes or history without reimplementing builder internals.</li>
        </List>
        <SectionTitle>Read methods</SectionTitle>
        <CodeBlock code={builderRefReadSnippet} language="tsx" label="Reading builder state" />
        <List>
          <li><InlineCode>getNodeById(id)</InlineCode> returns one normalized node by id.</li>
          <li><InlineCode>getNodes()</InlineCode> returns the current normalized node array.</li>
          <li><InlineCode>getData()</InlineCode> returns the denormalized public query shape.</li>
        </List>
        <SectionTitle>Mutation methods</SectionTitle>
        <CodeBlock code={builderRefMutationSnippet} language="tsx" label="Mutating nodes" />
        <List>
          <li><InlineCode>cloneNode</InlineCode>, <InlineCode>deleteNode</InlineCode>, and <InlineCode>moveNode</InlineCode> follow the same behavior as the built-in UI controls.</li>
          <li><InlineCode>addNode</InlineCode>, <InlineCode>addGroup</InlineCode>, <InlineCode>addRule</InlineCode>, and <InlineCode>insertNodes</InlineCode> let you build structure imperatively.</li>
          <li><InlineCode>replaceNode</InlineCode> swaps a node directly, while <InlineCode>updateNode</InlineCode> is useful when you want the next value to depend on the current node.</li>
          <li><InlineCode>setNodeLock</InlineCode>, <InlineCode>lockNode</InlineCode>, and <InlineCode>unlockNode</InlineCode> write the same read-only states as the lock UI.</li>
        </List>
        <SectionTitle>History methods</SectionTitle>
        <CodeBlock code={builderRefHistorySnippet} language="tsx" label="History access" />
        <List>
          <li><InlineCode>undo()</InlineCode> and <InlineCode>redo()</InlineCode> use the same history engine as the built-in controls.</li>
          <li><InlineCode>getHistory()</InlineCode> returns the current <InlineCode>past</InlineCode> and <InlineCode>future</InlineCode> stacks.</li>
          <li><InlineCode>setHistory()</InlineCode> lets you replace or clear the internal history state.</li>
        </List>
        <AlertBox title="Data shapes" variant="info">
          Most imperative methods use normalized nodes because that matches the
          internal builder engine. Use <InlineCode>getData()</InlineCode> when
          you need the public denormalized query shape.
        </AlertBox>
        <AlertBox title="API reference" variant="info">
          <TextLink to="/api/builder-ref">Builder Ref</TextLink>,{' '}
          <TextLink to="/api/builder">Builder</TextLink>, and{' '}
          <TextLink to="/api/data">Data</TextLink>.
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
    path: '/documentation/history',
    title: 'Undo and Redo',
    sectionKey: 'getting-started',
    sectionTitle: 'Getting Started',
    summary: '',
    description:
      'Documentation for enabling inverse-history undo and redo, built-in controls, state callbacks, and drag-and-drop coverage.',
    searchText:
      'undo redo history inverse history maxEntries controls canUndo canRedo onStateChange drag and drop clone delete edit builder',
    content: (
      <>
        <p>
          Set <InlineCode>history</InlineCode> on <TextLink to="/api/builder">Builder</TextLink>{' '}
          to enable built-in undo and redo support for structural edits and value
          changes. The builder records inverse actions internally, so history stays
          smaller than full-query snapshots and still works with drag-and-drop,
          cloning, deletes, and inline edits.
        </p>
        <CodeBlock code={historySnippet} language="tsx" label="History support" />
        <SectionTitle>How to enable it</SectionTitle>
        <List>
          <li><InlineCode>history={true}</InlineCode> enables history with default behavior.</li>
          <li><InlineCode>history={`{{ maxEntries, controls }}`}</InlineCode> enables history with custom configuration.</li>
          <li><InlineCode>maxEntries</InlineCode> limits how many undo steps are kept in memory.</li>
          <li><InlineCode>controls</InlineCode> controls whether the built-in Undo and Redo buttons are rendered.</li>
        </List>
        <SectionTitle>What gets tracked</SectionTitle>
        <List>
          <li>Adding, removing, cloning, and editing rules.</li>
          <li>Adding, removing, cloning, and editing groups.</li>
          <li>Drag-and-drop reordering and movement between groups.</li>
          <li>Changes driven through the builder UI that emit through <InlineCode>onChange</InlineCode>.</li>
        </List>
        <SectionTitle>State callbacks</SectionTitle>
        <List>
          <li><InlineCode>onStateChange</InlineCode> includes <InlineCode>canUndo</InlineCode> and <InlineCode>canRedo</InlineCode> so custom toolbars can stay in sync.</li>
          <li>The built-in controls already use those flags and render disabled when no action is available.</li>
          <li>Redo history is cleared after a new forward edit, which matches standard editor behavior.</li>
        </List>
        <SectionTitle>Custom HistoryControls</SectionTitle>
        <p>
          Use <InlineCode>components.HistoryControls</InlineCode> when you want
          to change the placement or surrounding layout of the built-in history
          controls without reimplementing undo and redo behavior yourself.
        </p>
        <CodeBlock
          code={historyControlsSnippet}
          language="tsx"
          label="HistoryControls override"
        />
        <List>
          <li>The override receives ready-to-render <InlineCode>undoButton</InlineCode> and <InlineCode>redoButton</InlineCode> nodes.</li>
          <li>It also receives <InlineCode>canUndo</InlineCode>, <InlineCode>canRedo</InlineCode>, <InlineCode>onUndo</InlineCode>, and <InlineCode>onRedo</InlineCode> when you need custom wrappers or auxiliary UI.</li>
          <li>This lets you reorder, wrap, or annotate the default buttons without having to rebuild their disabled-state logic.</li>
        </List>
        <AlertBox title="Related docs" variant="info">
          <TextLink to="/documentation/builder-behavior">Builder Behavior</TextLink>,{' '}
          <TextLink to="/documentation/builder-ref">Builder Ref</TextLink>,{' '}
          <TextLink to="/demo">Demo</TextLink>, and{' '}
          <TextLink to="/api/builder">Builder</TextLink>.
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
      'Documentation for clone controls, drag-and-drop, insertion placement, root-group behavior, and group mode configuration.',
    searchText:
      'builder behavior cloneable clone controls draggable drag and drop readOnlyProtectsDelete newNodePlacement append prepend singleRootGroup groupTypes with modifiers without modifiers both root group',
    content: (
      <>
        <p>
          A few builder props shape the overall editing model more than the
          field or query data itself. These are worth deciding early because
          they affect how users add, move, and organize rules.
        </p>
        <CodeBlock code={builderBehaviorSnippet} language="tsx" label="Builder behavior" />
        <SectionTitle>cloneable</SectionTitle>
        <List>
          <li>Defaults to <InlineCode>false</InlineCode> and renders built-in clone controls for rules and groups.</li>
          <li>The clone button appears immediately to the left of the lock button when both controls are enabled.</li>
          <li>Cloning a rule inserts a duplicate directly below that rule.</li>
          <li>Cloning a group duplicates the entire subtree and inserts the clone directly below that group.</li>
          <li>When <InlineCode>singleRootGroup</InlineCode> is enabled, the synthetic root group does not expose a clone control.</li>
        </List>
        <SectionTitle>draggable</SectionTitle>
        <List>
          <li>Use <InlineCode>lockable</InlineCode> to expose lock controls directly in the UI.</li>
          <li>Enables drag-and-drop reordering and movement for editable rules and groups.</li>
          <li>Read-only rules and groups are excluded from dragging.</li>
          <li>When the entire builder is read-only, drag-and-drop is disabled as well.</li>
          <li>Empty groups expose a dedicated drop zone so items can be moved into them.</li>
        </List>
        <SectionTitle>readOnlyProtectsDelete</SectionTitle>
        <List>
          <li>Defaults to <InlineCode>true</InlineCode>.</li>
          <li>When enabled, deleting a group is blocked if that would indirectly remove read-only protected descendants.</li>
          <li>Set it to <InlineCode>false</InlineCode> when your product wants only directly protected nodes to be non-deletable, while still allowing parent-group deletes around them.</li>
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
        <SectionTitle>newNodePlacement</SectionTitle>
        <List>
          <li>
            Defaults to <InlineCode>'append'</InlineCode>, which inserts newly
            added rules and groups at the end of their parent.
          </li>
          <li>
            Set it to <InlineCode>'prepend'</InlineCode> to insert new rules
            and groups at the beginning of their parent instead.
          </li>
          <li>
            This affects built-in Add Rule and Add Group controls, root-level
            add controls, and imperative ref methods when no explicit index is
            provided.
          </li>
          <li>
            It does not change cloning or drag-and-drop behavior, since those
            actions already use explicit target positions.
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
          <TextLink to="/documentation/history">Undo and Redo</TextLink>,{' '}
          <TextLink to="/documentation/builder-ref">Builder Ref</TextLink>,{' '}
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
      'Documentation for builder-level, rule-level, and group-level read-only behavior, including targeted read-only and group inheritance semantics.',
    searchText:
      'readOnly locking locked rule group targets field operator value combinator negation inheritToChildren inheritance read only builder rule group drag delete add controls',
    content: (
      <>
        <p>
          Locking can be applied at the builder, rule, or group level. The key
          distinction is that rules lock only themselves, while groups can lock
          either just their own controls or their entire subtree. Object-based{' '}
          <InlineCode>readOnly</InlineCode> configs also support targeted
          read-only for specific controls.
        </p>
        <SectionTitle>GUI Locking</SectionTitle>
        <p>
          Set <InlineCode>lockable</InlineCode> on <TextLink to="/api/builder">Builder</TextLink>{' '}
          to render lock controls directly in the UI. The built-in controls update
          the same <InlineCode>readOnly</InlineCode> fields that are already part of
          the query data model, so the resulting lock state is preserved in output.
          If a node already has <InlineCode>readOnly.targets</InlineCode>, the
          lock toggle preserves those targets and only changes whether the lock
          is enabled and, for groups, whether it inherits to descendants.
        </p>
        <CodeBlock code={lockingGuiSnippet} language="tsx" label="GUI locking" />
        <List>
          <li>Rules cycle through two states: unlocked and locked.</li>
          <li>Groups cycle through three states: unlocked, locked group only, and locked group with descendants.</li>
          <li>The default group cycle maps to <InlineCode>false</InlineCode>, <InlineCode>true</InlineCode>, and <InlineCode>{`{ enabled: true, inheritToChildren: true }`}</InlineCode>.</li>
          <li>When a parent group inherits a lock to descendants, child lock controls render disabled because descendants cannot override that inherited state.</li>
          <li>When <InlineCode>cloneable</InlineCode> is also enabled, the clone button renders immediately to the left of the lock button.</li>
        </List>
        <SectionTitle>Targeted read-only</SectionTitle>
        <p>
          Use object-based <InlineCode>readOnly</InlineCode> configs when you want
          to keep specific controls visible but non-editable instead of locking
          the entire rule or group.
        </p>
        <CodeBlock code={targetedReadOnlySnippet} language="tsx" label="Targeted read-only" />
        <List>
          <li>Rule targets are <InlineCode>field</InlineCode>, <InlineCode>operator</InlineCode>, and <InlineCode>value</InlineCode>.</li>
          <li>Group targets are <InlineCode>combinator</InlineCode> and <InlineCode>negation</InlineCode>.</li>
          <li>If <InlineCode>enabled</InlineCode> is <InlineCode>true</InlineCode> and <InlineCode>targets</InlineCode> is omitted, the whole node is read-only.</li>
          <li>If <InlineCode>enabled</InlineCode> is <InlineCode>false</InlineCode>, the config stays dormant until the node is locked again.</li>
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
            <InlineCode>{`rule.readOnly = { enabled: true, targets: ['field'] }`}</InlineCode>{' '}
            keeps the field visible but non-editable, and also prevents deleting
            that rule.
          </li>
          <li>
            <InlineCode>group.readOnly = true</InlineCode> locks only that
            group&apos;s own controls. Its child rules and child groups stay
            editable by default.
          </li>
          <li>
            <InlineCode>{`group.readOnly = { enabled: true, targets: ['combinator'] }`}</InlineCode>{' '}
            keeps the group combinator visible but non-editable without forcing
            descendant rules to become read-only.
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
        <SectionTitle>Custom Clone Control</SectionTitle>
        <p>
          The default clone button can be replaced through{' '}
          <InlineCode>components.CloneButton</InlineCode>.
        </p>
        <CodeBlock code={cloneButtonSnippet} language="tsx" label="CloneButton override" />
        <SectionTitle>What &quot;locked&quot; means in the UI</SectionTitle>
        <List>
          <li>Read-only targets stay visible. They become disabled, not hidden.</li>
          <li>Locked rules cannot change field, operator, or value, and cannot be deleted.</li>
          <li>Targeted rule read-only also blocks deleting that rule, even if only one target such as <InlineCode>field</InlineCode> is protected.</li>
          <li>Locked groups cannot change their group operator, negation, add actions, or delete action.</li>
          <li>By default, groups also cannot be deleted when that would remove protected descendants indirectly.</li>
          <li>Set <InlineCode>Builder.readOnlyProtectsDelete={false}</InlineCode> to disable that subtree delete protection while keeping direct node-level read-only deletion rules.</li>
          <li>Locked rules and groups are removed from drag-and-drop interactions.</li>
          <li>Clone controls render only for editable rules and groups. Cloned nodes preserve their read-only configuration.</li>
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
          <li>
            Group target inheritance preserves only the group-level semantics of
            the inherited lock. It does not turn rule-specific controls such as{' '}
            <InlineCode>field</InlineCode> or <InlineCode>value</InlineCode> into inherited targets.
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
        <CodeBlock code={textModeSnippet} language="tsx" label="Enable built-in text mode" />
        <SectionTitle>Current scope</SectionTitle>
        <List>
          <li>Text mode currently uses SQL as the editable text format.</li>
          <li>
            It requires <InlineCode>singleRootGroup</InlineCode> to stay enabled.
            If <InlineCode>singleRootGroup</InlineCode> is <InlineCode>false</InlineCode>,
            text mode is unavailable and the builder stays in visual mode.
          </li>
          <li>
            When text mode is enabled, modifierless groups are normalized to{' '}
            <InlineCode>AND</InlineCode> groups so the query can round-trip through SQL.
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
          <li>Missing brackets, quotes, commas, and other SQL syntax mistakes are highlighted directly in the editor.</li>
          <li>Unknown fields are highlighted on the field token.</li>
          <li>Unsupported operators for a field are highlighted on the operator token.</li>
          <li>Invalid <InlineCode>LIST</InlineCode> values are highlighted on the invalid value token.</li>
          <li>Invalid <InlineCode>MULTI_LIST</InlineCode> values are highlighted on the invalid value token.</li>
          <li>Read-only negation changes are rejected after parsing and shown as below-editor semantic errors.</li>
        </List>
        <SectionTitle>Invalid text behavior</SectionTitle>
        <List>
          <li>Invalid text stays local to the text editor until the SQL becomes valid again.</li>
          <li>The last valid builder query is preserved while the user is fixing text-mode errors.</li>
          <li><InlineCode>onChange</InlineCode> is fired only after a valid parse and successful semantic validation.</li>
        </List>
        <SectionTitle>History behavior</SectionTitle>
        <List>
          <li>Valid text edits are committed into builder history, so they can be undone and redone.</li>
          <li>Invalid intermediate text is not committed into builder state or history.</li>
        </List>
        <SectionTitle>Choosing an editor</SectionTitle>
        <List>
          <li><ItemTitle>Choose the built-in editor:</ItemTitle> when you want lightweight SQL editing, built-in validation, and no extra dependencies.</li>
          <li><ItemTitle>Choose Monaco:</ItemTitle> when locked or targeted read-only query segments must stay protected in text mode, or when you want a more advanced editor experience.</li>
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
            <ItemTitle>Built-in editor limitation:</ItemTitle> Locked rules,
            locked groups, and targeted read-only queries are blocked before
            entering text mode there, because the basic editor cannot preserve
            protected query segments safely after freeform text edits.
          </li>
          <li>
            <ItemTitle>Monaco text mode:</ItemTitle> Optional advanced editor
            integration exposed from{' '}
            <InlineCode>@vojtechportes/react-query-builder/monaco</InlineCode>.
            It preserves locked and targeted read-only query segments by rendering
            them as protected ranges.
          </li>
          <li>
            <ItemTitle>Monaco protected behavior:</ItemTitle> Protected SQL fragments
            are dimmed, protected from edits, and expose their lock explanation on hover.
          </li>
          <li>
            <ItemTitle>Localized read-only protection:</ItemTitle> Rule field,
            operator, and value segments can be protected inline, while read-only
            negation is additionally enforced semantically and reported below the editor when changed.
          </li>
          <li>
            <ItemTitle>Monaco packaging:</ItemTitle>{' '}
            <InlineCode>monaco-editor</InlineCode> is an optional peer dependency.
            Consumers only need to install it when they actually want the Monaco editor.
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
          <li><InlineCode>strings.textMode.toggleToText</InlineCode> customizes the button label for entering text mode.</li>
          <li><InlineCode>strings.textMode.toggleToBuilder</InlineCode> customizes the button label for returning to the visual builder.</li>
          <li><InlineCode>strings.textMode.syntaxError</InlineCode> customizes the syntax error prefix.</li>
          <li><InlineCode>strings.textMode.locksUnsupported</InlineCode> customizes the built-in alert shown when the basic editor cannot open a locked or targeted read-only query.</li>
          <li><InlineCode>strings.textMode.lockedRangesHover</InlineCode> customizes the hover message shown for protected Monaco ranges.</li>
          <li><InlineCode>strings.textMode.sql</InlineCode> customizes SQL parser and syntax-validation messages such as missing brackets, missing quotes, missing keywords, and unexpected tokens.</li>
        </List>
        <SectionTitle>Installing Monaco</SectionTitle>
        <CodeBlock code={monacoInstallSnippet} language="bash" label="Monaco peer dependency" />
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
          <li>
            <InlineCode>HistoryControls</InlineCode> receives built-in undo and
            redo button nodes plus history state and handlers, so custom layouts
            can reuse the default controls instead of recreating them.
          </li>
          <li>
            <InlineCode>TextModeEditor</InlineCode> replaces the whole text-mode
            editor surface. This is the correct override point for Monaco or
            other advanced editors.
          </li>
          <li>
            <InlineCode>TextModeInput</InlineCode> replaces only the input control
            used by the built-in text editor. It is useful when you want the
            built-in overlay editor behavior but need a UI-library-specific input shell.
          </li>
          <li>
            <InlineCode>TextModeToggleContent</InlineCode>, <InlineCode>OutlinedButton</InlineCode>,
            and <InlineCode>Alert</InlineCode> let you align text-mode controls
            and warnings with your design system.
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
        <AlertBox title="Adapter packages" variant="info">
          If you want ready-made component mappings instead of wiring every
          override by hand, see <TextLink to="/documentation/adapters">Adapters</TextLink>.
        </AlertBox>
        <AlertBox title="Related docs" variant="info">
          <TextLink to="/documentation/text-mode">Text Mode</TextLink> covers the
          built-in SQL editor and the optional Monaco editor integration.
        </AlertBox>
        <AlertBox title="API reference" variant="info">
          <TextLink to="/api/components">Components</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/documentation/adapters',
    title: 'Adapters',
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'Documentation overview for packaged UI adapters, versioned entrypoints, adapter-specific subpages, and shared customization patterns.',
    searchText:
      'Adapters customization mui material ui antd ant design fluent ui versioned adapter entrypoints adapter overview create components pages ready made overrides',
    content: (
      <>
        <p>
          Adapters provide pre-mapped <InlineCode>components</InlineCode> objects
          for UI libraries so you do not need to implement every override in{' '}
          <TextLink to="/documentation/components">Components</TextLink> yourself.
        </p>
        <SectionTitle>Adapter guides</SectionTitle>
        <List>
          <li><TextLink to="/documentation/adapters/mui">MUI</TextLink> covers <InlineCode>mui/v9</InlineCode>, legacy <InlineCode>mui/v7</InlineCode>, install steps, and merge patterns.</li>
          <li><TextLink to="/documentation/adapters/antd">ANTD</TextLink> covers <InlineCode>antd/v6</InlineCode>, legacy <InlineCode>antd/v5</InlineCode>, install steps, and merge patterns.</li>
          <li><TextLink to="/documentation/adapters/fluentui">Fluent UI</TextLink> covers <InlineCode>fluentui/v8</InlineCode>, install steps, and merge patterns.</li>
        </List>
        <SectionTitle>Extending an adapter</SectionTitle>
        <List>
          <li>Start with the exported adapter <InlineCode>components</InlineCode> object.</li>
          <li>Override only the pieces you want to replace, such as a single select or button component.</li>
          <li>This keeps your app aligned with future adapter updates while still allowing local customization.</li>
        </List>
        <CodeBlock code={muiCreateComponentsSnippet} language="tsx" label="Merging adapter defaults" />
        <SectionTitle>Shared behavior</SectionTitle>
        <List>
          <li>Adapters are versioned entrypoints so the package can support multiple major UI-library versions in parallel.</li>
          <li>Each adapter exports a ready-to-pass <InlineCode>components</InlineCode> object plus a merge helper that preserves nested <InlineCode>form</InlineCode> overrides.</li>
          <li>Choose the adapter subpage that matches your UI library for exact installation commands and code samples.</li>
        </List>
        <AlertBox title="Monaco text mode" variant="info">
          When you want Monaco text mode together with MUI, ANTD, or Fluent UI, compose the
          adapter <InlineCode>components</InlineCode> object with{' '}
          <InlineCode>createMonacoComponents(...)</InlineCode>. See{' '}
          <TextLink to="/documentation/text-mode">Text Mode</TextLink> for examples.
        </AlertBox>
        <AlertBox title="Related docs" variant="info">
          <TextLink to="/documentation/components">Components</TextLink>,{' '}
          <TextLink to="/documentation/theming">Theming</TextLink>, and{' '}
          <TextLink to="/api/adapters">Adapters API</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/documentation/adapters/mui',
    title: 'MUI',
    depth: 1,
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'Documentation for the Material UI adapter, including mui/v9, legacy mui/v7 support, installation, and component merging.',
    searchText:
      'MUI adapter material ui mui v9 mui v7 adapter install createMuiComponents components',
    content: (
      <>
        <p>
          Use the MUI adapter when your application already uses Material UI and
          you want the builder to inherit that component language.
        </p>
        <SectionTitle>Available entrypoints</SectionTitle>
        <List>
          <li><InlineCode>@vojtechportes/react-query-builder/mui/v9</InlineCode> is the recommended entrypoint for new Material UI projects and the one used in the demo.</li>
          <li><InlineCode>@vojtechportes/react-query-builder/mui/v7</InlineCode> is available for applications that are still on Material UI 7.</li>
        </List>
        <SectionTitle>Installing MUI</SectionTitle>
        <p>
          Install the MUI peer dependencies that match the adapter version you want
          to use. For new setups, prefer <InlineCode>mui/v9</InlineCode>.
        </p>
        <CodeBlock code={adaptersInstallSnippet} language="bash" label="MUI v9 peers" />
        <SectionTitle>Using MUI v9</SectionTitle>
        <CodeBlock code={muiSnippet} language="tsx" label="MUI v9 adapter" />
        <SectionTitle>Supporting MUI v7</SectionTitle>
        <p>
          If your application is still on Material UI 7, switch the import path to{' '}
          <InlineCode>@vojtechportes/react-query-builder/mui/v7</InlineCode>.
        </p>
        <CodeBlock
          code={muiOverrideSnippet}
          language="tsx"
          label="Starting from the MUI v7 mapping"
        />
        <SectionTitle>Extending the MUI adapter</SectionTitle>
        <CodeBlock
          code={muiCreateComponentsSnippet}
          language="tsx"
          label="Merging MUI defaults"
        />
        <AlertBox title="Related docs" variant="info">
          <TextLink to="/documentation/adapters">Adapters</TextLink>,{' '}
          <TextLink to="/documentation/components">Components</TextLink>, and{' '}
          <TextLink to="/api/adapters/mui">MUI adapter API</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/documentation/adapters/antd',
    title: 'ANTD',
    depth: 1,
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'Documentation for the Ant Design adapter, including antd/v6, legacy antd/v5 support, installation, and component merging.',
    searchText:
      'ANTD adapter ant design antd v6 antd v5 adapter install createAntdComponents components',
    content: (
      <>
        <p>
          Use the ANTD adapter when your application uses Ant Design and you want
          the builder controls to match the surrounding system components.
        </p>
        <SectionTitle>Available entrypoints</SectionTitle>
        <List>
          <li><InlineCode>@vojtechportes/react-query-builder/antd/v6</InlineCode> is the recommended entrypoint for new Ant Design projects and is available in the demo.</li>
          <li><InlineCode>@vojtechportes/react-query-builder/antd/v5</InlineCode> is available for applications that are still on Ant Design 5.</li>
        </List>
        <SectionTitle>Installing ANTD</SectionTitle>
        <p>
          Install the Ant Design peer dependencies that match the adapter version
          you want to use. For new setups, prefer <InlineCode>antd/v6</InlineCode>.
        </p>
        <CodeBlock code={antdAdaptersInstallSnippet} language="bash" label="ANTD v6 peers" />
        <SectionTitle>Using ANTD v6</SectionTitle>
        <CodeBlock code={antdSnippet} language="tsx" label="ANTD v6 adapter" />
        <SectionTitle>Supporting ANTD v5</SectionTitle>
        <p>
          If your application is still on Ant Design 5, switch the import path to{' '}
          <InlineCode>@vojtechportes/react-query-builder/antd/v5</InlineCode>.
        </p>
        <SectionTitle>Extending the ANTD adapter</SectionTitle>
        <CodeBlock
          code={antdCreateComponentsSnippet}
          language="tsx"
          label="Merging ANTD defaults"
        />
        <AlertBox title="Related docs" variant="info">
          <TextLink to="/documentation/adapters">Adapters</TextLink>,{' '}
          <TextLink to="/documentation/components">Components</TextLink>, and{' '}
          <TextLink to="/api/adapters/antd">ANTD adapter API</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/documentation/adapters/fluentui',
    title: 'Fluent UI',
    depth: 1,
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'Documentation for the Fluent UI adapter, including fluentui/v8 installation, usage, and component merging.',
    searchText:
      'Fluent UI adapter fluentui v8 adapter install createFluentUiComponents components',
    content: (
      <>
        <p>
          Use the Fluent UI adapter when your application is built on Fluent UI
          React 8 and you want builder controls mapped to that component set.
        </p>
        <SectionTitle>Available entrypoint</SectionTitle>
        <List>
          <li><InlineCode>@vojtechportes/react-query-builder/fluentui/v8</InlineCode> targets <InlineCode>@fluentui/react</InlineCode> 8.x and is available in the demo.</li>
        </List>
        <SectionTitle>Installing Fluent UI</SectionTitle>
        <p>
          Install the matching Fluent UI peer dependency before using the adapter.
        </p>
        <CodeBlock
          code={fluentUiAdaptersInstallSnippet}
          language="bash"
          label="Fluent UI v8 peers"
        />
        <SectionTitle>Using Fluent UI v8</SectionTitle>
        <CodeBlock code={fluentUiSnippet} language="tsx" label="Fluent UI v8 adapter" />
        <SectionTitle>Extending the Fluent UI adapter</SectionTitle>
        <CodeBlock
          code={fluentUiCreateComponentsSnippet}
          language="tsx"
          label="Merging Fluent UI defaults"
        />
        <AlertBox title="Related docs" variant="info">
          <TextLink to="/documentation/adapters">Adapters</TextLink>,{' '}
          <TextLink to="/documentation/components">Components</TextLink>, and{' '}
          <TextLink to="/api/adapters/fluentui">Fluent UI adapter API</TextLink>.
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
        <AlertBox title="Adapters and theming" variant="info">
          <InlineCode>ThemeProvider</InlineCode> customizes the built-in default
          component set. If you use an adapter from{' '}
          <TextLink to="/documentation/adapters">Adapters</TextLink>, such as{' '}
          <InlineCode>mui/v7</InlineCode>, <InlineCode>mui/v9</InlineCode>,{' '}
          <InlineCode>antd/v5</InlineCode>, <InlineCode>antd/v6</InlineCode>, or{' '}
          <InlineCode>fluentui/v8</InlineCode>, these theme tokens do not affect
          the adapter UI.
        </AlertBox>
        <AlertBox title="API reference" variant="info">
          <TextLink to="/api/theming">Theming</TextLink> and{' '}
          <TextLink to="/api/adapters">Adapters</TextLink>.
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
          <li><InlineCode>textMode</InlineCode> covers text-mode labels and messages such as the mode toggle, syntax error prefix, lock warning, and locked-range hover text.</li>
          <li><InlineCode>textMode.sql</InlineCode> covers localized SQL parser and syntax-validation messages used by text mode.</li>
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
