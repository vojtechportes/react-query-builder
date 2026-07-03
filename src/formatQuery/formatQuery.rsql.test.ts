import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery RSQL', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(formatQuery(query, 'RSQL', { rootlessCombinator: 'OR' })).toEqual(
      '(price=gt=10,active==true)'
    );
  });

  it('formats wildcard, membership, and range operators', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'STARTS_WITH', value: 'Stev' },
          { field: 'status', operator: 'IN', value: ['active', 'trial'] },
          { field: 'age', operator: 'BETWEEN', value: [18, 30] },
        ],
      },
    ];

    expect(formatQuery(query, 'RSQL')).toEqual(
      "(name==Stev*;status=in=(active,trial);(age=ge=18;age=le=30))"
    );
  });

  it('throws explicitly for unsupported field-to-field comparisons', () => {
    const query: DenormalizedQuery = [
      {
        field: 'price',
        operator: 'EQUAL',
        valueSource: 'field',
        valueField: 'cost',
      },
    ];

    expect(() => formatQuery(query, 'RSQL')).toThrow(
      'RSQL does not support field-to-field comparisons for field "price" and operator "EQUAL".'
    );
  });
});
