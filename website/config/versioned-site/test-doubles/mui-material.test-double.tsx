import { forwardRef, type HTMLAttributes } from 'react';

export const ScopedCssBaseline = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    {...props}
    className={['MuiScopedCssBaseline-root', className]
      .filter(Boolean)
      .join(' ')}
    ref={ref}
  />
));

ScopedCssBaseline.displayName = 'ScopedCssBaseline';
