import type { DenormalizedQuery } from '../../utils/query-tree';
import type { IFormatODataOptions } from '../types';
import {
  DEFAULT_MODIFIERLESS_GROUP_COMBINATOR,
  DEFAULT_ROOTLESS_COMBINATOR,
} from '../sql/shared';
import { formatODataNode } from './format-odata-node';

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

export const formatOData = (
  value: DenormalizedQuery,
  options: IFormatODataOptions = {}
): string => {
  const expression = joinRoot(
    value
      .map(node =>
        formatODataNode(
          node,
          options.modifierlessGroupCombinator ??
            DEFAULT_MODIFIERLESS_GROUP_COMBINATOR
        )
      )
      .filter(fragment => fragment.trim().length > 0),
    options.rootlessCombinator ?? DEFAULT_ROOTLESS_COMBINATOR
  );

  if (options.wrapFilterClause) {
    return `$filter=${expression}`;
  }

  return expression;
};
