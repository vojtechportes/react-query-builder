import { parseQuery } from './index';

describe('parseQuery JsonLogic', () => {
  it('parses logical groups and comparisons', () => {
    const result = parseQuery(
      JSON.stringify({
        and: [
          { '==': [{ var: 'status' }, 'active'] },
          { '>=': [{ var: 'age' }, 18] },
        ],
      }),
      'JsonLogic'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'status', operator: 'EQUAL', value: 'active' },
          { field: 'age', operator: 'LARGER_EQUAL', value: 18 },
        ],
      },
    ]);
  });

  it('parses contains, not-in, and between logic', () => {
    const result = parseQuery(
      JSON.stringify({
        and: [
          { in: ['pro', { var: 'tags' }] },
          { '!': { in: [{ var: 'status' }, ['archived', 'deleted']] } },
          { '<=': [10, { var: 'score' }, 20] },
        ],
      }),
      'JsonLogic'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'tags', operator: 'CONTAINS', value: 'pro' },
          {
            field: 'status',
            operator: 'NOT_IN',
            value: ['archived', 'deleted'],
          },
          { field: 'score', operator: 'BETWEEN', value: [10, 20] },
        ],
      },
    ]);
  });

  it('parses field-to-field scalar comparisons and infers both fields', () => {
    const result = parseQuery(
      JSON.stringify({
        and: [
          { '>=': [{ var: 'price' }, { var: 'cost' }] },
          { '<': [{ var: 'discount' }, { var: 'max_discount' }] },
          { '==': [{ var: 'name' }, { var: 'fallback_name' }] },
          { '!=': [{ var: 'status' }, { var: 'archived_status' }] },
        ],
      }),
      'JsonLogic'
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
      JSON.stringify({
        and: [
          { '>=': [{ var: 'price' }, { var: 'min_price' }] },
          { '<=': [{ var: 'price' }, { var: 'max_price' }] },
        ],
      }),
      'JsonLogic'
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

  it('still collapses literal not-between ranges normally', () => {
    const result = parseQuery(
      JSON.stringify({
        '!': { '<=': [10, { var: 'price' }, 20] },
      }),
      'JsonLogic'
    );

    expect(result.data).toEqual([
      { field: 'price', operator: 'NOT_BETWEEN', value: [10, 20] },
    ]);
  });

  it('still collapses literal ranges normally', () => {
    const result = parseQuery(
      JSON.stringify({
        '<=': [10, { var: 'price' }, 20],
      }),
      'JsonLogic'
    );

    expect(result.data).toEqual([
      { field: 'price', operator: 'BETWEEN', value: [10, 20] },
    ]);
  });
});
