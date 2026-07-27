import { GridLogicOperator } from '@mui/x-data-grid';
import { describe, expect, it } from 'vitest';
import { toMuiFilterModel } from './to-mui-filter-model.util';

describe('toMuiFilterModel', () => {
  it('maps top-level logic and supported operators', () => {
    const model = toMuiFilterModel([
      {
        type: 'GROUP',
        value: 'OR',
        isNegated: false,
        children: [
          { field: 'age', operator: 'LARGER_EQUAL', value: 21 },
          { field: 'name', operator: 'CONTAINS', value: 'Ada' },
        ],
      },
    ]);
    expect(model.logicOperator).toBe(GridLogicOperator.Or);
    expect(model.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'age', operator: '>=', value: 21 }),
        expect.objectContaining({
          field: 'name',
          operator: 'contains',
          value: 'Ada',
        }),
      ])
    );
  });
});
