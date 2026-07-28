import { formatDynamoRule } from './format-dynamo-rule';

describe('format-dynamo-rule', () => {
  it('formats a representative equality rule', () => {
    const formatted = formatDynamoRule({
      field: 'name',
      operator: 'EQUAL',
      value: 'Alice',
    });

    expect(formatted).toMatchSnapshot();
  });
});
