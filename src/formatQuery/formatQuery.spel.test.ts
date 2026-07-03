import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery SpEL', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(formatQuery(query, 'SpEL', { rootlessCombinator: 'OR' })).toEqual(
      '(price > 10 or active == true)'
    );
  });

  it('formats string, range, and collection operators', () => {
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

    expect(formatQuery(query, 'SpEL')).toEqual(
      "(name.startsWith('Stev') and (age >= 18 and age <= 30) and ({'b2b', 'priority'}.?[segments.contains(#this)].size() == 2))"
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

    expect(formatQuery(query, 'SpEL')).toEqual(
      '(price >= cost and discount < max_discount and name == fallback_name and status != archived_status)'
    );
  });

  it('formats native field-to-field string methods', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'CONTAINS', valueSource: 'field', valueField: 'needle' },
          { field: 'name', operator: 'STARTS_WITH', valueSource: 'field', valueField: 'prefix' },
          { field: 'name', operator: 'ENDS_WITH', valueSource: 'field', valueField: 'suffix' },
          { field: 'status', operator: 'NOT_CONTAINS', valueSource: 'field', valueField: 'archived_status' },
        ],
      },
    ];

    expect(formatQuery(query, 'SpEL')).toEqual(
      '(name.contains(needle) and name.startsWith(prefix) and name.endsWith(suffix) and !(status.contains(archived_status)))'
    );
  });
});
