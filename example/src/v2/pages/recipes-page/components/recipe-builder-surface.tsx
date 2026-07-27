import * as React from 'react';
import { BuilderSurface } from '../../demo-page/components/builder-surface';
import { MuiBuilderSurface } from '../../demo-page/components/mui-builder-surface';

export const RecipeBuilderSurface: React.FC<
  React.PropsWithChildren<{ adapter?: boolean }>
> = ({ adapter = false, children }) => {
  if (adapter) {
    return <MuiBuilderSurface>{children}</MuiBuilderSurface>;
  }

  return <BuilderSurface>{children}</BuilderSurface>;
};
