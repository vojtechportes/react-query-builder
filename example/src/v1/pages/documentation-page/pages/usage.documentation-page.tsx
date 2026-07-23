import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import { CodeBlock } from '../../../../components/code-block';
import { InlineCode, TextLink } from '../../../../components/docs-primitives';
import type { IDocumentationPage } from '../types/documentation-page';

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

export const usageDocumentationPage: IDocumentationPage = {
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
        The example includes a single rule with{' '}
        <InlineCode>readOnly: true</InlineCode> to show that locking can live
        directly in the query data without changing the rest of the builder
        configuration.
      </p>
      <AlertBox title="Related guide" variant="info">
        Need a rule to compare against another field instead of a literal value?
        Visit{' '}
        <TextLink to="/documentation/field-comparisons">
          Field Comparisons
        </TextLink>
        .
      </AlertBox>
      <AlertBox title="Next step" variant="tip">
        Continue with{' '}
        <TextLink to="/documentation/builder-ref">Builder Ref</TextLink> for
        imperative control,{' '}
        <TextLink to="/documentation/field-comparisons">
          Field Comparisons
        </TextLink>{' '}
        for cross-field rules,{' '}
        <TextLink to="/documentation/builder-behavior">
          Builder Behavior
        </TextLink>{' '}
        or <TextLink to="/documentation/text-mode">Text Mode</TextLink> or{' '}
        <TextLink to="/documentation/history">Undo and Redo</TextLink> for
        editing workflows, or{' '}
        <TextLink to="/documentation/dynamic-field-options">
          Dynamic Field Options
        </TextLink>{' '}
        for async select data, or{' '}
        <TextLink to="/documentation/locking-and-read-only">
          Locking and Read-only
        </TextLink>{' '}
        for partial locking.
      </AlertBox>
    </>
  ),
};
