export const historySnippet = `import React, { useState } from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderStateChange,
} from '@vojtechportes/react-query-builder';

export const MyBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);
  const [historyState, setHistoryState] = useState({
    canUndo: false,
    canRedo: false,
  });

  const handleStateChange = (state: IBuilderStateChange) => {
    setHistoryState({
      canUndo: state.canUndo,
      canRedo: state.canRedo,
    });
  };

  return (
    <>
      <Builder
        fields={fields}
        data={data}
        draggable
        cloneable
        history={{ maxEntries: 30, controls: true }}
        onStateChange={handleStateChange}
        onChange={setData}
      />
      <p>Undo available: {String(historyState.canUndo)}</p>
      <p>Redo available: {String(historyState.canRedo)}</p>
    </>
  );
};`;
