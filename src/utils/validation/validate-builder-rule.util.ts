import {
  IBuilderFieldValidationBase,
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
  IDateFieldProps,
  IDateFieldValidationRule,
  IDateValueValidationRule,
  IListFieldValidationRule,
  IMultiListFieldValidationRule,
  INumberFieldProps,
  INumberFieldValidationRule,
  INumberValueValidationRule,
  IStatementFieldProps,
  ITextFieldProps,
  ITextFieldValidationRule,
  ITextValueValidationRule,
} from '../../builder';
import { isBoolean } from '../is-boolean.util';
import { isEmptyBuilderValue } from '../is-empty-builder-value.util';
import { isNumber } from '../is-number.util';
import { isNumberArray } from '../is-number-array.util';
import { isOptionList } from '../is-option-list.util';
import { isPromiseLike } from '../is-promise-like.util';
import { isRangeOperator } from '../is-range-operator.util';
import { isString } from '../is-string.util';
import { isStringArray } from '../is-string-array.util';
import { isStringOrNumberArray } from '../is-string-or-number-array.util';
import { operatorRequiresValue } from '../operator-requires-value.util';
import { IDenormalizedRuleNode } from '../query-tree';
import { getBuilderValidationMessage } from './get-builder-validation-message.util';
import { getValidationString } from './get-validation-string.util';
import { resolveBuilderValidationRule } from './resolve-builder-validation-rule.util';
import { resolveRangeBoundValidation } from './resolve-range-bound-validation.util';
import { validateBooleanValue } from './validate-boolean-value.util';
import { validateBuilderRange } from './validate-builder-range.util';
import { validateDateValue } from './validate-date-value.util';
import { validateListValue } from './validate-list-value.util';
import { validateMultiListValue } from './validate-multi-list-value.util';
import { validateNumberValue } from './validate-number-value.util';
import { validateTextValue } from './validate-text-value.util';

const validateTextRule = (
  rule: IDenormalizedRuleNode,
  field: ITextFieldProps | IStatementFieldProps,
  validation: Partial<ITextFieldValidationRule>,
  baseIssue: Omit<IBuilderValidationIssue, 'message'>,
  context: IBuilderValidationMessageContext,
  validationContext: IBuilderValidationContext
): IBuilderValidationIssue[] | Promise<IBuilderValidationIssue[]> => {
  void field;
  const issues: IBuilderValidationIssue[] = [];
  const pendingIssueGroups: Array<Promise<IBuilderValidationIssue[]>> = [];

  if (isString(rule.value)) {
    const valueIssues = validateTextValue(
      rule.value,
      validation,
      baseIssue,
      context,
      validationContext
    );

    if (isPromiseLike(valueIssues)) {
      pendingIssueGroups.push(valueIssues);
    } else {
      issues.push(...valueIssues);
    }
  }

  if (isRangeOperator(rule.operator) && isStringArray(rule.value)) {
    const startValidation = resolveRangeBoundValidation<ITextValueValidationRule>(
      validation,
      'start'
    );
    const endValidation = resolveRangeBoundValidation<ITextValueValidationRule>(
      validation,
      'end'
    );

    const startIssues = validateTextValue(rule.value[0], startValidation, baseIssue, {
      ...context,
      value: rule.value[0],
      rangeBoundary: 'start',
    }, validationContext);
    const endIssues = validateTextValue(rule.value[1], endValidation, baseIssue, {
      ...context,
      value: rule.value[1],
      rangeBoundary: 'end',
    }, validationContext);

    if (isPromiseLike(startIssues)) {
      pendingIssueGroups.push(startIssues);
    } else {
      issues.push(...startIssues);
    }

    if (isPromiseLike(endIssues)) {
      pendingIssueGroups.push(endIssues);
    } else {
      issues.push(...endIssues);
    }

    const rangeIssues = validateBuilderRange(
      [rule.value[0], rule.value[1]],
      validation.range,
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

  if (pendingIssueGroups.length > 0) {
    return Promise.all(pendingIssueGroups).then((asyncIssueGroups) => [
      ...issues,
      ...asyncIssueGroups.flat(),
    ]);
  }

  return issues;
};

const validateNumberRule = (
  rule: IDenormalizedRuleNode,
  field: INumberFieldProps,
  validation: Partial<INumberFieldValidationRule>,
  baseIssue: Omit<IBuilderValidationIssue, 'message'>,
  context: IBuilderValidationMessageContext,
  validationContext: IBuilderValidationContext
): IBuilderValidationIssue[] | Promise<IBuilderValidationIssue[]> => {
  void field;
  const issues: IBuilderValidationIssue[] = [];
  const pendingIssueGroups: Array<Promise<IBuilderValidationIssue[]>> = [];

  if (isNumber(rule.value)) {
    const valueIssues = validateNumberValue(
      rule.value,
      validation,
      baseIssue,
      context,
      validationContext
    );

    if (isPromiseLike(valueIssues)) {
      pendingIssueGroups.push(valueIssues);
    } else {
      issues.push(...valueIssues);
    }
  }

  if (isRangeOperator(rule.operator) && isNumberArray(rule.value)) {
    const startValidation = resolveRangeBoundValidation<INumberValueValidationRule>(
      validation,
      'start'
    );
    const endValidation = resolveRangeBoundValidation<INumberValueValidationRule>(
      validation,
      'end'
    );

    const startIssues = validateNumberValue(rule.value[0], startValidation, baseIssue, {
      ...context,
      value: rule.value[0],
      rangeBoundary: 'start',
    }, validationContext);
    const endIssues = validateNumberValue(rule.value[1], endValidation, baseIssue, {
      ...context,
      value: rule.value[1],
      rangeBoundary: 'end',
    }, validationContext);

    if (isPromiseLike(startIssues)) {
      pendingIssueGroups.push(startIssues);
    } else {
      issues.push(...startIssues);
    }

    if (isPromiseLike(endIssues)) {
      pendingIssueGroups.push(endIssues);
    } else {
      issues.push(...endIssues);
    }

    const rangeIssues = validateBuilderRange(
      [rule.value[0], rule.value[1]],
      validation.range,
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

  if (pendingIssueGroups.length > 0) {
    return Promise.all(pendingIssueGroups).then((asyncIssueGroups) => [
      ...issues,
      ...asyncIssueGroups.flat(),
    ]);
  }

  return issues;
};

const validateDateRule = (
  rule: IDenormalizedRuleNode,
  field: IDateFieldProps,
  validation: Partial<IDateFieldValidationRule>,
  baseIssue: Omit<IBuilderValidationIssue, 'message'>,
  context: IBuilderValidationMessageContext,
  validationContext: IBuilderValidationContext
): IBuilderValidationIssue[] | Promise<IBuilderValidationIssue[]> => {
  void field;
  const issues: IBuilderValidationIssue[] = [];
  const pendingIssueGroups: Array<Promise<IBuilderValidationIssue[]>> = [];

  if (isString(rule.value)) {
    const valueIssues = validateDateValue(
      rule.value,
      validation,
      baseIssue,
      context,
      validationContext
    );

    if (isPromiseLike(valueIssues)) {
      pendingIssueGroups.push(valueIssues);
    } else {
      issues.push(...valueIssues);
    }
  }

  if (isRangeOperator(rule.operator) && isStringArray(rule.value)) {
    const startValidation = resolveRangeBoundValidation<IDateValueValidationRule>(
      validation,
      'start'
    );
    const endValidation = resolveRangeBoundValidation<IDateValueValidationRule>(
      validation,
      'end'
    );

    const startIssues = validateDateValue(rule.value[0], startValidation, baseIssue, {
      ...context,
      value: rule.value[0],
      rangeBoundary: 'start',
    }, validationContext);
    const endIssues = validateDateValue(rule.value[1], endValidation, baseIssue, {
      ...context,
      value: rule.value[1],
      rangeBoundary: 'end',
    }, validationContext);

    if (isPromiseLike(startIssues)) {
      pendingIssueGroups.push(startIssues);
    } else {
      issues.push(...startIssues);
    }

    if (isPromiseLike(endIssues)) {
      pendingIssueGroups.push(endIssues);
    } else {
      issues.push(...endIssues);
    }

    const rangeIssues = validateBuilderRange(
      [rule.value[0], rule.value[1]],
      validation.range,
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

  if (pendingIssueGroups.length > 0) {
    return Promise.all(pendingIssueGroups).then((asyncIssueGroups) => [
      ...issues,
      ...asyncIssueGroups.flat(),
    ]);
  }

  return issues;
};

export const validateBuilderRule = (
  rule: IDenormalizedRuleNode,
  field: IBuilderValidationContext['fields'][number],
  validationContext: IBuilderValidationContext
): IBuilderValidationIssue[] | Promise<IBuilderValidationIssue[]> => {
  const issues: IBuilderValidationIssue[] = [];
  const pendingIssueGroups: Array<Promise<IBuilderValidationIssue[]>> = [];
  const validation = resolveBuilderValidationRule<
    IBuilderFieldValidationBase<unknown> & { range?: unknown }
  >(field.validation as never, rule.operator);
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
        { operator: rule.operator, field: field.field }
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
      const textIssues = validateTextRule(
        rule,
        field,
        validation as Partial<ITextFieldValidationRule>,
        baseIssue,
        context,
        validationContext
      );

      if (isPromiseLike(textIssues)) {
        pendingIssueGroups.push(textIssues);
      } else {
        issues.push(...textIssues);
      }

      break;
    }

    case 'NUMBER': {
      const numberIssues = validateNumberRule(
        rule,
        field,
        validation as Partial<INumberFieldValidationRule>,
        baseIssue,
        context,
        validationContext
      );

      if (isPromiseLike(numberIssues)) {
        pendingIssueGroups.push(numberIssues);
      } else {
        issues.push(...numberIssues);
      }

      break;
    }

    case 'DATE': {
      const dateIssues = validateDateRule(
        rule,
        field,
        validation as Partial<IDateFieldValidationRule>,
        baseIssue,
        context,
        validationContext
      );

      if (isPromiseLike(dateIssues)) {
        pendingIssueGroups.push(dateIssues);
      } else {
        issues.push(...dateIssues);
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
      } else {
        const booleanIssues = validateBooleanValue(
          rule.value,
          validation as Partial<IBuilderFieldValidationBase<boolean>>,
          baseIssue,
          context,
          validationContext
        );

        if (isPromiseLike(booleanIssues)) {
          pendingIssueGroups.push(booleanIssues);
        } else {
          issues.push(...booleanIssues);
        }
      }

      break;
    }

    case 'LIST': {
      const allowedValues = isOptionList(field.value)
        ? field.value.map((option) => option.value)
        : [];

      if (
        typeof rule.value !== 'undefined' &&
        (typeof rule.value === 'string' ||
          typeof rule.value === 'number')
      ) {
        const listIssues = validateListValue(
          rule.value,
          validation as Partial<IListFieldValidationRule>,
          allowedValues,
          baseIssue,
          context,
          validationContext
        );

        if (isPromiseLike(listIssues)) {
          pendingIssueGroups.push(listIssues);
        } else {
          issues.push(...listIssues);
        }
      }

      break;
    }

    case 'MULTI_LIST': {
      const allowedValues = isOptionList(field.value)
        ? field.value.map((option) => option.value)
        : [];

      if (isStringOrNumberArray(rule.value)) {
        const multiListIssues = validateMultiListValue(
          rule.value,
          validation as Partial<IMultiListFieldValidationRule>,
          allowedValues,
          baseIssue,
          context,
          validationContext
        );

        if (isPromiseLike(multiListIssues)) {
          pendingIssueGroups.push(multiListIssues);
        } else {
          issues.push(...multiListIssues);
        }
      }

      break;
    }

    default:
      break;
  }

  if (pendingIssueGroups.length > 0) {
    return Promise.all(pendingIssueGroups).then((asyncIssueGroups) => [
      ...issues,
      ...asyncIssueGroups.flat(),
    ]);
  }

  return issues;
};
