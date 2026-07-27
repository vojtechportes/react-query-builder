import type {
  DenormalizedNode,
  DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import type { IRecipeDemoRow } from '../types/i-recipe-demo-row';
import { compareRecipeValues } from './compare-recipe-values.util';

export const doesRecipeRowMatch = (
  row: IRecipeDemoRow,
  node: DenormalizedNode | DenormalizedQuery
): boolean => {
  if (Array.isArray(node)) {
    return node.every((child) => doesRecipeRowMatch(row, child));
  }

  if ('children' in node) {
    if (node.children.length === 0) return !node.isNegated;
    const matches =
      node.value === 'OR'
        ? node.children.some((child) => doesRecipeRowMatch(row, child))
        : node.children.every((child) => doesRecipeRowMatch(row, child));
    return node.isNegated ? !matches : matches;
  }

  const left = row[node.field];
  const right =
    node.valueSource === 'field' && node.valueField
      ? row[node.valueField]
      : node.value;
  const leftText = String(left ?? '').toLocaleLowerCase();
  const rightText = String(right ?? '').toLocaleLowerCase();
  const rightValues = Array.isArray(right) ? right.map(String) : [];

  switch (node.operator) {
    case 'EQUAL':
      return left === right || leftText === rightText;
    case 'NOT_EQUAL':
      return left !== right && leftText !== rightText;
    case 'CONTAINS':
      return leftText.includes(rightText);
    case 'NOT_CONTAINS':
      return !leftText.includes(rightText);
    case 'STARTS_WITH':
      return leftText.startsWith(rightText);
    case 'ENDS_WITH':
      return leftText.endsWith(rightText);
    case 'LARGER':
      return compareRecipeValues(left, right) > 0;
    case 'LARGER_EQUAL':
      return compareRecipeValues(left, right) >= 0;
    case 'SMALLER':
      return compareRecipeValues(left, right) < 0;
    case 'SMALLER_EQUAL':
      return compareRecipeValues(left, right) <= 0;
    case 'BETWEEN':
      return (
        rightValues.length === 2 &&
        compareRecipeValues(left, rightValues[0]) >= 0 &&
        compareRecipeValues(left, rightValues[1]) <= 0
      );
    case 'IN':
      return rightValues
        .map((value) => value.toLocaleLowerCase())
        .includes(leftText);
    case 'NOT_IN':
      return !rightValues
        .map((value) => value.toLocaleLowerCase())
        .includes(leftText);
    case 'IS_NULL':
      return left === undefined || left === null || left === '';
    case 'IS_NOT_NULL':
      return left !== undefined && left !== null && left !== '';
    default:
      return true;
  }
};
