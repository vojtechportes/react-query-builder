import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  DenormalizedQuery,
  IDenormalizedRuleNode,
  QueryGroupValue,
} from '../../utils/query-tree';
import type { IBuilderFieldProps } from '../../builder';
import type { IFormatSqlOptions } from '../types';
import { isFieldComparisonRule } from '../../utils/rule-value-source';
import {
  DEFAULT_MODIFIERLESS_GROUP_COMBINATOR,
  DEFAULT_ROOTLESS_COMBINATOR,
  formatScalarValue,
  isGroupNode,
  quoteIdentifier,
} from './shared';
import { coerceSqlArrayValue } from './utils/coerce-sql-array-value';
import { isSqlRuleFormattable } from './utils/is-sql-rule-formattable';

const resolveFieldConfig = (
  rule: IDenormalizedRuleNode,
  fields?: IBuilderFieldProps[]
): IBuilderFieldProps | undefined =>
  fields?.find(field => field.field === rule.field);

const formatValueWithField = (
  value: string | number | boolean,
  field?: IBuilderFieldProps
): string => {
  if (!field) {
    return formatScalarValue(value);
  }

  switch (field.type) {
    case 'BOOLEAN':
      if (typeof value !== 'boolean') {
        throw new Error(`Field "${field.field}" expects a boolean value.`);
      }
      return value ? 'TRUE' : 'FALSE';
    case 'NUMBER':
      if (typeof value !== 'number') {
        throw new Error(`Field "${field.field}" expects a numeric value.`);
      }
      return `${value}`;
    case 'DATE':
    case 'TEXT':
    case 'STATEMENT':
    case 'LIST':
    case 'MULTI_LIST':
      if (typeof value !== 'string' && typeof value !== 'number') {
        throw new Error(`Field "${field.field}" expects a scalar SQL-compatible value.`);
      }
      return formatScalarValue(value);
    default:
      return formatScalarValue(value);
  }
};

const formatArrayValueWithField = (
  value: Array<string | number>,
  field?: IBuilderFieldProps
): string =>
  `(${value.map(item => formatValueWithField(item, field)).join(', ')})`;

const formatRuleValue = (
  rule: IDenormalizedRuleNode,
  field?: IBuilderFieldProps
): string => {
  if (isFieldComparisonRule(rule)) {
    return quoteIdentifier(rule.valueField);
  }

  return formatValueWithField(
    rule.value as number | string | boolean,
    field
  );
};

const joinFragments = (
  fragments: string[],
  combinator: QueryGroupValue
): string => {
  if (fragments.length === 0) {
    return '';
  }

  if (fragments.length === 1) {
    return fragments[0];
  }

  return `(${fragments.join(` ${combinator} `)})`;
};

const formatLikePattern = (
  rule: IDenormalizedRuleNode,
  prefix: string,
  suffix: string
): string => {
  if (typeof rule.value !== 'string') {
    throw new Error(
      `Operator "${rule.operator}" requires a string value for field "${rule.field}".`
    );
  }

  return `${prefix}${rule.value}${suffix}`;
};

const ensureSqlSupportsRule = (rule: IDenormalizedRuleNode): void => {
  if (!isFieldComparisonRule(rule)) {
    return;
  }

  if (isSqlRuleFormattable(rule)) {
    return;
  }

  throw new Error(
    `SQL does not support field-to-field comparisons for field "${rule.field}" and operator "${rule.operator}".`
  );
};

const formatRule = (
  rule: IDenormalizedRuleNode,
  fields?: IBuilderFieldProps[]
): string => {
  ensureSqlSupportsRule(rule);

  if (!isSqlRuleFormattable(rule)) {
    return '';
  }

  const field = quoteIdentifier(rule.field);
  const fieldConfig = resolveFieldConfig(rule, fields);

  switch (rule.operator) {
    case 'LARGER':
      return `${field} > ${formatRuleValue(rule, fieldConfig)}`;
    case 'SMALLER':
      return `${field} < ${formatRuleValue(rule, fieldConfig)}`;
    case 'LARGER_EQUAL':
      return `${field} >= ${formatRuleValue(rule, fieldConfig)}`;
    case 'SMALLER_EQUAL':
      return `${field} <= ${formatRuleValue(rule, fieldConfig)}`;
    case 'EQUAL':
      return `${field} = ${formatRuleValue(rule, fieldConfig)}`;
    case 'NOT_EQUAL':
      return `${field} <> ${formatRuleValue(rule, fieldConfig)}`;
    case 'ALL_IN':
    case 'ANY_IN':
    case 'IN':
      if (!coerceSqlArrayValue(rule.value)) {
        throw new Error(`Operator "${rule.operator}" requires an array value.`);
      }

      return `${field} IN ${formatArrayValueWithField(
        coerceSqlArrayValue(rule.value) as Array<string | number>,
        fieldConfig
      )}`;
    case 'NOT_IN':
      if (!coerceSqlArrayValue(rule.value)) {
        throw new Error(`Operator "${rule.operator}" requires an array value.`);
      }

      return `${field} NOT IN ${formatArrayValueWithField(
        coerceSqlArrayValue(rule.value) as Array<string | number>,
        fieldConfig
      )}`;
    case 'BETWEEN':
      if (!Array.isArray(rule.value) || rule.value.length !== 2) {
        throw new Error('Operator "BETWEEN" requires a two-item array value.');
      }

      return `${field} BETWEEN ${formatValueWithField(
        rule.value[0] as number | string | boolean,
        fieldConfig
      )} AND ${formatValueWithField(
        rule.value[1] as number | string | boolean,
        fieldConfig
      )}`;
    case 'NOT_BETWEEN':
      if (!Array.isArray(rule.value) || rule.value.length !== 2) {
        throw new Error('Operator "NOT_BETWEEN" requires a two-item array value.');
      }

      return `${field} NOT BETWEEN ${formatValueWithField(
        rule.value[0] as number | string | boolean,
        fieldConfig
      )} AND ${formatValueWithField(
        rule.value[1] as number | string | boolean,
        fieldConfig
      )}`;
    case 'IS_NULL':
      return `${field} IS NULL`;
    case 'IS_NOT_NULL':
      return `${field} IS NOT NULL`;
    case 'LIKE':
      return `${field} LIKE ${formatRuleValue(rule, fieldConfig)}`;
    case 'NOT_LIKE':
      return `${field} NOT LIKE ${formatRuleValue(rule, fieldConfig)}`;
    case 'CONTAINS':
      return `${field} LIKE ${formatValueWithField(
        formatLikePattern(rule, '%', '%'),
        fieldConfig
      )}`;
    case 'NOT_CONTAINS':
      return `${field} NOT LIKE ${formatValueWithField(
        formatLikePattern(rule, '%', '%'),
        fieldConfig
      )}`;
    case 'STARTS_WITH':
      return `${field} LIKE ${formatValueWithField(
        formatLikePattern(rule, '', '%'),
        fieldConfig
      )}`;
    case 'ENDS_WITH':
      return `${field} LIKE ${formatValueWithField(
        formatLikePattern(rule, '%', ''),
        fieldConfig
      )}`;
    default:
      throw new Error(
        `Unsupported or missing operator "${rule.operator}" for field "${rule.field}".`
      );
  }
};

const formatNode = (
  node: DenormalizedNode,
  options: Required<Pick<
    IFormatSqlOptions,
    | 'rootlessCombinator'
    | 'modifierlessGroupCombinator'
    | 'wrapWhereClause'
    | 'fields'
  >>,
  isRoot = false
): string => {
  if (!isGroupNode(node)) {
    return formatRule(node, options.fields);
  }

  return formatGroup(node, options, isRoot);
};

const formatGroup = (
  group: DenormalizedGroupNode,
  options: Required<Pick<
    IFormatSqlOptions,
    | 'rootlessCombinator'
    | 'modifierlessGroupCombinator'
    | 'wrapWhereClause'
    | 'fields'
  >>,
  isRoot = false
): string => {
  const combinator = 'value' in group && group.value
    ? group.value
    : options.modifierlessGroupCombinator;
  const inner = joinFragments(
    group.children
      .map(child => formatNode(child, options, false))
      .filter(fragment => fragment.trim().length > 0),
    combinator
  );

  if (!inner) {
    return '';
  }

  const wrappedInner = inner.startsWith('(') && inner.endsWith(')')
    ? inner
    : `(${inner})`;

  if ('isNegated' in group && group.isNegated) {
    return `NOT ${wrappedInner}`;
  }

  if (isRoot) {
    return inner;
  }

  return wrappedInner;
};

export const formatSql = (
  value: DenormalizedQuery,
  options: IFormatSqlOptions = {}
): string => {
  const normalizedOptions = {
    rootlessCombinator:
      options.rootlessCombinator ?? DEFAULT_ROOTLESS_COMBINATOR,
    modifierlessGroupCombinator:
      options.modifierlessGroupCombinator ??
      DEFAULT_MODIFIERLESS_GROUP_COMBINATOR,
    wrapWhereClause: options.wrapWhereClause ?? false,
    fields: options.fields ?? [],
  };

  const sql = joinFragments(
    value
      .map(node => formatNode(node, normalizedOptions, true))
      .filter(fragment => fragment.trim().length > 0),
    normalizedOptions.rootlessCombinator
  );

  if (!sql) {
    return '';
  }

  return normalizedOptions.wrapWhereClause ? `WHERE ${sql}` : sql;
};


