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

  it('formats supported field-to-field SQL comparisons', () => {
    const fields: IBuilderFieldProps[] = [
      { field: 'price', label: 'Price', type: 'NUMBER' },
      { field: 'cost', label: 'Cost', type: 'NUMBER' },
      { field: 'name', label: 'Name', type: 'TEXT' },
      { field: 'name_pattern', label: 'Pattern', type: 'TEXT' },
    ];
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            field: 'price',
            operator: 'LARGER_EQUAL',
            valueSource: 'field',
            valueField: 'cost',
          },
          {
            field: 'name',
            operator: 'LIKE',
            valueSource: 'field',
            valueField: 'name_pattern',
          },
        ],
      },
    ];

    expect(formatQuery(query, 'SQL', { fields })).toEqual(
      '(price >= cost AND name LIKE name_pattern)'
    );
  });
  it('throws explicitly for unsupported SQL field-to-field string operators', () => {
    const fields: IBuilderFieldProps[] = [
      { field: 'name', label: 'Name', type: 'TEXT' },
      { field: 'prefix', label: 'Prefix', type: 'TEXT' },
    ];
    const query: DenormalizedQuery = [
      {
        field: 'name',
        operator: 'STARTS_WITH',
        valueSource: 'field',
        valueField: 'prefix',
      },
    ];

    expect(() => formatQuery(query, 'SQL', { fields })).toThrow(
      'SQL does not support field-to-field comparisons for field "name" and operator "STARTS_WITH".'
    );
  });
});

