import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  QueryGroupValue,
} from '../../utils/query-tree';
import { isGroupNode } from '../sql/shared';
import type { JsonLogicRule } from './shared';
import { formatJsonLogicRule } from './format-json-logic-rule';

const combineJsonLogicRules = (
  rules: JsonLogicRule[],
  combinator: QueryGroupValue
): JsonLogicRule => {
  if (rules.length === 0) {
    return {};
  }

  if (rules.length === 1) {
    return rules[0];
  }

  return { [combinator === 'AND' ? 'and' : 'or']: rules };
};

export const formatJsonLogicNode = (
  node: DenormalizedNode,
  modifierlessGroupCombinator: QueryGroupValue
): JsonLogicRule => {
  if (!isGroupNode(node)) {
    return formatJsonLogicRule(node);
  }

  return formatJsonLogicGroup(node, modifierlessGroupCombinator);
};

export const formatJsonLogicGroup = (
  group: DenormalizedGroupNode,
  modifierlessGroupCombinator: QueryGroupValue
): JsonLogicRule => {
  const combinator =
    'value' in group && group.value
      ? group.value
      : modifierlessGroupCombinator;
  const rule = combineJsonLogicRules(
    group.children.map(child =>
      formatJsonLogicNode(child, modifierlessGroupCombinator)
    ),
    combinator
  );

  if ('isNegated' in group && group.isNegated) {
    return { '!': rule };
  }

  return rule;
};

