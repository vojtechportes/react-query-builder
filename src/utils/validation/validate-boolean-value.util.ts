import {
  IBooleanValueValidationRule,
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
} from '../../builder';
import { validateBuilderBaseValue } from './validate-builder-base-value.util';

export const validateBooleanValue = (
  value: boolean,
  validation: Partial<IBooleanValueValidationRule>,
  baseIssue: Omit<IBuilderValidationIssue, 'message'>,
  context: IBuilderValidationMessageContext,
  validationContext: IBuilderValidationContext
): IBuilderValidationIssue[] | Promise<IBuilderValidationIssue[]> => {
  return validateBuilderBaseValue(
    value,
    validation,
    baseIssue,
    context,
    validationContext
  );
};
