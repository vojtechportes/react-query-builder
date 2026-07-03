import { isSameQuery } from './is-same-query.util';
import { DenormalizedQuery } from './query-tree';

describe('#utils/isSameQuery', () => {
  it('Returns true for identical rule trees', () => {
    const leftQuery: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'NAME', operator: 'EQUAL', value: 'Alice' }],
      },
    ];

    const rightQuery: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'NAME', operator: 'EQUAL', value: 'Alice' }],
      },
    ];

    expect(isSameQuery(leftQuery, rightQuery)).toBe(true);
  });

  it('Returns false when a nested rule changes', () => {
    const leftQuery: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'NAME', operator: 'EQUAL', value: 'Alice' }],
      },
    ];

    const rightQuery: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'NAME', operator: 'EQUAL', value: 'Bob' }],
      },
    ];

    expect(isSameQuery(leftQuery, rightQuery)).toBe(false);
  });

  it('Returns true for identical field comparison rules', () => {
    const leftQuery: DenormalizedQuery = [
      {
        field: 'PRICE',
        operator: 'LARGER',
        valueSource: 'field',
        valueField: 'COST',
      },
    ];

    const rightQuery: DenormalizedQuery = [
      {
        field: 'PRICE',
        operator: 'LARGER',
        valueSource: 'field',
        valueField: 'COST',
      },
    ];

    expect(isSameQuery(leftQuery, rightQuery)).toBe(true);
  });

  it('Returns false when a rule changes from literal to field comparison', () => {
    const leftQuery: DenormalizedQuery = [
      {
        field: 'PRICE',
        operator: 'LARGER',
        value: 100,
      },
    ];

    const rightQuery: DenormalizedQuery = [
      {
        field: 'PRICE',
        operator: 'LARGER',
        valueSource: 'field',
        valueField: 'COST',
      },
    ];

    expect(isSameQuery(leftQuery, rightQuery)).toBe(false);
  });

  it('Returns false when field comparison rhs changes', () => {
    const leftQuery: DenormalizedQuery = [
      {
        field: 'PRICE',
        operator: 'LARGER',
        valueSource: 'field',
        valueField: 'COST',
      },
    ];

    const rightQuery: DenormalizedQuery = [
      {
        field: 'PRICE',
        operator: 'LARGER',
        valueSource: 'field',
        valueField: 'DISCOUNT',
      },
    ];

    expect(isSameQuery(leftQuery, rightQuery)).toBe(false);
  });
});
