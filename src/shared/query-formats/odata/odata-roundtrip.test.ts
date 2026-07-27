import type { DenormalizedQuery } from '../../query/model/types/query-tree';
import { formatOData } from './format-odata';
import { parseOData } from './parse-odata';

describe('OData roundtrip', () => {
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

    const expression = formatOData(query);
    const parsed = parseOData(expression);

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

    const expression = formatOData(query);
    const parsed = parseOData(expression);

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
    const parsed = parseOData('(price ge min_price and price le max_price)');

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

  it('round-trips native field-to-field string functions', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            field: 'name',
            operator: 'CONTAINS',
            valueSource: 'field',
            valueField: 'needle',
          },
          {
            field: 'name',
            operator: 'STARTS_WITH',
            valueSource: 'field',
            valueField: 'prefix',
          },
          {
            field: 'name',
            operator: 'ENDS_WITH',
            valueSource: 'field',
            valueField: 'suffix',
          },
          {
            field: 'status',
            operator: 'NOT_CONTAINS',
            valueSource: 'field',
            valueField: 'archived_status',
          },
        ],
      },
    ];

    const expression = formatOData(query);
    const parsed = parseOData(expression);

    expect(parsed.data).toEqual(query);
  });
});
