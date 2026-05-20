import type { IDenormalizedRuleNode } from '../../utils/query-tree';
import { inferSpelMatchesOperator } from './shared';
import { stripOuterParentheses } from './split-spel-expression';

const FIELD_PATTERN = '[A-Za-z_][A-Za-z0-9_.]*';

const parseStringLiteral = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed.startsWith("'") || !trimmed.endsWith("'")) {
    return null;
  }

  return trimmed.slice(1, -1).replace(/''/g, "'");
};

const parseScalarValue = (
  value: string
): string | number | boolean | null | undefined => {
  const trimmed = value.trim();
  const stringValue = parseStringLiteral(trimmed);

  if (stringValue !== null) {
    return stringValue;
  }

  if (trimmed === 'null') {
    return null;
  }

  if (trimmed === 'true') {
    return true;
  }

  if (trimmed === 'false') {
    return false;
  }

  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  return undefined;
};

const splitInlineList = (value: string): string[] => {
  const items: string[] = [];
  let inString = false;
  let lastIndex = 0;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const next = value[index + 1];

    if (char === "'" && next === "'") {
      index += 1;
      continue;
    }

    if (char === "'") {
      inString = !inString;
      continue;
    }

    if (!inString && char === ',') {
      items.push(value.slice(lastIndex, index).trim());
      lastIndex = index + 1;
    }
  }

  const lastItem = value.slice(lastIndex).trim();

  if (lastItem) {
    items.push(lastItem);
  }

  return items;
};

const parseInlineList = (value: string): string[] | number[] | null => {
  const trimmed = value.trim();

  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    return null;
  }

  const inner = trimmed.slice(1, -1).trim();

  if (!inner) {
    return [];
  }

  const items = splitInlineList(inner)
    .map(item => parseScalarValue(item))
    .filter(item => typeof item !== 'undefined');

  if (items.length === 0) {
    return [];
  }

  if (items.every(item => typeof item === 'string')) {
    return items as string[];
  }

  if (items.every(item => typeof item === 'number')) {
    return items as number[];
  }

  throw new Error('SpEL inline lists must contain only strings or only numbers.');
};

const parseNegatedRule = (value: string): IDenormalizedRuleNode | null => {
  const trimmed = value.trim();

  if (!trimmed.startsWith('!(') || !trimmed.endsWith(')')) {
    return null;
  }

  const inner = trimmed.slice(2, -1).trim();
  const parsed = parseSpelRule(inner);

  if (!parsed) {
    return null;
  }

  if (parsed.operator === 'IN') {
    return { ...parsed, operator: 'NOT_IN' };
  }

  if (parsed.operator === 'CONTAINS') {
    return { ...parsed, operator: 'NOT_CONTAINS' };
  }

  if (parsed.operator === 'LIKE') {
    return { ...parsed, operator: 'NOT_LIKE' };
  }

  return null;
};

export const parseSpelRule = (value: string): IDenormalizedRuleNode | null => {
  const trimmed = value.trim();
  const negated = parseNegatedRule(trimmed);

  if (negated) {
    return negated;
  }

  const normalized = stripOuterParentheses(trimmed);
  let match = normalized.match(
    new RegExp(
      `^(${FIELD_PATTERN})\\s*>=\\s*(.+)\\s+and\\s+\\1\\s*<=\\s*(.+)$`
    )
  );

  if (match) {
    const [, field, rawStart, rawEnd] = match;
    const start = parseScalarValue(rawStart);
    const end = parseScalarValue(rawEnd);

    if (
      typeof start === 'undefined' ||
      typeof end === 'undefined' ||
      start === null ||
      end === null ||
      typeof start === 'boolean' ||
      typeof end === 'boolean'
    ) {
      return null;
    }

    return { field, operator: 'BETWEEN', value: [start, end] as never };
  }

  match = normalized.match(
    new RegExp(
      `^(${FIELD_PATTERN})\\s*<\\s*(.+)\\s+or\\s+\\1\\s*>\\s*(.+)$`
    )
  );

  if (match) {
    const [, field, rawStart, rawEnd] = match;
    const start = parseScalarValue(rawStart);
    const end = parseScalarValue(rawEnd);

    if (
      typeof start === 'undefined' ||
      typeof end === 'undefined' ||
      start === null ||
      end === null ||
      typeof start === 'boolean' ||
      typeof end === 'boolean'
    ) {
      return null;
    }

    return { field, operator: 'NOT_BETWEEN', value: [start, end] as never };
  }

  match = normalized.match(
    new RegExp(
      `^(${FIELD_PATTERN})\\s*(==|!=|>=|<=|>|<)\\s*(.+)$`
    )
  );

  if (match) {
    const [, field, operator, rawValue] = match;
    const parsedValue = parseScalarValue(rawValue);

    if (typeof parsedValue === 'undefined') {
      return null;
    }

    if (operator === '==' && parsedValue === null) {
      return { field, operator: 'IS_NULL' };
    }

    if (operator === '!=' && parsedValue === null) {
      return { field, operator: 'IS_NOT_NULL' };
    }

    const operatorMap = {
      '==': 'EQUAL',
      '!=': 'NOT_EQUAL',
      '>': 'LARGER',
      '>=': 'LARGER_EQUAL',
      '<': 'SMALLER',
      '<=': 'SMALLER_EQUAL',
    } as const;

    return {
      field,
      operator: operatorMap[operator as keyof typeof operatorMap],
      value: parsedValue as Exclude<typeof parsedValue, null>,
    };
  }

  match = normalized.match(
    new RegExp(`^(${FIELD_PATTERN})\\.contains\\((.+)\\)$`)
  );

  if (match) {
    const [, field, rawValue] = match;
    const parsedValue = parseStringLiteral(rawValue);

    if (parsedValue === null) {
      return null;
    }

    return { field, operator: 'CONTAINS', value: parsedValue };
  }

  match = normalized.match(
    new RegExp(`^(${FIELD_PATTERN})\\.startsWith\\((.+)\\)$`)
  );

  if (match) {
    const [, field, rawValue] = match;
    const parsedValue = parseStringLiteral(rawValue);

    if (parsedValue === null) {
      return null;
    }

    return { field, operator: 'STARTS_WITH', value: parsedValue };
  }

  match = normalized.match(
    new RegExp(`^(${FIELD_PATTERN})\\.endsWith\\((.+)\\)$`)
  );

  if (match) {
    const [, field, rawValue] = match;
    const parsedValue = parseStringLiteral(rawValue);

    if (parsedValue === null) {
      return null;
    }

    return { field, operator: 'ENDS_WITH', value: parsedValue };
  }

  match = normalized.match(
    new RegExp(`^(${FIELD_PATTERN})\\s+matches\\s+(.+)$`)
  );

  if (match) {
    const [, field, rawValue] = match;
    const parsedValue = parseStringLiteral(rawValue);

    if (parsedValue === null) {
      return null;
    }

    return {
      field,
      ...inferSpelMatchesOperator(parsedValue),
    };
  }

  match = normalized.match(
    new RegExp(`^(\\{.*\\})\\.contains\\((${FIELD_PATTERN})\\)$`)
  );

  if (match) {
    const [, rawList, field] = match;
    const parsedList = parseInlineList(rawList);

    if (!parsedList) {
      return null;
    }

    return { field, operator: 'IN', value: parsedList };
  }

  match = normalized.match(
    new RegExp(
      `^(\\{.*\\})\\.\\?\\[(${FIELD_PATTERN})\\.contains\\(#this\\)\\]\\.size\\(\\)\\s*==\\s*(\\d+)$`
    )
  );

  if (match) {
    const [, rawList, field] = match;
    const parsedList = parseInlineList(rawList);

    if (!parsedList) {
      return null;
    }

    return { field, operator: 'ALL_IN', value: parsedList };
  }

  match = normalized.match(
    new RegExp(
      `^(\\{.*\\})\\.\\?\\[(${FIELD_PATTERN})\\.contains\\(#this\\)\\]\\.size\\(\\)\\s*>\\s*0$`
    )
  );

  if (match) {
    const [, rawList, field] = match;
    const parsedList = parseInlineList(rawList);

    if (!parsedList) {
      return null;
    }

    return { field, operator: 'ANY_IN', value: parsedList };
  }

  return null;
};
