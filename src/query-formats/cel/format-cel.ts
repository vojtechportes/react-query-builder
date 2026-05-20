import type { DenormalizedQuery } from '../../utils/query-tree';
import type { IFormatCelOptions } from '../types';
import {
  DEFAULT_MODIFIERLESS_GROUP_COMBINATOR,
  DEFAULT_ROOTLESS_COMBINATOR,
} from '../sql/shared';
import { formatCelNode } from './format-cel-node';

const joinRoot = (
  fragments: string[],
  rootlessCombinator: 'AND' | 'OR'
): string => {
  if (fragments.length === 0) {
    return '';
  }

  if (fragments.length === 1) {
    return fragments[0];
  }

  return `(${fragments.join(` ${rootlessCombinator === 'AND' ? '&&' : '||'} `)})`;
};

export const formatCel = (
  value: DenormalizedQuery,
  options: IFormatCelOptions = {}
): string =>
  joinRoot(
    value
      .map(node =>
        formatCelNode(
          node,
          options.modifierlessGroupCombinator ??
            DEFAULT_MODIFIERLESS_GROUP_COMBINATOR
        )
      )
      .filter(fragment => fragment.trim().length > 0),
    options.rootlessCombinator ?? DEFAULT_ROOTLESS_COMBINATOR
  );
