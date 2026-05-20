import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  QueryGroupValue,
} from '../../utils/query-tree';
import { isGroupNode } from '../sql/shared';
import { formatRsqlRule } from './format-rsql-rule';

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

  return `(${fragments.join(combinator === 'AND' ? ';' : ',')})`;
};

export const formatRsqlNode = (
  node: DenormalizedNode,
  modifierlessGroupCombinator: QueryGroupValue
): string => {
  if (!isGroupNode(node)) {
    return formatRsqlRule(node);
  }

  return formatRsqlGroup(node, modifierlessGroupCombinator);
};

export const formatRsqlGroup = (
  group: DenormalizedGroupNode,
  modifierlessGroupCombinator: QueryGroupValue
): string => {
  if ('isNegated' in group && group.isNegated) {
    throw new Error('RSQL formatting does not support negated groups.');
  }

  const combinator =
    'value' in group && group.value
      ? group.value
      : modifierlessGroupCombinator;
  return joinFragments(
    group.children
      .map(child => formatRsqlNode(child, modifierlessGroupCombinator))
      .filter(fragment => fragment.trim().length > 0),
    combinator
  );
};
