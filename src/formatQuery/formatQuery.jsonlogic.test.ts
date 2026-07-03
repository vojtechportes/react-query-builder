import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery JsonLogic', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(formatQuery(query, 'JsonLogic', { rootlessCombinator: 'OR' })).toEqual(
      JSON.stringify(
        {
          or: [
            { '>': [{ var: 'price' }, 10] },
            { '==': [{ var: 'active' }, true] },
          ],
        },
        null,
        2
      )
    );
  });

  it('formats string and range operators', () => {
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

    expect(formatQuery(query, 'JsonLogic')).toEqual(
      JSON.stringify(
        {
          and: [
            { '==': [{ substr: [{ var: 'name' }, 0, 4] }, 'Stev'] },
            { '<=': [18, { var: 'age' }, 30] },
          ],
        },
        null,
        2
      )
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

    expect(formatQuery(query, 'JsonLogic')).toEqual(
      JSON.stringify(
        {
          and: [
            { '>=': [{ var: 'price' }, { var: 'cost' }] },
            { '<': [{ var: 'discount' }, { var: 'max_discount' }] },
            { '==': [{ var: 'name' }, { var: 'fallback_name' }] },
            { '!=': [{ var: 'status' }, { var: 'archived_status' }] },
          ],
        },
        null,
        2
      )
    );
  });
});
