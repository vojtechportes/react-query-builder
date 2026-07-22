import type { IStrings } from '../../../locales/types/strings';
import { getValidationString } from '../../../utils/validation/get-validation-string.util';
import { ITextModeDiagnostic } from '../types/text-mode-diagnostic';

export const createFieldNotFoundDiagnostic = (
  fieldName: string,
  start: number,
  end: number,
  strings: IStrings
): ITextModeDiagnostic => ({
  code: 'field_not_found',
  message: getValidationString(
    strings.validation,
    'fieldNotFound',
    `Field "${fieldName}" is not defined`,
    { field: fieldName }
  ),
  start,
  end,
});
