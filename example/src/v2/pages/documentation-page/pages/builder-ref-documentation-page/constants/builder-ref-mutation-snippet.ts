export const builderRefMutationSnippet = `const builderRef = useBuilderRef();

builderRef.current?.cloneNode(nodeId);
builderRef.current?.moveNode(nodeId, 0, targetGroupId);

builderRef.current?.setNodeLock(nodeId, 'self');
builderRef.current?.unlockNode(nodeId);

builderRef.current?.replaceNode(nodeId, nextNode);
builderRef.current?.updateNode(nodeId, node => ({
  ...node,
  readOnly: true,
}));`;
