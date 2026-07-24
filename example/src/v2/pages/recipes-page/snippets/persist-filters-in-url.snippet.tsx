import React from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

const fields: IBuilderFieldProps[] = [
  {
    field: 'status',
    label: 'Status',
    type: 'LIST',
    value: [
      { label: 'Open', value: 'OPEN' },
      { label: 'Closed', value: 'CLOSED' },
    ],
  },
  { field: 'owner', label: 'Owner', type: 'TEXT' },
];

const fallbackQuery: DenormalizedQuery = [
  { type: 'GROUP', value: 'AND', isNegated: false, children: [] },
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isQueryNode = (value: unknown): boolean => {
  if (!isRecord(value)) return false;
  if (value.type === 'GROUP') {
    return (
      (value.value === 'AND' || value.value === 'OR') &&
      Array.isArray(value.children) &&
      value.children.every(isQueryNode)
    );
  }
  return typeof value.field === 'string' && typeof value.operator === 'string';
};

const validateFilter = (value: unknown): DenormalizedQuery | undefined =>
  Array.isArray(value) && value.every(isQueryNode)
    ? (value as DenormalizedQuery)
    : undefined;

const readFilter = (search: string): DenormalizedQuery | undefined => {
  try {
    const value = new URLSearchParams(search).get('filter');
    return value ? validateFilter(JSON.parse(value)) : undefined;
  } catch {
    return undefined;
  }
};

export const UrlFilter = () => {
  const [query, setQuery] = React.useState(
    () => readFilter(location.search) ?? fallbackQuery
  );

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set('filter', JSON.stringify(query));
    history.replaceState(null, '', '?' + params.toString());
  }, [query]);

  return <Builder fields={fields} data={query} onChange={setQuery} />;
};
