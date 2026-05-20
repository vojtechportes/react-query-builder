import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  QueryGroupValue,
} from '../../utils/query-tree';
import { isGroupNode } from '../sql/shared';
import { formatMongoRule } from './format-mongo-rule';

const combineMongoExpressions = (
  expressions: Record<string, unknown>[],
  combinator: QueryGroupValue
): Record<string, unknown> => {
  if (expressions.length === 0) {
    return {};
  }

  if (expressions.length === 1) {
    return expressions[0];
  }

  return {
    [combinator === 'AND' ? '$and' : '$or']: expressions,
  };
};

const negateMongoExpression = (
  expression: Record<string, unknown>,
  combinator: QueryGroupValue
): Record<string, unknown> => {
  if (Object.keys(expression).length === 0) {
    return expression;
  }

  const negationKey = combinator === 'AND' ? '$nor' : '$nor';
  return {
    [negationKey]: [expression],
  };
};

export const formatMongoNode = (
  node: DenormalizedNode,
  modifierlessGroupCombinator: QueryGroupValue
): Record<string, unknown> => {
  if (!isGroupNode(node)) {
    return formatMongoRule(node);
  }

  return formatMongoGroup(node, modifierlessGroupCombinator);
};

export const formatMongoGroup = (
  group: DenormalizedGroupNode,
  modifierlessGroupCombinator: QueryGroupValue
): Record<string, unknown> => {
  const combinator =
    'value' in group && group.value
      ? group.value
      : modifierlessGroupCombinator;
  const expression = combineMongoExpressions(
    group.children
      .map(child => formatMongoNode(child, modifierlessGroupCombinator))
      .filter(item => Object.keys(item).length > 0),
    combinator
  );

  if ('isNegated' in group && group.isNegated) {
    return negateMongoExpression(expression, combinator);
  }

  return expression;
};

