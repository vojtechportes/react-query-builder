import type { IStrings } from '../../../locales/types/strings';
import { getBuilderValidationMessage } from '../../../utils/validation/get-builder-validation-message.util';
import { getValidationString } from '../../../utils/validation/get-validation-string.util';
import { IBuilderFieldProps } from '../../types';
import { ITextModeDiagnostic } from '../types/text-mode-diagnostic';

export const createUsageLimitExceededDiagnostic = (
  field: IBuilderFieldProps,
  start: number,
  end: number,
  strings: IStrings
): ITextModeDiagnostic => ({
  code: 'usage_limit_exceeded',
  message: getBuilderValidationMessage(
    field.usageLimit?.message,
    getValidationString(
      strings.validation,
      'usageLimitExceeded',
      `Field "${field.field}" can appear at most ${field.usageLimit?.max} times in this scope`,
      {
        field: field.label || field.field,
        max: field.usageLimit?.max,
      }
    ),
    {
      field,
      usageLimit: field.usageLimit,
    }
  ),
  start,
  end,
});
