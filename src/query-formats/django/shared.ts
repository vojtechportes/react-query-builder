import type { QueryOperator, QueryRuleValue } from '../../utils/query-tree';

export const djangoFieldReferenceFunction = 'F';

export const quoteDjangoString = (value: string): string =>
  `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

export const formatDjangoScalarValue = (
  value: Exclude<QueryRuleValue, string[] | number[]>
): string => {
  if (typeof value === 'number') {
    return `${value}`;
  }

  if (typeof value === 'boolean') {
    return value ? 'True' : 'False';
  }

  return quoteDjangoString(value);
};

export const formatDjangoFieldReference = (field: string): string =>
  `${djangoFieldReferenceFunction}(${quoteDjangoString(field)})`;

export const inferDjangoLookupOperator = (
  lookup: string,
  value: unknown
): QueryOperator => {
  switch (lookup) {
    case 'exact':
      return 'EQUAL';
    case 'gt':
      return 'LARGER';
    case 'gte':
      return 'LARGER_EQUAL';
    case 'lt':
      return 'SMALLER';
    case 'lte':
      return 'SMALLER_EQUAL';
    case 'in':
      return 'IN';
    case 'contains':
      return 'CONTAINS';
    case 'startswith':
      return 'STARTS_WITH';
    case 'endswith':
      return 'ENDS_WITH';
    case 'isnull':
      if (value === true) {
        return 'IS_NULL';
      }

      return 'IS_NOT_NULL';
    default:
      throw new Error(`Unsupported Django lookup "${lookup}".`);
  }
};
