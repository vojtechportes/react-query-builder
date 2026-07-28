import { splitTopLevel, stripOuterParentheses } from './split-spel-expression';

describe('split-spel-expression', () => {
  it('removes balanced outer parentheses', () => {
    expect(stripOuterParentheses("((name == 'Alice'))")).toBe(
      "name == 'Alice'"
    );
  });

  it('splits only delimiters at the top level', () => {
    expect(
      splitTopLevel(
        "(name == 'Alice' or name == 'Bob') and active == true",
        ' and '
      )
    ).toEqual(["(name == 'Alice' or name == 'Bob')", 'active == true']);
  });
});
