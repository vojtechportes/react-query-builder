import { strings } from '../../../constants/strings';
import { createOneOfDiagnostic } from './create-one-of-diagnostic.util';

describe('createOneOfDiagnostic', () => {
  it('creates a one-of diagnostic', () => {
    expect(createOneOfDiagnostic(4, 9, strings)).toEqual({
      code: 'one_of',
      message: 'Value must be one of the allowed options',
      start: 4,
      end: 9,
    });
  });
});
