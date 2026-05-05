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

export interface IDenormalizeTreeOptions {
  preserveIds?: boolean;
}

const toDenormalizedNode = (
  item: NormalizedNode,
  originalData: NormalizedQuery,
  options: IDenormalizeTreeOptions = {}
): DenormalizedNode => {
  if (isNormalizedGroupNode(item)) {
    const children = item.children.map(childId => {
      const childItem = originalData.find(
        originalItem => originalItem.id === childId
      );

      if (!childItem) {
        throw new Error('Input data tree is in invalid format');
      }

      return toDenormalizedNode(childItem, originalData, options);
    });

    const denormalizedGroup: DenormalizedGroupNode =
      typeof item.value !== 'undefined'
        ? {
            ...(options.preserveIds ? { id: item.id } : {}),
            type: item.type,
            value: (item as INormalizedGroupNodeWithModifiers).value,
            isNegated: item.isNegated,
            ...(typeof item.readOnly !== 'undefined'
              ? { readOnly: item.readOnly }
              : {}),
            children,
          }
        : {
            ...(options.preserveIds ? { id: item.id } : {}),
            type: item.type,
            ...(typeof item.readOnly !== 'undefined'
              ? { readOnly: item.readOnly }
              : {}),
            children,
          };

    return denormalizedGroup;
  }

  const denormalizedRule = clone(item) as IDenormalizedRuleNode;

  if (!options.preserveIds) {
    delete denormalizedRule.id;
  }

  delete denormalizedRule.parent;
  delete denormalizedRule.operators;

  return denormalizedRule;
};

export const denormalizeTree = (
  data: NormalizedQuery,
  options: IDenormalizeTreeOptions = {}
): DenormalizedQuery =>
  data
    .filter(item => !item.parent)
    .map(item => toDenormalizedNode(item, data, options));
