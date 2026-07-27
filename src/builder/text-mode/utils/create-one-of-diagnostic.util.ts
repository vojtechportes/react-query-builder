import type { IStrings } from '../../../shared/localization/types/strings';
import { getValidationString } from '../../validation/utils/get-validation-string.util';
import { ITextModeDiagnostic } from '../types/text-mode-diagnostic';

export const createOneOfDiagnostic = (
  start: number,
  end: number,
  strings: IStrings
): ITextModeDiagnostic => ({
  code: 'one_of',
  message: getValidationString(
    strings.validation,
    'oneOf',
    'Value must be one of the allowed options'
  ),
  start,
  end,
});
