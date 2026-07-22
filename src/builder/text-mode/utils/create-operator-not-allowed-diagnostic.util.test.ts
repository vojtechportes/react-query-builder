import { strings } from '../../../locales/en-us';
import { createOperatorNotAllowedDiagnostic } from './create-operator-not-allowed-diagnostic.util';

describe('createOperatorNotAllowedDiagnostic', () => {
  it('creates an operator-not-allowed diagnostic', () => {
    expect(
      createOperatorNotAllowedDiagnostic('STATUS', 'NOT_IN', 3, 9, strings)
    ).toEqual({
      code: 'operator_not_allowed',
      message: 'Operator "NOT_IN" is not allowed for field "STATUS"',
      start: 3,
      end: 9,
    });
  });
});
