import * as React from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
  useBuilderRef,
} from '@vojtechportes/react-query-builder';
import { RecipeBuilderSurface } from '../components/recipe-builder-surface';
import { RecipeDemoFrame } from '../components/recipe-demo-frame';
import { RecipeDemoGroup } from '../components/recipe-demo-group';
import { RecipeDemoOutput } from '../components/recipe-demo-output';
import { cloneRecipeQuery } from '../utils/clone-recipe-query.util';

const statusOptions = [
  { value: 'OPEN', label: 'Open' },
  { value: 'CLOSED', label: 'Closed' },
];
const refreshedStatusOptions = [
  ...statusOptions,
  { value: 'ARCHIVED', label: 'Archived' },
];
const fields: IBuilderFieldProps[] = [
  {
    field: 'name',
    label: 'Name',
    type: 'TEXT',
    operators: ['EQUAL', 'CONTAINS', 'IS_NULL'],
  },
  {
    field: 'amount',
    label: 'Amount',
    type: 'NUMBER',
    operators: ['EQUAL', 'LARGER', 'BETWEEN'],
  },
  {
    field: 'createdAt',
    label: 'Created',
    type: 'DATE',
    operators: ['EQUAL', 'SMALLER', 'LARGER'],
  },
  { field: 'active', label: 'Active', type: 'BOOLEAN' },
  {
    field: 'status',
    label: 'Status',
    type: 'LIST',
    value: statusOptions,
    operators: ['EQUAL', 'NOT_EQUAL', 'IN'],
  },
  {
    field: 'approvedAmount',
    label: 'Approved amount',
    type: 'NUMBER',
    fieldComparison: { type: 'number', comparableFields: ['amount'] },
  },
];
const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'status', operator: 'EQUAL', value: 'OPEN' }],
  },
];

export const DynamicOperatorsByFieldTypeDemo: React.FC = () => {
  const builderRef = useBuilderRef();
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const [query, setQuery] = React.useState(() =>
    cloneRecipeQuery(initialQuery)
  );
  const [status, setStatus] = React.useState('Options ready.');

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const refresh = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    builderRef.current?.setFieldOptionsStatus('status', 'loading');
    setStatus('Loading status options...');
    timerRef.current = setTimeout(() => {
      builderRef.current?.setFieldOptions('status', refreshedStatusOptions);
      builderRef.current?.setFieldOptionsStatus('status', 'success');
      setStatus('Loaded Open, Closed, and Archived.');
    }, 500);
  };

  const fail = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    builderRef.current?.setFieldOptions('status', []);
    builderRef.current?.setFieldOptionsStatus('status', 'error');
    setStatus('Option loading failed. Use Refresh options to retry.');
  };

  return (
    <RecipeDemoFrame
      title="Type-aware and dynamic fields"
      note="Switch fields to compare their operators, or refresh the Status options to see loading and error states."
      actions={
        <>
          <button type="button" onClick={refresh}>
            Refresh options
          </button>
          <button type="button" onClick={fail}>
            Simulate error
          </button>
        </>
      }
    >
      <RecipeDemoGroup>
        <RecipeBuilderSurface>
          <Builder
            ref={builderRef}
            fields={fields}
            data={query}
            onChange={setQuery}
            allowFieldComparisons
            showValidation
          />
        </RecipeBuilderSurface>
      </RecipeDemoGroup>
      <RecipeDemoGroup>
        <RecipeDemoOutput label="Status option loading" value={status} />
      </RecipeDemoGroup>
    </RecipeDemoFrame>
  );
};

export default DynamicOperatorsByFieldTypeDemo;
