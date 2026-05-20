import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  QueryGroupValue,
} from '../../utils/query-tree';
import { isGroupNode } from '../sql/shared';
import { formatPrismaRule } from './format-prisma-rule';

type PrismaClause = Record<string, unknown>;

const combinePrismaExpressions = (
  expressions: PrismaClause[],
  combinator: QueryGroupValue
): PrismaClause => {
  if (expressions.length === 0) {
    return {};
  }

  if (expressions.length === 1) {
    return expressions[0];
  }

  return {
    [combinator]: expressions,
  };
};

const negatePrismaExpression = (expression: PrismaClause): PrismaClause => {
  if (Object.keys(expression).length === 0) {
    return expression;
  }

  return {
    NOT: expression,
  };
};

export const formatPrismaNode = (
  node: DenormalizedNode,
  modifierlessGroupCombinator: QueryGroupValue
): PrismaClause => {
  if (!isGroupNode(node)) {
    return formatPrismaRule(node);
  }

  return formatPrismaGroup(node, modifierlessGroupCombinator);
};

export const formatPrismaGroup = (
  group: DenormalizedGroupNode,
  modifierlessGroupCombinator: QueryGroupValue
): PrismaClause => {
  const combinator =
    'value' in group && group.value
      ? group.value
      : modifierlessGroupCombinator;
  const expression = combinePrismaExpressions(
    group.children
      .map(child => formatPrismaNode(child, modifierlessGroupCombinator))
      .filter(item => Object.keys(item).length > 0),
    combinator
  );

  if ('isNegated' in group && group.isNegated) {
    return negatePrismaExpression(expression);
  }

  return expression;
};
