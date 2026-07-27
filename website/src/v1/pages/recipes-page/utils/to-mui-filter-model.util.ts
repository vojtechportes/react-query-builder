import { GridLogicOperator, type GridFilterModel } from '@mui/x-data-grid';
import type {
  DenormalizedNode,
  DenormalizedQuery,
} from '@vojtechportes/react-query-builder';

export const toMuiFilterModel = (query: DenormalizedQuery): GridFilterModel => {
  const operatorMap: Record<string, string> = {
    EQUAL: 'equals',
    NOT_EQUAL: 'not',
    CONTAINS: 'contains',
    NOT_CONTAINS: 'doesNotContain',
    STARTS_WITH: 'startsWith',
    ENDS_WITH: 'endsWith',
    LARGER: '>',
    LARGER_EQUAL: '>=',
    SMALLER: '<',
    SMALLER_EQUAL: '<=',
    IS_NULL: 'isEmpty',
    IS_NOT_NULL: 'isNotEmpty',
  };
  const root = query.find(
    (node): node is Extract<DenormalizedNode, { type: 'GROUP' }> =>
      'type' in node && node.type === 'GROUP'
  );
  const stack = [...query];
  const items: GridFilterModel['items'] = [];

  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) continue;
    if ('children' in node) {
      stack.push(...node.children);
      continue;
    }
    items.push({
      id: items.length + 1,
      field: node.field,
      operator: operatorMap[node.operator ?? ''] ?? 'equals',
      value: node.value,
    });
  }

  return {
    items,
    logicOperator:
      root?.value === 'OR' ? GridLogicOperator.Or : GridLogicOperator.And,
  };
};
