import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  QueryGroupValue,
} from '../../utils/query-tree';
import { isGroupNode } from '../sql/shared';
import { formatElasticsearchRule } from './format-elasticsearch-rule';

type ElasticsearchClause = Record<string, unknown>;

const combineElasticsearchExpressions = (
  expressions: ElasticsearchClause[],
  combinator: QueryGroupValue
): ElasticsearchClause => {
  if (expressions.length === 0) {
    return {};
  }

  if (expressions.length === 1) {
    return expressions[0];
  }

  if (combinator === 'AND') {
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

const negateElasticsearchExpression = (
  expression: ElasticsearchClause
): ElasticsearchClause => {
  if (Object.keys(expression).length === 0) {
    return expression;
  }

  return {
    bool: {
      must_not: [expression],
    },
  };
};

export const formatElasticsearchNode = (
  node: DenormalizedNode,
  modifierlessGroupCombinator: QueryGroupValue
): ElasticsearchClause => {
  if (!isGroupNode(node)) {
    return formatElasticsearchRule(node);
  }

  return formatElasticsearchGroup(node, modifierlessGroupCombinator);
};

export const formatElasticsearchGroup = (
  group: DenormalizedGroupNode,
  modifierlessGroupCombinator: QueryGroupValue
): ElasticsearchClause => {
  const combinator =
    'value' in group && group.value
      ? group.value
      : modifierlessGroupCombinator;
  const expression = combineElasticsearchExpressions(
    group.children
      .map(child =>
        formatElasticsearchNode(child, modifierlessGroupCombinator)
      )
      .filter(item => Object.keys(item).length > 0),
    combinator
  );

  if ('isNegated' in group && group.isNegated) {
    return negateElasticsearchExpression(expression);
  }

  return expression;
};
