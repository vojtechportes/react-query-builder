import { strings } from '../../../locales/en-us';
import { createFieldNotFoundDiagnostic } from './create-field-not-found-diagnostic.util';

describe('createFieldNotFoundDiagnostic', () => {
  it('creates a field-not-found diagnostic', () => {
    expect(createFieldNotFoundDiagnostic('STATUS', 2, 8, strings)).toEqual({
      code: 'field_not_found',
      message: 'Field "STATUS" is not defined',
      start: 2,
      end: 8,
    });
  });
});
