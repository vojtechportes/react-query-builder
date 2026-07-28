import {
  IBuilderFieldProps,
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
} from '../..';
import { strings } from '../../../shared/localization/locales/en-us';
import { validateBooleanValue } from './validate-boolean-value.util';

const field: IBuilderFieldProps = {
  field: 'ACTIVE',
  label: 'Active',
  type: 'BOOLEAN',
};
const baseIssue: Omit<IBuilderValidationIssue, 'message'> = {
  ruleId: 'rule-1',
  field: 'ACTIVE',
};
const context: IBuilderValidationMessageContext = { field };
const validationContext: IBuilderValidationContext = {
  fields: [field],
  singleRootGroup: true,
  groupTypes: 'with-modifiers',
  allowGroupNegation: true,
  allowFieldComparisons: false,
  strings,
};

describe('validateBooleanValue', () => {
  it('delegates custom validation to the base validator', () => {
    expect(
      validateBooleanValue(
        false,
        { custom: (value) => value, customMessage: 'Must be enabled' },
        baseIssue,
        context,
        validationContext
      )
    ).toEqual([
      expect.objectContaining({ code: 'custom', message: 'Must be enabled' }),
    ]);
  });
});
