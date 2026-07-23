export const builderRefReadSnippet = `const builderRef = useBuilderRef();

const allNodes = builderRef.current?.getNodes();
const singleNode = builderRef.current?.getNodeById(nodeId);
const denormalizedData = builderRef.current?.getData();
const isCityInUse = builderRef.current?.isFieldInUse('CITY');
const cityOptionState = builderRef.current?.getFieldOptionState('CITY');`;
