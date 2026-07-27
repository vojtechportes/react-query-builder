import type { DenormalizedQuery } from '../../query/model/types/query-tree';
import { formatDynamo } from './format-dynamo';
import { parseDynamo } from './parse-dynamo';

describe('Dynamo roundtrip', () => {
  it('round-trips a supported query subset', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'STARTS_WITH', value: 'Al' },
          { field: 'age', operator: 'BETWEEN', value: [18, 30] },
        ],
      },
    ];

    const expression = formatDynamo(query);
    const parsed = parseDynamo(expression);

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

    const expression = formatDynamo(query);
    const parsed = parseDynamo(expression);

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
