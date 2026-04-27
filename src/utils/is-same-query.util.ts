import {
  DenormalizedNode,
  DenormalizedQuery,
  DenormalizedRuleNode,
} from './query-tree';
import { isDenormalizedGroupNode } from './is-denormalized-group-node.util';

const isSameValue = (leftValue: any, rightValue: any) => {
  if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
    return (
      leftValue.length === rightValue.length &&
      leftValue.every((item, index) => item === rightValue[index])
    );
  }

  return leftValue === rightValue;
};

const isSameNode = (left: DenormalizedNode, right: DenormalizedNode): boolean => {
  if (isDenormalizedGroupNode(left) !== isDenormalizedGroupNode(right)) {
    return false;
  }

  if (isDenormalizedGroupNode(left) && isDenormalizedGroupNode(right)) {
    return (
      left.value === right.value &&
      left.isNegated === right.isNegated &&
      isSameQuery(left.children, right.children)
    );
  }

  const leftRule = left as DenormalizedRuleNode;
  const rightRule = right as DenormalizedRuleNode;

  return (
    leftRule.field === rightRule.field &&
    leftRule.operator === rightRule.operator &&
    isSameValue(leftRule.value, rightRule.value)
  );
};

export const isSameQuery = (
  leftQuery: DenormalizedQuery,
  rightQuery: DenormalizedQuery
): boolean => {
  if (leftQuery.length !== rightQuery.length) {
    return false;
  }

  return leftQuery.every((item, index) => isSameNode(item, rightQuery[index]));
};
