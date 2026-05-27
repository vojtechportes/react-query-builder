import { IStrings } from '../../../constants/strings';

export interface ISqlParserStringReplacements {
  [key: string]: string | number | undefined;
}

export const getSqlParserString = (
  textModeStrings: IStrings['textMode'] | undefined,
  key: keyof NonNullable<NonNullable<IStrings['textMode']>['sql']>,
  fallback: string,
  replacements: ISqlParserStringReplacements = {}
): string => {
  const template = textModeStrings?.sql?.[key] || fallback;

  return Object.entries(replacements).reduce((result, [replacementKey, value]) => {
    return result.replaceAll(`{${replacementKey}}`, String(value ?? ''));
  }, template);
};
