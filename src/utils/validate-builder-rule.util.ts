import {
  IBuilderFieldProps,
  IBuilderRangeValidation,
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
} from '../builder';
import { IDenormalizedRuleNode } from './query-tree';
import { getBuilderValidationMessage } from './get-builder-validation-message.util';
import { getValidationString } from './get-validation-string.util';
import { isBoolean } from './is-boolean.util';
import { isEmptyBuilderValue } from './is-empty-builder-value.util';
import { isNumber } from './is-number.util';
import { isNumberArray } from './is-number-array.util';
import { isOptionList } from './is-option-list.util';
import { isPromiseLike } from './is-promise-like.util';
import { isString } from './is-string.util';
import { isStringArray } from './is-string-array.util';
import { isStringOrNumberArray } from './is-string-or-number-array.util';
import { operatorRequiresValue } from './operator-requires-value.util';
import { validateBuilderRange } from './validate-builder-range.util';

const parseComparableDate = (value: string | Date) => {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
};

const createCustomValidationIssue = (
  baseIssue: Omit<IBuilderValidationIssue, 'message'>,
  context: IBuilderValidationMessageContext,
  validation: IBuilderFieldProps['validation'],
  validationContext: IBuilderValidationContext
) => {
  return {
    ...baseIssue,
    code: 'custom',
    message: getBuilderValidationMessage(
      validation?.customMessage,
      getValidationString(
        validationContext.strings.validation,
        'custom',
        'Value is invalid'
      ),
      context
    ),
  };
};

export const validateBuilderRule = (
  rule: IDenormalizedRuleNode,
  field: IBuilderFieldProps,
  validationContext: IBuilderValidationContext
): IBuilderValidationIssue[] | Promise<IBuilderValidationIssue[]> => {
  const issues: IBuilderValidationIssue[] = [];
  const pendingIssueGroups: Array<Promise<IBuilderValidationIssue[]>> = [];
  const validation = field.validation;
  const baseIssue = {
    ruleId: rule.id || '',
    field: rule.field,
    severity: 'error' as const,
  };
  const context: IBuilderValidationMessageContext = {
    field,
    operator: rule.operator,
    value: rule.value,
    ruleId: rule.id,
  };

  if (field.operators && rule.operator && !field.operators.includes(rule.operator)) {
    issues.push({
      ...baseIssue,
      code: 'operator_not_allowed',
      message: getValidationString(
        validationContext.strings.validation,
        'operatorNotAllowed',
        `Operator "${rule.operator}" is not allowed for field "${field.field}"`,
        {
          operator: rule.operator,
          field: field.field,
        }
      ),
    });
  }

  if (!validation) {
    return issues;
  }

  if (!operatorRequiresValue(rule.operator)) {
    if (typeof rule.value !== 'undefined') {
      issues.push({
        ...baseIssue,
        code: 'value_not_allowed',
        message: getValidationString(
          validationContext.strings.validation,
          'valueNotAllowed',
          'This operator must not have a value'
        ),
      });
    }

    return issues;
  }

  if (validation.required && isEmptyBuilderValue(rule.value)) {
    issues.push({
      ...baseIssue,
      code: 'required',
      message: getBuilderValidationMessage(
        validation.customMessage,
        getValidationString(
          validationContext.strings.validation,
          'required',
          'This value is required'
        ),
        context
      ),
    });

    return issues;
  }

  switch (field.type) {
    case 'TEXT':
    case 'STATEMENT': {
      if (isString(rule.value)) {
        if (
          'minLength' in validation &&
          typeof validation.minLength === 'number' &&
          rule.value.length < validation.minLength
        ) {
          issues.push({
            ...baseIssue,
            code: 'min_length',
            message: getValidationString(
              validationContext.strings.validation,
              'minLength',
              `Value must be at least ${validation.minLength} characters long`,
              { min: validation.minLength }
            ),
          });
        }

        if (
          'maxLength' in validation &&
          typeof validation.maxLength === 'number' &&
          rule.value.length > validation.maxLength
        ) {
          issues.push({
            ...baseIssue,
            code: 'max_length',
            message: getValidationString(
              validationContext.strings.validation,
              'maxLength',
              `Value must be at most ${validation.maxLength} characters long`,
              { max: validation.maxLength }
            ),
          });
        }

        if ('matches' in validation && validation.matches && !validation.matches.test(rule.value)) {
          issues.push({
            ...baseIssue,
            code: 'matches',
            message: getValidationString(
              validationContext.strings.validation,
              'matches',
              'Value has invalid format'
            ),
          });
        }
      }

      if (isStringArray(rule.value) && 'range' in validation && validation.range) {
        const rangeIssues = validateBuilderRange(
          [rule.value[0], rule.value[1]],
          validation.range as IBuilderRangeValidation<string>,
          baseIssue,
          context,
          validationContext
        );

        if (isPromiseLike(rangeIssues)) {
          pendingIssueGroups.push(rangeIssues);
        } else {
          issues.push(...rangeIssues);
        }
      }

      break;
    }

    case 'NUMBER': {
      if (isNumber(rule.value)) {
        if ('min' in validation && typeof validation.min === 'number' && rule.value < validation.min) {
          issues.push({
            ...baseIssue,
            code: 'min',
            message: getValidationString(
              validationContext.strings.validation,
              'min',
              `Value must be greater than or equal to ${validation.min}`,
              { min: validation.min }
            ),
          });
        }

        if ('max' in validation && typeof validation.max === 'number' && rule.value > validation.max) {
          issues.push({
            ...baseIssue,
            code: 'max',
            message: getValidationString(
              validationContext.strings.validation,
              'max',
              `Value must be less than or equal to ${validation.max}`,
              { max: validation.max }
            ),
          });
        }

        if ('integer' in validation && validation.integer && !Number.isInteger(rule.value)) {
          issues.push({
            ...baseIssue,
            code: 'integer',
            message: getValidationString(
              validationContext.strings.validation,
              'integer',
              'Value must be an integer'
            ),
          });
        }

        if ('positive' in validation && validation.positive && rule.value <= 0) {
          issues.push({
            ...baseIssue,
            code: 'positive',
            message: getValidationString(
              validationContext.strings.validation,
              'positive',
              'Value must be positive'
            ),
          });
        }

        if ('negative' in validation && validation.negative && rule.value >= 0) {
          issues.push({
            ...baseIssue,
            code: 'negative',
            message: getValidationString(
              validationContext.strings.validation,
              'negative',
              'Value must be negative'
            ),
          });
        }
      }

      if (isNumberArray(rule.value) && 'range' in validation && validation.range) {
        const rangeIssues = validateBuilderRange(
          [rule.value[0], rule.value[1]],
          validation.range as IBuilderRangeValidation<number>,
          baseIssue,
          context,
          validationContext
        );

        if (isPromiseLike(rangeIssues)) {
          pendingIssueGroups.push(rangeIssues);
        } else {
          issues.push(...rangeIssues);
        }
      }

      break;
    }

    case 'DATE': {
      if (isString(rule.value)) {
        const comparableValue = parseComparableDate(rule.value);

        if (
          'minDate' in validation &&
          validation.minDate &&
          comparableValue < parseComparableDate(validation.minDate)
        ) {
          issues.push({
            ...baseIssue,
            code: 'min_date',
            message: getValidationString(
              validationContext.strings.validation,
              'minDate',
              'Date is earlier than allowed'
            ),
          });
        }

        if (
          'maxDate' in validation &&
          validation.maxDate &&
          comparableValue > parseComparableDate(validation.maxDate)
        ) {
          issues.push({
            ...baseIssue,
            code: 'max_date',
            message: getValidationString(
              validationContext.strings.validation,
              'maxDate',
              'Date is later than allowed'
            ),
          });
        }
      }

      if (isStringArray(rule.value) && 'range' in validation && validation.range) {
        const rangeIssues = validateBuilderRange(
          [rule.value[0], rule.value[1]],
          validation.range as IBuilderRangeValidation<string>,
          baseIssue,
          context,
          validationContext
        );

        if (isPromiseLike(rangeIssues)) {
          pendingIssueGroups.push(rangeIssues);
        } else {
          issues.push(...rangeIssues);
        }
      }

      break;
    }

    case 'BOOLEAN': {
      if (!isBoolean(rule.value)) {
        issues.push({
          ...baseIssue,
          code: 'boolean',
          message: getValidationString(
            validationContext.strings.validation,
            'boolean',
            'Value must be boolean'
          ),
        });
      }

      break;
    }

    case 'LIST': {
      const allowedValues = isOptionList(field.value)
        ? field.value.map((option) => option.value)
        : [];

      const restrictedValues = validation.oneOf?.length
        ? validation.oneOf
        : allowedValues;

      if (
        rule.value &&
        restrictedValues.length > 0 &&
        !restrictedValues.some((allowedValue) => allowedValue === rule.value)
      ) {
        issues.push({
          ...baseIssue,
          code: 'one_of',
          message: getValidationString(
            validationContext.strings.validation,
            'oneOf',
            'Value must be one of the allowed options'
          ),
        });
      }

      break;
    }

    case 'MULTI_LIST': {
      const allowedValues = isOptionList(field.value)
        ? field.value.map((option) => option.value)
        : [];

      if (isStringOrNumberArray(rule.value)) {
        if (
          'minItems' in validation &&
          typeof validation.minItems === 'number' &&
          rule.value.length < validation.minItems
        ) {
          issues.push({
            ...baseIssue,
            code: 'min_items',
            message: getValidationString(
              validationContext.strings.validation,
              'minItems',
              `Select at least ${validation.minItems} values`,
              { min: validation.minItems }
            ),
          });
        }

        if (
          'maxItems' in validation &&
          typeof validation.maxItems === 'number' &&
          rule.value.length > validation.maxItems
        ) {
          issues.push({
            ...baseIssue,
            code: 'max_items',
            message: getValidationString(
              validationContext.strings.validation,
              'maxItems',
              `Select at most ${validation.maxItems} values`,
              { max: validation.maxItems }
            ),
          });
        }

        const restrictedValues = validation.oneOf?.length
          ? validation.oneOf
          : allowedValues;

        if (
          restrictedValues.length > 0 &&
          rule.value.some(
            (value) =>
              !restrictedValues.some((allowedValue) => allowedValue === value)
          )
        ) {
          issues.push({
            ...baseIssue,
            code: 'one_of',
            message: getValidationString(
              validationContext.strings.validation,
              'oneOf',
              'All selected values must be allowed'
            ),
          });
        }
      }

      break;
    }

    default:
      break;
  }

  if (validation.custom) {
    const customValidationResult = validation.custom(rule.value as never, context);

    if (isPromiseLike(customValidationResult)) {
      pendingIssueGroups.push(
        customValidationResult.then((customValidationPassed) =>
          customValidationPassed
            ? []
            : [
                createCustomValidationIssue(
                  baseIssue,
                  context,
                  validation,
                  validationContext
                ),
              ]
        )
      );
    } else if (!customValidationResult) {
      issues.push({
        ...createCustomValidationIssue(
          baseIssue,
          context,
          validation,
          validationContext
        ),
      });
    }
  }

  if (pendingIssueGroups.length > 0) {
    return Promise.all(pendingIssueGroups).then((asyncIssueGroups) => [
      ...issues,
      ...asyncIssueGroups.flat(),
    ]);
  }

  return issues;
};
