import type { DenormalizedQuery } from '../../utils/query-tree';
import type { IFormatJsonataOptions } from '../types';
import {
  DEFAULT_MODIFIERLESS_GROUP_COMBINATOR,
  DEFAULT_ROOTLESS_COMBINATOR,
} from '../sql/shared';
import { formatJsonataNode } from './format-jsonata-node';

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

  return `(${fragments.join(` ${rootlessCombinator.toLowerCase()} `)})`;
};

export const formatJsonata = (
  value: DenormalizedQuery,
  options: IFormatJsonataOptions = {}
): string =>
  joinRoot(
    value
      .map(node =>
        formatJsonataNode(
          node,
          options.modifierlessGroupCombinator ??
            DEFAULT_MODIFIERLESS_GROUP_COMBINATOR
        )
      )
      .filter(fragment => fragment.trim().length > 0),
    options.rootlessCombinator ?? DEFAULT_ROOTLESS_COMBINATOR
  );

