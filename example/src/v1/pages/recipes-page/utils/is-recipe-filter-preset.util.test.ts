import { describe, expect, it } from 'vitest';
import { isRecipeFilterPreset } from './is-recipe-filter-preset.util';

describe('isRecipeFilterPreset', () => {
  it('accepts a versioned preset with valid query data', () => {
    expect(
      isRecipeFilterPreset({
        id: 'one',
        name: 'Paid orders',
        version: 1,
        query: [
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'status', operator: 'EQUAL', value: 'PAID' }],
          },
        ],
      })
    ).toBe(true);
  });

  it('rejects unknown versions and malformed queries', () => {
    expect(
      isRecipeFilterPreset({ id: 'one', name: 'Old', version: 0, query: [] })
    ).toBe(false);
    expect(
      isRecipeFilterPreset({ id: 'one', name: 'Broken', version: 1, query: {} })
    ).toBe(false);
  });
  it('rejects stored queries outside the preset field and operator schema', () => {
    expect(
      isRecipeFilterPreset(
        {
          id: 'unsafe',
          name: 'Unsafe preset',
          version: 1,
          query: [
            {
              type: 'GROUP',
              value: 'AND',
              children: [
                { field: 'tenantId', operator: 'DELETE', value: 'one' },
              ],
            },
          ],
        },
        {
          allowedFields: ['region', 'revenue'],
          allowedOperators: [
            'EQUAL',
            'NOT_EQUAL',
            'LARGER_EQUAL',
            'SMALLER_EQUAL',
          ],
        }
      )
    ).toBe(false);
  });
});
