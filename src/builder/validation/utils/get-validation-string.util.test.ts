import { getValidationString } from './get-validation-string.util';

describe('getValidationString', () => {
  it('uses localized templates and replaces every placeholder', () => {
    expect(
      getValidationString(
        { required: 'Choose {field}; current: {value}; again: {field}' },
        'required',
        'Fallback',
        { field: 'Name', value: undefined }
      )
    ).toBe('Choose Name; current: ; again: Name');
  });

  it('uses the fallback when localized validation strings are absent', () => {
    expect(getValidationString(undefined, 'required', 'Fallback')).toBe(
      'Fallback'
    );
  });
});
