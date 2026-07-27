import type { DenormalizedQuery } from '../../query/model/types/query-tree';
import { formatDjango } from './format-django';
import { parseDjango } from './parse-django';

describe('Django roundtrip', () => {
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

    const expression = formatDjango(query);
    const parsed = parseDjango(expression);

    expect(parsed.data).toEqual(query);
  });

  it('round-trips field-to-field scalar comparisons through F() expressions', () => {
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

    const expression = formatDjango(query);
    const parsed = parseDjango(expression);

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

  it('round-trips native field-to-field string lookups through F() expressions', () => {
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

    const expression = formatDjango(query);
    const parsed = parseDjango(expression);

    expect(parsed.data).toEqual(query);
  });
});
