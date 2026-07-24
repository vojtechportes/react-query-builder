export const cloneButtonSignature = `export interface ICloneButtonProps {
  nodeType: 'rule' | 'group';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  title?: string;
  'data-test'?: string;
}`;
