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

const fieldComparisonSnippet = `import React, { useState } from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

const fields: IBuilderFieldProps[] = [
  {
    field: 'ORDER_TOTAL',
    label: 'Order total',
    type: 'NUMBER',
    operators: ['LARGER_EQUAL'],
    fieldComparison: {
      type: 'number',
      comparableFields: ['ORDER_APPROVAL_LIMIT'],
    },
  },
  {
    field: 'ORDER_APPROVAL_LIMIT',
    label: 'Approval limit',
    type: 'NUMBER',
    operators: ['LARGER_EQUAL'],
  },
  {
    field: 'CUSTOMER_COUNTRY',
    label: 'Customer country',
    type: 'LIST',
    operators: ['EQUAL'],
    value: [
      { value: 'CZ', label: 'Czech Republic' },
      { value: 'SK', label: 'Slovakia' },
    ],
    fieldComparison: {
      type: 'string',
      comparableFields: ['DELIVERY_COUNTRY_CODE'],
    },
  },
  {
    field: 'DELIVERY_COUNTRY_CODE',
    label: 'Delivery country code',
    type: 'TEXT',
    operators: ['EQUAL'],
  },
];

const initialData: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'ORDER_TOTAL',
        operator: 'LARGER_EQUAL',
        valueSource: 'field',
        valueField: 'ORDER_APPROVAL_LIMIT',
      },
      {
        field: 'CUSTOMER_COUNTRY',
        operator: 'EQUAL',
        valueSource: 'field',
        valueField: 'DELIVERY_COUNTRY_CODE',
      },
    ],
  },
];

export const FieldComparisonBuilder = () => {
  const [data, setData] = useState(initialData);

  return (
    <Builder
      allowFieldComparisons
      fields={fields}
      data={data}
      onChange={setData}
    />
  );
};`;

export const fieldComparisonsDocumentationPage: IDocumentationPage = {
  path: '/documentation/field-comparisons',
  title: 'Field Comparisons',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Enable rules that compare one field against another field, including configuration, data shape, and format support.',
  searchText:
    'field comparisons field-to-field allowFieldComparisons valueSource valueField comparableFields fieldComparison formatQuery parseQuery',
  content: (
    <>
      <p>
        Enable <InlineCode>allowFieldComparisons</InlineCode> on{' '}
        <TextLink to="/api/builder">Builder</TextLink> when a rule should be
        able to compare against another field instead of a literal value.
      </p>
      <CodeBlock
        code={fieldComparisonSnippet}
        language="tsx"
        label="Enable field comparisons"
      />
      <SectionTitle>How It Works</SectionTitle>
      <List>
        <li>
          <InlineCode>valueSource: 'field'</InlineCode> plus{' '}
          <InlineCode>valueField</InlineCode> stores the selected comparison
          field in query data.
        </li>
        <li>
          <InlineCode>fieldComparison.type</InlineCode> lets semantically
          compatible fields compare even when their builder UI types differ,
          such as <InlineCode>LIST</InlineCode> to <InlineCode>TEXT</InlineCode>
          .
        </li>
        <li>
          <InlineCode>fieldComparison.comparableFields</InlineCode> narrows the
          right-hand-side selector to an explicit allowlist owned by the source
          field.
        </li>
      </List>
      <AlertBox title="API reference" variant="info">
        <TextLink to="/api/builder">Builder</TextLink>,{' '}
        <TextLink to="/api/fields">Fields</TextLink>,{' '}
        <TextLink to="/api/data">Data</TextLink>,{' '}
        <TextLink to="/api/format-query">formatQuery</TextLink>, and{' '}
        <TextLink to="/api/parse-query">parseQuery</TextLink>.
      </AlertBox>
      <AlertBox title="Parsing and formatting" variant="tip">
        Native field-to-field formatting and parsing examples are documented in{' '}
        <TextLink to="/documentation/parsing-and-formatting/supported-formats">
          Supported Formats
        </TextLink>
        .
      </AlertBox>
    </>
  ),
};
