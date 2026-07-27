import React from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const fields: IBuilderFieldProps[] = [
  {
    field: 'category',
    label: 'Category',
    type: 'LIST',
    value: [
      { label: 'Books', value: 'BOOKS' },
      { label: 'Games', value: 'GAMES' },
    ],
  },
  {
    field: 'price',
    label: 'Price',
    type: 'NUMBER',
    operators: ['EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
  },
  { field: 'inStock', label: 'In stock', type: 'BOOLEAN' },
];

const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'inStock', operator: 'EQUAL', value: true }],
  },
];

export const PrismaFilter = () => {
  const [query, setQuery] = React.useState(initialQuery);

  const submit = async () => {
    const formatted = formatQuery(query, 'Prisma', {
      fields,
      wrapWhereClause: true,
    });

    const { where } = JSON.parse(formatted) as { where: unknown };
    await fetch('/api/products/search', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ where }),
    });
  };

  return (
    <>
      <Builder fields={fields} data={query} onChange={setQuery} />
      <button onClick={submit}>Search products</button>
    </>
  );
};
