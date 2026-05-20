import type { DenormalizedQuery } from '../../utils/query-tree';
import type { IFormatPrismaOptions } from '../types';
import {
  DEFAULT_MODIFIERLESS_GROUP_COMBINATOR,
  DEFAULT_ROOTLESS_COMBINATOR,
} from '../sql/shared';
import { formatPrismaNode } from './format-prisma-node';

const combineRootExpressions = (
  expressions: Record<string, unknown>[],
  rootlessCombinator: 'AND' | 'OR'
): Record<string, unknown> => {
  if (expressions.length === 0) {
    return {};
  }

  if (expressions.length === 1) {
    return expressions[0];
  }

  return {
    [rootlessCombinator]: expressions,
  };
};

export const formatPrisma = (
  value: DenormalizedQuery,
  options: IFormatPrismaOptions = {}
): string => {
  const expression = combineRootExpressions(
    value
      .map(node =>
        formatPrismaNode(
          node,
          options.modifierlessGroupCombinator ??
            DEFAULT_MODIFIERLESS_GROUP_COMBINATOR
        )
      )
      .filter(item => Object.keys(item).length > 0),
    options.rootlessCombinator ?? DEFAULT_ROOTLESS_COMBINATOR
  );

  return JSON.stringify(
    options.wrapWhereClause ? { where: expression } : expression,
    null,
    2
  );
};
