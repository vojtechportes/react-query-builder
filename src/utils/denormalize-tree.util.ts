import { clone } from './clone.util';
import { isNormalizedGroupNode } from './is-normalized-group-node.util';
import {
  DenormalizedGroupNode,
  DenormalizedNode,
  DenormalizedQuery,
  IDenormalizedRuleNode,
  NormalizedNode,
  NormalizedQuery,
  INormalizedGroupNodeWithModifiers,
} from './query-tree';

const toDenormalizedNode = (
  item: NormalizedNode,
  originalData: NormalizedQuery
): DenormalizedNode => {
  if (isNormalizedGroupNode(item)) {
    const children = item.children.map(childId => {
      const childItem = originalData.find(
        originalItem => originalItem.id === childId
      );

      if (!childItem) {
        throw new Error('Input data tree is in invalid format');
      }

      return toDenormalizedNode(childItem, originalData);
    });

    const denormalizedGroup: DenormalizedGroupNode =
      typeof item.value !== 'undefined'
        ? {
            type: item.type,
            value: (item as INormalizedGroupNodeWithModifiers).value,
            isNegated: item.isNegated,
            children,
          }
        : {
            type: item.type,
            children,
          };

    return denormalizedGroup;
  }

  const denormalizedRule = clone(item) as IDenormalizedRuleNode;

  delete denormalizedRule.id;
  delete denormalizedRule.parent;
  delete denormalizedRule.operators;

  return denormalizedRule;
};

export const denormalizeTree = (data: NormalizedQuery): DenormalizedQuery =>
  data
    .filter(item => !item.parent)
    .map(item => toDenormalizedNode(item, data));
