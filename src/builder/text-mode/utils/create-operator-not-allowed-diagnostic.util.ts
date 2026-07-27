import type { IStrings } from '../../../shared/localization/types/strings';
import { getValidationString } from '../../validation/utils/get-validation-string.util';
import { ITextModeDiagnostic } from '../types/text-mode-diagnostic';

export const createOperatorNotAllowedDiagnostic = (
  fieldName: string,
  operator: string,
  start: number,
  end: number,
  strings: IStrings
): ITextModeDiagnostic => ({
  code: 'operator_not_allowed',
  message: getValidationString(
    strings.validation,
    'operatorNotAllowed',
    `Operator "${operator}" is not allowed for field "${fieldName}"`,
    { field: fieldName, operator }
  ),
  start,
  end,
});
