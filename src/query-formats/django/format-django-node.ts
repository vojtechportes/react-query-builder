import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  QueryGroupValue,
} from '../../utils/query-tree';
import { isGroupNode } from '../sql/shared';
import { formatDjangoRule } from './format-django-rule';

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

  return `(${fragments.join(combinator === 'AND' ? ' & ' : ' | ')})`;
};

export const formatDjangoNode = (
  node: DenormalizedNode,
  modifierlessGroupCombinator: QueryGroupValue
): string => {
  if (!isGroupNode(node)) {
    return formatDjangoRule(node);
  }

  return formatDjangoGroup(node, modifierlessGroupCombinator);
};

export const formatDjangoGroup = (
  group: DenormalizedGroupNode,
  modifierlessGroupCombinator: QueryGroupValue
): string => {
  const combinator =
    'value' in group && group.value
      ? group.value
      : modifierlessGroupCombinator;
  const inner = joinFragments(
    group.children
      .map(child => formatDjangoNode(child, modifierlessGroupCombinator))
      .filter(fragment => fragment.trim().length > 0),
    combinator
  );

  if (!inner) {
    return '';
  }

  if ('isNegated' in group && group.isNegated) {
    return `~(${inner})`;
  }

  return inner;
};
