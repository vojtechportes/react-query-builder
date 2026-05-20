import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AlertBox } from '../../../components/alert-box';
import { CodeBlock } from '../../../components/code-block';
import { siteTheme } from '../../../constants/site-theme';

const TextLink = styled(Link)`
  color: ${siteTheme.primary};
  font-weight: 600;
`;

const List = styled.ul`
  margin: 0;
  margin-bottom: 1rem;
  padding-left: 1.2rem;
  line-height: 1.7;

  li + li {
    margin-top: 0.55rem;
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 1.15rem;
`;

const InlineCode = styled.code`
  padding: 0.14rem 0.32rem;
  border-radius: 16px;
  background: ${siteTheme.primarySurface};
  color: ${siteTheme.primaryDark};
  font-size: 0.92em;
`;

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
        <AlertBox title="API reference" variant="info">
          <TextLink to="/api/builder">Builder</TextLink>,{' '}
          <TextLink to="/api/fields">Fields</TextLink>, and{' '}
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
      'Components component overrides custom controls custom renderers builder customization add remove select input group rule',
    content: (
      <>
        <p>
          Replace built-in controls and containers through the{' '}
          <InlineCode>components</InlineCode> prop.
        </p>
        <CodeBlock code={componentsSnippet} language="tsx" label="Component overrides" />
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
