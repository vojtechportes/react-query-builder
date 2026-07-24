export const historyControlsSignature = `export interface IHistoryControlsProps {
  undoButton: React.ReactNode;
  redoButton: React.ReactNode;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  className?: string;
}`;
