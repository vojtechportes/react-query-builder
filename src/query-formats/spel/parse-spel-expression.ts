import type { DenormalizedNode } from '../../utils/query-tree';
import { parseSpelRule } from './parse-spel-rule';
import { splitTopLevel, stripOuterParentheses } from './split-spel-expression';

const createLogicalGroup = (
  combinator: 'AND' | 'OR',
  items: string[],
  isNegated = false
): DenormalizedNode => ({
  type: 'GROUP',
  value: combinator,
  isNegated,
  children: items.flatMap(item => parseSpelExpression(item)),
});

export const parseSpelExpression = (value: string): DenormalizedNode[] => {
  const trimmed = value.trim();
  const parsedRule = parseSpelRule(trimmed);

  if (parsedRule) {
    return [parsedRule];
  }

  if (trimmed.startsWith('!(') && trimmed.endsWith(')')) {
    const childNodes = parseSpelExpression(trimmed.slice(2, -1));

    if (childNodes.length === 1 && 'type' in childNodes[0]) {
      const child = childNodes[0];

      if (child.type === 'GROUP') {
        if ('value' in child && typeof child.value !== 'undefined') {
          return [
            {
              type: 'GROUP',
              value: child.value,
              isNegated: !child.isNegated,
              children: child.children,
            },
          ];
        }

        return [
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: true,
            children: child.children,
          },
        ];
      }
    }

    return [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: true,
        children: childNodes,
      },
    ];
  }

  const normalized = stripOuterParentheses(trimmed);
  const orParts = splitTopLevel(normalized, ' or ');

  if (orParts.length > 1) {
    return [createLogicalGroup('OR', orParts)];
  }

  const andParts = splitTopLevel(normalized, ' and ');

  if (andParts.length > 1) {
    return [createLogicalGroup('AND', andParts)];
  }

  throw new Error('Unsupported SpEL expression structure.');
};
