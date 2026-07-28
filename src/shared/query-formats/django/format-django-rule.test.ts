import { formatDjangoRule } from './format-django-rule';

describe('format-django-rule', () => {
  it('formats a representative equality rule', () => {
    const formatted = formatDjangoRule({
      field: 'name',
      operator: 'EQUAL',
      value: 'Alice',
    });

    expect(formatted).toMatchSnapshot();
  });
});
