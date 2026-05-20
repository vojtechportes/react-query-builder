import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  QueryGroupValue,
} from '../../utils/query-tree';
import { isGroupNode } from '../sql/shared';
import { formatJsonataRule } from './format-jsonata-rule';

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

  return `(${fragments.join(` ${combinator.toLowerCase()} `)})`;
};

export const formatJsonataNode = (
  node: DenormalizedNode,
  modifierlessGroupCombinator: QueryGroupValue
): string => {
  if (!isGroupNode(node)) {
    return formatJsonataRule(node);
  }

  return formatJsonataGroup(node, modifierlessGroupCombinator);
};

export const formatJsonataGroup = (
  group: DenormalizedGroupNode,
  modifierlessGroupCombinator: QueryGroupValue
): string => {
  const combinator =
    'value' in group && group.value
      ? group.value
      : modifierlessGroupCombinator;
  const inner = joinFragments(
    group.children
      .map(child => formatJsonataNode(child, modifierlessGroupCombinator))
      .filter(fragment => fragment.trim().length > 0),
    combinator
  );

  if (!inner) {
    return '';
  }

  if ('isNegated' in group && group.isNegated) {
    return `$not(${inner})`;
  }

  return inner;
};

