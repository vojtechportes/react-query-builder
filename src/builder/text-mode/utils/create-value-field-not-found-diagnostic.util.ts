import type { IStrings } from '../../../shared/localization/types/strings';
import { getValidationString } from '../../validation/utils/get-validation-string.util';
import { ITextModeDiagnostic } from '../types/text-mode-diagnostic';

export const createValueFieldNotFoundDiagnostic = (
  fieldName: string,
  start: number,
  end: number,
  strings: IStrings
): ITextModeDiagnostic => ({
  code: 'value_field_not_found',
  message: getValidationString(
    strings.validation,
    'valueFieldNotFound',
    `Comparison field "${fieldName}" was not found`,
    { field: fieldName }
  ),
  start,
  end,
});
