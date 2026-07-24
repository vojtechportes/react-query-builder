import { describe, expect, it } from 'vitest';
import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';
import { recipeDemoRows } from '../constants/recipe-demo-rows';
import { doesRecipeRowMatch } from './does-recipe-row-match.util';

describe('doesRecipeRowMatch', () => {
  it('evaluates nested AND, OR, and negated groups', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'age', operator: 'LARGER_EQUAL', value: 18 },
          {
            type: 'GROUP',
            value: 'OR',
            isNegated: false,
            children: [
              { field: 'role', operator: 'EQUAL', value: 'ADMIN' },
              { field: 'country', operator: 'EQUAL', value: 'France' },
            ],
          },
        ],
      },
    ];
    expect(
      recipeDemoRows.filter((row) => doesRecipeRowMatch(row, query))
    ).toHaveLength(3);

    const negated: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: true,
        children: [{ field: 'status', operator: 'EQUAL', value: 'PAID' }],
      },
    ];
    expect(
      recipeDemoRows.filter((row) => doesRecipeRowMatch(row, negated))
    ).toHaveLength(2);
  });

  it('compares ISO calendar dates for TanStack filtering', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'role', operator: 'NOT_EQUAL', value: 'VIEWER' },
          {
            field: 'lastActive',
            operator: 'SMALLER_EQUAL',
            value: '2026-07-15',
          },
        ],
      },
    ];
    const matchingNames = recipeDemoRows
      .filter((row) => doesRecipeRowMatch(row, query))
      .map((row) => row.name);

    expect(matchingNames).toEqual([
      'Ada Lovelace',
      'Grace Hopper',
      'Margaret Hamilton',
      'Dorothy Vaughan',
    ]);
    expect(
      doesRecipeRowMatch(recipeDemoRows[0], {
        field: 'lastActive',
        operator: 'SMALLER_EQUAL',
        value: '2026-07-12',
      })
    ).toBe(true);
    expect(
      doesRecipeRowMatch(recipeDemoRows[0], {
        field: 'lastActive',
        operator: 'LARGER_EQUAL',
        value: '2026-07-13',
      })
    ).toBe(false);
    expect(
      doesRecipeRowMatch(recipeDemoRows[0], {
        field: 'lastActive',
        operator: 'BETWEEN',
        value: ['2026-07-01', '2026-07-12'],
      })
    ).toBe(true);
    expect(
      doesRecipeRowMatch(recipeDemoRows[0], {
        field: 'lastActive',
        operator: 'SMALLER_EQUAL',
        value: '2026-02-30',
      })
    ).toBe(false);
  });

  it('supports text, range, list, and field comparison values', () => {
    expect(
      doesRecipeRowMatch(recipeDemoRows[0], {
        field: 'name',
        operator: 'CONTAINS',
        value: 'lovelace',
      })
    ).toBe(true);
    expect(
      doesRecipeRowMatch(recipeDemoRows[0], {
        field: 'price',
        operator: 'BETWEEN',
        value: [20, 40],
      })
    ).toBe(true);
    expect(
      doesRecipeRowMatch(recipeDemoRows[0], {
        field: 'status',
        operator: 'IN',
        value: ['PAID', 'PENDING'],
      })
    ).toBe(true);
    expect(
      doesRecipeRowMatch(recipeDemoRows[0], {
        field: 'approvedAmount',
        operator: 'LARGER',
        valueSource: 'field',
        valueField: 'amount',
      })
    ).toBe(true);
  });
});
