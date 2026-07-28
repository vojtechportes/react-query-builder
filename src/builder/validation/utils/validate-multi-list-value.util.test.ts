import {
  IBuilderFieldProps,
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
} from '../..';
import { strings } from '../../../shared/localization/locales/en-us';
import { validateMultiListValue } from './validate-multi-list-value.util';

const field: IBuilderFieldProps = {
  field: 'TAGS',
  label: 'Tags',
  type: 'MULTI_LIST',
  value: [{ label: 'Allowed', value: 'allowed' }],
};
const baseIssue: Omit<IBuilderValidationIssue, 'message'> = {
  ruleId: 'rule-1',
  field: 'TAGS',
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

describe('validateMultiListValue', () => {
  it('aggregates item-count and membership issues', async () => {
    const tooFewIssues = await Promise.resolve(
      validateMultiListValue(
        [],
        { minItems: 1 },
        ['allowed'],
        baseIssue,
        context,
        validationContext
      )
    );
    const invalidSelectionIssues = await Promise.resolve(
      validateMultiListValue(
        ['allowed', 'missing', 'extra'],
        { maxItems: 2 },
        ['allowed'],
        baseIssue,
        context,
        validationContext
      )
    );

    expect(tooFewIssues).toEqual([
      expect.objectContaining({ code: 'min_items' }),
    ]);
    expect(invalidSelectionIssues).toEqual([
      expect.objectContaining({ code: 'max_items' }),
      expect.objectContaining({ code: 'one_of' }),
    ]);
  });
});
