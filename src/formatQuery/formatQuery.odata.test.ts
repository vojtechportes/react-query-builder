import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery OData', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(formatQuery(query, 'OData', { rootlessCombinator: 'OR' })).toEqual(
      '(price gt 10 or active eq true)'
    );
  });

  it('formats string and range operators with filter wrapper', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'STARTS_WITH', value: 'Stev' },
          { field: 'age', operator: 'BETWEEN', value: [18, 30] },
        ],
      },
    ];

    expect(
      formatQuery(query, 'OData', { wrapFilterClause: true })
    ).toEqual("$filter=(startswith(name,'Stev') and (age ge 18 and age le 30))");
  });

  it('formats supported field-to-field comparisons', () => {
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
            operator: 'NOT_EQUAL',
            valueSource: 'field',
            valueField: 'fallback_name',
          },
        ],
      },
    ];

    expect(formatQuery(query, 'OData')).toEqual(
      '(price ge cost and name ne fallback_name)'
    );
  });

  it('formats native field-to-field string functions', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'CONTAINS', valueSource: 'field', valueField: 'needle' },
          { field: 'name', operator: 'STARTS_WITH', valueSource: 'field', valueField: 'prefix' },
          { field: 'name', operator: 'ENDS_WITH', valueSource: 'field', valueField: 'suffix' },
        ],
      },
    ];

    expect(formatQuery(query, 'OData')).toEqual(
      '(contains(name,needle) and startswith(name,prefix) and endswith(name,suffix))'
    );
  });
});
