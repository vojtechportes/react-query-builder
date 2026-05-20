import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  QueryGroupValue,
} from '../../utils/query-tree';
import { isGroupNode } from '../sql/shared';
import { formatCelRule } from './format-cel-rule';

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

  return `(${fragments.join(` ${combinator === 'AND' ? '&&' : '||'} `)})`;
};

export const formatCelNode = (
  node: DenormalizedNode,
  modifierlessGroupCombinator: QueryGroupValue
): string => {
  if (!isGroupNode(node)) {
    return formatCelRule(node);
  }

  return formatCelGroup(node, modifierlessGroupCombinator);
};

export const formatCelGroup = (
  group: DenormalizedGroupNode,
  modifierlessGroupCombinator: QueryGroupValue
): string => {
  const combinator =
    'value' in group && group.value
      ? group.value
      : modifierlessGroupCombinator;
  const inner = joinFragments(
    group.children
      .map(child => formatCelNode(child, modifierlessGroupCombinator))
      .filter(fragment => fragment.trim().length > 0),
    combinator
  );

  if (!inner) {
    return '';
  }

  if ('isNegated' in group && group.isNegated) {
    return `!(${inner})`;
  }

  return inner;
};
