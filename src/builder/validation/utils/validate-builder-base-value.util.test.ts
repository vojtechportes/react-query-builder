import {
  IBuilderFieldProps,
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
} from '../..';
import { strings } from '../../../shared/localization/locales/en-us';
import { validateBuilderBaseValue } from './validate-builder-base-value.util';

const field: IBuilderFieldProps = {
  field: 'VALUE',
  label: 'Value',
  type: 'TEXT',
};
const baseIssue: Omit<IBuilderValidationIssue, 'message'> = {
  ruleId: 'rule-1',
  field: 'VALUE',
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

describe('validateBuilderBaseValue', () => {
  it('combines allowed-value and synchronous custom issues', () => {
    expect(
      validateBuilderBaseValue(
        'missing',
        {
          oneOf: ['allowed'],
          custom: () => false,
          customMessage: 'Custom failure',
        },
        baseIssue,
        context,
        validationContext
      )
    ).toEqual([
      expect.objectContaining({ code: 'one_of' }),
      expect.objectContaining({ code: 'custom', message: 'Custom failure' }),
    ]);
  });

  it('supports asynchronous custom validation', async () => {
    await expect(
      validateBuilderBaseValue(
        'value',
        {
          custom: async () => false,
          customMessage: 'Async failure',
        },
        baseIssue,
        context,
        validationContext
      )
    ).resolves.toEqual([
      expect.objectContaining({ code: 'custom', message: 'Async failure' }),
    ]);
  });
});
