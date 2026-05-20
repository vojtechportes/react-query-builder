import type { DenormalizedQuery } from '../../utils/query-tree';
import type { IFormatMongoOptions } from '../types';
import {
  DEFAULT_MODIFIERLESS_GROUP_COMBINATOR,
  DEFAULT_ROOTLESS_COMBINATOR,
} from '../sql/shared';
import { formatMongoNode } from './format-mongo-node';

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
    [rootlessCombinator === 'AND' ? '$and' : '$or']: expressions,
  };
};

export const formatMongo = (
  value: DenormalizedQuery,
  options: IFormatMongoOptions = {}
): string => {
  const expression = combineRootExpressions(
    value
      .map(node =>
        formatMongoNode(
          node,
          options.modifierlessGroupCombinator ??
            DEFAULT_MODIFIERLESS_GROUP_COMBINATOR
        )
      )
      .filter(item => Object.keys(item).length > 0),
    options.rootlessCombinator ?? DEFAULT_ROOTLESS_COMBINATOR
  );

  return JSON.stringify(expression, null, 2);
};

