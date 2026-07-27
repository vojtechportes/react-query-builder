import type { DenormalizedQuery } from '../../query/model/types/query-tree';
import { formatMongo } from './format-mongo';
import { parseMongo } from './parse-mongo';

describe('Mongo roundtrip', () => {
  it('round-trips a supported query subset', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'CONTAINS', value: 'Al' },
          { field: 'age', operator: 'BETWEEN', value: [18, 30] },
          {
            type: 'GROUP',
            value: 'OR',
            isNegated: true,
            children: [
              { field: 'status', operator: 'EQUAL', value: 'active' },
              { field: 'score', operator: 'LARGER', value: 100 },
            ],
          },
        ],
      },
    ];

    const mongo = formatMongo(query);
    const parsed = parseMongo(mongo);

    expect(parsed.data).toEqual(query);
  });

  it('round-trips field-to-field scalar comparisons through $expr', () => {
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

    const mongo = formatMongo(query);
    const parsed = parseMongo(mongo);

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
});
