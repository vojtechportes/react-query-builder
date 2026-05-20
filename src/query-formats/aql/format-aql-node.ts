import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  QueryGroupValue,
} from '../../utils/query-tree';
import { isGroupNode } from '../sql/shared';
import { formatAqlRule } from './format-aql-rule';

const joinAqlFragments = (
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

export const formatAqlNode = (
  node: DenormalizedNode,
  variableName: string,
  modifierlessGroupCombinator: QueryGroupValue
): string => {
  if (!isGroupNode(node)) {
    return formatAqlRule(node, variableName);
  }

  return formatAqlGroup(node, variableName, modifierlessGroupCombinator);
};

export const formatAqlGroup = (
  group: DenormalizedGroupNode,
  variableName: string,
  modifierlessGroupCombinator: QueryGroupValue
): string => {
  const combinator =
    'value' in group && group.value
      ? group.value
      : modifierlessGroupCombinator;
  const inner = joinAqlFragments(
    group.children
      .map(child =>
        formatAqlNode(child, variableName, modifierlessGroupCombinator)
      )
      .filter(fragment => fragment.trim().length > 0),
    combinator
  );

  if (!inner) {
    return '';
  }

  if ('isNegated' in group && group.isNegated) {
    return `NOT ${inner}`;
  }

  return inner;
};

