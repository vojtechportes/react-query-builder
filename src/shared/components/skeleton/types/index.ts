// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IBaseSkeletonProps {
  className?: string;
}

export interface ITextSkeletonProps extends IBaseSkeletonProps {
  variant?: 'text';
  height?: string | number;
  rows?: number;
  width?: never;
}

export interface IRectangularSkeletonProps extends IBaseSkeletonProps {
  variant: 'rectangular';
  width?: string | number;
  height?: string | number;
  rows?: never;
}

export interface ICircularSkeletonProps extends IBaseSkeletonProps {
  variant: 'circular';
  width?: string | number;
  height?: never;
  rows?: never;
}

export type ISkeletonProps =
  | ITextSkeletonProps
  | IRectangularSkeletonProps
  | ICircularSkeletonProps;