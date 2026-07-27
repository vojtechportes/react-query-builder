export const historyControlsSnippet = `const components = {
  HistoryControls: ({
    undoButton,
    redoButton,
    canUndo,
    canRedo,
  }) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span>History</span>
      {undoButton}
      {redoButton}
      <small>{canUndo ? 'Undo ready' : 'No undo yet'}</small>
      <small>{canRedo ? 'Redo ready' : 'No redo yet'}</small>
    </div>
  ),
};

<Builder
  fields={fields}
  data={data}
  history
  components={components}
  onChange={setData}
/>;

// HistoryControls receives:
// undoButton: React.ReactNode
// redoButton: React.ReactNode
// canUndo: boolean
// canRedo: boolean
// onUndo: () => void
// onRedo: () => void`;
