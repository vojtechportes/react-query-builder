import * as React from 'react';
import { ThemeProvider } from '@vojtechportes/react-query-builder';
import { BuilderSurface } from '../../demo-page/components/builder-surface';
import { MuiBuilderSurface } from '../../demo-page/components/mui-builder-surface';
import { defaultTheme } from '../../demo-page/constants/default-theme';

export const RecipeBuilderSurface: React.FC<
  React.PropsWithChildren<{ adapter?: boolean }>
> = ({ adapter = false, children }) => {
  if (adapter) {
    return <MuiBuilderSurface>{children}</MuiBuilderSurface>;
  }

  return (
    <BuilderSurface>
      <ThemeProvider colors={defaultTheme.colors}>{children}</ThemeProvider>
    </BuilderSurface>
  );
};
