import * as React from 'react';
import { OverviewApiContent } from '../components/overview-api-content';
import { BuilderApiContent } from '../components/builder-api-content';
import { BuilderRefApiContent } from '../components/builder-ref-api-content';
import { FieldsApiContent } from '../components/fields-api-content';
import { DataApiContent } from '../components/data-api-content';
import { ComponentsApiContent } from '../components/components-api-content';
import { AdaptersApiContent } from '../components/adapters-api-content';
import { AdaptersMuiApiContent } from '../components/adapters-mui-api-content';
import { AdaptersAntdApiContent } from '../components/adapters-antd-api-content';
import { AdaptersFluentuiApiContent } from '../components/adapters-fluentui-api-content';
import { AdaptersMantineApiContent } from '../components/adapters-mantine-api-content';
import { AdaptersBootstrapApiContent } from '../components/adapters-bootstrap-api-content';
import { AdaptersRadixApiContent } from '../components/adapters-radix-api-content';
import { ThemingApiContent } from '../components/theming-api-content';
import { FormatQueryApiContent } from '../components/format-query-api-content';
import { ParseQueryApiContent } from '../components/parse-query-api-content';
import type { IApiPage } from '../types/api-page';

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
      'API overview builder props fields data components adapters bootstrap formatQuery parseQuery exports types shapes reference',
    content: <OverviewApiContent />,
  },
  {
    path: '/api/builder',
    title: 'Builder',
    sectionKey: 'core',
    sectionTitle: 'Core API',
    summary: '',
    description:
      'Builder component API reference for IBuilderProps, controlled data flow, validation, editing options, and field-to-field comparisons.',
    searchText:
      'Builder component IBuilderProps onChange controlled component defaults strings components validator history state change undo redo canUndo canRedo newNodePlacement append prepend allowFieldComparisons field comparison valueSource valueField',
    content: <BuilderApiContent />,
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
      'useBuilderRef useBuilderRuleDependencies bindRuleOptions IBuilderRef BuilderRef BuilderRefListener BuilderRuleDependenciesListener imperative ref subscribe subscribeToRuleDependencies cloneNode deleteNode replaceNode updateNode insertNodes addNode addGroup addRule moveNode setNodeLock lockNode unlockNode getNodeById getNearestField getNodes getData getHistory setHistory undo redo isFieldInUse getFieldOptionState getRuleOptionState setFieldOptions setRuleOptions setFieldOptionsStatus setRuleOptionsStatus invalidateFieldOptions invalidateRuleOptions reloadFieldOptions reloadRuleOptions clearFieldOptions clearRuleOptions',
    content: <BuilderRefApiContent />,
  },
  {
    path: '/api/fields',
    title: 'Fields',
    sectionKey: 'core',
    sectionTitle: 'Core API',
    summary: '',
    description:
      'Field definition API reference for IBuilderFieldProps, field types, operators, usageLimit, validation metadata, and field-comparison configuration.',
    searchText:
      'IBuilderFieldProps field label type value operators usageLimit validation fieldComparison comparableFields BOOLEAN TEXT DATE NUMBER STATEMENT LIST MULTI_LIST GROUP BuilderFieldOption BuilderFieldOptionsStatus IBuilderFieldOptionState INearestFieldMatch IBuilderFieldChange dynamic field options',
    content: <FieldsApiContent />,
  },
  {
    path: '/api/data',
    title: 'Data',
    sectionKey: 'core',
    sectionTitle: 'Core API',
    summary: '',
    description:
      'Query data API reference for denormalized rule and group shapes, literal versus field-reference values, and read-only semantics.',
    searchText:
      'DenormalizedQuery DenormalizedNode IDenormalizedRuleNode IDenormalizedGroupNode QueryRuleValue QueryRuleValueSource valueSource valueField QueryGroupValue readOnly id parent',
    content: <DataApiContent />,
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
    content: <ComponentsApiContent />,
  },
  {
    path: '/api/adapters',
    title: 'Adapters',
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'API overview for packaged UI adapter entrypoints, shared exports, and how adapters map onto the components override surface.',
    searchText:
      'Adapters API mui material ui antd ant design bootstrap mantine fluent ui radix themes components object adapter entrypoints customization shared exports',
    content: <AdaptersApiContent />,
  },
  {
    path: '/api/adapters/mui',
    title: 'MUI',
    depth: 1,
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'API reference for the Material UI adapter entrypoints, exports, and createMuiComponents helper.',
    searchText:
      'MUI adapter API material ui mui v9 mui v7 createMuiComponents components',
    content: <AdaptersMuiApiContent />,
  },
  {
    path: '/api/adapters/antd',
    title: 'ANTD',
    depth: 1,
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'API reference for the Ant Design adapter entrypoints, exports, and createAntdComponents helper.',
    searchText:
      'ANTD adapter API ant design antd v6 antd v5 createAntdComponents components',
    content: <AdaptersAntdApiContent />,
  },
  {
    path: '/api/adapters/fluentui',
    title: 'Fluent UI',
    depth: 1,
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'API reference for the Fluent UI adapter entrypoint, exports, and createFluentUiComponents helper.',
    searchText:
      'Fluent UI adapter API fluentui v8 createFluentUiComponents components',
    content: <AdaptersFluentuiApiContent />,
  },
  {
    path: '/api/adapters/mantine',
    title: 'Mantine',
    depth: 1,
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'API reference for the Mantine adapter entrypoints, exports, and createMantineComponents helper.',
    searchText:
      'Mantine adapter API mantine v9 mantine v8 createMantineComponents components',
    content: <AdaptersMantineApiContent />,
  },
  {
    path: '/api/adapters/bootstrap',
    title: 'Bootstrap',
    depth: 1,
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'API reference for the Bootstrap adapter entrypoint, exports, and createBootstrapComponents helper.',
    searchText:
      'Bootstrap adapter API bootstrap v5 createBootstrapComponents components',
    content: <AdaptersBootstrapApiContent />,
  },
  {
    path: '/api/adapters/radix',
    title: 'Radix',
    depth: 1,
    sectionKey: 'customization',
    sectionTitle: 'Customization',
    summary: '',
    description:
      'API reference for the Radix Themes adapter entrypoint, exports, and createRadixComponents helper.',
    searchText:
      'Radix adapter API radix themes radix v1 createRadixComponents components',
    content: <AdaptersRadixApiContent />,
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
    content: <ThemingApiContent />,
  },
  {
    path: '/api/format-query',
    title: 'formatQuery',
    sectionKey: 'exports',
    sectionTitle: 'Query Conversion',
    summary: '',
    description:
      'API reference for formatQuery, including supported formats, shared or format-specific options, and field-to-field serialization behavior.',
    searchText:
      'formatQuery signature parameters value format options fields wrapWhereClause wrapFilterClause wrapQueryClause variableName rootlessCombinator modifierlessGroupCombinator field comparison valueSource valueField',
    content: <FormatQueryApiContent />,
  },
  {
    path: '/api/parse-query',
    title: 'parseQuery',
    sectionKey: 'exports',
    sectionTitle: 'Query Conversion',
    summary: '',
    description:
      'API reference for parseQuery, including supported input formats, the parse result shape, and field-to-field inference.',
    searchText:
      'parseQuery signature parameters value format IParseQueryResult fields data QueryFormat field comparison valueSource valueField',
    content: <ParseQueryApiContent />,
  },
];
