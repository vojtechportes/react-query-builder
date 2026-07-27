import type { DenormalizedQuery } from '../../query/model/types/query-tree';
import { formatAql } from './format-aql';
import { parseAql } from './parse-aql';

describe('AQL roundtrip', () => {
  it('round-trips a supported query subset', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'OR',
        isNegated: false,
        children: [
          { field: 'name', operator: 'CONTAINS', value: 'Al' },
          { field: 'age', operator: 'BETWEEN', value: [18, 30] },
        ],
      },
    ];

    const aql = formatAql(query, {
      wrapFilterClause: false,
      variableName: 'doc',
    });
    const parsed = parseAql(aql);

    expect(parsed.data).toEqual(query);
  });

  it('round-trips field-to-field scalar comparisons', () => {
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
        ],
      },
    ];

    const aql = formatAql(query, {
      wrapFilterClause: false,
      variableName: 'doc',
    });
    const parsed = parseAql(aql);

    expect(parsed.data).toEqual(query);
    expect(parsed.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'price' }),
        expect.objectContaining({ field: 'cost' }),
        expect.objectContaining({ field: 'discount' }),
        expect.objectContaining({ field: 'max_discount' }),
      ])
    );
  });

  it('does not collapse same-field field references into literal range operators', () => {
    const parsed = parseAql(
      '(doc.price >= doc.min_price AND doc.price <= doc.max_price)'
    );

    expect(parsed.data).toEqual<DenormalizedQuery>([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            field: 'price',
            operator: 'LARGER_EQUAL',
            valueSource: 'field',
            valueField: 'min_price',
          },
          {
            field: 'price',
            operator: 'SMALLER_EQUAL',
            valueSource: 'field',
            valueField: 'max_price',
          },
        ],
      },
    ]);
  });
});
