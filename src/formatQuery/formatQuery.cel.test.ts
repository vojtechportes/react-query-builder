import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery CEL', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(formatQuery(query, 'CEL', { rootlessCombinator: 'OR' })).toEqual(
      '(price > 10 || active == true)'
    );
  });

  it('formats string, range, and membership operators', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'STARTS_WITH', value: 'Stev' },
          { field: 'age', operator: 'BETWEEN', value: [18, 30] },
          { field: 'segments', operator: 'ALL_IN', value: ['b2b', 'priority'] },
        ],
      },
    ];

    expect(formatQuery(query, 'CEL')).toEqual(
      '(name.startsWith("Stev") && (age >= 18 && age <= 30) && ["b2b", "priority"].all(item, item in segments))'
    );
  });

  it('formats supported field-to-field scalar comparisons', () => {
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
            field: 'discount',
            operator: 'SMALLER',
            valueSource: 'field',
            valueField: 'max_discount',
          },
          {
            field: 'name',
            operator: 'EQUAL',
            valueSource: 'field',
            valueField: 'fallback_name',
          },
          {
            field: 'status',
            operator: 'NOT_EQUAL',
            valueSource: 'field',
            valueField: 'archived_status',
          },
        ],
      },
    ];

    expect(formatQuery(query, 'CEL')).toEqual(
      '(price >= cost && discount < max_discount && name == fallback_name && status != archived_status)'
    );
  });

  it('formats native field-to-field string method comparisons', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'CONTAINS', valueSource: 'field', valueField: 'needle' },
          { field: 'name', operator: 'STARTS_WITH', valueSource: 'field', valueField: 'prefix' },
          { field: 'name', operator: 'ENDS_WITH', valueSource: 'field', valueField: 'suffix' },
          { field: 'name', operator: 'LIKE', valueSource: 'field', valueField: 'pattern' },
        ],
      },
    ];

    expect(formatQuery(query, 'CEL')).toEqual(
      '(name.contains(needle) && name.startsWith(prefix) && name.endsWith(suffix) && name.matches(pattern))'
    );
  });
});
