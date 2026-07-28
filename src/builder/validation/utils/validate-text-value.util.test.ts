import {
  IBuilderFieldProps,
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
} from '../..';
import { strings } from '../../../shared/localization/locales/en-us';
import { validateTextValue } from './validate-text-value.util';

const field: IBuilderFieldProps = {
  field: 'NAME',
  label: 'Name',
  type: 'TEXT',
};
const baseIssue: Omit<IBuilderValidationIssue, 'message'> = {
  ruleId: 'rule-1',
  field: 'NAME',
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

describe('validateTextValue', () => {
  it('aggregates length and pattern issues', async () => {
    const shortIssues = await Promise.resolve(
      validateTextValue(
        'ab',
        { minLength: 3, matches: /^z/ },
        baseIssue,
        context,
        validationContext
      )
    );
    const longIssues = await Promise.resolve(
      validateTextValue(
        'abcdef',
        { maxLength: 5 },
        baseIssue,
        context,
        validationContext
      )
    );

    expect(getCodes(shortIssues)).toEqual(['min_length', 'matches']);
    expect(getCodes(longIssues)).toEqual(['max_length']);
  });
});
