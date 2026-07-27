import { IButtonProps } from '../../../builder/components/button';

export const resolveButtonContent = ({ children, label }: IButtonProps) =>
  children || label;
