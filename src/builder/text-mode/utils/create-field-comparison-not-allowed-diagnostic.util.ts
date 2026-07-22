import type { IStrings } from '../../../locales/types/strings';
import { getValidationString } from '../../../utils/validation/get-validation-string.util';
import { ITextModeDiagnostic } from '../types/text-mode-diagnostic';

export const createFieldComparisonNotAllowedDiagnostic = (
  fieldName: string,
  operator: string,
  start: number,
  end: number,
  strings: IStrings
): ITextModeDiagnostic => ({
  code: 'field_comparison_not_allowed',
  message: getValidationString(
    strings.validation,
    'fieldComparisonNotAllowed',
    `Field-to-field comparison is not allowed for field "${fieldName}" and operator "${operator}"`,
    { field: fieldName, operator }
  ),
  start,
  end,
});
