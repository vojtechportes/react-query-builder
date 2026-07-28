import {
  IBuilderFieldProps,
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
} from '../..';
import { strings } from '../../../shared/localization/locales/en-us';
import { validateListValue } from './validate-list-value.util';

const field: IBuilderFieldProps = {
  field: 'STATUS',
  label: 'Status',
  type: 'LIST',
  value: [{ label: 'Open', value: 'open' }],
};
const baseIssue: Omit<IBuilderValidationIssue, 'message'> = {
  ruleId: 'rule-1',
  field: 'STATUS',
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

describe('validateListValue', () => {
  it('prefers configured restrictions over field options', async () => {
    const configuredIssues = await Promise.resolve(
      validateListValue(
        'open',
        { oneOf: ['closed'] },
        ['open'],
        baseIssue,
        context,
        validationContext
      )
    );
    const fieldIssues = await Promise.resolve(
      validateListValue(
        'missing',
        {},
        ['open'],
        baseIssue,
        context,
        validationContext
      )
    );

    expect(configuredIssues).toEqual([
      expect.objectContaining({ code: 'one_of' }),
    ]);
    expect(fieldIssues).toEqual([expect.objectContaining({ code: 'one_of' })]);
  });
});
