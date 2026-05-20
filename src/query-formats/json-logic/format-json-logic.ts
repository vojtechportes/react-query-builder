import type { DenormalizedQuery } from '../../utils/query-tree';
import type { IFormatJsonLogicOptions } from '../types';
import {
  DEFAULT_MODIFIERLESS_GROUP_COMBINATOR,
  DEFAULT_ROOTLESS_COMBINATOR,
} from '../sql/shared';
import { formatJsonLogicNode } from './format-json-logic-node';

const combineRootRules = (
  rules: unknown[],
  combinator: 'AND' | 'OR'
): unknown => {
  if (rules.length === 0) {
    return {};
  }

  if (rules.length === 1) {
    return rules[0];
  }

  return { [combinator === 'AND' ? 'and' : 'or']: rules };
};

export const formatJsonLogic = (
  value: DenormalizedQuery,
  options: IFormatJsonLogicOptions = {}
): string => {
  const rule = combineRootRules(
    value.map(node =>
      formatJsonLogicNode(
        node,
        options.modifierlessGroupCombinator ??
          DEFAULT_MODIFIERLESS_GROUP_COMBINATOR
      )
    ),
    options.rootlessCombinator ?? DEFAULT_ROOTLESS_COMBINATOR
  );

  return JSON.stringify(rule, null, 2);
};

