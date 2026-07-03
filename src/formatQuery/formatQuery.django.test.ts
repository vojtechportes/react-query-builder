import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery Django', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(formatQuery(query, 'Django', { rootlessCombinator: 'OR' })).toEqual(
      "(Q(price__gt=10) | Q(active=True))"
    );
  });

  it('formats lookups, membership, and range operators', () => {
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

    expect(formatQuery(query, 'Django')).toEqual(
      "(Q(name__startswith='Stev') & Q(status__in=['active', 'trial']) & Q(age__gte=18, age__lte=30))"
    );
  });

  it('formats supported field-to-field scalar comparisons through F() expressions', () => {
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

    expect(formatQuery(query, 'Django')).toEqual(
      "(Q(price__gte=F('cost')) & Q(discount__lt=F('max_discount')) & Q(name=F('fallback_name')) & ~Q(status=F('archived_status')))"
    );
  });

  it('formats native field-to-field string lookups through F() expressions', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'CONTAINS', valueSource: 'field', valueField: 'needle' },
          { field: 'name', operator: 'STARTS_WITH', valueSource: 'field', valueField: 'prefix' },
          { field: 'name', operator: 'ENDS_WITH', valueSource: 'field', valueField: 'suffix' },
          { field: 'status', operator: 'NOT_CONTAINS', valueSource: 'field', valueField: 'archived_status' },
        ],
      },
    ];

    expect(formatQuery(query, 'Django')).toEqual(
      "(Q(name__contains=F('needle')) & Q(name__startswith=F('prefix')) & Q(name__endswith=F('suffix')) & ~Q(status__contains=F('archived_status')))"
    );
  });
});
