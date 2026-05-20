import type {
  IDenormalizedRuleNode,
  QueryOperator,
  QueryRuleValue,
} from '../../utils/query-tree';
import { escapeElasticsearchWildcard } from './shared';

type ElasticsearchClause = Record<string, unknown>;

const ensureArrayValue = (
  operator: QueryOperator | undefined,
  value: QueryRuleValue | undefined
): string[] | number[] => {
  if (!Array.isArray(value)) {
    throw new Error(`Operator "${operator}" requires an array value.`);
  }

  return value;
};

const ensureRangeValue = (
  operator: QueryOperator | undefined,
  value: QueryRuleValue | undefined
): [string, string] | [number, number] => {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new Error(`Operator "${operator}" requires a two-item array value.`);
  }

  return value as [string, string] | [number, number];
};

const ensureStringValue = (
  operator: QueryOperator | undefined,
  value: QueryRuleValue | undefined
): string => {
  if (typeof value !== 'string') {
    throw new Error(`Operator "${operator}" requires a string value.`);
  }

  return value;
};

const createMustNotClause = (clause: ElasticsearchClause): ElasticsearchClause => ({
  bool: {
    must_not: [clause],
  },
});

export const formatElasticsearchRule = (
  rule: IDenormalizedRuleNode
): ElasticsearchClause => {
  switch (rule.operator) {
    case 'EQUAL':
      return { term: { [rule.field]: rule.value } };
    case 'NOT_EQUAL':
      return createMustNotClause({ term: { [rule.field]: rule.value } });
    case 'LARGER':
      return { range: { [rule.field]: { gt: rule.value } } };
    case 'LARGER_EQUAL':
      return { range: { [rule.field]: { gte: rule.value } } };
    case 'SMALLER':
      return { range: { [rule.field]: { lt: rule.value } } };
    case 'SMALLER_EQUAL':
      return { range: { [rule.field]: { lte: rule.value } } };
    case 'IN':
    case 'ANY_IN':
      return { terms: { [rule.field]: ensureArrayValue(rule.operator, rule.value) } };
    case 'NOT_IN':
      return createMustNotClause({
        terms: { [rule.field]: ensureArrayValue(rule.operator, rule.value) },
      });
    case 'ALL_IN':
      return {
        bool: {
          must: ensureArrayValue(rule.operator, rule.value).map(item => ({
            term: { [rule.field]: item },
          })),
        },
      };
    case 'BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return { range: { [rule.field]: { gte: start, lte: end } } };
    }
    case 'NOT_BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return {
        bool: {
          should: [
            { range: { [rule.field]: { lt: start } } },
            { range: { [rule.field]: { gt: end } } },
          ],
          minimum_should_match: 1,
        },
      };
    }
    case 'IS_NULL':
      return createMustNotClause({ exists: { field: rule.field } });
    case 'IS_NOT_NULL':
      return { exists: { field: rule.field } };
    case 'CONTAINS':
      return {
        wildcard: {
          [rule.field]: {
            value: `*${escapeElasticsearchWildcard(
              ensureStringValue(rule.operator, rule.value)
            )}*`,
          },
        },
      };
    case 'NOT_CONTAINS':
      return createMustNotClause({
        wildcard: {
          [rule.field]: {
            value: `*${escapeElasticsearchWildcard(
              ensureStringValue(rule.operator, rule.value)
            )}*`,
          },
        },
      });
    case 'STARTS_WITH':
      return {
        prefix: {
          [rule.field]: ensureStringValue(rule.operator, rule.value),
        },
      };
    case 'ENDS_WITH':
      return {
        wildcard: {
          [rule.field]: {
            value: `*${escapeElasticsearchWildcard(
              ensureStringValue(rule.operator, rule.value)
            )}`,
          },
        },
      };
    case 'LIKE':
      return {
        wildcard: {
          [rule.field]: {
            value: escapeElasticsearchWildcard(
              ensureStringValue(rule.operator, rule.value)
            ),
          },
        },
      };
    case 'NOT_LIKE':
      return createMustNotClause({
        wildcard: {
          [rule.field]: {
            value: escapeElasticsearchWildcard(
              ensureStringValue(rule.operator, rule.value)
            ),
          },
        },
      });
    default:
      throw new Error(
        `Unsupported or missing operator "${rule.operator}" for field "${rule.field}".`
      );
  }
};
