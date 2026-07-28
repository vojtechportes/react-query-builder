import {
  IBuilderFieldProps,
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
} from '../..';
import { strings } from '../../../shared/localization/locales/en-us';
import { validateNumberValue } from './validate-number-value.util';

const field: IBuilderFieldProps = {
  field: 'AMOUNT',
  label: 'Amount',
  type: 'NUMBER',
};
const baseIssue: Omit<IBuilderValidationIssue, 'message'> = {
  ruleId: 'rule-1',
  field: 'AMOUNT',
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
const getCodes = (issues: IBuilderValidationIssue[]) =>
  issues.map((issue) => issue.code);

describe('validateNumberValue', () => {
  it('reports representative numeric constraint failures', async () => {
    const lowIssues = await Promise.resolve(
      validateNumberValue(
        -1.5,
        { min: 0, integer: true, positive: true },
        baseIssue,
        context,
        validationContext
      )
    );
    const highIssues = await Promise.resolve(
      validateNumberValue(
        5,
        { max: 4, negative: true },
        baseIssue,
        context,
        validationContext
      )
    );

    expect(getCodes(lowIssues)).toEqual(['min', 'integer', 'positive']);
    expect(getCodes(highIssues)).toEqual(['max', 'negative']);
  });
});
