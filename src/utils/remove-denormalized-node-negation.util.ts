import { DenormalizedNode } from './query-tree';

export const removeDenormalizedNodeNegation = (
  node: DenormalizedNode
): DenormalizedNode => {
  if (!('type' in node) || node.type !== 'GROUP') {
    return node;
  }

  let childrenChanged = false;
  const children = node.children.map((child) => {
    const nextChild = removeDenormalizedNodeNegation(child);

    if (nextChild !== child) {
      childrenChanged = true;
    }

    return nextChild;
  });

  if (typeof node.isNegated === 'undefined') {
    return childrenChanged
      ? {
          ...node,
          children,
        }
      : node;
  }

  if (!node.isNegated && !childrenChanged) {
    return node;
  }

  return {
    ...node,
    isNegated: false,
    children,
  };
};
