import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  IDenormalizedRuleNode,
  QueryGroupValue,
  QueryRuleValue,
} from '../../utils/query-tree';

export const DEFAULT_ROOTLESS_COMBINATOR: QueryGroupValue = 'AND';
export const DEFAULT_MODIFIERLESS_GROUP_COMBINATOR: QueryGroupValue = 'AND';

export const isGroupNode = (
  node: DenormalizedNode
): node is DenormalizedGroupNode => 'type' in node && node.type === 'GROUP';

export const isRuleNode = (
  node: DenormalizedNode
): node is IDenormalizedRuleNode => !isGroupNode(node);

export const escapeSqlString = (value: string): string =>
  value.replace(/'/g, "''");

export const quoteIdentifier = (value: string): string => {
  if (/^[A-Za-z_][A-Za-z0-9_$.]*$/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '""')}"`;
};

export const formatScalarValue = (
  value: Exclude<QueryRuleValue, string[] | number[]>
): string => {
  if (typeof value === 'number') {
    return `${value}`;
  }

  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }

  return `'${escapeSqlString(value)}'`;
};

export const formatListValue = (
  value: Array<string | number>
): string => `(${value.map(item => formatScalarValue(item)).join(', ')})`;

export const isDateString = (value: string): boolean =>
  /^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)?$/.test(value);

