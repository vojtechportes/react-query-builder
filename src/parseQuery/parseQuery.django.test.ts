import { parseQuery } from './index';

describe('parseQuery Django', () => {
  it('parses Q lookups and logical groups', () => {
    const result = parseQuery(
      "(Q(status__in=['active', 'paused']) & Q(age__gte=18))",
      'Django'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'status', operator: 'IN', value: ['active', 'paused'] },
          { field: 'age', operator: 'LARGER_EQUAL', value: 18 },
        ],
      },
    ]);
  });

  it('parses not, grouped range logic, and null checks', () => {
    const result = parseQuery(
      "(~Q(tags__contains='pro') & Q(status__isnull=False) & (Q(score__lt=10) | Q(score__gt=20)))",
      'Django'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'tags', operator: 'NOT_CONTAINS', value: 'pro' },
          { field: 'status', operator: 'IS_NOT_NULL' },
          { field: 'score', operator: 'NOT_BETWEEN', value: [10, 20] },
        ],
      },
    ]);
  });

  it('parses field-to-field scalar comparisons from F() expressions and infers both fields', () => {
    const result = parseQuery(
      "(Q(price__gte=F('cost')) & Q(discount__lt=F('max_discount')) & Q(name=F('fallback_name')) & ~Q(status=F('archived_status')))",
      'Django'
    );

    expect(result.data).toEqual([
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
    ]);

    expect(result.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'price' }),
        expect.objectContaining({ field: 'cost' }),
        expect.objectContaining({ field: 'discount' }),
        expect.objectContaining({ field: 'max_discount' }),
        expect.objectContaining({ field: 'name' }),
        expect.objectContaining({ field: 'fallback_name' }),
        expect.objectContaining({ field: 'status' }),
        expect.objectContaining({ field: 'archived_status' }),
      ])
    );
  });

  it('does not collapse same-field field references into literal ranges', () => {
    const result = parseQuery(
      "Q(price__gte=F('min_price'), price__lte=F('max_price'))",
      'Django'
    );

    expect(result.data).toEqual([
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

  it('does not collapse same-field field references into literal not-between ranges', () => {
    const result = parseQuery(
      "(Q(price__lt=F('min_price')) | Q(price__gt=F('max_price')))",
      'Django'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'OR',
        isNegated: false,
        children: [
          {
            field: 'price',
            operator: 'SMALLER',
            valueSource: 'field',
            valueField: 'min_price',
          },
          {
            field: 'price',
            operator: 'LARGER',
            valueSource: 'field',
            valueField: 'max_price',
          },
        ],
      },
    ]);
  });

  it('rejects F() expressions outside the builder field-to-field model', () => {
    expect(() =>
      parseQuery(
        "Q(price__gt=F(cost))",
        'Django'
      )
    ).toThrow('Django F() references must contain a quoted field name.');
  });

  it('parses native field-to-field string lookups from F() expressions', () => {
    const result = parseQuery(
      "(Q(name__contains=F('needle')) & Q(name__startswith=F('prefix')) & Q(name__endswith=F('suffix')) & ~Q(status__contains=F('archived_status')))",
      'Django'
    );

    expect(result.data).toEqual([
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
    ]);
  });

  it('rejects unsupported transformed string lookups with F() field references', () => {
    expect(() =>
      parseQuery(
        "Q(name__icontains=F('needle'))",
        'Django'
      )
    ).toThrow(
      'Django F() field references are supported only for native direct-reference lookups, found "icontains".'
    );
  });
});
