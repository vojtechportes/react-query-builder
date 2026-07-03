import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery AQL', () => {
  it('formats root-level rules with FILTER wrapping', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(
      formatQuery(query, 'AQL', {
        rootlessCombinator: 'OR',
        variableName: 'item',
      })
    ).toEqual('FILTER (item.price > 10 OR item.active == true)');
  });

  it('formats groups without modifiers using the configured combinator', () => {
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
      formatQuery(query, 'AQL', {
        modifierlessGroupCombinator: 'OR',
        wrapFilterClause: false,
      })
    ).toEqual('(doc.first_name == "Alice" OR doc.last_name == "Smith")');
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

    expect(
      formatQuery(query, 'AQL', {
        wrapFilterClause: false,
        variableName: 'item',
      })
    ).toEqual('(item.price >= item.cost AND item.discount < item.max_discount AND item.name == item.fallback_name AND item.status != item.archived_status)');
  });
});
