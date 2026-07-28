import { formatPrismaRule } from './format-prisma-rule';

describe('format-prisma-rule', () => {
  it('formats a representative equality rule', () => {
    const formatted = formatPrismaRule({
      field: 'name',
      operator: 'EQUAL',
      value: 'Alice',
    });

    expect(formatted).toMatchSnapshot();
  });
});
