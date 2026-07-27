import type { DenormalizedQuery } from '../../query/model/types/query-tree';
import { formatSql } from './format-sql';
import { parseSql } from './parse-sql';

describe('SQL roundtrip', () => {
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

    const sql = formatSql(query);
    const parsed = parseSql(sql);

    expect(parsed.data).toEqual(query);
  });

  it('preserves explicit nested single-rule groups', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'EQUAL', value: 'Al' },
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'city', operator: 'EQUAL', value: 'Prague' }],
          },
        ],
      },
    ];

    const sql = formatSql(query);
    const parsed = parseSql(sql);

    expect(parsed.data).toEqual(query);
  });

  it('round-trips supported field-to-field comparisons', () => {
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
            operator: 'LIKE',
            valueSource: 'field',
            valueField: 'name_pattern',
          },
        ],
      },
    ];

    const sql = formatSql(query);
    const parsed = parseSql(sql);

    expect(parsed.data).toEqual(query);
  });
});
