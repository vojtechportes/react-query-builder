import { IStrings } from '../../constants/strings';

export interface IValidationStringReplacements {
  [key: string]: string | number | undefined;
}

export const getValidationString = (
  validationStrings: IStrings['validation'] | undefined,
  key: keyof NonNullable<IStrings['validation']>,
  fallback: string,
  replacements: IValidationStringReplacements = {}
): string => {
  const template = validationStrings?.[key] || fallback;

  return Object.entries(replacements).reduce((result, [replacementKey, value]) => {
    return result.replaceAll(`{${replacementKey}}`, String(value ?? ''));
  }, template);
};
