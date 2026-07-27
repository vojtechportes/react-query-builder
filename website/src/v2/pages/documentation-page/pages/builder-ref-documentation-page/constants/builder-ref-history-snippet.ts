export const builderRefHistorySnippet = `const builderRef = useBuilderRef();

const history = builderRef.current?.getHistory();

builderRef.current?.undo();
builderRef.current?.redo();

builderRef.current?.setHistory({
  past: [],
  future: [],
});`;
