import {
  IBuilderFieldProps,
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
} from '../..';
import { strings } from '../../../shared/localization/locales/en-us';
import { validateDateValue } from './validate-date-value.util';

const field: IBuilderFieldProps = {
  field: 'CREATED_AT',
  label: 'Created at',
  type: 'DATE',
};
const baseIssue: Omit<IBuilderValidationIssue, 'message'> = {
  ruleId: 'rule-1',
  field: 'CREATED_AT',
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

describe('validateDateValue', () => {
  it('validates stable ISO dates against both limits', async () => {
    const earlyIssues = await Promise.resolve(
      validateDateValue(
        '2026-01-01T00:00:00.000Z',
        { minDate: '2026-02-01T00:00:00.000Z' },
        baseIssue,
        context,
        validationContext
      )
    );
    const lateIssues = await Promise.resolve(
      validateDateValue(
        '2026-04-01T00:00:00.000Z',
        { maxDate: new Date('2026-03-01T00:00:00.000Z') },
        baseIssue,
        context,
        validationContext
      )
    );

    expect(earlyIssues).toEqual([
      expect.objectContaining({ code: 'min_date' }),
    ]);
    expect(lateIssues).toEqual([expect.objectContaining({ code: 'max_date' })]);
  });
});
