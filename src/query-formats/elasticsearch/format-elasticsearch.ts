import type { DenormalizedQuery } from '../../utils/query-tree';
import type { IFormatElasticsearchOptions } from '../types';
import {
  DEFAULT_MODIFIERLESS_GROUP_COMBINATOR,
  DEFAULT_ROOTLESS_COMBINATOR,
} from '../sql/shared';
import { formatElasticsearchNode } from './format-elasticsearch-node';

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

  if (rootlessCombinator === 'AND') {
    return {
      bool: {
        must: expressions,
      },
    };
  }

  return {
    bool: {
      should: expressions,
      minimum_should_match: 1,
    },
  };
};

export const formatElasticsearch = (
  value: DenormalizedQuery,
  options: IFormatElasticsearchOptions = {}
): string => {
  const expression = combineRootExpressions(
    value
      .map(node =>
        formatElasticsearchNode(
          node,
          options.modifierlessGroupCombinator ??
            DEFAULT_MODIFIERLESS_GROUP_COMBINATOR
        )
      )
      .filter(item => Object.keys(item).length > 0),
    options.rootlessCombinator ?? DEFAULT_ROOTLESS_COMBINATOR
  );

  return JSON.stringify(
    options.wrapQueryClause ? { query: expression } : expression,
    null,
    2
  );
};
