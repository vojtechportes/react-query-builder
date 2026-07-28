import { toDenormalizedDjangoQuery } from './to-denormalized-django-node';

describe('to-denormalized-django-node', () => {
  it('converts parsed groups into denormalized groups', () => {
    const result = (toDenormalizedDjangoQuery as (...args: any[]) => unknown)([
      {
        kind: 'group',
        combinator: 'AND',
        isNegated: true,
        children: [{ field: 'name', operator: 'EQUAL', value: 'Alice' }],
      },
    ]);

    expect(result).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: true,
        children: [{ field: 'name', operator: 'EQUAL', value: 'Alice' }],
      },
    ]);
  });
});
