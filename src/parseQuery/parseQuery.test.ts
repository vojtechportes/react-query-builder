import { parseQuery } from './index';

describe('parseQuery', () => {
  it('parses a WHERE clause from a full SELECT statement', () => {
    const result = parseQuery(
      "SELECT * FROM users WHERE first_name LIKE 'Stev%' AND age >= 18",
      'SQL'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'first_name', operator: 'STARTS_WITH', value: 'Stev' },
          { field: 'age', operator: 'LARGER_EQUAL', value: 18 },
        ],
      },
    ]);
    expect(result.fields).toEqual([
      {
        field: 'first_name',
        label: 'first_name',
        type: 'TEXT',
        operators: ['STARTS_WITH'],
      },
      {
        field: 'age',
        label: 'age',
        type: 'NUMBER',
        operators: ['LARGER_EQUAL'],
      },
    ]);
  });

  it('parses nested groups, NOT, IN, and null checks', () => {
    const result = parseQuery(
      "(status IN ('open', 'pending') OR score BETWEEN 10 AND 20) AND NOT deleted_at IS NOT NULL",
      'SQL'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            type: 'GROUP',
            value: 'OR',
            isNegated: false,
            children: [
              { field: 'status', operator: 'IN', value: ['open', 'pending'] },
              { field: 'score', operator: 'BETWEEN', value: [10, 20] },
            ],
          },
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: true,
            children: [{ field: 'deleted_at', operator: 'IS_NOT_NULL' }],
          },
        ],
      },
    ]);
  });

  it('parses field-to-field SQL comparisons and infers both fields', () => {
    const result = parseQuery(
      'price >= cost AND name LIKE name_pattern',
      'SQL'
    );

    expect(result.data).toEqual([
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
    ]);
    expect(result.fields).toEqual([
      {
        field: 'price',
        label: 'price',
        type: 'TEXT',
        operators: ['LARGER_EQUAL'],
      },
      {
        field: 'cost',
        label: 'cost',
        type: 'TEXT',
        operators: ['LARGER_EQUAL'],
      },
      {
        field: 'name',
        label: 'name',
        type: 'TEXT',
        operators: ['LIKE'],
      },
      {
        field: 'name_pattern',
        label: 'name_pattern',
        type: 'TEXT',
        operators: ['LIKE'],
      },
    ]);
  });

  it('throws on invalid SQL', () => {
    expect(() => parseQuery('status =', 'SQL')).toThrow(
      'Expected a scalar value'
    );
  });
});

