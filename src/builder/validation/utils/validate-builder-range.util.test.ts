import {
  IBuilderFieldProps,
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
} from '../..';
import { strings } from '../../../shared/localization/locales/en-us';
import { validateBuilderRange } from './validate-builder-range.util';

const field: IBuilderFieldProps = {
  field: 'AMOUNT',
  label: 'Amount',
  type: 'NUMBER',
};
const baseIssue: Omit<IBuilderValidationIssue, 'message'> = {
  ruleId: 'rule-1',
  field: 'AMOUNT',
};
const messageContext: IBuilderValidationMessageContext = {
  field,
  operator: 'BETWEEN',
  value: [10, 5],
  ruleId: 'rule-1',
};
const validationContext: IBuilderValidationContext = {
  fields: [field],
  singleRootGroup: true,
  groupTypes: 'with-modifiers',
  allowGroupNegation: true,
  allowFieldComparisons: false,
  strings,
};

describe('validateBuilderRange', () => {
  it('allows ranges when validation is absent', () => {
    expect(
      validateBuilderRange(
        [10, 5],
        undefined,
        baseIssue,
        messageContext,
        validationContext
      )
    ).toEqual([]);
  });

  it('checks numeric and string ordering with equality rules', () => {
    expect(
      validateBuilderRange(
        [10, 5],
        { requireAscending: true },
        baseIssue,
        messageContext,
        validationContext
      )
    ).toEqual([expect.objectContaining({ code: 'range_order' })]);
    expect(
      validateBuilderRange(
        ['b', 'a'],
        { requireAscending: true },
        baseIssue,
        messageContext,
        validationContext
      )
    ).toEqual([expect.objectContaining({ code: 'range_order' })]);
    expect(
      validateBuilderRange(
        [5, 5],
        { requireAscending: true, allowEqual: true },
        baseIssue,
        messageContext,
        validationContext
      )
    ).toEqual([]);
  });

  it('adds synchronous custom range issues with configured messages', () => {
    expect(
      validateBuilderRange(
        [1, 2],
        { validate: () => false, message: 'Invalid interval' },
        baseIssue,
        messageContext,
        validationContext
      )
    ).toEqual([
      expect.objectContaining({
        code: 'range_custom',
        message: 'Invalid interval',
      }),
    ]);
  });

  it('supports asynchronous custom range validation', async () => {
    await expect(
      validateBuilderRange(
        [1, 2],
        { validate: async () => false },
        baseIssue,
        messageContext,
        validationContext
      )
    ).resolves.toEqual([expect.objectContaining({ code: 'range_custom' })]);
  });
});
