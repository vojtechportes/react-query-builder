export const lockToggleSignature = `export type BuilderLockState = 'unlocked' | 'self' | 'all';

export interface ILockToggleProps {
  state: BuilderLockState;
  nodeType: 'rule' | 'group';
  disabled?: boolean;
  onChange?: (nextState: BuilderLockState) => void;
  className?: string;
  title?: string;
  'data-test'?: string;
}`;
