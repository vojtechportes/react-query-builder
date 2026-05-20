import type { DenormalizedQuery } from '../../utils/query-tree';
import type { IFormatAqlOptions } from '../types';
import {
  DEFAULT_MODIFIERLESS_GROUP_COMBINATOR,
  DEFAULT_ROOTLESS_COMBINATOR,
} from '../sql/shared';
import { formatAqlNode } from './format-aql-node';
import { AQL_DEFAULT_VARIABLE_NAME } from './shared';

const joinRootFragments = (
  fragments: string[],
  rootlessCombinator: 'AND' | 'OR'
): string => {
  if (fragments.length === 0) {
    return '';
  }

  if (fragments.length === 1) {
    return fragments[0];
  }

  return `(${fragments.join(` ${rootlessCombinator} `)})`;
};

export const formatAql = (
  value: DenormalizedQuery,
  options: IFormatAqlOptions = {}
): string => {
  const expression = joinRootFragments(
    value
      .map(node =>
        formatAqlNode(
          node,
          options.variableName ?? AQL_DEFAULT_VARIABLE_NAME,
          options.modifierlessGroupCombinator ??
            DEFAULT_MODIFIERLESS_GROUP_COMBINATOR
        )
      )
      .filter(fragment => fragment.trim().length > 0),
    options.rootlessCombinator ?? DEFAULT_ROOTLESS_COMBINATOR
  );

  if (!expression) {
    return '';
  }

  return options.wrapFilterClause === false ? expression : `FILTER ${expression}`;
};

