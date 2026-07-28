import {
  IBuilderFieldProps,
  IBuilderValidationContext,
  IBuilderValidationMessageContext,
} from '../..';
import { strings } from '../../../shared/localization/locales/en-us';
import { createCustomValidationIssue } from './create-custom-validation-issue.util';

const field: IBuilderFieldProps = {
  field: 'NAME',
  label: 'Name',
  type: 'TEXT',
};
const context: IBuilderValidationMessageContext = { field, ruleId: 'rule-1' };
const validationContext: IBuilderValidationContext = {
  fields: [field],
  singleRootGroup: true,
  groupTypes: 'with-modifiers',
  allowGroupNegation: true,
  allowFieldComparisons: false,
  strings,
};

describe('createCustomValidationIssue', () => {
  it('creates a custom issue with the configured message', () => {
    expect(
      createCustomValidationIssue(
        {
          ruleId: 'rule-1',
          field: 'NAME',
          code: 'original',
          severity: 'warning',
        },
        context,
        (messageContext) => `Invalid ${messageContext.field.label}`,
        validationContext
      )
    ).toEqual({
      ruleId: 'rule-1',
      field: 'NAME',
      code: 'custom',
      severity: 'warning',
      message: 'Invalid Name',
    });
  });
});
