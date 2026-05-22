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

const builderSignature = `export interface IBuilderProps {
  fields: IBuilderFieldProps[];
  data: DenormalizedQuery;
  components?: IBuilderComponentsProps;
  strings?: IStrings;
  readOnly?: boolean;
  lockable?: boolean;
  cloneable?: boolean;
  draggable?: boolean;
  singleRootGroup?: boolean;
  groupTypes?: 'with-modifiers' | 'without-modifiers' | 'both';
  validator?: IBuilderValidator;
  onStateChange?: (state: IBuilderStateChange) => void;
  showValidation?: boolean;
  history?: boolean | IBuilderHistoryConfig;
  onChange?: (data: DenormalizedQuery) => any;
}`;

const historyConfigSignature = `export interface IBuilderHistoryConfig {
  maxEntries?: number;
  controls?: boolean;
}`;

const builderRefSignature = `export interface IBuilderRef {
  cloneNode: (nodeId: string) => boolean;
  deleteNode: (nodeId: string) => boolean;
  replaceNode: (nodeId: string, node: NormalizedNode) => boolean;
  updateNode: (
    nodeId: string,
    updater: (node: NormalizedNode) => NormalizedNode
  ) => boolean;
  insertNodes: (
    nodes: NormalizedQuery,
    index: number,
    parentId?: string
  ) => boolean;
  addNode: (node: NormalizedNode, parentId?: string, index?: number) => boolean;
  addGroup: (
    groupType?: QueryGroupType,
    parentId?: string,
    index?: number
  ) => boolean;
  addRule: (
    rule?: Partial<INormalizedRuleNode>,
    parentId?: string,
    index?: number
  ) => boolean;
  moveNode: (nodeId: string, index: number, parentId?: string) => boolean;
  setNodeLock: (
    nodeId: string,
    state: 'unlocked' | 'self' | 'all'
  ) => boolean;
  lockNode: (nodeId: string, state?: 'self' | 'all') => boolean;
  unlockNode: (nodeId: string) => boolean;
  getNodeById: (nodeId: string) => NormalizedNode | undefined;
  getNodes: () => NormalizedQuery;
  getData: () => DenormalizedQuery;
  getHistory: () => IBuilderHistoryState;
  setHistory: (history: IBuilderHistoryState) => void;
  undo: () => void;
  redo: () => void;
}

export type BuilderRef = React.MutableRefObject<IBuilderRef | null>;

export const useBuilderRef = (): BuilderRef;`;

const fieldTypesSignature = `export type BuilderFieldType =
  | 'BOOLEAN'
  | 'TEXT'
  | 'DATE'
  | 'NUMBER'
  | 'STATEMENT'
  | 'LIST'
  | 'MULTI_LIST'
  | 'GROUP';

export type IBuilderFieldProps =
  | IBooleanFieldProps
  | ITextFieldProps
  | IDateFieldProps
  | INumberFieldProps
  | IStatementFieldProps
  | IListFieldProps
  | IMultiListFieldProps
  | IGroupFieldProps;`;

const fieldBaseSignature = `interface IBuilderFieldBase<TType, TValue, TValidation> {
  field: string;
  label: string;
  value?: TValue;
  type: TType;
  operators?: BuilderFieldOperator[];
  validation?: TValidation;
}`;

const queryTreeSignature = `export type QueryGroupValue = 'AND' | 'OR';
export type QueryGroupType = 'with-modifiers' | 'without-modifiers';

export type QueryRuleValue =
  | string
  | number
  | string[]
  | number[]
  | boolean;

export interface IDenormalizedRuleNode {
  id?: string;
  parent?: string;
  field: string;
  value?: QueryRuleValue;
  operator?: QueryOperator;
  operators?: QueryOperator[];
  readOnly?: boolean;
}

export interface IDenormalizedGroupNodeBase {
  id?: string;
  parent?: string;
  type: 'GROUP';
  children: DenormalizedNode[];
  readOnly?: boolean | IGroupReadOnlyConfig;
}

export type DenormalizedQuery = DenormalizedNode[];`;

const componentsSignature = `export interface IBuilderComponentsProps {
  form?: {
    Select?: React.ComponentType<ISelectProps>;
    SelectMulti?: React.ComponentType<ISelectMultiProps>;
    Switch?: React.ComponentType<ISwitchProps>;
    Input?: React.ComponentType<IInputProps>;
  };
  Remove?: React.ComponentType<IButtonProps>;
  Add?: React.ComponentType<IButtonProps>;
  CloneButton?: React.ComponentType<ICloneButtonProps>;
  LockToggle?: React.ComponentType<ILockToggleProps>;
  HistoryControls?: React.ComponentType<IHistoryControlsProps>;
  Rule?: React.ComponentType<IRuleContainerProps>;
  Group?: React.ComponentType<IGroupContainerProps>;
  GroupHeaderOption?: React.ComponentType<IGroupHeaderOptionProps>;
  Text?: React.ComponentType<React.ComponentProps<typeof Text>>;
  DropZone?: React.ComponentType<IDropZoneProps>;
  EmptyGroupDropZone?: React.ComponentType<IEmptyGroupDropZoneProps>;
  Popover?: React.ComponentType<IPopoverProps>;
  PopoverItem?: React.ComponentType<IPopoverItemProps>;
}`;

const muiAdapterSnippet = `import { components } from '@vojtechportes/react-query-builder/mui/v9';

<Builder
  fields={fields}
  data={data}
  components={components}
  onChange={setData}
/>;`;

const antdAdapterSnippet = `import { components } from '@vojtechportes/react-query-builder/antd/v6';

<Builder
  fields={fields}
  data={data}
  components={components}
  onChange={setData}
/>;`;

const muiV7Snippet = `import { components } from '@vojtechportes/react-query-builder/mui/v7';`;

const antdV5Snippet = `import { components } from '@vojtechportes/react-query-builder/antd/v5';`;

const muiCreateComponentsSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import {
  createMuiComponents,
  components as muiComponents,
} from '@vojtechportes/react-query-builder/mui/v9';

const components = createMuiComponents(muiComponents, {
  form: {
    Input: MyInput,
  },
  Add: MyAddButton,
});

export const MyMuiBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Builder
      fields={fields}
      data={data}
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
      fields={fields}
      data={data}
      components={components}
      onChange={setData}
    />
  );
};`;

const historyControlsSignature = `export interface IHistoryControlsProps {
  undoButton: React.ReactNode;
  redoButton: React.ReactNode;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  className?: string;
}`;

const lockToggleSignature = `export type BuilderLockState = 'unlocked' | 'self' | 'all';

export interface ILockToggleProps {
  state: BuilderLockState;
  nodeType: 'rule' | 'group';
  disabled?: boolean;
  onChange?: (nextState: BuilderLockState) => void;
  className?: string;
  title?: string;
  'data-test'?: string;
}`;

const cloneButtonSignature = `export interface ICloneButtonProps {
  nodeType: 'rule' | 'group';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  title?: string;
  'data-test'?: string;
}`;

const themeProviderSignature = `export interface IThemeProps {
  colors?: IColors;
}

export interface IThemeProviderProps extends IThemeProps {
  children?: React.ReactNode;
}

export const ThemeProvider: React.FC<IThemeProviderProps>;`;

const colorsSignature = `export interface IColorVariant {
  light: string;
  dark: string;
  default: string;
  contrastText: string;
}

export interface IGreyColorVariant {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface IColors {
  primary: IColorVariant;
  secondary: IColorVariant;
  grey: IGreyColorVariant;
  white: string;
}

export const colors: IColors;`;

const formatQuerySignature = `export const formatQuery = (
  value: DenormalizedQuery,
  format: QueryFormat,
  options?:
    | IFormatSqlOptions
    | IFormatMongoOptions
    | IFormatAqlOptions
    | IFormatJsonataOptions
    | IFormatJsonLogicOptions
    | IFormatCelOptions
    | IFormatDjangoOptions
    | IFormatDynamoOptions
    | IFormatElasticsearchOptions
    | IFormatSpelOptions
    | IFormatPrismaOptions
    | IFormatODataOptions
    | IFormatRsqlOptions
) => string;`;

const formatOptionsSignature = `export interface IFormatQueryBaseOptions {
  rootlessCombinator?: 'AND' | 'OR';
  modifierlessGroupCombinator?: 'AND' | 'OR';
  fields?: IBuilderFieldProps[];
}

export interface IFormatSqlOptions extends IFormatQueryBaseOptions {
  wrapWhereClause?: boolean;
}

export interface IFormatAqlOptions extends IFormatQueryBaseOptions {
  wrapFilterClause?: boolean;
  variableName?: string;
}

export interface IFormatElasticsearchOptions extends IFormatQueryBaseOptions {
  wrapQueryClause?: boolean;
}

export interface IFormatPrismaOptions extends IFormatQueryBaseOptions {
  wrapWhereClause?: boolean;
}

export interface IFormatODataOptions extends IFormatQueryBaseOptions {
  wrapFilterClause?: boolean;
}`;

const parseQuerySignature = `export const parseQuery = (
  value: string,
  format: QueryFormat
): IParseQueryResult;`;

const parseResultSignature = `export interface IParseQueryResult {
  fields: IBuilderFieldProps[];
  data: DenormalizedQuery;
}`;

const queryFormatSignature = `export type QueryFormat =
  | 'SQL'
  | 'Mongo'
  | 'AQL'
  | 'JSONata'
  | 'JsonLogic'
  | 'CEL'
  | 'Elasticsearch'
  | 'SpEL'
  | 'Prisma'
  | 'OData'
  | 'RSQL'
  | 'Dynamo'
  | 'Django';`;

export interface IApiPage {
  path: string;
  title: string;
  sectionKey: string;
  sectionTitle: string;
  summary: string;
  description: string;
  searchText: string;
  content: React.ReactNode;
}

export interface IApiGroup {
  key: string;
  title: string;
  pages: IApiPage[];
}

export const apiPages: IApiPage[] = [
  {
    path: '/api',
    title: 'API Overview',
    sectionKey: 'overview',
    sectionTitle: 'API',
    summary: '',
    description:
      'API overview covering core builder types, customization points, and query conversion exports.',
    searchText:
      'API overview builder props fields data components formatQuery parseQuery exports types shapes reference',
    content: (
      <>
        <List>
          <li><ItemTitle>Core API:</ItemTitle> <InlineCode>Builder</InlineCode>, <InlineCode>Fields</InlineCode>, and <InlineCode>Data</InlineCode>.</li>
          <li><ItemTitle>Editing state:</ItemTitle> <InlineCode>Builder</InlineCode> also exposes history-related state such as <InlineCode>canUndo</InlineCode> and <InlineCode>canRedo</InlineCode> through <InlineCode>onStateChange</InlineCode>.</li>
          <li><ItemTitle>Imperative control:</ItemTitle> <InlineCode>useBuilderRef</InlineCode> and <InlineCode>IBuilderRef</InlineCode> expose builder actions through a React ref.</li>
          <li><ItemTitle>Customization:</ItemTitle> <InlineCode>Components</InlineCode>, <InlineCode>Adapters</InlineCode>, and <InlineCode>Theming</InlineCode>.</li>
          <li><ItemTitle>Query Conversion:</ItemTitle> <InlineCode>formatQuery</InlineCode> and <InlineCode>parseQuery</InlineCode>.</li>
        </List>
        <AlertBox title="Documentation and demo" variant="info">
          Use <TextLink to="/documentation">Documentation</TextLink> for setup,
          usage, and format walkthroughs. Use <TextLink to="/demo">Demo</TextLink>{' '}
          for the live sandbox. Use API pages for exact signatures, props, and
          option meanings.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/api/builder',
    title: 'Builder',
    sectionKey: 'core',
    sectionTitle: 'Core API',
    summary: '',
    description:
      'Builder component API reference for IBuilderProps, controlled data flow, validation, and editing options.',
    searchText:
      'Builder component IBuilderProps onChange controlled component defaults strings components validator history state change undo redo canUndo canRedo',
    content: (
      <>
        <CodeBlock code={builderSignature} language="ts" label="IBuilderProps" />
        <CodeBlock code={historyConfigSignature} language="ts" label="IBuilderHistoryConfig" />
        <SectionTitle>Props</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>fields</InlineCode>:</ItemTitle> Required. Defines the available fields, their types, allowed operators, and optional validation metadata.</li>
          <li><ItemTitle><InlineCode>data</InlineCode>:</ItemTitle> Required. The current denormalized query tree. The builder treats this as controlled input.</li>
          <li><ItemTitle>Ref support:</ItemTitle> <InlineCode>Builder</InlineCode> supports React refs and can be paired with <InlineCode>useBuilderRef()</InlineCode> for imperative access.</li>
          <li><ItemTitle><InlineCode>components</InlineCode>:</ItemTitle> Optional overrides for internal UI pieces. Omitted entries fall back to default components.</li>
          <li><ItemTitle><InlineCode>strings</InlineCode>:</ItemTitle> Optional localized UI strings used by the built-in controls.</li>
          <li><ItemTitle><InlineCode>readOnly</InlineCode>:</ItemTitle> Defaults to <InlineCode>false</InlineCode>. Disables editing actions when enabled.</li>
          <li><ItemTitle><InlineCode>lockable</InlineCode>:</ItemTitle> Defaults to <InlineCode>false</InlineCode>. Renders lock controls for rules and groups and writes the resulting lock state back into emitted query data.</li>
          <li><ItemTitle><InlineCode>cloneable</InlineCode>:</ItemTitle> Defaults to <InlineCode>false</InlineCode>. Renders clone controls for rules and groups and inserts the cloned node directly below the original.</li>
          <li><ItemTitle><InlineCode>draggable</InlineCode>:</ItemTitle> Defaults to <InlineCode>false</InlineCode>. Enables drag-and-drop reordering and movement of query nodes.</li>
          <li><ItemTitle><InlineCode>singleRootGroup</InlineCode>:</ItemTitle> Defaults to <InlineCode>true</InlineCode>. Wraps root-level items into a single root group and prevents deleting that root group.</li>
          <li><ItemTitle><InlineCode>groupTypes</InlineCode>:</ItemTitle> Defaults to <InlineCode>'with-modifiers'</InlineCode>. Controls whether groups use combinator/negation controls, modifierless groups, or both.</li>
          <li><ItemTitle><InlineCode>validator</InlineCode>:</ItemTitle> Optional function that receives the denormalized query plus validation context and returns a validation result synchronously or asynchronously.</li>
          <li><ItemTitle><InlineCode>onStateChange</InlineCode>:</ItemTitle> Optional callback fired with <InlineCode>data</InlineCode>, <InlineCode>isValid</InlineCode>, the full validation object, and history state flags such as <InlineCode>canUndo</InlineCode> and <InlineCode>canRedo</InlineCode>.</li>
          <li><ItemTitle><InlineCode>showValidation</InlineCode>:</ItemTitle> Defaults to <InlineCode>false</InlineCode>. Controls whether validation issues are rendered in the built-in UI.</li>
          <li><ItemTitle><InlineCode>history</InlineCode>:</ItemTitle> Optional. Set to <InlineCode>true</InlineCode> to enable undo and redo with default settings, or pass <InlineCode>IBuilderHistoryConfig</InlineCode> to customize retention and built-in controls.</li>
          <li><ItemTitle><InlineCode>onChange</InlineCode>:</ItemTitle> Optional callback fired with the denormalized query tree after changes are emitted.</li>
        </List>
        <SectionTitle>History config</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>maxEntries</InlineCode>:</ItemTitle> Optional limit for how many undo steps are retained.</li>
          <li><ItemTitle><InlineCode>controls</InlineCode>:</ItemTitle> Optional toggle for rendering the built-in Undo and Redo buttons inside the builder UI.</li>
        </List>
        <AlertBox title="Documentation" variant="info">
          <TextLink to="/documentation/usage">Usage</TextLink> and{' '}
          <TextLink to="/documentation/history">Undo and Redo</TextLink>, and{' '}
          <TextLink to="/documentation/builder-ref">Builder Ref</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/api/builder-ref',
    title: 'Builder Ref',
    sectionKey: 'core',
    sectionTitle: 'Core API',
    summary: '',
    description:
      'API reference for useBuilderRef, IBuilderRef, and the imperative builder methods for node operations and history access.',
    searchText:
      'useBuilderRef IBuilderRef BuilderRef imperative ref cloneNode deleteNode replaceNode updateNode insertNodes addNode addGroup addRule moveNode setNodeLock lockNode unlockNode getNodeById getNodes getData getHistory setHistory undo redo',
    content: (
      <>
        <CodeBlock code={builderRefSignature} language="ts" label="Builder ref API" />
        <SectionTitle>How to attach it</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>useBuilderRef()</InlineCode>:</ItemTitle> Returns a typed mutable React ref object for the builder instance.</li>
          <li><ItemTitle><InlineCode>{'<Builder ref={builderRef} />'}</InlineCode>:</ItemTitle> Attaches the ref to the builder so <InlineCode>builderRef.current</InlineCode> exposes the imperative methods.</li>
        </List>
        <SectionTitle>Read methods</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>getNodeById(nodeId)</InlineCode>:</ItemTitle> Returns one normalized node by id, or <InlineCode>undefined</InlineCode> when it does not exist.</li>
          <li><ItemTitle><InlineCode>getNodes()</InlineCode>:</ItemTitle> Returns the current normalized query array.</li>
          <li><ItemTitle><InlineCode>getData()</InlineCode>:</ItemTitle> Returns the current denormalized query tree in the same shape emitted by <InlineCode>onChange</InlineCode>.</li>
          <li><ItemTitle><InlineCode>getHistory()</InlineCode>:</ItemTitle> Returns the current history object with <InlineCode>past</InlineCode> and <InlineCode>future</InlineCode> stacks.</li>
        </List>
        <SectionTitle>Mutation methods</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>cloneNode(nodeId)</InlineCode>:</ItemTitle> Clones a rule or group subtree directly below the original node.</li>
          <li><ItemTitle><InlineCode>deleteNode(nodeId)</InlineCode>:</ItemTitle> Removes a node subtree.</li>
          <li><ItemTitle><InlineCode>replaceNode(nodeId, node)</InlineCode>:</ItemTitle> Replaces a normalized node directly.</li>
          <li><ItemTitle><InlineCode>updateNode(nodeId, updater)</InlineCode>:</ItemTitle> Reads the current normalized node, passes it to an updater, and replaces it with the updater result.</li>
          <li><ItemTitle><InlineCode>insertNodes(nodes, index, parentId?)</InlineCode>:</ItemTitle> Inserts one or more normalized nodes at the target index, either at the root or inside a group.</li>
          <li><ItemTitle><InlineCode>addNode(node, parentId?, index?)</InlineCode>:</ItemTitle> Inserts one normalized node and appends it when <InlineCode>index</InlineCode> is omitted.</li>
          <li><ItemTitle><InlineCode>addGroup(groupType?, parentId?, index?)</InlineCode>:</ItemTitle> Creates and inserts a new group node.</li>
          <li><ItemTitle><InlineCode>addRule(rule?, parentId?, index?)</InlineCode>:</ItemTitle> Creates and inserts a new rule node with optional initial values.</li>
          <li><ItemTitle><InlineCode>moveNode(nodeId, index, parentId?)</InlineCode>:</ItemTitle> Moves a node to a new index and optional parent group.</li>
        </List>
        <SectionTitle>Lock and history methods</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>setNodeLock(nodeId, state)</InlineCode>:</ItemTitle> Sets the explicit lock state for a rule or group. Groups additionally support <InlineCode>'all'</InlineCode> for descendant inheritance.</li>
          <li><ItemTitle><InlineCode>lockNode(nodeId, state?)</InlineCode>:</ItemTitle> Convenience wrapper for locking a node. For rules, the effective lock state is always <InlineCode>'self'</InlineCode>.</li>
          <li><ItemTitle><InlineCode>unlockNode(nodeId)</InlineCode>:</ItemTitle> Clears the node&apos;s lock state.</li>
          <li><ItemTitle><InlineCode>undo()</InlineCode> and <InlineCode>redo()</InlineCode>:</ItemTitle> Replay history steps when history is enabled.</li>
          <li><ItemTitle><InlineCode>setHistory(history)</InlineCode>:</ItemTitle> Replaces the current history state. This is useful for clearing or restoring custom history snapshots.</li>
        </List>
        <AlertBox title="Documentation" variant="info">
          <TextLink to="/documentation/builder-ref">Builder Ref</TextLink>,{' '}
          <TextLink to="/documentation/history">Undo and Redo</TextLink>, and{' '}
          <TextLink to="/api/builder">Builder</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/api/fields',
    title: 'Fields',
    sectionKey: 'core',
    sectionTitle: 'Core API',
    summary: '',
    description:
      'Field definition API reference for IBuilderFieldProps, field types, operators, and validation metadata.',
    searchText:
      'IBuilderFieldProps field label type value operators validation BOOLEAN TEXT DATE NUMBER STATEMENT LIST MULTI_LIST GROUP',
    content: (
      <>
        <CodeBlock code={fieldTypesSignature} language="ts" label="Field unions" />
        <CodeBlock code={fieldBaseSignature} language="ts" label="Shared field shape" />
        <SectionTitle>Props</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>field</InlineCode>:</ItemTitle> Required stable identifier used in query data and conversion helpers.</li>
          <li><ItemTitle><InlineCode>label</InlineCode>:</ItemTitle> Required user-facing caption shown in the field selector.</li>
          <li><ItemTitle><InlineCode>type</InlineCode>:</ItemTitle> Required field type. This controls which widget and value semantics are used.</li>
          <li><ItemTitle><InlineCode>value</InlineCode>:</ItemTitle> Optional default or backing field value metadata. For <InlineCode>LIST</InlineCode> and <InlineCode>MULTI_LIST</InlineCode>, this is the option set.</li>
          <li><ItemTitle><InlineCode>operators</InlineCode>:</ItemTitle> Optional operator whitelist. When omitted, the builder falls back to the default operators for the field type.</li>
          <li><ItemTitle><InlineCode>validation</InlineCode>:</ItemTitle> Optional validation config. The shape depends on field type.</li>
        </List>
        <SectionTitle>Type notes</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>BOOLEAN</InlineCode> / <InlineCode>TEXT</InlineCode> / <InlineCode>DATE</InlineCode> / <InlineCode>NUMBER</InlineCode>:</ItemTitle> The standard scalar field families with built-in widget and validation behavior.</li>
          <li><ItemTitle><InlineCode>LIST</InlineCode> / <InlineCode>MULTI_LIST</InlineCode>:</ItemTitle> Option-backed selectors where <InlineCode>value</InlineCode> holds the option set.</li>
          <li><ItemTitle><InlineCode>STATEMENT</InlineCode>:</ItemTitle> Advanced field type for free-form statement-like values. Document it carefully in consuming apps because it is less self-explanatory than scalar or list fields.</li>
          <li><ItemTitle><InlineCode>GROUP</InlineCode>:</ItemTitle> Advanced structural field type intended for specialized query models rather than everyday filter fields.</li>
        </List>
        <AlertBox title="Documentation" variant="info">
          <TextLink to="/documentation/usage">Usage</TextLink> and{' '}
          <TextLink to="/documentation/localization">Localization</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/api/data',
    title: 'Data',
    sectionKey: 'core',
    sectionTitle: 'Core API',
    summary: '',
    description:
      'Query data API reference for denormalized rule and group shapes, values, and read-only semantics.',
    searchText:
      'DenormalizedQuery DenormalizedNode IDenormalizedRuleNode IDenormalizedGroupNode QueryRuleValue QueryGroupValue readOnly id parent',
    content: (
      <>
        <CodeBlock code={queryTreeSignature} language="ts" label="Query tree types" />
        <SectionTitle>Rule props</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>field</InlineCode>:</ItemTitle> Required field identifier matching one of the configured fields.</li>
          <li><ItemTitle><InlineCode>operator</InlineCode>:</ItemTitle> Optional operator for the rule. Some field and operator combinations imply different value shapes.</li>
          <li><ItemTitle><InlineCode>value</InlineCode>:</ItemTitle> Optional rule value. Supported scalar/array forms are defined by <InlineCode>QueryRuleValue</InlineCode>.</li>
          <li><ItemTitle><InlineCode>operators</InlineCode>:</ItemTitle> Optional rule-level operator override list.</li>
          <li><ItemTitle><InlineCode>readOnly</InlineCode>:</ItemTitle> Optional per-rule lock flag. It locks only that rule and does not affect siblings, parents, or descendants.</li>
          <li><ItemTitle>GUI cycle:</ItemTitle> When <InlineCode>lockable</InlineCode> is enabled, rules cycle between unlocked and locked, which maps to omitted <InlineCode>readOnly</InlineCode> and <InlineCode>readOnly: true</InlineCode>.</li>
          <li><ItemTitle><InlineCode>id</InlineCode> and <InlineCode>parent</InlineCode>:</ItemTitle> Optional in denormalized input. The builder can ingest data without them.</li>
        </List>
        <SectionTitle>Group props</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>type</InlineCode>:</ItemTitle> Always <InlineCode>'GROUP'</InlineCode>.</li>
          <li><ItemTitle><InlineCode>children</InlineCode>:</ItemTitle> Required nested nodes.</li>
          <li><ItemTitle><InlineCode>value</InlineCode>:</ItemTitle> Present only for groups with modifiers and must be <InlineCode>'AND'</InlineCode> or <InlineCode>'OR'</InlineCode>.</li>
          <li><ItemTitle><InlineCode>isNegated</InlineCode>:</ItemTitle> Present only for groups with modifiers.</li>
          <li><ItemTitle><InlineCode>readOnly</InlineCode>:</ItemTitle> Can be a boolean or an object with <InlineCode>enabled</InlineCode> and optional <InlineCode>inheritToChildren</InlineCode>.</li>
          <li><ItemTitle><InlineCode>readOnly: true</InlineCode>:</ItemTitle> Locks only the group&apos;s own controls by default. Descendant rules and groups remain editable unless inheritance is enabled.</li>
          <li><ItemTitle>GUI cycle:</ItemTitle> When <InlineCode>lockable</InlineCode> is enabled, groups cycle through unlocked, locked group only, and locked group with descendants.</li>
          <li><ItemTitle><InlineCode>inheritToChildren</InlineCode>:</ItemTitle> Applies the group lock to all descendants when the group is enabled. Descendants cannot override an inherited lock from an ancestor.</li>
        </List>
        <AlertBox title="Documentation" variant="info">
          <TextLink to="/documentation/usage">Usage</TextLink> and{' '}
          <TextLink to="/documentation/locking-and-read-only">Locking and Read-only</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/api/components',
    title: 'Components',
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'Component override API reference for replacing built-in builder controls, containers, and popovers.',
    searchText:
      'IBuilderComponentsProps Select SelectMulti Switch Input Remove Add Rule Group GroupHeaderOption Text DropZone EmptyGroupDropZone Popover PopoverItem',
    content: (
      <>
        <CodeBlock code={componentsSignature} language="ts" label="Component overrides" />
        <CodeBlock code={cloneButtonSignature} language="ts" label="CloneButton props" />
        <CodeBlock code={lockToggleSignature} language="ts" label="LockToggle props" />
        <CodeBlock code={historyControlsSignature} language="ts" label="HistoryControls props" />
        <SectionTitle>Props</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>form.Select</InlineCode> / <InlineCode>form.SelectMulti</InlineCode> / <InlineCode>form.Switch</InlineCode> / <InlineCode>form.Input</InlineCode>:</ItemTitle> Replace the built-in form controls used by rules and groups.</li>
          <li><ItemTitle><InlineCode>Remove</InlineCode> and <InlineCode>Add</InlineCode>:</ItemTitle> Replace action buttons used for structural editing.</li>
          <li><ItemTitle><InlineCode>CloneButton</InlineCode>:</ItemTitle> Replaces the built-in clone control used when <InlineCode>cloneable</InlineCode> is enabled.</li>
          <li><ItemTitle><InlineCode>LockToggle</InlineCode>:</ItemTitle> Replaces the built-in lock control used when <InlineCode>lockable</InlineCode> is enabled.</li>
          <li><ItemTitle><InlineCode>HistoryControls</InlineCode>:</ItemTitle> Replaces the layout wrapper around the built-in undo and redo controls used when history controls are enabled.</li>
          <li><ItemTitle><InlineCode>Rule</InlineCode> and <InlineCode>Group</InlineCode>:</ItemTitle> Replace the main structural containers.</li>
          <li><ItemTitle><InlineCode>GroupHeaderOption</InlineCode>:</ItemTitle> Replaces the header option control used in group UIs.</li>
          <li><ItemTitle><InlineCode>Text</InlineCode>:</ItemTitle> Replaces the built-in text rendering component.</li>
          <li><ItemTitle><InlineCode>DropZone</InlineCode> and <InlineCode>EmptyGroupDropZone</InlineCode>:</ItemTitle> Replaces drag-and-drop target renderers.</li>
          <li><ItemTitle><InlineCode>Popover</InlineCode> and <InlineCode>PopoverItem</InlineCode>:</ItemTitle> Replaces the popover UI used by group creation mode where relevant.</li>
        </List>
        <SectionTitle>Key prop contracts</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>form.Input</InlineCode>:</ItemTitle> Receives <InlineCode>type</InlineCode>, <InlineCode>value</InlineCode>, <InlineCode>onChange(value)</InlineCode>, and optional <InlineCode>disabled</InlineCode>, <InlineCode>id</InlineCode>, and <InlineCode>name</InlineCode>.</li>
          <li><ItemTitle><InlineCode>form.Select</InlineCode>:</ItemTitle> Receives <InlineCode>values</InlineCode>, <InlineCode>selectedValue</InlineCode>, <InlineCode>emptyValue</InlineCode>, and <InlineCode>onChange(value)</InlineCode>.</li>
          <li><ItemTitle><InlineCode>form.SelectMulti</InlineCode>:</ItemTitle> Receives <InlineCode>selectedValue</InlineCode>, <InlineCode>values</InlineCode>, <InlineCode>onChange(value)</InlineCode>, and <InlineCode>onDelete(value)</InlineCode>.</li>
          <li><ItemTitle><InlineCode>form.Switch</InlineCode>:</ItemTitle> Receives <InlineCode>switched</InlineCode>, optional <InlineCode>onChange(value)</InlineCode>, and optional <InlineCode>disabled</InlineCode>.</li>
          <li><ItemTitle><InlineCode>CloneButton</InlineCode>:</ItemTitle> Receives <InlineCode>nodeType</InlineCode>, optional <InlineCode>disabled</InlineCode>, and <InlineCode>onClick()</InlineCode>.</li>
          <li><ItemTitle><InlineCode>LockToggle</InlineCode>:</ItemTitle> Receives <InlineCode>state</InlineCode>, <InlineCode>nodeType</InlineCode>, optional <InlineCode>disabled</InlineCode>, and <InlineCode>onChange(nextState)</InlineCode>.</li>
          <li><ItemTitle><InlineCode>HistoryControls</InlineCode>:</ItemTitle> Receives built-in <InlineCode>undoButton</InlineCode> and <InlineCode>redoButton</InlineCode> nodes plus <InlineCode>canUndo</InlineCode>, <InlineCode>canRedo</InlineCode>, <InlineCode>onUndo()</InlineCode>, and <InlineCode>onRedo()</InlineCode>.</li>
          <li><ItemTitle><InlineCode>Rule</InlineCode>:</ItemTitle> Receives already-built <InlineCode>children</InlineCode>, <InlineCode>controls</InlineCode>, and optional <InlineCode>dragHandle</InlineCode>.</li>
          <li><ItemTitle><InlineCode>Group</InlineCode>:</ItemTitle> Receives <InlineCode>controlsLeft</InlineCode>, <InlineCode>controlsRight</InlineCode>, <InlineCode>children</InlineCode>, and optional overlays or drag handles.</li>
          <li><ItemTitle><InlineCode>DropZone</InlineCode>:</ItemTitle> Receives <InlineCode>id</InlineCode>, <InlineCode>index</InlineCode>, optional <InlineCode>parentId</InlineCode>, and drag-state flags.</li>
          <li><ItemTitle><InlineCode>EmptyGroupDropZone</InlineCode>:</ItemTitle> Receives the target group id plus drag-state flags for empty containers.</li>
        </List>
        <AlertBox title="Documentation" variant="info">
          <TextLink to="/documentation/components">Components</TextLink> and{' '}
          <TextLink to="/documentation/adapters">Adapters</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/api/adapters',
    title: 'Adapters',
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'API reference for packaged UI adapter entrypoints such as Material UI v7 and v9 and how they map onto the components override surface.',
    searchText:
      'Adapters API mui material ui v7 v9 antd ant design v5 v6 components object adapter entrypoints customization',
    content: (
      <>
        <CodeBlock code={muiAdapterSnippet} language="tsx" label="MUI v9 adapter usage" />
        <CodeBlock code={antdAdapterSnippet} language="tsx" label="ANTD v6 adapter usage" />
        <CodeBlock code={muiV7Snippet} language="tsx" label="MUI v7 import" />
        <CodeBlock code={antdV5Snippet} language="tsx" label="ANTD v5 import" />
        <CodeBlock code={muiCreateComponentsSnippet} language="tsx" label="createMuiComponents" />
        <CodeBlock code={antdCreateComponentsSnippet} language="tsx" label="createAntdComponents" />
        <SectionTitle>Available adapter entrypoints</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>@vojtechportes/react-query-builder/mui/v9</InlineCode>:</ItemTitle> Recommended Material UI adapter for new projects.</li>
          <li><ItemTitle><InlineCode>@vojtechportes/react-query-builder/mui/v7</InlineCode>:</ItemTitle> Material UI adapter for applications still on MUI 7.</li>
          <li><ItemTitle><InlineCode>@vojtechportes/react-query-builder/antd/v6</InlineCode>:</ItemTitle> Recommended Ant Design adapter for new projects.</li>
          <li><ItemTitle><InlineCode>@vojtechportes/react-query-builder/antd/v5</InlineCode>:</ItemTitle> Ant Design adapter for applications still on Ant Design 5.</li>
        </List>
        <SectionTitle>What adapters export</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>components</InlineCode>:</ItemTitle> A ready-to-pass object that matches <InlineCode>IBuilderComponentsProps</InlineCode>.</li>
          <li><ItemTitle>Individual mapped components:</ItemTitle> Named exports such as <InlineCode>MuiSelect</InlineCode>, <InlineCode>MuiInput</InlineCode>, <InlineCode>AntdSelect</InlineCode>, and <InlineCode>AntdInput</InlineCode> for partial customization.</li>
          <li><ItemTitle><InlineCode>createMuiComponents</InlineCode> and <InlineCode>createAntdComponents</InlineCode>:</ItemTitle> Helpers for merging adapter defaults with local overrides while preserving the nested <InlineCode>form</InlineCode> mapping.</li>
        </List>
        <SectionTitle>Relationship to the Components API</SectionTitle>
        <List>
          <li>Adapters are built on top of the same override surface documented in <TextLink to="/api/components">Components</TextLink>.</li>
          <li>They are a convenience layer, not a separate rendering engine.</li>
          <li><InlineCode>createMuiComponents(base, overrides)</InlineCode> and <InlineCode>createAntdComponents(base, overrides)</InlineCode> return merged <InlineCode>IBuilderComponentsProps</InlineCode> objects and handle shallow top-level merging plus nested <InlineCode>form</InlineCode> merging for you.</li>
        </List>
        <AlertBox title="Documentation" variant="info">
          <TextLink to="/documentation/adapters">Adapters</TextLink>,{' '}
          <TextLink to="/documentation/components">Components</TextLink>, and{' '}
          <TextLink to="/api/theming">Theming</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/api/theming',
    title: 'Theming',
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'Theming API reference for ThemeProvider, IThemeProviderProps, IColors, and exported color tokens.',
    searchText:
      'ThemeProvider IThemeProviderProps IThemeProps IColors colors primary secondary grey white theme customization',
    content: (
      <>
        <CodeBlock code={themeProviderSignature} language="ts" label="ThemeProvider" />
        <CodeBlock code={colorsSignature} language="ts" label="Color types" />
        <SectionTitle>Props</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>colors</InlineCode>:</ItemTitle> Optional partial replacement source for theme color values provided through context.</li>
          <li><ItemTitle><InlineCode>children</InlineCode>:</ItemTitle> Optional React subtree that receives the theme context.</li>
          <li><ItemTitle><InlineCode>colors.primary</InlineCode> and <InlineCode>colors.secondary</InlineCode>:</ItemTitle> Color variants used by primary and secondary action surfaces.</li>
          <li><ItemTitle><InlineCode>colors.grey</InlineCode>:</ItemTitle> Neutral palette used for borders, text, backgrounds, and control states.</li>
          <li><ItemTitle><InlineCode>colors.white</InlineCode>:</ItemTitle> Surface color used by builder containers and controls.</li>
          <li><ItemTitle>Adapter note:</ItemTitle> <InlineCode>ThemeProvider</InlineCode> affects the built-in default components. If a packaged adapter is used instead, these tokens do not theme the adapter UI.</li>
        </List>
        <AlertBox title="Documentation" variant="info">
          <TextLink to="/documentation/theming">Theming</TextLink> and{' '}
          <TextLink to="/documentation/adapters">Adapters</TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/api/format-query',
    title: 'formatQuery',
    sectionKey: 'exports',
    sectionTitle: 'Query Conversion',
    summary: '',
    description:
      'API reference for formatQuery, including supported formats and shared or format-specific options.',
    searchText:
      'formatQuery signature parameters value format options fields wrapWhereClause wrapFilterClause wrapQueryClause variableName rootlessCombinator modifierlessGroupCombinator',
    content: (
      <>
        <CodeBlock code={formatQuerySignature} language="ts" label="formatQuery signature" />
        <CodeBlock code={queryFormatSignature} language="ts" label="Supported formats" />
        <CodeBlock code={formatOptionsSignature} language="ts" label="Options types" />
        <SectionTitle>Parameters</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>value</InlineCode>:</ItemTitle> The <TextLink to="/api/data">denormalized query tree</TextLink> to serialize.</li>
          <li><ItemTitle><InlineCode>format</InlineCode>:</ItemTitle> The target format. This determines both the formatter used and the shape of accepted options.</li>
          <li><ItemTitle><InlineCode>options</InlineCode>:</ItemTitle> Optional formatter configuration.</li>
        </List>
        <SectionTitle>Shared options</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>fields</InlineCode>:</ItemTitle> Supplies <TextLink to="/api/fields">field metadata</TextLink> to the formatter. This is often required when output depends on field type, option labels, or value semantics.</li>
          <li><ItemTitle><InlineCode>rootlessCombinator</InlineCode>:</ItemTitle> Chooses how root-level items are combined when the query does not have a single explicit root group. This matters most when <InlineCode>singleRootGroup</InlineCode> is disabled.</li>
          <li><ItemTitle><InlineCode>modifierlessGroupCombinator</InlineCode>:</ItemTitle> Chooses how children of modifierless groups are combined when a group has structure but no embedded AND/OR modifier.</li>
        </List>
        <SectionTitle>Behavior notes</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>fields</InlineCode>:</ItemTitle> Treat this as recommended for anything beyond trivial string-only formatting, especially for typed values and list-backed fields.</li>
          <li><ItemTitle><InlineCode>rootlessCombinator</InlineCode>:</ItemTitle> If your tree has multiple top-level nodes, this decides whether the exported expression joins them with <InlineCode>AND</InlineCode> or <InlineCode>OR</InlineCode>.</li>
          <li><ItemTitle><InlineCode>modifierlessGroupCombinator</InlineCode>:</ItemTitle> Use this when your UI allows groups without modifiers and your target syntax still needs a combinator in serialized output.</li>
        </List>
        <SectionTitle>Format-specific options</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>wrapWhereClause</InlineCode>:</ItemTitle> Supported by SQL and Prisma format options. Prefixes the output with <InlineCode>WHERE </InlineCode>.</li>
          <li><ItemTitle><InlineCode>wrapFilterClause</InlineCode>:</ItemTitle> Supported by AQL and OData format options. Prefixes the output with <InlineCode>FILTER </InlineCode> or equivalent filter clause semantics.</li>
          <li><ItemTitle><InlineCode>variableName</InlineCode>:</ItemTitle> Supported by AQL format options. Sets the document variable prefix used in generated expressions.</li>
          <li><ItemTitle><InlineCode>wrapQueryClause</InlineCode>:</ItemTitle> Supported by Elasticsearch format options. Wraps the generated expression in the outer query clause shape.</li>
        </List>
        <AlertBox title="See also" variant="info">
          For a live sandbox that exercises these formats, use{' '}
          <TextLink to="/documentation/parsing-and-formatting">
            Parsing and Formatting
          </TextLink>.
        </AlertBox>
      </>
    ),
  },
  {
    path: '/api/parse-query',
    title: 'parseQuery',
    sectionKey: 'exports',
    sectionTitle: 'Query Conversion',
    summary: '',
    description:
      'API reference for parseQuery, including supported input formats and the parse result shape.',
    searchText:
      'parseQuery signature parameters value format IParseQueryResult fields data QueryFormat',
    content: (
      <>
        <CodeBlock code={parseQuerySignature} language="ts" label="parseQuery signature" />
        <CodeBlock code={queryFormatSignature} language="ts" label="Supported formats" />
        <CodeBlock code={parseResultSignature} language="ts" label="Parse result" />
        <SectionTitle>Parameters</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>value</InlineCode>:</ItemTitle> The input string to parse.</li>
          <li><ItemTitle><InlineCode>format</InlineCode>:</ItemTitle> The source syntax. Parsing behavior is selected entirely from this value.</li>
        </List>
        <SectionTitle>Return value</SectionTitle>
        <List>
          <li><ItemTitle><InlineCode>fields</InlineCode>:</ItemTitle> <TextLink to="/api/fields">Field metadata</TextLink> inferred by the parser where possible. Some parsers can infer types and operator sets from the source expression.</li>
          <li><ItemTitle><InlineCode>data</InlineCode>:</ItemTitle> The <TextLink to="/api/data">denormalized query tree</TextLink> produced from the input string.</li>
        </List>
        <AlertBox title="Documentation" variant="info">
          <TextLink to="/documentation/parsing-and-formatting">Parsing and Formatting</TextLink>.
        </AlertBox>
      </>
    ),
  },
];

export const apiGroups: IApiGroup[] = [
  {
    key: 'core',
    title: 'Core API',
    pages: apiPages.filter(page => page.sectionKey === 'core'),
  },
  {
    key: 'customization',
    title: 'Customization',
    pages: apiPages.filter(page => page.sectionKey === 'customization'),
  },
  {
    key: 'exports',
    title: 'Query Conversion',
    pages: apiPages.filter(page => page.sectionKey === 'exports'),
  },
];

export const findApiPage = (pathname: string) =>
  apiPages.find(page => page.path === pathname) ?? apiPages[0];

export const apiOverviewPage = apiPages[0];
