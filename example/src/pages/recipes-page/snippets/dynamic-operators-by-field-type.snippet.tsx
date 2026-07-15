import React from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
  useBuilderRef,
} from '@vojtechportes/react-query-builder';

const statusOptions = [
  { value: 'OPEN', label: 'Open' },
  { value: 'CLOSED', label: 'Closed' },
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
  { type: 'GROUP', value: 'AND', isNegated: false, children: [] },
];

export const DynamicOperatorFilter = () => {
  const [query, setQuery] = React.useState(initialQuery);
  const builderRef = useBuilderRef();

  React.useEffect(() => {
    builderRef.current?.setFieldOptions('status', statusOptions);
  }, [builderRef]);

  return (
    <Builder
      ref={builderRef}
      fields={fields}
      data={query}
      onChange={setQuery}
      allowFieldComparisons
      showValidation
    />
  );
};
