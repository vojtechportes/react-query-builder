import { strings } from '../../../constants/strings';
import { createNegationNotAllowedDiagnostic } from './create-negation-not-allowed-diagnostic.util';

describe('createNegationNotAllowedDiagnostic', () => {
  it('creates a negation-not-allowed diagnostic', () => {
    expect(createNegationNotAllowedDiagnostic(0, 3, strings)).toEqual({
      code: 'negation_not_allowed',
      message: 'Negation is not allowed in this builder',
      start: 0,
      end: 3,
    });
  });
});
