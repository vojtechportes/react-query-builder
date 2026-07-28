import { formatPrisma } from './format-prisma';

describe('format-prisma', () => {
  it('formats a representative query', () => {
    const formatted = (formatPrisma as (...args: any[]) => unknown)([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'name', operator: 'EQUAL', value: 'Alice' }],
      },
    ]);

    expect(formatted).toMatchSnapshot();
  });
});
