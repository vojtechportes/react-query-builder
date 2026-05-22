import { IButtonProps } from '../../../button';

export const resolveButtonContent = ({ children, label }: IButtonProps) =>
  children || label;
