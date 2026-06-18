import type { IBuilderFieldProps } from '../builder';
import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery', () => {
  it('combines root-level rules with the configured combinator', () => {
    const fields: IBuilderFieldProps[] = [
      { field: 'price', label: 'Price', type: 'NUMBER' },
      { field: 'active', label: 'Active', type: 'BOOLEAN' },
    ];
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(
      formatQuery(query, 'SQL', { fields, rootlessCombinator: 'OR' })
    ).toEqual('(price > 10 OR active = TRUE)');
  });

  it('uses the configured combinator for groups without modifiers', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        children: [
          { field: 'first_name', operator: 'EQUAL', value: 'Alice' },
          { field: 'last_name', operator: 'EQUAL', value: 'Smith' },
        ],
      },
    ];

    expect(
      formatQuery(query, 'SQL', { modifierlessGroupCombinator: 'OR' })
    ).toEqual("(first_name = 'Alice' OR last_name = 'Smith')");
  });

  it('supports negated groups and WHERE clause wrapping', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: true,
        children: [{ field: 'status', operator: 'EQUAL', value: 'archived' }],
      },
    ];

    expect(formatQuery(query, 'SQL', { wrapWhereClause: true })).toEqual(
      "WHERE NOT (status = 'archived')"
    );
  });
});

