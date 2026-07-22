import type { IStrings } from '../../../locales/types/strings';
import { ITextModeDiagnostic } from '../types/text-mode-diagnostic';

export const createNegationNotAllowedDiagnostic = (
  start: number,
  end: number,
  strings: IStrings
): ITextModeDiagnostic => ({
  code: 'negation_not_allowed',
  message:
    strings.validation?.negationNotAllowed ||
    'Negation is not allowed in this builder',
  start,
  end,
});
