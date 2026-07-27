import { getRadixSelectPlaceholder } from './get-radix-select-placeholder.util';

describe('#radix/utils/getRadixSelectPlaceholder', () => {
  it.each([
    ['Choose a value', 'Translated fallback', 'Choose a value'],
    [undefined, 'Translated fallback', 'Translated fallback'],
    [undefined, undefined, 'Select your value'],
  ])(
    'resolves placeholder=%s fallback=%s',
    (placeholder, fallback, expected) => {
      expect(getRadixSelectPlaceholder(placeholder, fallback)).toBe(expected);
    }
  );
});
